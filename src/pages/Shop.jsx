import { useState, useEffect } from "react";
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

function SkeletonSidebar() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="skeleton h-5 w-40"></div>
          <div className="mt-5 space-y-3">
            <div className="skeleton h-12 w-full rounded-xl"></div>
            <div className="skeleton h-12 w-full rounded-xl"></div>
            <div className="skeleton h-12 w-3/4 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonMain() {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center text-center">
      <div className="skeleton h-32 w-32 rounded-[2rem]"></div>
      <div className="skeleton mt-8 h-10 w-96"></div>
      <div className="skeleton mt-4 h-5 w-full max-w-2xl"></div>
      <div className="skeleton mt-3 h-5 w-3/4 max-w-2xl"></div>
      <div className="mt-10 flex gap-4">
        <div className="skeleton h-14 w-44 rounded-full"></div>
        <div className="skeleton h-14 w-52 rounded-full"></div>
      </div>
    </div>
  );
}

function Shop() {
  const [active, setActive] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const select = (type, item) => {
    setActive({ type, id: item.id, label: item.label });
    setMobileOpen(false);
  };

  return (
    <section className="bg-[#F6F7FB] min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold leading-tight text-[#141432] sm:text-4xl lg:text-[2.75rem]">
              <span className="text-[#23195f]">Shop Medicines</span>
              <span className="text-slate-300"> | </span>
              <span className="font-normal text-slate-600">Browse and Refill Your Prescriptions</span>
            </h1>
          </div>
          <Link
            to="/Shop"
            aria-label="cart"
            className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#23195f] shadow-sm transition hover:bg-[#EEF0FF]"
          >
            <i className="fa-solid fa-cart-shopping text-xl"></i>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((s) => !s)}
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-base font-semibold text-[#23195f] shadow-sm lg:hidden"
        >
          <i className="fa-solid fa-sliders"></i>
          {mobileOpen ? "Hide filters" : "Show filters"}
        </button>

        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Sidebar */}
          <aside
            className={`${mobileOpen ? "block" : "hidden"} space-y-6 lg:sticky lg:top-6 lg:block lg:self-start`}
          >
            {loading ? (
              <SkeletonSidebar />
            ) : (
              <>
                {/* Find a Medication */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-[#141432]">Find a Medication</h3>
                  <div className="relative mt-4">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <i className="fa-solid fa-magnifying-glass text-base"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search Medication"
                      className="h-12 w-full rounded-full border border-gray-200 bg-slate-50 pl-12 pr-4 text-base outline-none transition focus:border-[#23195f] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-[#141432]">Categories</h3>
                  <ul className="mt-4 space-y-1.5">
                    {categories.map((c) => {
                      const isActive = active?.id === c.id;
                      return (
                        <li key={c.id}>
                          <button
                            onClick={() => select("category", c)}
                            className={`w-full rounded-xl px-4 py-3 text-left text-base transition ${
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

                {/* Condition */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold text-[#141432]">Condition</h3>
                  <ul className="mt-4 space-y-1.5">
                    {conditions.map((c) => {
                      const isActive = active?.id === c.id;
                      return (
                        <li key={c.id}>
                          <button
                            onClick={() => select("condition", c)}
                            className={`w-full rounded-xl px-4 py-3 text-left text-base transition ${
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
              </>
            )}
          </aside>

          {/* Main content */}
          <main className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:p-12 lg:p-16">
            {loading ? (
              <SkeletonMain />
            ) : (
              <div className="flex min-h-[600px] flex-col items-center justify-center text-center">
                {/* Icon */}
                <div className="relative">
                  <div className="absolute inset-0 -m-6 rounded-full bg-[#EEF0FF] blur-2xl"></div>
                  <div className="relative inline-flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gradient-to-br from-[#EEF0FF] to-[#FCE7F3] text-[#23195f] shadow-sm">
                    <i className="fa-solid fa-box-open text-5xl"></i>
                  </div>
                </div>

                {/* Heading */}
                <h2 className="mt-8 text-3xl font-semibold leading-tight text-[#141432] sm:text-4xl lg:text-[2.5rem]">
                  {active
                    ? `No products available in ${active.label}`
                    : "No products available in this section"}
                </h2>

                {/* Description */}
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
                  We are currently updating our digital inventory for this department.
                  Please check back later or try using the medication search bar on the left sidebar.
                </p>

                {/* Active filter chip */}
                {active && (
                  <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] px-5 py-2 text-sm font-semibold text-[#23195f]">
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

                {/* Actions */}
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Link
                    to="/home"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#23195f] px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#141444]"
                  >
                    <i className="fa-solid fa-house"></i>
                    Back to Home
                  </Link>
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Search Medication"]');
                      if (input) input.focus();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#23195f] bg-white px-7 py-3.5 text-base font-semibold text-[#23195f] transition hover:bg-[#EEF0FF]"
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>
                    Search medications
                  </button>
                </div>

                {/* Helper */}
                <p className="mt-10 inline-flex items-center gap-2 text-sm text-slate-400">
                  <i className="fa-solid fa-bell"></i>
                  Want an alert when items arrive? Notify me is coming soon.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

export default Shop;
