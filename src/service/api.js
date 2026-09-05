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

// Client-side fallback while the matching backend promotion route is being added.
export const PROMO_CODES = {
  SAVE10: { type: "percent", value: 10, label: "10% off your order" },
  SAVE20: { type: "percent", value: 20, label: "20% off your order" },
  WELCOME5000: { type: "flat", value: 5000, label: "₦5,000 off your order" },
};

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

  getProducts: () => tryApi(["/products", "/product", "/medicines", "/items"]),

  getCart: () => tryApi(["/cart", "/carts/me", "/user/cart"]),

  saveCart: (cart) =>
    tryApi(["/cart", "/carts/me", "/user/cart"], {
      method: "PUT",
      data: {
        items: cart,
        cart,
      },
    }),

  getWishlist: () =>
    tryApi(["/wishlist", "/wishlists/me", "/user/wishlist"]),

  saveWishlist: (wishlist) =>
    tryApi(["/wishlist", "/wishlists/me", "/user/wishlist"], {
      method: "PUT",
      data: {
        items: wishlist,
        wishlist,
      },
    }),

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
    tryApi(["/orders", "/order", "/checkout"], {
      method: "POST",
      data: order,
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

    inStock:
      product.inStock ??
      product.available ??
      (typeof product.stock === "number" ? product.stock > 0 : true),
  };
}

export default axiosClient;
