/*
  Backend-connected pharmacy shop page.
  Fetches products from the configured API, supports filtering/search/sorting,
  and sends selected products to the app-level cart/wishlist handlers.
*/

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { api, normalizeList, normalizeProduct } from "../service/api";

const CATEGORIES = [
  { id: "prescription", label: "Prescription" },
  { id: "otc", label: "Over-the-Counter" },
  { id: "supplements", label: "Supplements" },
];

const CONDITIONS = [
  { id: "blood-pressure", label: "Blood Pressure" },
  { id: "diabetes", label: "Diabetes" },
  { id: "diabetes-lungs", label: "Diabetes & Lungs" },
  { id: "others", label: "Others…" },
];

const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular" },
  { id: "price_low", label: "Price: Lowest First" },
  { id: "price_high", label: "Price: Highest First" },
];

const BRAND_DARK = "#23195f";
const BRAND_LIGHT = "#EEF0FF";

function formatPrice(n) {
  return "₦" + Number(n || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function SkeletonSidebar() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="skeleton h-6 w-40"></div>
          <div className="mt-5 space-y-3">
            <div className="skeleton h-14 w-full rounded-xl"></div>
            <div className="skeleton h-14 w-full rounded-xl"></div>
            <div className="skeleton h-14 w-3/4 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonMain() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="skeleton h-44 w-full rounded-2xl"></div>
          <div className="skeleton mt-5 h-5 w-3/4"></div>
          <div className="skeleton mt-3 h-4 w-1/2"></div>
          <div className="skeleton mt-6 h-12 w-full rounded-full"></div>
        </div>
      ))}
    </div>
  );
}

function FilterButton({ label, isActive, onClick }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={[
          "w-full rounded-xl px-4 py-3.5 text-left text-lg transition-all duration-150",
          isActive
            ? "bg-[#EEF0FF] font-semibold text-[#23195f] border-2 border-[#23195f] shadow-sm"
            : "text-slate-700 border-2 border-transparent hover:bg-slate-50 hover:text-[#23195f]",
        ].join(" ")}
      >
        <span className="flex items-center gap-3">
          {isActive && <span style={{ background: BRAND_DARK }} className="h-2.5 w-2.5 rounded-full flex-shrink-0" />}
          {label}
        </span>
      </button>
    </li>
  );
}

function ActiveFilterChip({ active, onClear }) {
  if (!active) return null;
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] px-5 py-2.5 text-base font-semibold text-[#23195f]">
        <i className="fa-solid fa-filter text-sm"></i>
        {active.type === "category" ? "Category" : "Condition"}: {active.label}
      </span>
      <button onClick={onClear} className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-base font-semibold text-rose-600 transition hover:bg-rose-100">
        <i className="fa-solid fa-xmark"></i>
        Clear filter
      </button>
    </div>
  );
}

function EmptyProductState({ active, error }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <div className="relative">
        <div className="absolute inset-0 -m-6 rounded-full bg-[#EEF0FF] opacity-40"></div>
        <div className="relative inline-flex h-32 w-32 items-center justify-center rounded-[2rem] shadow-sm" style={{ background: `linear-gradient(135deg, ${BRAND_LIGHT}, #FCE7F3)` }}>
          <i className="fa-solid fa-box-open text-5xl" style={{ color: BRAND_DARK }}></i>
        </div>
      </div>
      <h2 className="mt-8 text-3xl font-semibold leading-tight text-[#141432] sm:text-4xl">
        {error ? "Unable to load products" : active ? `Nothing listed under "${active.label}" yet` : "No products in this section yet"}
      </h2>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
        {error || "We're updating our inventory for this department. Check back soon, or request a medication from our team."}
      </p>
      <Link to="/contact" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border-2 border-orange-200 bg-orange-50 px-8 py-4 text-lg font-semibold text-orange-700 transition hover:bg-orange-100">
        <i className="fa-solid fa-envelope"></i>
        Request this medication
      </Link>
    </div>
  );
}

function ProductCard({ product, addToCart, addToWishlist, isWishlisted }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-xl">
      <div className="relative flex h-48 items-center justify-center bg-slate-50">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <i className="fa-solid fa-pills text-5xl text-slate-300"></i>
        )}
        <button
          type="button"
          onClick={() => addToWishlist && addToWishlist(product)}
          className={`absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition ${isWishlisted ? "text-rose-500" : "text-slate-400 hover:text-rose-500"}`}
          aria-label="Add to wishlist"
        >
          <i className={`${isWishlisted ? "fa-solid" : "fa-regular"} fa-heart`}></i>
        </button>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#7176C4]">{product.brand}</p>
        <h3 className="mt-2 line-clamp-2 min-h-[3rem] text-lg font-semibold text-[#141432]">{product.name}</h3>
        <p className="mt-2 text-sm text-slate-500">{product.type}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-[#23195f]">{formatPrice(product.price)}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.inStock ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
            {product.inStock ? "In stock" : "Out of stock"}
          </span>
        </div>
        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => addToCart && addToCart(product)}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#23195f] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <i className="fa-solid fa-cart-plus"></i>
          Add to cart
        </button>
      </div>
    </article>
  );
}

function Shop({ addToCart, addToWishlist, wishlist = [], cartCount = 0 }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortId, setSortId] = useState("popular");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;
    api.getProducts()
      .then((data) => {
        if (!mounted) return;
        setProducts(normalizeList(data).map(normalizeProduct));
        setLoadError("");
      })
      .catch((error) => {
        if (!mounted) return;
        setLoadError(error.status === 403 ? "Please sign in to view the product catalogue." : error.message);
      })
      .finally(() => mounted && setIsLoading(false));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    function handleScroll() { setHasScrolled(window.scrollY > 300); }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesQuery = !query || [product.name, product.brand, product.type, product.category, product.condition].join(" ").toLowerCase().includes(query);
      const value = activeFilter?.type === "category" ? product.category || product.type : product.condition;
      const matchesFilter = !activeFilter || String(value || "").toLowerCase().includes(activeFilter.id.replace(/-/g, " ")) || String(value || "").toLowerCase().includes(activeFilter.label.toLowerCase());
      return matchesQuery && matchesFilter;
    });
    if (sortId === "price_low") filtered.sort((a, b) => a.price - b.price);
    if (sortId === "price_high") filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, searchQuery, activeFilter, sortId]);

  function handleSelectFilter(type, item) {
    const isSame = activeFilter?.id === item.id && activeFilter?.type === type;
    setActiveFilter(isSame ? null : { type, id: item.id, label: item.label });
    if (window.innerWidth < 1024) setIsMobileOpen(false);
    setTimeout(() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  return (
    <section className="bg-[#F6F7FB] min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold leading-tight text-[#141432] sm:text-4xl lg:text-[2.75rem]">
              <span style={{ color: BRAND_DARK }}>Shop Medicines</span>
              <span className="text-slate-300"> | </span>
              <span className="font-normal text-slate-600">Browse &amp; Refill Your Prescriptions</span>
            </h1>
          </div>
          <Link to="/cart" aria-label="View cart" className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-[#EEF0FF]" style={{ color: BRAND_DARK }}>
            <i className="fa-solid fa-cart-shopping text-xl"></i>
            {cartCount > 0 && <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-sm font-semibold text-white" style={{ background: BRAND_DARK }}>{cartCount}</span>}
          </Link>
        </div>

        <button onClick={() => setIsMobileOpen((prev) => !prev)} className="mb-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-4 text-lg font-semibold shadow-sm lg:hidden" style={{ color: BRAND_DARK }}>
          <i className="fa-solid fa-sliders"></i>
          {isMobileOpen ? "Hide filters" : "Show filters"}
        </button>

        <ActiveFilterChip active={activeFilter} onClear={() => setActiveFilter(null)} />

        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <aside className={["space-y-6 lg:sticky lg:top-6 lg:self-start", isMobileOpen ? "block" : "hidden lg:block"].join(" ")}>
            {isLoading ? <SkeletonSidebar /> : (
              <>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#141432]">Find a Medication</h3>
                  <div className="relative mt-4">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500"><i className="fa-solid fa-magnifying-glass text-lg"></i></span>
                    <input id="medication-search" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search medication…" className="h-14 w-full rounded-full border border-gray-200 bg-slate-50 pl-14 pr-4 text-lg outline-none transition focus:border-[#23195f] focus:bg-white" />
                    {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600" aria-label="Clear search"><i className="fa-solid fa-xmark"></i></button>}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#141432]">Sort By</h3>
                  <ul className="mt-4 space-y-1.5">
                    {SORT_OPTIONS.map((option) => <FilterButton key={option.id} label={option.label} isActive={sortId === option.id} onClick={() => setSortId(option.id)} />)}
                  </ul>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#141432]">Categories</h3>
                  <ul className="mt-4 space-y-1.5">
                    {CATEGORIES.map((category) => <FilterButton key={category.id} label={category.label} isActive={activeFilter?.id === category.id && activeFilter?.type === "category"} onClick={() => handleSelectFilter("category", category)} />)}
                  </ul>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#141432]">Condition</h3>
                  <ul className="mt-4 space-y-1.5">
                    {CONDITIONS.map((condition) => <FilterButton key={condition.id} label={condition.label} isActive={activeFilter?.id === condition.id && activeFilter?.type === "condition"} onClick={() => handleSelectFilter("condition", condition)} />)}
                  </ul>
                </div>
              </>
            )}
          </aside>

          <main id="products" className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            {isLoading ? <SkeletonMain /> : visibleProducts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} addToCart={addToCart} addToWishlist={addToWishlist} isWishlisted={wishlist.some((item) => item.id === product.id)} />
                ))}
              </div>
            ) : <EmptyProductState active={activeFilter} error={loadError} />}
          </main>
        </div>
      </div>

      <div className="fixed left-0 right-0 bottom-0 z-30 py-3 text-center text-white text-lg font-semibold shadow-xl" style={{ background: BRAND_DARK }}>
        Need help ordering? <a href="tel:08001234567" className="underline underline-offset-2 hover:opacity-80">Call us free on 0800 123 4567</a>
      </div>

      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className={["fixed bottom-20 left-6 z-40 h-14 w-14 rounded-full bg-white shadow-xl border border-gray-200 transition-all duration-300 flex items-center justify-center", hasScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"].join(" ")} style={{ color: BRAND_DARK }}>
        <i className="fa-solid fa-chevron-up"></i>
      </button>

      <Link to="/cart" className="fixed bottom-20 right-6 z-40 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-lg font-semibold text-white shadow-xl transition-all hover:opacity-90" style={{ background: BRAND_DARK }}>
        <i className="fa-solid fa-cart-shopping"></i>
        View Cart{cartCount > 0 ? ` (${cartCount})` : ""}
      </Link>
      <div className="h-24"></div>
    </section>
  );
}

export default Shop;
