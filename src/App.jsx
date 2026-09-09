import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
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
import PaymentCallback from "./pages/PaymentCallback";
import { api, normalizeCart, normalizeWishlist } from "./service/api";
import { SearchProvider } from "./context/SearchProvider";
import { AuthProvider, useAuth } from "./context/AuthContext";

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
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[#23195f]">
        Checking your session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ── Main Layout ────────────────────────────────────
function AppLayout() {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  
  const ACCOUNT_PAGE_PATHS = ["/signin", "/login", "/profile", "/orders", "/checkout", "/payment/callback"];
  const hideNavbar = ACCOUNT_PAGE_PATHS.includes(location.pathname.toLowerCase());
  const hideFooter = hideNavbar;

  const [cart, setCart] = useState(() => loadLocalArray("guestCart"));
  const [wishlist, setWishlist] = useState(() => loadLocalArray("guestWishlist"));
  const [promoDiscount, setPromoDiscount] = useState(() => loadLocalObject("promoDiscount"));
  const [shoppingError, setShoppingError] = useState("");
  const [shoppingLoading, setShoppingLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (authLoading) {
      return undefined;
    }

    if (!user) {
      queueMicrotask(() => {
        if (!mounted) return;
        setCart(loadLocalArray("guestCart"));
        setWishlist(loadLocalArray("guestWishlist"));
        setShoppingLoading(false);
      });
      return () => { mounted = false; };
    }

    queueMicrotask(() => mounted && setShoppingLoading(true));
    const hydrateShopping = async () => {
      try {
        let [cartResponse, wishlistResponse] = await Promise.all([
          api.getCart(),
          api.getWishlist(),
        ]);

        const guestCart = loadLocalArray("guestCart");
        for (const item of guestCart) {
          cartResponse = await api.addCartItem(item.id, Number(item.qty || 1));
        }

        const guestWishlist = loadLocalArray("guestWishlist");
        for (const item of guestWishlist) {
          wishlistResponse = await api.addWishlistItem(item.id);
        }

        if (!mounted) return;
        setCart(normalizeCart(cartResponse));
        setWishlist(normalizeWishlist(wishlistResponse));
        localStorage.removeItem("guestCart");
        localStorage.removeItem("guestWishlist");
        setShoppingError("");
      } catch (error) {
        if (mounted) {
          setShoppingError(error.message || "Unable to load your saved shopping items.");
        }
      } finally {
        if (mounted) setShoppingLoading(false);
      }
    };

    hydrateShopping();

    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && !user) {
      localStorage.setItem("guestCart", JSON.stringify(cart));
    }
  }, [cart, user, authLoading]);

  useEffect(() => {
    if (!authLoading && !user) {
      localStorage.setItem("guestWishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, user, authLoading]);

  const addToCart = async (product) => {
    try {
      if (user) {
        const response = await api.addCartItem(product.id, 1);
        setCart(normalizeCart(response));
        setShoppingError("");
        return true;
      }

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
      return true;
    } catch (error) {
      setShoppingError(error.message || "Unable to update your cart.");
      return false;
    }
  };

  const updateCartQuantity = async (item, quantity) => {
    try {
      if (user) {
        const response = quantity < 1
          ? await api.removeCartItem(item.cartItemId)
          : await api.updateCartItem(item.cartItemId, quantity);
        setCart(normalizeCart(response));
      } else {
        setCart((prev) => prev
          .map((entry) => entry.id === item.id ? { ...entry, qty: quantity } : entry)
          .filter((entry) => entry.qty > 0));
      }
      setShoppingError("");
    } catch (error) {
      setShoppingError(error.message || "Unable to update your cart.");
    }
  };

  const removeFromCart = async (item) => {
    try {
      if (user) {
        const response = await api.removeCartItem(item.cartItemId);
        setCart(normalizeCart(response));
      } else {
        setCart((prev) => prev.filter((entry) => entry.id !== item.id));
      }
      setShoppingError("");
    } catch (error) {
      setShoppingError(error.message || "Unable to remove this item.");
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await api.clearCart();
      }
      setCart([]);
      setShoppingError("");
    } catch (error) {
      setShoppingError(error.message || "Unable to clear your cart.");
    }
  };

  const addToWishlist = async (product) => {
    try {
      if (user) {
        const response = await api.addWishlistItem(product.id);
        setWishlist(normalizeWishlist(response));
        setShoppingError("");
        return;
      }

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
    } catch (error) {
      setShoppingError(error.message || "Unable to update your wishlist.");
    }
  };

  const removeFromWishlist = async (id) => {
    const item = wishlist.find((entry) => entry.id === id);
    try {
      if (user && item?.wishlistItemId) {
        const response = await api.removeWishlistItem(item.wishlistItemId);
        setWishlist(normalizeWishlist(response));
      } else {
        setWishlist((prev) => prev.filter((entry) => entry.id !== id));
      }
      setShoppingError("");
    } catch (error) {
      setShoppingError(error.message || "Unable to remove this item.");
    }
  };

  const moveToCart = async (item) => {
    const added = await addToCart(item);
    if (added) await removeFromWishlist(item.id);
  };

  const applyPromo = (discount) => {
    setPromoDiscount(discount);
    localStorage.setItem("promoDiscount", JSON.stringify(discount));
  };

  const removePromo = useCallback(() => {
    setPromoDiscount(null);
    localStorage.removeItem("promoDiscount");
  }, []);

  const cartCount = cart.reduce((s, i) => s + Number(i.qty || 0), 0);

  return (
    <>
      {!hideNavbar && <Navbar cartCount={cartCount} wishlistCount={wishlist.length} />}
      <div className={hideNavbar ? "" : "pt-24"}>
        {shoppingError && (
          <div role="alert" className="fixed right-4 top-4 z-[70] max-w-sm rounded-2xl bg-rose-600 px-5 py-4 text-sm font-semibold text-white shadow-xl">
            {shoppingError}
          </div>
        )}
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
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
                deliveryFee={1500}
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
                  loading={shoppingLoading}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/callback"
            element={
              <ProtectedRoute>
                <PaymentCallback setCart={setCart} onRemovePromo={removePromo} />
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
      <AuthProvider>
        <SearchProvider>
          <AppLayout />
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
