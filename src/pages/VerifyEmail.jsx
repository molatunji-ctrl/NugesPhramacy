import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function VerifyEmail() {
  const { verifyEmail } = useAuth();
  const [token] = useState(() => {
    const search = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return search.get("oobCode") || hash.get("token") || "";
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!token) return;
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await verifyEmail(token);
      setMessage(response?.message || "Email verified successfully.");
    } catch (requestError) {
      setError(requestError.message || "Unable to verify this email link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F9FCFF] px-4 py-8">
      <main className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-8 py-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1B1967]/10 text-2xl text-[#1B1967]">
          <i className="fa-solid fa-envelope-circle-check" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-[#090F27]">Verify your email</h1>
        <p className="mt-2 text-sm text-[#6A7282]">Confirm the address connected to your Nuges account.</p>

        <button
          type="button"
          onClick={handleVerify}
          disabled={loading || !token || Boolean(message)}
          className="mt-6 w-full rounded-xl bg-[#1B1967] py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Verifying…" : message ? "Email verified" : "Verify email"}
        </button>

        {!token && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">This verification link is missing or invalid.</p>}
        {message && <p role="status" className="mt-4 rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-700">{message}</p>}
        {error && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <Link to={message ? "/login" : "/check-email"} className="mt-6 inline-block text-sm font-semibold text-[#1B1967] hover:underline">
          {message ? "Continue to sign in" : "Request another verification email"}
        </Link>
      </main>
    </section>
  );
}

export default VerifyEmail;
