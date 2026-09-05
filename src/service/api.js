import axios from "axios";

export const API_BASE = (
  import.meta.env.VITE_API_URL || "https://np-backend-qnrv.onrender.com"
).replace(/\/$/, "");

const API_URL = `${API_BASE}/api`;
const UNSAFE_METHODS = new Set(["post", "put", "patch", "delete"]);

const csrfClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let csrfToken = null;
let csrfTokenPromise = null;

function resetCsrfToken() {
  csrfToken = null;
  csrfTokenPromise = null;
}

async function getCsrfToken() {
  if (csrfToken) return csrfToken;

  if (!csrfTokenPromise) {
    csrfTokenPromise = csrfClient
      .get("/csrf")
      .then(({ data }) => {
        const token = data?.token;

        if (!token) {
          throw new Error("The server did not return a CSRF token.");
        }

        csrfToken = token;
        return token;
      })
      .finally(() => {
        csrfTokenPromise = null;
      });
  }

  return csrfTokenPromise;
}

axiosClient.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();

  if (UNSAFE_METHODS.has(method)) {
    config.headers = config.headers || {};
    config.headers["X-XSRF-TOKEN"] = await getCsrfToken();
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    if (error.response?.status === 403) {
      resetCsrfToken();
    }

    return Promise.reject(error);
  }
);

function getApiError(error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.response?.data?.detail ||
    error.message ||
    "Request failed";

  const normalizedError = new Error(message);
  normalizedError.status = error.response?.status;
  normalizedError.data = error.response?.data;

  throw normalizedError;
}

export async function apiRequest(path, options = {}) {
  try {
    const response = await axiosClient({
      url: path,
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : options.data,
      params: options.params,
      headers: options.headers,
    });

    return response.data;
  } catch (error) {
    getApiError(error);
  }
}

export async function tryApi(paths, options = {}) {
  let lastError;

  for (const path of paths) {
    try {
      return await apiRequest(path, options);
    } catch (error) {
      lastError = error;

      if (![403, 404, 405].includes(error.status)) {
        throw error;
      }
    }
  }

  throw lastError;
}

export const api = {
  login: async (payload) => {
    try {
      return await apiRequest("/auth/login", {
        method: "POST",
        data: payload,
      });
    } finally {
      // Spring Security rotates the CSRF token after authentication.
      resetCsrfToken();
    }
  },

  register: async (payload) => {
    try {
      return await apiRequest("/auth/register", {
        method: "POST",
        data: payload,
      });
    } finally {
      resetCsrfToken();
    }
  },

  getCurrentUser: () => apiRequest("/auth/me"),

  logout: async () => {
    try {
      return await tryApi(["/auth/logout", "/logout"], {
        method: "POST",
      });
    } finally {
      resetCsrfToken();
    }
  },

  getProducts: (params = {}) => apiRequest("/products", {
    params: { size: 50, ...params },
  }),

  getCart: () => apiRequest("/cart"),

  addCartItem: (productId, quantity = 1) =>
    apiRequest("/cart/items", {
      method: "POST",
      data: { productId, quantity },
    }),

  updateCartItem: (itemId, quantity) =>
    apiRequest(`/cart/items/${itemId}`, {
      method: "PUT",
      data: { quantity },
    }),

  removeCartItem: (itemId) =>
    apiRequest(`/cart/items/${itemId}`, { method: "DELETE" }),

  clearCart: () => apiRequest("/cart", { method: "DELETE" }),

  getWishlist: () => apiRequest("/wishlist"),

  addWishlistItem: (productId) =>
    apiRequest("/wishlist/items", {
      method: "POST",
      data: { productId },
    }),

  removeWishlistItem: (itemId) =>
    apiRequest(`/wishlist/items/${itemId}`, { method: "DELETE" }),

  getProfile: () =>
    tryApi(["/profile", "/user/profile", "/users/me", "/auth/me"]),

  updateProfile: (profile) =>
    tryApi(["/profile", "/user/profile", "/users/me"], {
      method: "PUT",
      data: profile,
    }),

  getOrders: () =>
    tryApi(["/orders", "/order", "/user/orders", "/orders/me"]),

  createOrder: (order) =>
    apiRequest("/orders", {
      method: "POST",
      data: order,
    }),

  getCheckoutQuote: (promoCode) =>
    apiRequest("/orders/quote", {
      method: "POST",
      data: { promoCode: promoCode || null },
    }),

  initializeFlutterwavePayment: (orderId) =>
    apiRequest(`/payments/flutterwave/initialize/${orderId}`, {
      method: "POST",
    }),

  verifyFlutterwavePayment: (transactionId, txRef) =>
    apiRequest("/payments/flutterwave/verify", {
      method: "POST",
      data: { transactionId: String(transactionId), txRef },
    }),

  applyPromoCode: (code, orderAmount) =>
    tryApi(["/promo/validate", "/promotions/validate", "/coupons/apply"], {
      method: "POST",
      data: { code, orderAmount },
    }),

  sendContactMessage: (payload) =>
    tryApi(["/contact", "/contact-us", "/messages", "/inquiries"], {
      method: "POST",
      data: payload,
    }),
};

export function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.content)) return data.content;

  return [];
}

export function normalizeProduct(product) {
  return {
    id:
      product.id ||
      product._id ||
      product.productId ||
      product.slug ||
      product.name,

    name: product.name || product.title || product.productName || "Medication",

    brand: product.brand || product.manufacturer || product.category || "NUGES",

    type: product.type || product.category || product.categoryName || "PHARMACY",

    category: product.category || product.categoryName || "",

    condition: product.condition || product.conditionName || "",

    price: Number(product.price || product.amount || product.sellingPrice || 0),

    image:
      product.image ||
      product.imageUrl ||
      product.photo ||
      product.thumbnail ||
      "",

    description: product.description || product.details || "",

    prescriptionRequired: Boolean(product.prescriptionRequired),

    inStock:
      product.inStock ??
      product.available ??
      (typeof product.stock === "number" ? product.stock > 0 : true),
  };
}

export function normalizeCart(data) {
  return normalizeList(data).map((item) => ({
    id: item.productId ?? item.product?.id ?? item.id,
    cartItemId: item.id,
    name: item.productName ?? item.name ?? item.product?.name ?? "Medication",
    image: item.productImage ?? item.image ?? item.product?.image ?? "",
    price: Number(item.productPrice ?? item.price ?? item.product?.price ?? 0),
    qty: Number(item.quantity ?? item.qty ?? 1),
    inStock: item.inStock ?? true,
    brand: item.brand ?? item.product?.brand ?? "NUGES",
    type: item.type ?? item.product?.category ?? "PHARMACY",
  }));
}

export function normalizeWishlist(data) {
  return normalizeList(data).map((item) => ({
    id: item.productId ?? item.product?.id ?? item.id,
    wishlistItemId: item.id,
    name: item.productName ?? item.name ?? item.product?.name ?? "Medication",
    image: item.productImage ?? item.image ?? item.product?.image ?? "",
    price: Number(item.productPrice ?? item.price ?? item.product?.price ?? 0),
    inStock: item.inStock ?? true,
    brand: item.brand ?? item.product?.brand ?? "NUGES",
    type: item.type ?? item.product?.category ?? "PHARMACY",
  }));
}

export default axiosClient;
