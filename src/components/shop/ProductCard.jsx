import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCartPlus, faPills } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

function formatPrice(n) {
  return "₦" + Number(n || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ProductCard({ product, addToCart, addToWishlist, isWishlisted }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-xl">
      <div className="relative flex h-48 items-center justify-center bg-slate-50">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <FontAwesomeIcon icon={faPills} size="2x" className="text-slate-300" />
        )}
        <button
          type="button"
          onClick={() => addToWishlist && addToWishlist(product)}
          className={`absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition ${isWishlisted ? "text-rose-500" : "text-slate-400 hover:text-rose-500"}`}
          aria-label="Add to wishlist"
        >
          <FontAwesomeIcon icon={isWishlisted ? faHeart : faHeartRegular} />
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
          <FontAwesomeIcon icon={faCartPlus} size="sm" />
          Add to cart
        </button>
      </div>
    </article>
  );
}