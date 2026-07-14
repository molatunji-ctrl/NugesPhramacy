import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import googleIcon from "../assets/Icons/google.ico";
import { API_BASE, api, saveAuthData } from "../service/api";

function LogIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const goToSignIn = (e) => {
    e.preventDefault();
    setNavigating(true);

    setTimeout(() => {
      navigate("/signin");
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const cleanEmail = email.toLowerCase().trim();

      const data = await api.login({
        email: cleanEmail,
        password,
      });

      saveAuthData(data, cleanEmail);

      setMessageType("success");
      setMessage(data.message || "Login successful");

      navigate("/home", { replace: true });
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F9FCFF] px-4 py-8">
      <div className="animate-fade-in-up flex w-full max-w-md flex-col items-center">
        <header className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B1967] text-lg font-semibold text-white">
            N
          </div>

          <h3 className="text-2xl font-semibold text-[#1B1967]">
            Nuges Pharmaceuticals
          </h3>
        </header>

        <main className="flex w-full flex-col gap-6 rounded-xl border border-gray-200 bg-white px-8 py-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-[#090F27]">
              Welcome back
            </h1>

            <h3 className="text-sm text-[#6A7282]">
              Sign in to track orders and manage your profile.
            </h3>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="flex items-center justify-center rounded-xl border border-gray-300 py-2.5 font-semibold text-[#100F27] transition-all duration-200 hover:border-[#1B1967] hover:bg-[#F4F5FA] active:scale-[0.98]"
          >
            <img src={googleIcon} alt="Google" className="mr-2 h-5 w-5" />
            Continue with Google
          </button>

          <div className="text-center text-sm text-[#6A7282]">or</div>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <a
              href="#"
              className="text-[13px] font-semibold text-[#1B1967] transition-opacity duration-200 hover:opacity-70"
            >
              Forgot password?
            </a>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1B1967] py-2.5 font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {message && (
            <p
              role="alert"
              className={`text-center rounded-lg px-3 py-2 text-sm ${
                messageType === "success"
                  ? "border border-green-100 bg-green-50 text-green-700"
                  : "border border-red-100 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex items-center justify-center gap-1">
            <h2 className="text-[14px] font-medium text-[#5B6379]">
              New to Nuges?
            </h2>

            <a
              href="/signin"
              onClick={goToSignIn}
              className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-[#1B1967] transition-opacity duration-200 hover:opacity-70"
            >
              {navigating && (
                <i className="fa-solid fa-spinner animate-spin text-sm"></i>
              )}
              Create account
            </a>
          </div>
        </main>

        <div className="mt-4 flex items-center justify-center">
          <Link
            to="/home"
            className="text-sm text-[#6A7282] transition-colors duration-200 hover:text-[#1B1967]"
          >
            <i className="fa-solid fa-arrow-left-long mr-1.5"></i>
            Back to Home
          </Link>
        </div>
      </div>

      {navigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F9FCFF]/80 backdrop-blur-sm animate-fade-in-up">
          <div className="flex flex-col items-center gap-3">
            <i className="fa-solid fa-spinner animate-spin text-3xl text-[#1B1967]"></i>

            <p className="text-sm font-medium text-[#1B1967]">
              Taking you to create an account…
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default LogIn;