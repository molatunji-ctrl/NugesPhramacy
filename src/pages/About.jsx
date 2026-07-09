import aboutImg from "../assets/Images/img.jpg";

function About() {
  return (
    <main className="bg-[#F9FCFF] text-slate-900">
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl">
              <img src={aboutImg} alt="Nuges pharmacy shelf" className="h-full w-full object-cover" />
              <div className="absolute bottom-6 left-6 rounded-[2rem] bg-[#171B57] px-6 py-5 text-white shadow-2xl sm:left-auto sm:right-6">
                <p className="text-4xl font-semibold">15+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.35em] text-slate-300">Years of trust</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#7176C4]">About Nuges</p>
                <h1 className="mt-4 text-4xl font-semibold text-[#0B1020] sm:text-5xl">A neighborhood pharmacy with a clinical standard.</h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                  Founded by Pharmacist Olusegun Abiona, Nuges Pharmaceuticals Ltd has served the Egbeda community for over a decade — combining warm, personal service with rigorous clinical practice.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Licensed and NAFDAC-compliant",
                  "Cold-chain storage for sensitive medicines",
                  "Discreet, confidential consultations",
                  "Insurance and HMO support",
                ].map((item) => (
                  <div key={item} className="flex gap-4 rounded-3xl bg-[#F8FAFC] p-5">
                    <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <i className="fa-solid fa-shield-check"></i>
                    </span>
                    <p className="text-sm font-medium text-[#141432]">{item}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#171B57] text-lg font-semibold text-white">OA</div>
                  <div>
                    <p className="font-semibold text-[#171B57]">Olusegun Abiona</p>
                    <p className="text-sm text-slate-500">Founder & Lead Pharmacist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
