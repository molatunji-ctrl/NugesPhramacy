import { useState } from "react";
import { Link } from "react-router-dom";
import googleLogo from "../assets/Icons/google.ico"

function SignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F9FCFF] px-4 py-8">
      <div className="flex w-full max-w-md flex-col items-center">
        <header className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B1967] text-lg font-semibold text-white">
            N
          </div>
          <h3 className="text-2xl font-semibold text-[#1B1967]">Nuges Pharmaceuticals</h3>
        </header>

        <main className="flex w-full flex-col gap-6 rounded-xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
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
            className="flex items-center justify-center rounded-xl border border-gray-300 py-2.5 font-semibold text-[#100F27]"
          >
            <img src={googleLogo} alt="Google" className="mr-2 h-5 w-5" />
            Continue with Google
          </button>

          <div className="text-center text-sm text-[#6A7282]">or</div>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-[#1B1967]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-[#1B1967]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              className="rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-[#1B1967]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="rounded-xl bg-[#1B1967] py-2.5 font-semibold text-white"
            >
              Create account
            </button>
          </form>

          {message && (
            <p className="text-sm text-center text-[#1B1967]">{message}</p>
          )}

          <div className="flex items-center justify-center gap-1">
            <h2 className="text-[14px] font-medium text-[#5B6379]">Already have an account?</h2>
            <Link to="/login" className="text-[16px] font-semibold text-[#1B1967]">
              Sign in
            </Link>
          </div>
        </main>

        <div className="mt-4 text-center">
          <Link to="/home" className="text-sm text-[#6A7282] hover:text-[#1B1967]">
            <i class="fa-solid fa-arrow-left-long"></i>Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SignIn;