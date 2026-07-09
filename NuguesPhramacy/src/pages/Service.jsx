function Service() {
  return (
    <section id="services" className="bg-[#F9FCFF] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-10 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#7176C4]">What we offer</p>
            <h2 className="mt-4 text-4xl font-semibold text-[#141432] sm:text-5xl">More than a pharmacy</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              From routine prescriptions to one-on-one wellness advice, our team is here for every step of your health journey.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Prescription Filling",
                description: "Bring your prescription or upload it — we'll prepare and verify it with care.",
                icon: "fa-pill",
              },
              {
                label: "Pharmacist Consults",
                description: "Free, confidential 1:1 sessions with our licensed pharmacists.",
                icon: "fa-stethoscope",
              },
              {
                label: "Health Screenings",
                description: "Blood pressure, blood sugar and BMI checks at our Egbeda store.",
                icon: "fa-heart-circle-plus",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#EEF2FF] text-[#23195f] text-xl">
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <h3 className="text-xl font-semibold text-[#23195f]">{item.label}</h3>
                <p className="mt-3 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

  );
}

export default Service;
