import { Link } from "react-router-dom";

function formatPrice(n) {
  return "$" + n.toFixed(2);
}

function Wishlist({ wishlist = [], removeFromWishlist, moveToCart, addToCart }) {
  return (
    <section className="bg-[#F6F7FB] min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <i className="fa-solid fa-heart"></i>
              </span>
              <h1 className="text-2xl font-semibold text-[#141432] sm:text-3xl">My Wishlist</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/Shop"
                className="text-sm font-medium text-slate-500 hover:text-[#23195f]"
              >
                <i className="fa-solid fa-arrow-left"></i> Continue shopping
              </Link>
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <i className="fa-regular fa-heart"></i>
                </span>
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                  {wishlist.length}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-[#141432]">Saved for later</h2>
            <p className="mt-1 text-sm text-slate-500">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in your wishlist
            </p>
          </div>

          {wishlist.length === 0 && (
            <div className="mt-12 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <i className="fa-regular fa-heart text-5xl text-rose-200"></i>
              <p className="mt-4 text-slate-500">Your wishlist is empty.</p>
              <p className="mt-1 text-sm text-slate-400">Tap the heart icon on any product to save it for later.</p>
              <Link
                to="/Shop"
                className="mt-6 inline-block rounded-full bg-[#23195f] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Discover products
              </Link>
            </div>
          )}

          {wishlist.length > 0 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-xl"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    {!item.inStock && (
                      <span className="absolute left-3 top-3 rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-white">
                        Out of stock
                      </span>
                    )}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow transition hover:bg-rose-500 hover:text-white"
                      aria-label="Remove from wishlist"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>

                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#23195f]">
                      {item.brand} <span className="text-slate-400">· {item.type}</span>
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-[#141432]">{item.name}</h3>
                    <p className="mt-2 text-xl font-semibold text-[#23195f]">{formatPrice(item.price)}</p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => (moveToCart ? moveToCart(item) : addToCart && addToCart(item))}
                        disabled={!item.inStock}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#23195f] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#141444] disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        <i className="fa-solid fa-cart-plus"></i>
                        {item.inStock ? "Move to cart" : "Notify me"}
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-slate-400 transition hover:border-rose-500 hover:text-rose-500"
                        aria-label="Remove"
                      >
                        <i className="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {wishlist.length > 0 && (
            <div className="mt-10 flex flex-col items-center gap-2 rounded-3xl bg-gradient-to-r from-[#EEF0FF] to-[#FCE7F3] p-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <h3 className="text-lg font-semibold text-[#141432]">Ready to check out?</h3>
                <p className="mt-1 text-sm text-slate-600">Move your saved items to the cart and complete your order.</p>
              </div>
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-full bg-[#23195f] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Go to cart <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Wishlist;
