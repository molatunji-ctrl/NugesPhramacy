import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ResetPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [token] = useState(() => {
    const search = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return search.get("oobCode") || hash.get("token") || "";
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("This password reset link is missing or invalid.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(token, password);
      setMessage(response?.message || "Password reset successfully.");
      window.setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (requestError) {
      setError(requestError.message || "Unable to reset your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F9FCFF] px-4 py-8">
      <main className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#090F27]">Choose a new password</h1>
        <p className="mt-2 text-sm text-[#6A7282]">Your reset link works once and expires automatically.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
          />
          <button type="submit" disabled={loading || !token} className="w-full rounded-xl bg-[#1B1967] py-2.5 font-semibold text-white disabled:opacity-60">
            {loading ? "Updating…" : "Reset password"}
          </button>
        </form>

        {!token && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">This password reset link is missing or invalid.</p>}
        {message && <p role="status" className="mt-4 rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-700">{message}</p>}
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <Link to="/forgot-password" className="mt-6 inline-block text-sm font-semibold text-[#1B1967] hover:underline">Request another link</Link>
      </main>
    </section>
  );
}

export default ResetPassword;
