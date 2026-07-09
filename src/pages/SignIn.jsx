import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleLogo from "../assets/Icons/google.ico";

const API_BASE = import.meta.env.VITE_API_URL || "https://np-backend-4ee5.onrender.com";

function SignIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};

    if (form.name.trim().length < 2) {
      e.name = "Full name must be at least 2 characters";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }

    if (form.password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullname: form.name.trim(),
          email: form.email.toLowerCase().trim(),
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Registration failed (${response.status})`
        );
      }

      setMessageType("success");
      setMessage(data.message || "Account created successfully!");

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", form.email.toLowerCase().trim());

      setTimeout(() => {
        navigate("/home", {
          replace: true,
          state: {
            email: form.email.toLowerCase().trim(),
            justRegistered: true,
          },
        });
      }, 1200);
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Something went wrong. Please try again.");
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

        <main className="flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-[#090F27]">
              Create your account
            </h1>

            <p className="text-sm text-[#6A7282]">
              Join us to enjoy faster checkout, order history, and exclusive
              offers.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="flex items-center justify-center rounded-xl border border-gray-300 py-2.5 font-semibold text-[#100F27] transition-all duration-200 hover:border-[#1B1967] hover:bg-[#F4F5FA] active:scale-[0.98]"
          >
            <img src={googleLogo} alt="Google" className="mr-2 h-5 w-5" />
            Continue with Google
          </button>

          <div className="relative text-center text-sm text-[#6A7282]">
            <span className="relative z-10 bg-white px-2">or</span>
            <div className="absolute left-0 right-0 top-1/2 border-t border-gray-200"></div>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                className={`w-full rounded-xl border px-3 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1B1967]/15 ${
                  errors.name
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-[#1B1967]"
                }`}
                value={form.name}
                onChange={handleChange("name")}
                required
              />

              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                className={`w-full rounded-xl border px-3 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1B1967]/15 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-[#1B1967]"
                }`}
                value={form.email}
                onChange={handleChange("email")}
                required
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 chars)"
                autoComplete="new-password"
                className={`w-full rounded-xl border px-3 py-2.5 pr-12 outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1B1967]/15 ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-gray-300 focus:border-[#1B1967]"
                }`}
                value={form.password}
                onChange={handleChange("password")}
                required
                minLength={6}
              />

              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-2.5 text-xs font-medium text-[#6A7282] hover:text-[#1B1967]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1B1967] py-3 font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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

          <p className="text-center text-[14px] text-[#5B6379]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[15px] font-semibold text-[#1B1967] transition-opacity duration-200 hover:opacity-70"
            >
              Log in
            </Link>
          </p>

          <p className="text-center text-[11px] leading-relaxed text-[#8a8fa3]">
            By creating an account, you agree to Nuges Pharmaceuticals’{" "}
            <Link to="/terms" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </main>

        <div className="mt-4 text-center">
          <Link
            to="/home"
            className="text-sm text-[#6A7282] transition-colors duration-200 hover:text-[#1B1967]"
          >
            <i className="fa-solid fa-arrow-left-long mr-1.5"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SignIn;