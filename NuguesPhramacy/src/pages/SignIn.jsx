import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../assets/Icons/google.ico";

function SignIn() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const goToLogIn = (e) => {
    e.preventDefault();
    setNavigating(true);
    setTimeout(() => navigate("/login"), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Account created successfully");
      console.log("Backend response:", data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F9FCFF] px-4 py-8">
      <div className="animate-fade-in-up flex w-full max-w-md flex-col items-center">
        <header className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B1967] text-lg font-semibold text-white">
            N
          </div>
          <h3 className="text-2xl font-semibold text-[#1B1967]">Nuges Pharmaceuticals</h3>
        </header>

        <main className="flex w-full flex-col gap-6 rounded-xl border border-gray-200 bg-white px-8 py-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-[#090F27]">Create your account</h1>
            <h3 className="text-sm text-[#6A7282]">
              Join us to enjoy faster checkout, order history, and exclusive offers.
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "http://localhost:5000/auth/google";
            }}
            className="flex items-center justify-center rounded-xl border border-gray-300 py-2.5 font-semibold text-[#100F27] transition-all duration-200 hover:border-[#1B1967] hover:bg-[#F4F5FA] active:scale-[0.98]"
          >
            <img src={googleLogo} alt="Google" className="mr-2 h-5 w-5" />
            Continue with Google
          </button>

          <div className="text-center text-sm text-[#6A7282]">or</div>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1B1967] py-2.5 font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i> Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {message && (
            <p className="animate-fade-in-up text-sm text-center text-[#1B1967]">{message}</p>
          )}

          <div className="flex items-center justify-center gap-1">
            <h2 className="text-[14px] font-medium text-[#5B6379]">Already have an account?</h2>
            <a
              href="/login"
              onClick={goToLogIn}
              className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-[#1B1967] transition-opacity duration-200 hover:opacity-70"
            >
              {navigating && <i className="fa-solid fa-spinner animate-spin text-sm"></i>}
              Sign in
            </a>
          </div>
        </main>

        <div className="mt-4 text-center">
          <Link to="/home" className="text-sm text-[#6A7282] transition-colors duration-200 hover:text-[#1B1967]">
            <i className="fa-solid fa-arrow-left-long"></i> Back to Home
          </Link>
        </div>
      </div>

      {navigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F9FCFF]/80 backdrop-blur-sm animate-fade-in-up">
          <div className="flex flex-col items-center gap-3">
            <i className="fa-solid fa-spinner animate-spin text-3xl text-[#1B1967]"></i>
            <p className="text-sm font-medium text-[#1B1967]">Taking you to sign in…</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default SignIn;
