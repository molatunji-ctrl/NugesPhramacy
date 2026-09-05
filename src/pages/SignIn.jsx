import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import googleIcon from "../assets/Icons/google.ico";
import { useAuth } from "../context/AuthContext";

function SignIn() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (form.password.length < 8) {
      setMessageType("error");
      setMessage("Use at least 8 characters for your password.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessageType("error");
      setMessage("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        fullname: form.fullname.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });

      setMessageType("success");
      setMessage(response?.message || "Account created. You can now sign in.");
      setTimeout(() => navigate("/login", { replace: true }), 800);
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Account creation failed.");
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
          <h3 className="text-2xl font-semibold text-[#1B1967]">
            Nuges Pharmaceuticals
          </h3>
        </header>

        <main className="flex w-full flex-col gap-6 rounded-xl border border-gray-200 bg-white px-8 py-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-[#090F27]">
              Create your account
            </h1>
            <p className="text-sm text-[#6A7282]">
              Save your details, track orders, and checkout faster.
            </p>
          </div>

          <button
            type="button"
            onClick={loginWithGoogle}
            className="flex items-center justify-center rounded-xl border border-gray-300 py-2.5 font-semibold text-[#100F27] transition-all duration-200 hover:border-[#1B1967] hover:bg-[#F4F5FA] active:scale-[0.98]"
          >
            <img src={googleIcon} alt="" className="mr-2 h-5 w-5" />
            Continue with Google
          </button>

          <div className="text-center text-sm text-[#6A7282]">or</div>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              name="fullname"
              type="text"
              placeholder="Full name"
              value={form.fullname}
              onChange={updateField}
              autoComplete="name"
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password (8+ characters)"
              value={form.password}
              onChange={updateField}
              autoComplete="new-password"
              minLength={8}
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
              required
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={updateField}
              autoComplete="new-password"
              minLength={8}
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none transition-all duration-200 focus:border-[#1B1967] focus:ring-2 focus:ring-[#1B1967]/15"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1B1967] py-2.5 font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {message && (
            <p
              role="alert"
              className={`rounded-lg px-3 py-2 text-center text-sm ${
                messageType === "success"
                  ? "border border-green-100 bg-green-50 text-green-700"
                  : "border border-red-100 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-center text-sm text-[#5B6379]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#1B1967] transition-opacity hover:opacity-70"
            >
              Sign in
            </Link>
          </p>
        </main>

        <Link
          to="/home"
          className="mt-4 text-sm text-[#6A7282] transition-colors duration-200 hover:text-[#1B1967]"
        >
          <i className="fa-solid fa-arrow-left-long mr-1.5"></i>
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default SignIn;
