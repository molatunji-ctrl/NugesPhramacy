import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import heroImg from "../assets/Images/img3.jpg";
import Contact from "./Contact";
import About from "./About";
import Service from "./Service";

function Home() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    let sectionId = "home";

    if (path === "/about") sectionId = "about";
    else if (path === "/service") sectionId = "services";
    else if (path === "/contact") sectionId = "contact";

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.pathname]);

  return (
    <main className="bg-[#F9FCFF] text-slate-900">
      {/* ── Hero ─────────────────────────────────── */}
      <section
        id="home"
        className="hero min-h-[85vh] sm:min-h-screen overflow-hidden px-4 py-8 sm:py-12 sm:px-6 lg:px-8 flex items-center justify-center text-center"
      >
        <div className="relative mx-auto w-full max-w-7xl pt-8 pb-8 sm:pt-15 sm:pb-15 rounded-2xl overflow-hidden">
          <img
            src={heroImg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover filter blur-md scale-105"
          />
          <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
          <div className="relative z-10 grid items-center gap-8 sm:gap-12">
            <div className="mx-auto max-w-2xl px-2">
              <p className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#7176C4]">
                Trusted since 2008 · Egbeda, Lagos
              </p>
              <h1 className="mt-4 sm:mt-6 text-3xl font-semibold leading-tight text-[#141432] sm:text-4xl lg:text-5xl">
                Your partner in sound health.
              </h1>
              <p className="mt-4 sm:mt-6 max-w-xl mx-auto text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:text-lg">
                Quality medicines, wellness products and personal pharmacist
                consultations — delivered with the care your family deserves.
              </p>

              {/* CTA buttons — stacked full-width on mobile */}
              <div className="mt-7 sm:mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4 sm:items-center justify-center">
                <Link
                  to="/Shop"
                  className="inline-flex items-center justify-center rounded-full bg-[#23195f] px-6 py-3.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-[#23195f]/20 transition hover:bg-[#141444]"
                >
                  Shop Medicines
                </Link>
                
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 sm:py-3 text-sm font-semibold text-[#141432] shadow-sm transition hover:border-[#23195f] hover:text-[#23195f]"
                >
                  Book a Consultation
                </a>
              </div>

              {/* stat cards — 2-up mobile, 3-up desktop */}
              <div className="mt-10 sm:mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6">
                <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 text-center shadow-sm">
                  <p className="text-2xl sm:text-3xl font-semibold text-[#23195f]">15+</p>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500">Years caring</p>
                </div>
                <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 text-center shadow-sm">
                  <p className="text-2xl sm:text-3xl font-semibold text-[#23195f]">10k+</p>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500">Customers</p>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 text-center shadow-sm">
                  <p className="text-2xl sm:text-3xl font-semibold text-[#23195f]">3k+</p>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500">Products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features strip below hero ───────────────── */}
      <section className="brhero -mt-6 sm:-mt-8 mb-10 sm:mb-12 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* desktop grid */}
          <div className="hidden w-full rounded-full bg-white/90 py-3 shadow-xl backdrop-blur-sm border border-gray-100 md:grid md:grid-cols-4">
            <div className="flex items-center gap-4 px-6 py-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#EEF2FF] text-[#23195f]">
                <i className="fa-solid fa-truck"></i>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#141432]">Free delivery</div>
                <div className="text-xs text-slate-500">Orders over ₦15,000</div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-gray-100 px-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#EEF2FF] text-[#23195f]">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#141432]">Genuine products</div>
                <div className="text-xs text-slate-500">NAFDAC verified</div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-gray-100 px-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#EEF2FF] text-[#23195f]">
                <i className="fa-solid fa-user-doctor"></i>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#141432]">Expert pharmacists</div>
                <div className="text-xs text-slate-500">Free consultations</div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-gray-100 px-6">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#EEF2FF] text-[#23195f]">
                <i className="fa-regular fa-clock"></i>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#141432]">Open 7 days</div>
                <div className="text-xs text-slate-500">8am — 9pm daily</div>
              </div>
            </div>
          </div>

          {/* mobile strip */}
          <div className="md:hidden mx-auto flex w-full gap-2.5 overflow-x-auto rounded-2xl bg-white/90 py-3 px-3 shadow-md backdrop-blur-sm border border-gray-100 scrollbar-hide">
            {[
              { title: "Free delivery", subtitle: "Orders over ₦15,000", icon: "fa-truck" },
              { title: "Genuine products", subtitle: "NAFDAC verified", icon: "fa-shield-halved" },
              { title: "Expert pharmacists", subtitle: "Free consultations", icon: "fa-user-doctor" },
              { title: "Open 7 days", subtitle: "8am — 9pm", icon: "fa-clock" },
            ].map((f) => (
              <div
                key={f.title}
                className="flex min-w-[150px] flex-shrink-0 items-center gap-2.5 rounded-xl bg-[#F9FAFF] px-3 py-2.5"
              >
                <div className="h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#EEF2FF] text-[#23195f] flex text-sm">
                  <i className={`fa-solid ${f.icon}`}></i>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-[#141432]">{f.title}</div>
                  <div className="truncate text-[11px] text-slate-500">{f.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by category ─────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#7176C4]">
                Shop by category
              </p>
              <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-semibold text-[#0B1020]">
                Everything for your wellbeing
              </h2>
            </div>
            
            <Link to="/Shop" className="flex-shrink-0 text-sm font-medium text-[#23195f] whitespace-nowrap">
              View all →
            </Link>
          </div>

          <div className="mt-4 sm:mt-6 -mx-4 overflow-x-auto py-6 sm:py-10 px-4 scrollbar-hide">
            <div className="flex gap-3 sm:gap-4 w-max">
              {[
                { title: "Prescription", count: "1,200+ items", icon: "fa-pill" },
                { title: "Wellness", count: "480+ items", icon: "fa-heart-circle-plus" },
                { title: "Mother & Baby", count: "260+ items", icon: "fa-baby" },
                { title: "Personal Care", count: "390+ items", icon: "fa-sparkles" },
                { title: "Medical Devices", count: "120+ items", icon: "fa-stethoscope" },
                { title: "Supplements", count: "540+ items", icon: "fa-shield-halved" },
              ].map((c) => (
                <Link
                  key={c.title}
                  to="/Shop"
                  className="group block min-w-[160px] sm:min-w-[200px] flex-shrink-0 rounded-xl border border-gray-100 bg-white p-3.5 sm:p-4 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg bg-[#EEF2FF] text-[#23195f]">
                      <i className={`fa-solid ${c.icon} text-xs sm:text-sm`}></i>
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm sm:text-base font-semibold text-[#0B1020] group-hover:text-[#23195f]">
                        {c.title}
                      </div>
                      <div className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-slate-500">
                        {c.count}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact / About / Service ──────────────
          These components already render their own
          <section id="..."> with background + padding,
          so they're placed directly — no wrapping
          section here to avoid duplicate ids / nested
          landmarks. ────────────────────────────── */}
      <Contact />
      <About />
      <Service />
    </main>
  );
}

export default Home;