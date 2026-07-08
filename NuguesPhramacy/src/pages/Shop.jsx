import { useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  { id: "prescription", label: "Prescription" },
  { id: "otc", label: "Over-the-Counter" },
  { id: "supplements", label: "Supplements" },
];

const conditions = [
  { id: "blood-pressure", label: "Blood Pressure" },
  { id: "diabetes", label: "Diabetes" },
  { id: "diabetes-lungs", label: "Diabetes & Lungs" },
  { id: "others", label: "Others..." },
];

function PriceRangeSlider() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#141432]">Price</h3>
      <div className="relative mt-5 h-1 rounded-full bg-slate-200">
        <div className="absolute left-[15%] right-[20%] top-0 h-1 rounded-full bg-[#23195f]"></div>
        <span className="absolute left-[15%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#23195f] bg-white shadow"></span>
        <span className="absolute right-[20%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#23195f] bg-white shadow"></span>
      </div>
      <div className="mt-3 flex justify-between text-xs font-medium text-slate-500">
        <span>$10 - $30</span>
        <span>$70 - $80</span>
      </div>
    </div>
  );
}

function Shop() {
  const [active, setActive] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const select = (type, item) => {
    setActive({ type, id: item.id, label: item.label });
    setMobileOpen(false);
  };

  return (
    <section className="bg-[#F6F7FB] min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#141432] sm:text-3xl">
              <span className="text-[#23195f]">Shop Medicines</span>
              <span className="text-slate-400"> | </span>
              <span className="font-normal text-slate-600">Browse and Refill Your Prescriptions</span>
            </h1>
          </div>
          <Link
            to="/Shop"
            aria-label="cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#23195f] shadow-sm transition hover:bg-[#EEF0FF]"
          >
            <i className="fa-solid fa-cart-shopping text-lg"></i>
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((s) => !s)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#23195f] shadow-sm lg:hidden"
        >
          <i className="fa-solid fa-sliders"></i>
          {mobileOpen ? "Hide filters" : "Show filters"}
        </button>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside
            className={`${mobileOpen ? "block" : "hidden"} space-y-6 lg:sticky lg:top-6 lg:block lg:self-start`}
          >
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#141432]">Find a Medication</h3>
              <div className="relative mt-3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <i className="fa-solid fa-magnifying-glass text-sm"></i>
                </span>
                <input
                  type="text"
                  placeholder="Search Medication"
                  className="h-11 w-full rounded-full border border-gray-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#23195f] focus:bg-white"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#141432]">Categories</h3>
              <ul className="mt-3 space-y-1">
                {categories.map((c) => {
                  const isActive = active?.id === c.id;
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => select("category", c)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                          isActive
                            ? "bg-[#EEF0FF] font-semibold text-[#23195f]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-[#23195f]"
                        }`}
                      >
                        {c.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#141432]">Condition</h3>
              <ul className="mt-3 space-y-1">
                {conditions.map((c) => {
                  const isActive = active?.id === c.id;
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => select("condition", c)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                          isActive
                            ? "bg-[#EEF0FF] font-semibold text-[#23195f]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-[#23195f]"
                        }`}
                      >
                        {c.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <PriceRangeSlider />
            </div>
          </aside>

          <main className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="absolute inset-0 -m-4 rounded-full bg-[#EEF0FF] blur-xl"></div>
                <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#EEF0FF] to-[#FCE7F3] text-[#23195f] shadow-sm">
                  <i className="fa-solid fa-box-open text-3xl"></i>
                </div>
              </div>

              <h2 className="mt-6 text-2xl font-semibold text-[#141432] sm:text-3xl">
                {active ? `No products available in ${active.label}` : "No products available in this section"}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                We are currently updating our digital inventory for this department.
                Please check back later or try using the medication search bar on the left sidebar.
              </p>

              {active && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] px-4 py-1.5 text-xs font-semibold text-[#23195f]">
                  <i className="fa-solid fa-filter"></i>
                  {active.type === "category" ? "Category" : "Condition"}: {active.label}
                  <button
                    onClick={() => setActive(null)}
                    className="ml-1 text-[#23195f]/60 hover:text-[#23195f]"
                    aria-label="Clear filter"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/home"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#23195f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#141444]"
                >
                  <i className="fa-solid fa-house"></i>
                  Back to Home
                </Link>
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Search Medication"]');
                    if (input) input.focus();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#23195f] bg-white px-5 py-2.5 text-sm font-semibold text-[#23195f] transition hover:bg-[#EEF0FF]"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                  Search medications
                </button>
              </div>

              <p className="mt-8 inline-flex items-center gap-2 text-xs text-slate-400">
                <i className="fa-solid fa-bell"></i>
                Want an alert when items arrive? Notify me is coming soon.
              </p>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

export default Shop;
