import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await requestPasswordReset(email);
      setMessage(response?.message || "If the account exists, a reset link has been sent.");
    } catch (requestError) {
      setError(requestError.message || "Unable to request a password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F9FCFF] px-4 py-8">
      <main className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B1967] font-semibold text-white">N</div>
          <span className="text-xl font-semibold text-[#1B1967]">Nuges Pharmaceuticals</span>
        </div>

        <h1 className="text-2xl font-semibold text-[#090F27]">Forgot your password?</h1>
        <p className="mt-2 text-sm text-[#6A7282]">
          Enter your account email. For privacy, we always show the same confirmation message.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1B1967] py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        {message && <p role="status" className="mt-4 rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-700">{message}</p>}
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-[#1B1967] hover:underline">
          Back to sign in
        </Link>
      </main>
    </section>
  );
}

export default ForgotPassword;
