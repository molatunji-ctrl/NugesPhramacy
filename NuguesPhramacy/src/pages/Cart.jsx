import { Link } from "react-router-dom";

function formatPrice(n) {
  return "$" + n.toFixed(2);
}

function Cart({ cart, setCart }) {
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <section className="bg-[#F6F7FB] min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#23195f]">
                <i className="fa-solid fa-bag-shopping"></i>
              </span>
              <h1 className="text-2xl font-semibold text-[#141432] sm:text-3xl">ShopCart</h1>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={clearCart} className="text-sm font-medium text-slate-500 hover:text-[#23195f]">
                Clear cart
              </button>
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#23195f]">
                  <i className="fa-solid fa-cart-shopping"></i>
                </span>
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#23195f] px-1 text-[11px] font-semibold text-white">
                  {itemCount}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[#141432]">Your Shopping Cart</h2>
            <p className="mt-1 text-sm text-slate-500">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-4">
              {cart.length === 0 && (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
                  <i className="fa-solid fa-cart-arrow-down text-4xl text-slate-300"></i>
                  <p className="mt-4 text-slate-500">Your cart is empty.</p>
                  <Link
                    to="/Shop"
                    className="mt-4 inline-block rounded-full bg-[#23195f] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Continue shopping
                  </Link>
                </div>
              )}

              {cart.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    {item.badge && (
                      <span
                        className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${
                          item.badge === "Best Seller" ? "bg-orange-500" :
                          item.badge === "New" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#23195f]">
                      {item.brand} <span className="text-slate-400">· {item.type}</span>
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-[#141432]">{item.name}</h3>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-gray-200 bg-white">
                        <button onClick={() => updateQty(item.id, -1)} className="h-9 w-9 text-slate-500 hover:text-[#23195f]">
                          <i className="fa-solid fa-minus text-xs"></i>
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="h-9 w-9 text-slate-500 hover:text-[#23195f]">
                          <i className="fa-solid fa-plus text-xs"></i>
                        </button>
                      </div>
                      <span className="text-lg font-semibold text-[#141432]">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="text-slate-400 transition hover:text-rose-500" aria-label="Remove item">
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>
              ))}

              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#23195f]">
                  <i className="fa-solid fa-tag"></i> Promo Code
                </p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. SAVE10)"
                    className="h-11 flex-1 rounded-xl border border-gray-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#23195f]"
                  />
                  <button className="rounded-xl bg-[#23195f] px-5 text-sm font-semibold text-white">Apply</button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="inline-flex items-center gap-2 text-lg font-semibold text-[#141432]">
                  <i className="fa-regular fa-file-lines text-[#23195f]"></i> Order Summary
                </h3>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-[#141432]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="inline-flex items-center gap-2"><i className="fa-solid fa-truck text-xs"></i>Shipping</span>
                    <span className="font-semibold text-emerald-600">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Tax (8%)</span>
                    <span className="font-semibold text-[#141432]">{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t border-dashed pt-3 flex items-center justify-between">
                    <span className="text-base font-semibold text-[#141432]">Total</span>
                    <span className="text-xl font-semibold text-[#23195f]">{formatPrice(total)}</span>
                  </div>
                </div>

                {subtotal > 0 && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <i className="fa-solid fa-truck-fast"></i> You've unlocked FREE shipping!
                  </p>
                )}

                <button className="mt-5 w-full rounded-full bg-gradient-to-r from-[#23195f] to-[#5B3DF5] py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-95">
                  Proceed to Checkout →
                </button>

                <p className="mt-3 text-center text-xs text-slate-500">
                  <i className="fa-solid fa-lock text-[10px]"></i> Secure checkout · SSL encrypted
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400">Accepted Payments</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {["Visa", "MC", "Amex", "PayPal", "Apple"].map((p) => (
                    <span key={p} className="rounded-lg border border-gray-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
