import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { clearAuthData } from "../../service/api";
import { useSearch } from "../../context/SearchContext";

function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { query, setQuery, search, clearSearch } = useSearch();

  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      setIsLoggedIn(!!token || !!user || isAuthenticated === "true");
    };

    checkLogin();

    window.addEventListener("authChange", checkLogin);
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("authChange", checkLogin);
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const handleLogout = async () => {
    try {
      clearAuthData();
      setIsLoggedIn(false);
      navigate("/signin");
    } catch (error) {
      clearAuthData();
      setIsLoggedIn(false);
      navigate("/signin");
    }
  };

  const linkClass = ({ isActive }) => {
    const baseClass =
      "relative py-1 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#23195f] after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100";

    return isActive
      ? `${baseClass} text-[#23195f] font-semibold after:scale-x-100`
      : `${baseClass} text-gray-700 hover:text-[#23195f]`;
  };

  const anchorClass =
    "relative py-1 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#23195f] after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 text-gray-700 hover:text-[#23195f]";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-b-3xl border border-white/40 bg-white/70 px-3 py-3 shadow-sm backdrop-blur-md sm:px-4 lg:px-6">
        {/* Logo */}
        <div className="rounded-full bg-white/60 px-3 py-2 shadow-sm sm:px-5 sm:py-3">
          <Link to="/home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#23195f] font-semibold text-white">
              N
            </div>

            <div className="hidden sm:block">
              <h2 className="text-lg font-bold text-[#23195f]">Nuges</h2>
              <p className="text-[11px] tracking-widest text-gray-500">
                PHARMACEUTICALS
              </p>
            </div>
          </Link>
        </div>

        {/* Nav + Search Desktop */}
        <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
          <nav className="flex items-center gap-6">
            <NavLink to="/home" className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/shop" className={linkClass}>
              Shop
            </NavLink>

            <Link to="/service" className={anchorClass}>
              Services
            </Link>

            <Link to="/about" className={anchorClass}>
              About
            </Link>

            <Link to="/contact" className={anchorClass}>
              Contact
            </Link>
          </nav>

          <div className="h-6 w-px bg-gray-300"></div>

          <label className="relative block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search(query)}
              placeholder="Search medicines..."
              className="w-60 rounded-full border border-gray-200 bg-white/70 py-2 pl-10 pr-4 text-sm outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </label>
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-2 text-gray-900 transition hover:bg-white sm:px-5"
              >
                <i className="fa-regular fa-user text-lg"></i>
                <span className="hidden sm:inline">Account</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f7fb] text-gray-900 transition hover:bg-gray-200 sm:h-12 sm:w-12"
                title="Logout"
              >
                <i className="fa-solid fa-arrow-right-from-bracket text-lg"></i>
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              className="flex items-center gap-2 rounded-full bg-[#23195f] px-4 py-2.5 text-white transition hover:bg-[#1b124d] sm:px-7 sm:py-3"
            >
              <i className="fa-regular fa-user text-lg"></i>
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          <Link
            to="/wishlist"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f7fb] text-gray-900 transition hover:bg-gray-200 sm:h-12 sm:w-12"
          >
            <i className="fa-regular fa-heart text-lg"></i>

            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f7fb] text-gray-900 transition hover:bg-gray-200 sm:h-12 sm:w-12"
          >
            <i className="fa-solid fa-bag-shopping text-lg"></i>

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#23195f] px-1 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f7fb] lg:hidden sm:h-12 sm:w-12"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white/95 shadow-lg backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col items-start px-4 py-4 sm:px-6">
            <label className="relative mb-4 block w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search(query)}
                placeholder="Search medicines..."
                className="w-full rounded-full border border-gray-200 bg-white/80 py-2 pl-10 pr-4 text-sm outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </label>

            <NavLink
              to="/home"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Shop
            </NavLink>

            <Link
              to="/service"
              className={anchorClass}
              onClick={() => setOpen(false)}
            >
              Services
            </Link>

            <Link
              to="/about"
              className={anchorClass}
              onClick={() => setOpen(false)}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={anchorClass}
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>

            <div className="my-2 h-px w-full bg-gray-200"></div>

            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="w-full text-gray-700 hover:text-[#23195f]"
                  onClick={() => setOpen(false)}
                >
                  Account
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left text-gray-700 hover:text-[#23195f]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="w-full text-gray-700 hover:text-[#23195f]"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            )}

            <Link
              to="/wishlist"
              className="w-full text-gray-700 hover:text-[#23195f]"
              onClick={() => setOpen(false)}
            >
              Wishlist
            </Link>

            <Link
              to="/cart"
              className="w-full text-gray-700 hover:text-[#23195f]"
              onClick={() => setOpen(false)}
            >
              Cart
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;