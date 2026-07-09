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
      <section id="home" className="hero min-h-screen overflow-hidden px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center text-center">
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
      <section className="brhero -mt-8 mb-12 px-5 py-8 sm:px-6 lg:px-8">
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

      
        {/* Shop by category */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#7176C4]">Shop by category</p>
                <h2 className="mt-2 text-3xl font-semibold text-[#0B1020]">Everything for your wellbeing</h2>
              </div>
              <a href="/Shop" className="text-[#23195f] font-medium">View all categories →</a>
            </div>

            <div className="mt-6 -mx-4 overflow-x-auto py-10 px-4">
              <div className="flex gap-4 w-max">
                {[
                  { title: 'Prescription', count: '1,200+ items', icon: 'fa-pill' },
                  { title: 'Wellness', count: '480+ items', icon: 'fa-heart-circle-plus' },
                  { title: 'Mother & Baby', count: '260+ items', icon: 'fa-baby' },
                  { title: 'Personal Care', count: '390+ items', icon: 'fa-sparkles' },
                  { title: 'Medical Devices', count: '120+ items', icon: 'fa-stethoscope' },
                  { title: 'Supplements', count: '540+ items', icon: 'fa-shield-halved' },
                ].map((c) => (
                  <a key={c.title} href="/Shop" className="group block min-w-[200px] flex-shrink-0 rounded-xl border border-gray-100 bg-white p-4 hover:shadow-sm transition">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#EEF2FF] text-[#23195f]">
                        <i className={`fa-solid ${c.icon} text-sm`}></i>
                      </div>
                      <div>
                        <div className="text-base font-semibold text-[#0B1020] group-hover:text-[#23195f]">{c.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{c.count}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>


        <section id="contact" className="bg-[#171B57] px-4 py-12 sm:px-6 lg:px-8">
          <Contact />
        </section>
        
        <section id="about" className="px-4 py-12 sm:px-6 lg:px-8">
          <About />
        </section>
         
         <section id="services" className="px-4 py-12 sm:px-6 lg:px-8">
          <Service />
        </section>
    </main>
  );
}

 
   


export default Home;
