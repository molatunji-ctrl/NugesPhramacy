import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
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

function AppLayout() {
  const location = useLocation();
  const ACCOUNT_PAGE_PATHS = ["/signin", "/login", "/profile", "/orders"];
  const hideNavbar = ACCOUNT_PAGE_PATHS.includes(location.pathname);
  const hideFooter = hideNavbar;

  // Empty starter state — no seed data
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand || (product.category?.toUpperCase() || "NUGES"),
          type: product.type || "PHARMACY",
          price: product.price,
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
          brand: product.brand || (product.category?.toUpperCase() || "NUGES"),
          type: product.type || "PHARMACY",
          price: product.price,
          image: product.image,
          inStock: true,
        },
      ];
    });
  };

  const removeFromWishlist = (id) =>
    setWishlist((prev) => prev.filter((i) => i.id !== id));

  const moveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      {!hideNavbar && (
        <Navbar cartCount={cartCount} wishlistCount={wishlist.length} />
      )}
      <div className={hideNavbar ? "" : "pt-24"}>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route
          path="/home"
          element={
            <Home
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              wishlist={wishlist}
            />
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/about"
          element={
            <Home
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              wishlist={wishlist}
            />
          }
        />
        <Route path="/service"
          element={
            <Home
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              wishlist={wishlist}
            />
          }
        />
        <Route path="/contact"
          element={
            <Home
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              wishlist={wishlist}
            />
          }
        />
        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />
        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              removeFromWishlist={removeFromWishlist}
              moveToCart={moveToCart}
              addToCart={addToCart}
            />
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/home" element={<Home />} />

<Route
  path="/checkout"
  element={
    <Checkout
      cart={cart}
      setCart={setCart}
      deliveryFee={1500}
      vatRate={0.075}
      currencySymbol="₦"
    />
  }
/>
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
