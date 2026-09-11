import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function CheckEmail() {
  const { resendEmailVerification } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [message, setMessage] = useState("Check your inbox for your verification link.");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await resendEmailVerification(email);
      setMessage(response?.message || "If verification is required, a new email has been sent.");
    } catch (requestError) {
      setError(requestError.message || "Unable to resend the verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F9FCFF] px-4 py-8">
      <main className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#090F27]">Check your email</h1>
        <p role="status" className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">{message}</p>

        <form onSubmit={handleResend} className="mt-6 space-y-4">
          <label htmlFor="verification-email" className="block text-sm font-medium text-[#34384A]">Email address</label>
          <input
            id="verification-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
          />
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#1B1967] py-2.5 font-semibold text-white disabled:opacity-60">
            {loading ? "Sending…" : "Resend verification email"}
          </button>
        </form>

        {error && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-[#1B1967] hover:underline">Back to sign in</Link>
      </main>
    </section>
  );
}

export default CheckEmail;
