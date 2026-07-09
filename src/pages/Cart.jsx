import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import verveLogo from "../assets/icons/verve.png";
import mastercardLogo from "../assets/icons/mastercard.jpg";
import visaLogo from "../assets/icons/visa.png";

function SkeletonLine() {
  return <div className="skeleton h-5 w-full"></div>;
}

function SkeletonItem() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="skeleton h-28 w-28 rounded-2xl"></div>
      <div className="flex-1 space-y-4">
        <div className="skeleton h-4 w-40"></div>
        <div className="skeleton h-6 w-3/4"></div>
        <div className="flex items-center justify-between">
          <div className="skeleton h-11 w-32 rounded-full"></div>
          <div className="skeleton h-6 w-24"></div>
        </div>
      </div>
    </div>
  );
}

function SkeletonSummary() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
      <div className="skeleton h-6 w-40"></div>
      <div className="mt-6 space-y-4">
        <SkeletonLine />
        <SkeletonLine />
        <SkeletonLine />
        <div className="border-t pt-4">
          <SkeletonLine />
        </div>
      </div>
      <div className="skeleton mt-7 h-14 w-full rounded-full"></div>
    </div>
  );
}

function Cart({
  cart,
  setCart,
  deliveryFee = 0,
  vatRate = 0.075,
  currencySymbol = "₦",
  onCheckout,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // ── format price ──────────────────────────────
  const fmt = (n) =>
    currencySymbol +
    n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ── cart actions ──────────────────────────────
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  // ── totals ────────────────────────────────────
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal  = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vat       = subtotal * vatRate;
  const total     = subtotal + deliveryFee + vat;
  const vatLabel  = `VAT (${(vatRate * 100).toFixed(1)}%)`;

  return (
    <section className="bg-[#F6F7FB] min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-10 lg:p-12">

          {/* ── Header ─────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF0FF] text-[#23195f]">
                <i className="fa-solid fa-bag-shopping text-2xl"></i>
              </span>
              {loading ? (
                <div className="skeleton h-9 w-40"></div>
              ) : (
                <h1 className="text-3xl font-semibold text-[#141432] sm:text-4xl">
                  ShopCart
                </h1>
              )}
            </div>

            <div className="flex items-center gap-5">
              {loading ? (
                <div className="skeleton h-6 w-24"></div>
              ) : (
                <button
                  onClick={clearCart}
                  className="text-base font-medium text-slate-500 hover:text-[#23195f] transition"
                >
                  Clear cart
                </button>
              )}
              <div className="relative">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF0FF] text-[#23195f]">
                  <i className="fa-solid fa-cart-shopping text-2xl"></i>
                </span>
                <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#23195f] px-1.5 text-sm font-semibold text-white">
                  {itemCount}
                </span>
              </div>
            </div>
          </div>

          {/* ── Page Title ─────────────────────────── */}
          <div className="mt-10">
            {loading ? (
              <>
                <div className="skeleton h-9 w-80"></div>
                <div className="skeleton mt-3 h-5 w-48"></div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-semibold text-[#141432] sm:text-4xl">
                  Your Shopping Cart
                </h2>
                <p className="mt-2 text-base text-slate-500">
                  {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                </p>
              </>
            )}
          </div>

          {/* ── Body ───────────────────────────────── */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">

            {/* ── Left — Cart Items ───────────────── */}
            <div className="space-y-5">
              {loading ? (
                <>
                  <SkeletonItem />
                  <SkeletonItem />
                </>
              ) : cart.length === 0 ? (
                /* empty state */
                <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                  <i className="fa-solid fa-cart-arrow-down text-5xl text-slate-300"></i>
                  <p className="mt-5 text-base text-slate-500">Your cart is empty.</p>
                  <Link
                    to="/Shop"
                    className="mt-6 inline-block rounded-full bg-[#23195f] px-7 py-3.5 text-base font-semibold text-white transition hover:opacity-90"
                  >
                    Continue shopping
                  </Link>
                </div>
              ) : (
                /* cart items */
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                  >
                    {/* thumbnail */}
                    <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      {item.badge && (
                        <span
                          className={`absolute left-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
                            item.badge === "Best Seller"
                              ? "bg-orange-500"
                              : item.badge === "New"
                              ? "bg-emerald-500"
                              : "bg-rose-500"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* details */}
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#23195f]">
                        {item.brand}{" "}
                        <span className="text-slate-400">· {item.type}</span>
                      </p>
                      <h3 className="mt-1.5 text-xl font-semibold text-[#141432]">
                        {item.name}
                      </h3>

                      <div className="mt-4 flex items-center justify-between">
                        {/* qty stepper */}
                        <div className="inline-flex items-center rounded-full border border-gray-200 bg-white">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="h-11 w-11 text-slate-500 hover:text-[#23195f] transition"
                            aria-label="Decrease quantity"
                          >
                            <i className="fa-solid fa-minus text-sm"></i>
                          </button>
                          <span className="w-10 text-center text-base font-semibold">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="h-11 w-11 text-slate-500 hover:text-[#23195f] transition"
                            aria-label="Increase quantity"
                          >
                            <i className="fa-solid fa-plus text-sm"></i>
                          </button>
                        </div>

                        {/* line total */}
                        <span className="text-xl font-semibold text-[#141432]">
                          {fmt(item.price * item.qty)}
                        </span>
                      </div>
                    </div>

                    {/* remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="self-start text-slate-400 transition hover:text-rose-500 sm:self-center"
                      aria-label="Remove item"
                    >
                      <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                  </div>
                ))
              )}

              {/* ── Promo Code ───────────────────────── */}
              {!loading && (
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="inline-flex items-center gap-2 text-base font-semibold text-[#23195f]">
                    <i className="fa-solid fa-tag"></i> Promo Code
                  </p>
                  <div className="mt-4 flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter code (e.g. SAVE10)"
                      className="h-12 flex-1 rounded-xl border border-gray-200 bg-slate-50 px-5 text-base outline-none focus:border-[#23195f] transition"
                    />
                    <button className="rounded-xl bg-[#23195f] px-6 text-base font-semibold text-white transition hover:opacity-90">
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right — Order Summary ───────────── */}
            <div className="space-y-6">
              {loading ? (
                <SkeletonSummary />
              ) : (
                <>
                  {/* summary card */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
                    <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-[#141432]">
                      <i className="fa-regular fa-file-lines text-[#23195f]"></i>
                      Order Summary
                    </h3>

                    <div className="mt-6 space-y-4 text-base">
                      {/* subtotal */}
                      <div className="flex items-center justify-between text-slate-600">
                        <span>
                          Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                        </span>
                        <span className="font-semibold text-[#141432]">
                          {fmt(subtotal)}
                        </span>
                      </div>

                      {/* delivery fee */}
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <i className="fa-solid fa-truck text-sm"></i>
                          Delivery Fee
                        </span>
                        <span
                          className={`font-semibold ${
                            deliveryFee === 0 ? "text-emerald-600" : "text-[#141432]"
                          }`}
                        >
                          {deliveryFee === 0 ? "FREE" : fmt(deliveryFee)}
                        </span>
                      </div>

                      {/* VAT */}
                      <div className="flex items-center justify-between text-slate-600">
                        <span>{vatLabel}</span>
                        <span className="font-semibold text-[#141432]">{fmt(vat)}</span>
                      </div>

                      {/* total */}
                      <div className="flex items-center justify-between border-t border-dashed pt-4">
                        <span className="text-lg font-semibold text-[#141432]">Total</span>
                        <span className="text-2xl font-semibold text-[#23195f]">
                          {fmt(total)}
                        </span>
                      </div>
                    </div>

                    {/* free delivery badge */}
                    {deliveryFee === 0 && subtotal > 0 && (
                      <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                        <i className="fa-solid fa-truck-fast"></i>
                        You've unlocked FREE delivery!
                      </p>
                    )}

                    {/* checkout button */}
                    <button
                      onClick={onCheckout}
                      disabled={cart.length === 0}
                      className="mt-6 w-full rounded-full bg-gradient-to-r from-[#23195f] to-[#5B3DF5] py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Proceed to Checkout →
                    </button>

                    <p className="mt-4 text-center text-sm text-slate-500">
                      <i className="fa-solid fa-lock text-xs mr-1"></i>
                      Secure checkout · SSL encrypted
                    </p>
                  </div>

                  {/* accepted payments */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
                    <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Accepted Payments
                    </p>
                    <div className="flex items-center justify-center gap-10">
                      <img
                        src={verveLogo}
                        alt="Verve"
                        className="h-14 w-auto object-contain"
                      />
                      <img
                        src={mastercardLogo}
                        alt="Mastercard"
                        className="h-16 w-auto object-contain"
                      />
                      <img
                        src={visaLogo}
                        alt="Visa"
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                    <p className="mt-6 text-center text-xs text-slate-400">
                      <i className="fa-solid fa-shield-halved mr-1"></i>
                      All transactions are secured with 256-bit SSL encryption
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;