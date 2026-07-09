import React from 'react';

function Contact() {
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

          <form className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Full name" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#23195f] focus:bg-white" />
              <input type="text" placeholder="Phone" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#23195f] focus:bg-white" />
            </div>
            <input type="email" placeholder="Email" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#23195f] focus:bg-white" />
            <textarea rows="5" placeholder="How can we help?" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-[#23195f] focus:bg-white" />
            <button type="submit" className="w-full rounded-2xl bg-[#171B57] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#0f1343]">
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
