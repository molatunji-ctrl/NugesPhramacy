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

function loadLocalArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function AppLayout() {
  const location = useLocation();
  const ACCOUNT_PAGE_PATHS = ["/signin", "/login", "/profile", "/orders"];
  const hideNavbar = ACCOUNT_PAGE_PATHS.includes(location.pathname.toLowerCase());
  const hideFooter = hideNavbar;

  const [cart, setCart] = useState(() => loadLocalArray("cart"));
  const [wishlist, setWishlist] = useState(() => loadLocalArray("wishlist"));
  const hydrated = useRef(false);

  useEffect(() => {
    let mounted = true;
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
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
    if (hydrated.current && localStorage.getItem("isAuthenticated") === "true") {
      api.saveCart(cart).catch(() => {});
    }
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    if (hydrated.current && localStorage.getItem("isAuthenticated") === "true") {
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

  const cartCount = cart.reduce((s, i) => s + Number(i.qty || 0), 0);

  return (
    <>
      {!hideNavbar && <Navbar cartCount={cartCount} wishlistCount={wishlist.length} />}
      <div className={hideNavbar ? "" : "pt-24"}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/shop" element={<Shop addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} cartCount={cartCount} />} />
          <Route path="/Shop" element={<Shop addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} cartCount={cartCount} />} />
          <Route path="/about" element={<Home addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />} />
          <Route path="/service" element={<Home addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />} />
          <Route path="/contact" element={<Home addToCart={addToCart} addToWishlist={addToWishlist} wishlist={wishlist} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/wishlist" element={<Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} moveToCart={moveToCart} addToCart={addToCart} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} deliveryFee={1500} vatRate={0.075} currencySymbol="₦" />} />
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
