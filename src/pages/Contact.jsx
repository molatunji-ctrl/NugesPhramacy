import { useState } from "react";
import { api } from "../service/api";

function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.message.trim()) errs.message = "Please tell us how we can help";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await api.sendContactMessage(form);
      setStatus({ type: "success", message: "Message sent — we'll get back to you within the hour." });
      setForm({ name: "", phone: "", email: "", message: "" });
      setErrors({});
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Couldn't send your message. Please call or email us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-[#171B57] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="text-white">
          <p className="text-xs uppercase tracking-[0.35em] text-[#A5B4FC]">Visit us</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            We're here when you need us.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#CBD5E1]">
            Walk in for a consultation, call ahead for a prescription, or send us a message — we respond within the hour.
          </p>

          <div className="mt-10 space-y-6 text-sm sm:text-base">
            <div className="flex items-start gap-4">
              <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                <i className="fa-solid fa-location-dot"></i>
              </span>
              <div>
                <p className="text-white">26/28, Karimu Laka Street, By Old Oba's Palace, Egbeda, Lagos.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                <i className="fa-solid fa-phone"></i>
              </span>
              <div className="space-y-1 text-white/90">
                <p>+234 803 359 7959 (mobile)</p>
                <p>+234 906 000 5227 (office)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                <i className="fa-regular fa-envelope"></i>
              </span>
              <div className="space-y-1 text-white/90">
                <p>nugespharmaceuticals@gmail.com</p>
                <p>nugespharmacy@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                <i className="fa-brands fa-instagram"></i>
              </span>
              <p className="text-white/90">@nugespharmacy</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-2xl sm:p-10">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Send us a message</h3>
            <p className="mt-2 text-slate-600">We'll reply by phone or email shortly.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className={`h-14 w-full rounded-2xl border px-4 text-sm outline-none transition ${
                    errors.name ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 focus:border-[#23195f] focus:bg-white"
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className={`h-14 w-full rounded-2xl border px-4 text-sm outline-none transition ${
                    errors.phone ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 focus:border-[#23195f] focus:bg-white"
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange("email")}
                className={`h-14 w-full rounded-2xl border px-4 text-sm outline-none transition ${
                  errors.email ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 focus:border-[#23195f] focus:bg-white"
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>

            <div>
              <textarea
                rows="5"
                placeholder="How can we help?"
                value={form.message}
                onChange={handleChange("message")}
                className={`w-full rounded-2xl border px-4 py-4 text-sm outline-none transition ${
                  errors.message ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 focus:border-[#23195f] focus:bg-white"
                }`}
              />
              {errors.message && <p className="mt-1 text-xs text-rose-500">{errors.message}</p>}
            </div>

            {status.message && (
              <p
                role="alert"
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  status.type === "success"
                    ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border border-rose-100 bg-rose-50 text-rose-700"
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[#171B57] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#0f1343] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin mr-2"></i>
                  Sending…
                </>
              ) : (
                "Send message"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;