import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { clearAuthData } from "../../service/api";

function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    <div className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between gap-4 px-4 md:px-8">
      {/* Logo */}
      <div className="rounded-full bg-white/60 backdrop-blur-md border border-white/40 px-5 py-3 shadow-sm">
        <Link to="/home" className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#23195f] text-white font-semibold">
            N
          </div>

          <div className="hidden sm:block">
            <h2 className="text-lg font-bold text-[#23195f]">Nugues</h2>
            <p className="text-[11px] tracking-widest text-gray-500">
              PHARMACEUTICALS
            </p>
          </div>
        </Link>
      </div>

      {/* Nav + Search Desktop */}
      <div className="hidden lg:flex items-center gap-8 rounded-full bg-white/60 backdrop-blur-md border border-white/40 px-6 py-2 shadow-sm">
        <nav className="flex items-center gap-6">
          <NavLink to="/home" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/Shop" className={linkClass}>
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
            placeholder="Search medicines..."
            className="w-60 rounded-full bg-white/70 border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none"
          />
        </label>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 rounded-full bg-white/60 backdrop-blur-md border border-white/40 px-3 py-2 shadow-sm">
        {isLoggedIn ? (
          <>
            <Link
              to="/account"
              className="flex items-center gap-2 rounded-full bg-white/70 border border-gray-200 px-5 py-2 text-gray-900 font-medium hover:bg-white transition"
            >
              <i className="fa-regular fa-user text-lg"></i>
              <span className="hidden sm:inline">Account</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="h-12 w-12 rounded-full bg-[#f4f7fb] flex items-center justify-center text-gray-900 hover:bg-gray-200 transition"
              title="Logout"
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-lg"></i>
            </button>
          </>
        ) : (
          <Link
            to="/signin"
            className="flex items-center gap-2 rounded-full bg-[#23195f] px-7 py-3 text-white font-medium hover:bg-[#1b124d] transition"
          >
            <i className="fa-regular fa-user text-lg"></i>
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        )}

        <Link
          to="/wishlist"
          className="relative h-12 w-12 rounded-full bg-[#f4f7fb] flex items-center justify-center text-gray-900 hover:bg-gray-200 transition"
        >
          <i className="fa-regular fa-heart text-lg"></i>

          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </Link>

        <Link
          to="/cart"
          className="relative h-12 w-12 rounded-full bg-[#f4f7fb] flex items-center justify-center text-gray-900 hover:bg-gray-200 transition"
        >
          <i className="fa-solid fa-bag-shopping text-lg"></i>

          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-[#23195f] text-white text-xs flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="lg:hidden h-12 w-12 rounded-full bg-[#f4f7fb] flex items-center justify-center"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden absolute left-0 right-0 top-full border-t bg-white/95 backdrop-blur-md shadow-lg">
          <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col space-y-4 items-start">
            <NavLink
              to="/home"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/Shop"
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

            <div className="w-full h-px bg-gray-200 my-2"></div>

            {isLoggedIn ? (
              <>
                <Link
                  to="/account"
                  className="text-gray-700 hover:text-[#23195f] w-full"
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
                  className="text-gray-700 hover:text-[#23195f] w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="text-gray-700 hover:text-[#23195f] w-full"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            )}

            <Link
              to="/wishlist"
              className="text-gray-700 hover:text-[#23195f] w-full"
              onClick={() => setOpen(false)}
            >
              Wishlist
            </Link>

            <Link
              to="/cart"
              className="text-gray-700 hover:text-[#23195f] w-full"
              onClick={() => setOpen(false)}
            >
              Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;