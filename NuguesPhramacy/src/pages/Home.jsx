import { Link } from "react-router-dom";
import heroImg from "../assets/Images/img3.jpg";

function Home() {
  return (
    <main className="bg-[#F9FCFF] text-slate-900">
      <section className="hero min-h-screen overflow-hidden px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center text-center">
        <div className="relative mx-auto w-full max-w-8xl max-h-6xl pt-15 pb-15 rounded-2xl overflow-hidden">
          <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover filter blur-md scale-105" />
          <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
          <div className="relative z-10 grid items-center gap-12">
            <div className="mx-auto max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-[#7176C4]">Trusted since 2008 · Egbeda, Lagos</p>
              <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#141432] sm:text-5xl">
                Your partner in sound health.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Quality medicines, wellness products and personal pharmacist consultations — delivered with the care your family deserves.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center justify-center">
                <Link
                  to="/Shop"
                  className="inline-flex items-center justify-center rounded-full bg-[#23195f] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#23195f]/20 transition hover:bg-[#141444]"
                >
                  Shop Medicines
                </Link>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#141432] shadow-sm transition hover:border-[#23195f] hover:text-[#23195f]"
                >
                  Book a Consultation
                </a>
              </div>

              <div className="mt-14 grid gap-6 sm:grid-cols-3">
                <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                  <p className="text-3xl font-semibold text-[#23195f]">15+</p>
                  <p className="mt-2 text-sm text-slate-500">Years caring</p>
                </div>
                <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                  <p className="text-3xl font-semibold text-[#23195f]">10k+</p>
                  <p className="mt-2 text-sm text-slate-500">Customers</p>
                </div>
                <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                  <p className="text-3xl font-semibold text-[#23195f]">3k+</p>
                  <p className="mt-2 text-sm text-slate-500">Products</p>
                </div>
              </div>
            </div>

            {/* <div className="rounded-[2rem] border border-white/30 bg-white/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="rounded-3xl bg-[#F6F8FF] p-6 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-[#7176C4]">Fast care</p>
                <h2 className="mt-4 text-3xl font-semibold text-[#141432]">Speak with a pharmacist today.</h2>
                <p className="mt-4 text-slate-600">
                  Get professional advice, prescription support, and health guidance whenever you need it.
                </p>
              </div>
            </div> */}
          </div>

          {/* features strip will appear below the hero */}

        </div>
      </section>

      {/* Features strip below hero */}
      <section className="-mt-8 mb-12 px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="hidden w-full rounded-full bg-white/90 py-3 shadow-xl backdrop-blur-sm border border-gray-100 md:grid md:grid-cols-4">
            <div className="flex items-center gap-4 px-6 py-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#EEF2FF] text-[#23195f]"> <i className="fa-solid fa-truck"></i> </div>
              <div>
                <div className="text-sm font-semibold text-[#141432]">Free delivery</div>
                <div className="text-xs text-slate-500">Orders over ₦15,000</div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-gray-100 px-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#EEF2FF] text-[#23195f]"> <i className="fa-solid fa-shield-halved"></i> </div>
              <div>
                <div className="text-sm font-semibold text-[#141432]">Genuine products</div>
                <div className="text-xs text-slate-500">NAFDAC verified</div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-gray-100 px-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#EEF2FF] text-[#23195f]"> <i className="fa-solid fa-user-doctor"></i> </div>
              <div>
                <div className="text-sm font-semibold text-[#141432]">Expert pharmacists</div>
                <div className="text-xs text-slate-500">Free consultations</div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-gray-100 px-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#EEF2FF] text-[#23195f]"> <i className="fa-regular fa-clock"></i> </div>
              <div>
                <div className="text-sm font-semibold text-[#141432]">Open 7 days</div>
                <div className="text-xs text-slate-500">8am — 9pm daily</div>
              </div>
            </div>
          </div>

          {/* mobile strip */}
          <div className="md:hidden mx-auto flex w-full gap-3 overflow-x-auto rounded-xl bg-white/90 py-3 px-3 shadow-lg backdrop-blur-sm border border-gray-100">
            {[
              {title: 'Free delivery', subtitle: 'Orders over ₦15,000', icon: 'fa-truck'},
              {title: 'Genuine products', subtitle: 'NAFDAC verified', icon: 'fa-shield-halved'},
              {title: 'Expert pharmacists', subtitle: 'Free consultations', icon: 'fa-user-doctor'},
              {title: 'Open 7 days', subtitle: '8am — 9pm', icon: 'fa-clock'},
            ].map((f) => (
              <div key={f.title} className="flex min-w-[160px] items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#23195f] flex"> <i className={`fa-solid ${f.icon}`}></i> </div>
                <div>
                  <div className="text-sm font-semibold text-[#141432]">{f.title}</div>
                  <div className="text-xs text-slate-500">{f.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                <input
                  type="text"
                  placeholder="Full name"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#23195f] focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#23195f] focus:bg-white"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#23195f] focus:bg-white"
              />
              <textarea
                rows="5"
                placeholder="How can we help?"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-[#23195f] focus:bg-white"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#171B57] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#0f1343]"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
