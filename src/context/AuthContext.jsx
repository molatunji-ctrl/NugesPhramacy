import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  verifyPasswordResetCode,
} from "firebase/auth";

import { auth, googleProvider } from "../lib/firebase";
import { api } from "../service/api";

const AuthContext = createContext(null);

const LEGACY_AUTH_KEYS = [
  "token",
  "authToken",
  "accessToken",
  "isAuthenticated",
  "userEmail",
  "userName",
  "user",
];

const FIREBASE_ERROR_MESSAGES = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/weak-password": "Use a stronger password with at least 8 characters.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  "auth/popup-blocked": "Allow pop-ups for this website and try again.",
  "auth/network-request-failed": "Unable to reach Firebase. Check your connection.",
  "auth/too-many-requests": "Too many attempts. Please wait and try again.",
  "auth/unauthorized-domain": "This website is not authorized in Firebase yet.",
  "auth/expired-action-code": "This link has expired. Request a new one.",
  "auth/invalid-action-code": "This link is invalid or has already been used.",
  "auth/email-not-verified": "Verify your email before signing in.",
};

function normalizeApiUser(payload) {
  const user = payload?.user ?? payload?.data?.user ?? payload?.data ?? payload;

  if (user && typeof user === "object" && (user.id || user.email)) {
    return user;
  }

  return null;
}

function customerUser(firebaseUser, apiUser) {
  const email = firebaseUser.email || apiUser?.email || "";

  return {
    ...apiUser,
    id: apiUser?.id,
    uid: firebaseUser.uid,
    fullname:
      apiUser?.fullname ||
      firebaseUser.displayName ||
      email.split("@")[0] ||
      "Customer",
    email,
    role: apiUser?.role || "ROLE_USER",
    emailVerified: firebaseUser.emailVerified,
  };
}

function friendlyAuthError(error, fallback) {
  const normalized = new Error(
    FIREBASE_ERROR_MESSAGES[error?.code] || error?.message || fallback
  );
  normalized.code = error?.code;
  return normalized;
}

async function synchronizeCustomer(firebaseUser) {
  await firebaseUser.getIdToken(true);
  const apiUser = normalizeApiUser(await api.getCurrentUser());

  if (!apiUser) {
    throw new Error("Your account could not be synchronized with Nuges Pharmacy.");
  }

  return customerUser(firebaseUser, apiUser);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      setUser(null);
      return null;
    }

    try {
      await reload(firebaseUser);

      if (!firebaseUser.emailVerified) {
        setUser(null);
        return null;
      }

      const synchronizedUser = await synchronizeCustomer(firebaseUser);
      setUser(synchronizedUser);
      return synchronizedUser;
    } catch (error) {
      setUser(null);
      throw friendlyAuthError(error, "Unable to restore your customer session.");
    }
  }, []);

  useEffect(() => {
    LEGACY_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));

    let active = true;
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!active) return;

      if (!firebaseUser || !firebaseUser.emailVerified) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const synchronizedUser = await synchronizeCustomer(firebaseUser);
        if (active) setUser(synchronizedUser);
      } catch (error) {
        if (active) {
          setUser(null);
          console.error("Unable to synchronize the Firebase customer", error);
        }
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.toLowerCase().trim(),
        password
      );

      if (!credential.user.emailVerified) {
        setUser(null);
        const verificationError = new Error(
          FIREBASE_ERROR_MESSAGES["auth/email-not-verified"]
        );
        verificationError.code = "auth/email-not-verified";
        throw verificationError;
      }

      const synchronizedUser = await synchronizeCustomer(credential.user);
      setUser(synchronizedUser);
      return { message: "Login successful", user: synchronizedUser };
    } catch (error) {
      throw friendlyAuthError(error, "Login failed.");
    }
  }, []);

  const register = useCallback(async ({ fullname, email, password }) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.toLowerCase().trim(),
        password
      );

      await updateProfile(credential.user, { displayName: fullname.trim() });
      await sendEmailVerification(credential.user, {
        url: `${window.location.origin}/login`,
      });
      setUser(null);

      return {
        message: "Account created. Check your email to verify your account.",
        emailVerificationRequired: true,
      };
    } catch (error) {
      throw friendlyAuthError(error, "Account creation failed.");
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const synchronizedUser = await synchronizeCustomer(credential.user);
      setUser(synchronizedUser);
      return { message: "Google sign-in successful", user: synchronizedUser };
    } catch (error) {
      throw friendlyAuthError(error, "Google sign-in failed.");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      console.warn("The previous backend session could not be cleared", error);
    } finally {
      await signOut(auth);
      setUser(null);
    }
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.toLowerCase().trim(), {
        url: `${window.location.origin}/login`,
      });
      return {
        message: "If the account exists, a password reset link has been sent.",
      };
    } catch (error) {
      throw friendlyAuthError(error, "Unable to send the password reset email.");
    }
  }, []);

  const resendEmailVerification = useCallback(async (email) => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser || firebaseUser.email?.toLowerCase() !== email.toLowerCase().trim()) {
      throw new Error("Sign in with this email again before requesting another verification link.");
    }

    try {
      await sendEmailVerification(firebaseUser, {
        url: `${window.location.origin}/login`,
      });
      return { message: "A new verification email has been sent." };
    } catch (error) {
      throw friendlyAuthError(error, "Unable to resend the verification email.");
    }
  }, []);

  const verifyEmail = useCallback(async (actionCode) => {
    try {
      await applyActionCode(auth, actionCode);

      if (auth.currentUser) {
        await reload(auth.currentUser);
        await auth.currentUser.getIdToken(true);
      }

      return { message: "Email verified successfully. You can now sign in." };
    } catch (error) {
      throw friendlyAuthError(error, "Unable to verify this email link.");
    }
  }, []);

  const resetPassword = useCallback(async (actionCode, password) => {
    try {
      await verifyPasswordResetCode(auth, actionCode);
      await confirmPasswordReset(auth, actionCode, password);
      return { message: "Password reset successfully. You can now sign in." };
    } catch (error) {
      throw friendlyAuthError(error, "Unable to reset your password.");
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      loginWithGoogle,
      logout,
      refreshUser,
      requestPasswordReset,
      resendEmailVerification,
      verifyEmail,
      resetPassword,
    }),
    [
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      refreshUser,
      requestPasswordReset,
      resendEmailVerification,
      verifyEmail,
      resetPassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
