import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { API_BASE, api } from "../service/api";

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

function normalizeUser(payload) {
  const user = payload?.user ?? payload?.data?.user ?? payload?.data ?? payload;

  if (
    user &&
    typeof user === "object" &&
    (user.id || user.email || user.username)
  ) {
    return user;
  }

  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.getCurrentUser();
      const currentUser = normalizeUser(response);
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      setUser(null);

      if (error.status !== 401) {
        console.error("Unable to restore the customer session", error);
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    LEGACY_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await api.login(credentials);
    const authenticatedUser =
      normalizeUser(response) ?? normalizeUser(await api.getCurrentUser());

    if (!authenticatedUser) {
      throw new Error("Login succeeded, but the user session could not be loaded.");
    }

    setUser(authenticatedUser);
    return response;
  }, []);

  const register = useCallback((details) => api.register(details), []);

  const loginWithGoogle = useCallback(() => {
    window.location.assign(`${API_BASE}/oauth2/authorization/google`);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
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
    }),
    [user, loading, login, register, loginWithGoogle, logout, refreshUser]
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
