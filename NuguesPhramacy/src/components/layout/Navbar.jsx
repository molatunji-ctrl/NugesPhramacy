import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive ? "text-[#23195f] font-semibold" : "text-gray-700 hover:text-[#23195f]";

  return (
    <>
      <div className="w-full bg-[#1B1967] text-white text-sm">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          <span>
            <h3 className="text-xs font-semibold">
              Free delivery within Egbeda on orders over ₦15,000
            </h3>
          </span>
          <div className="flex items-center gap-4 text-xs opacity-90">
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-phone"></i>+234 803 359 7959
            </span>
            <span className="hidden sm:inline">
              <i className="fa-brands fa-instagram"></i>@nugespharmacy
            </span>
          </div>
        </div>
      </div>

      <header className="w-full bg-[#F9FCFF] border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/home" className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#23195f] text-white font-semibold">N</div>
                <div className="hidden sm:block">
                  <div className="text-lg font-semibold text-[#23195f]">Nuges</div>
                  <div className="text-xs text-gray-400">PHARMACEUTICALS</div>
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <NavLink to="/home" className={linkClass}>Home</NavLink>
              <NavLink to="/Shop" className={linkClass}>Shop</NavLink>
              <NavLink to="/Service" className={linkClass}>Services</NavLink>
              <NavLink to="/About" className={linkClass}>About</NavLink>
              <NavLink to="/Contact" className={linkClass}>Contact</NavLink>
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden md:block">
                <label className="relative block">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <i className="fa-brands fa-sistrix"></i>
                  </span>
                  <input
                    className="w-64 rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:outline-none"
                    placeholder="Search medicines..."
                    aria-label="Search"
                  />
                </label>
              </div>

              <Link to="/signin" className="inline-flex items-center gap-2 rounded-full bg-[#23195f] px-4 py-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z" />
                </svg>
                <span className="hidden sm:inline">Sign in</span>
              </Link>

              <Link to="/wishlist" aria-label="wishlist" className="relative h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#23195f]">
                <i className="fa-regular fa-heart"></i>
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" aria-label="cart" className="relative h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#23195f]">
                <i className="fa-solid fa-cart-shopping"></i>
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#23195f] px-1 text-[11px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setOpen((s) => !s)} className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100" aria-label="Open menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t">
            <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col space-y-2">
              <NavLink to="/home" className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
              <NavLink to="/Shop" className={linkClass} onClick={() => setOpen(false)}>Shop</NavLink>
              <NavLink to="/Service" className={linkClass} onClick={() => setOpen(false)}>Services</NavLink>
              <NavLink to="/About" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
              <NavLink to="/Contact" className={linkClass} onClick={() => setOpen(false)}>Contact</NavLink>
              <Link to="/wishlist" className="text-gray-700 hover:text-[#23195f]" onClick={() => setOpen(false)}>Wishlist</Link>
              <Link to="/cart" className="text-gray-700 hover:text-[#23195f]" onClick={() => setOpen(false)}>Cart</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
