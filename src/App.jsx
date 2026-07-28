import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SignIn from "./pages/SignIn";
import LogIn from "./pages/LogIn";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/footer";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import { api, normalizeList } from "./service/api";

// ── Helpers ────────────────────────────────────────
function loadLocalArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function loadLocalObject(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Route Protection ───────────────────────────────
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true" || !!token;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ── Main Layout ────────────────────────────────────
function AppLayout() {
  const location = useLocation();
  
  const ACCOUNT_PAGE_PATHS = ["/signin", "/login", "/profile", "/orders", "/checkout"];
  const hideNavbar = ACCOUNT_PAGE_PATHS.includes(location.pathname.toLowerCase());
  const hideFooter = hideNavbar;

  const [cart, setCart] = useState(() => loadLocalArray("cart"));
  const [wishlist, setWishlist] = useState(() => loadLocalArray("wishlist"));
  const [promoDiscount, setPromoDiscount] = useState(() => loadLocalObject("promoDiscount"));
  const hydrated = useRef(false);

  // 👉 CAPTURE GOOGLE OAUTH TOKEN FROM URL QUERY PARAMS ON LOAD
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");
      // Clean up the URL query parameters so it looks neat
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true" || !!localStorage.getItem("token");
    if (!isAuthenticated) {
      hydrated.current = true;
      return;
    }

    Promise.allSettled([api.getCart(), api.getWishlist()]).then(([cartResult, wishlistResult]) => {
      if (!mounted) return;
      if (cartResult.status === "fulfilled") setCart(normalizeList(cartResult.value));
      if (wishlistResult.status === "fulfilled") setWishlist(normalizeList(wishlistResult.value));
      hydrated.current = true;
    });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (hydrated.current && (localStorage.getItem("isAuthenticated") === "true" || localStorage.getItem("token"))) {
      api.saveCart(cart).catch(() => {});
    }
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    if (hydrated.current && (localStorage.getItem("isAuthenticated") === "true" || localStorage.getItem("token"))) {
      api.saveWishlist(wishlist).catch(() => {});
    }
  }, [wishlist]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, qty: Number(item.qty || 0) + 1 } : item);
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand || product.category?.toUpperCase() || "NUGES",
          type: product.type || product.category || "PHARMACY",
          price: Number(product.price || 0),
          qty: 1,
          image: product.image,
        },
      ];
    });
  };

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((i) => i.id === product.id)) return prev;
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand || product.category?.toUpperCase() || "NUGES",
          type: product.type || product.category || "PHARMACY",
          price: Number(product.price || 0),
          image: product.image,
          inStock: product.inStock ?? true,
        },
      ];
    });
  };

  const removeFromWishlist = (id) => setWishlist((prev) => prev.filter((i) => i.id !== id));

  const moveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  const applyPromo = (discount) => {
    setPromoDiscount(discount);
    localStorage.setItem("promoDiscount", JSON.stringify(discount));
  };

  const removePromo = () => {
    setPromoDiscount(null);
    localStorage.removeItem("promoDiscount");
  };

  const cartCount = cart.reduce((s, i) => s + Number(i.qty || 0), 0);

  return (
    <>
      {!hideNavbar && <Navbar cartCount={cartCount} wishlistCount={wishlist.length} />}
      <div className={hideNavbar ? "" : "pt-24"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} cartCount={cartCount} />} />
          <Route path="/about" element={<Home addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />} />
          <Route path="/service" element={<Home addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />} />
          <Route path="/contact" element={<Home addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />} />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                setCart={setCart}
                promoDiscount={promoDiscount}
                onApplyPromo={applyPromo}
                onRemovePromo={removePromo}
              />
            }
          />
          <Route path="/wishlist" element={<Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} moveToCart={moveToCart} addToCart={addToCart} />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout
                  cart={cart}
                  setCart={setCart}
                  deliveryFee={1500}
                  vatRate={0.075}
                  currencySymbol="₦"
                  promoDiscount={promoDiscount}
                  onRemovePromo={removePromo}
                />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;