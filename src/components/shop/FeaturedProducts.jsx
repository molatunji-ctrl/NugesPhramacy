import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faArrowRight, faBoxOpen, faEnvelope, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useProducts } from "./useProducts";
import { ProductCard } from "./ProductCard";
import { useSearch } from "../../context/SearchContext";

function formatPrice(n) {
  return "₦" + Number(n || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function EmptyProductState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center px-4">
      <div className="relative">
        <div className="absolute inset-0 -m-6 rounded-full bg-[#EEF0FF] opacity-40"></div>
        <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-[2rem] shadow-sm" style={{ background: `linear-gradient(135deg, #EEF0FF, #FCE7F3)` }}>
          <FontAwesomeIcon icon={faBoxOpen} size="3x" style={{ color: "#23195f" }} />
        </div>
      </div>
      <h2 className="mt-6 text-2xl font-semibold leading-tight text-[#141432]">No products found</h2>
      <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">We couldn't find any products matching your search.</p>
      <Link to="/contact" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border-2 border-orange-200 bg-orange-50 px-6 py-3 text-base font-semibold text-orange-700 transition hover:bg-orange-100">
        <FontAwesomeIcon icon={faEnvelope} size="sm" />
        Request this medication
      </Link>
    </div>
  );
}

export function FeaturedProducts({ addToCart, addToWishlist, wishlist = [] }) {
  const { products, isLoading, error } = useProducts();
  const { search } = useSearch();
  const [localQuery, setLocalQuery] = useState("");

  const displayProducts = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    const filtered = products.filter((p) =>
      !q || [p.name, p.brand, p.type, p.category, p.condition].join(" ").toLowerCase().includes(q)
    );
    return filtered.slice(0, 8);
  }, [products, localQuery]);

  const handleSearch = (e) => {
    setLocalQuery(e.target.value);
    if (e.key === "Enter") search(localQuery);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#7176C4]">Featured Products</p>
            <h2 className="mt-1 text-2xl font-semibold text-[#141432]">Popular Medicines & Wellness</h2>
          </div>
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
            </span>
            <input
              type="text"
              value={localQuery}
              onChange={handleSearch}
              onKeyDown={handleSearch}
              placeholder="Search products…"
              className="w-full h-12 rounded-full border border-gray-200 bg-white pl-12 pr-12 text-base outline-none transition focus:border-[#23195f]"
            />
            {localQuery && (
              <button
                onClick={() => setLocalQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={faXmark} size="sm" />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="skeleton h-44 w-full rounded-2xl"></div>
                <div className="skeleton mt-5 h-5 w-3/4"></div>
                <div className="skeleton mt-3 h-4 w-1/2"></div>
                <div className="skeleton mt-6 h-12 w-full rounded-full"></div>
              </div>
            ))}
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                addToWishlist={addToWishlist}
                isWishlisted={wishlist.some((item) => item.id === product.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyProductState />
        )}

        <div className="mt-8 text-center">
          <Link to="/shop" className="inline-flex items-center gap-2 text-[#23195f] font-medium hover:underline">
            View all products
            <FontAwesomeIcon icon={faArrowRight} size="sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}