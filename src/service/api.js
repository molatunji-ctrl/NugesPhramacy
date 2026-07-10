import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_URL || "https://np-backend-4ee5.onrender.com";

const axiosClient = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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

export function saveAuthData(data = {}, fallbackEmail = "", fallbackName = "") {
  const token =
    data.token ||
    data.accessToken ||
    data.jwt ||
    data?.data?.token ||
    data?.data?.accessToken;

  const user = data.user || data.data?.user || data.data || data;

  if (token) {
    localStorage.setItem("token", token);
  }

  localStorage.setItem("isAuthenticated", "true");

  localStorage.setItem(
    "userEmail",
    (user?.email || fallbackEmail || "").toLowerCase().trim()
  );

  if (user?.fullname || user?.fullName || user?.name || fallbackName) {
    localStorage.setItem(
      "userName",
      user?.fullname || user?.fullName || user?.name || fallbackName
    );
  }
}

export function clearAuthData() {
  [
    "token",
    "authToken",
    "accessToken",
    "isAuthenticated",
    "userEmail",
    "userName",
  ].forEach((key) => {
    localStorage.removeItem(key);
  });
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
  login: (payload) =>
    apiRequest("/auth/login", {
      method: "POST",
      data: payload,
    }),

  register: (payload) =>
    apiRequest("/auth/register", {
      method: "POST",
      data: payload,
    }),

  logout: () =>
    tryApi(["/auth/logout", "/logout"], {
      method: "POST",
    }),

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

  getWishlist: () => tryApi(["/wishlist", "/wishlists/me", "/user/wishlist"]),

  saveWishlist: (wishlist) =>
    tryApi(["/wishlist", "/wishlists/me", "/user/wishlist"], {
      method: "PUT",
      data: {
        items: wishlist,
        wishlist,
      },
    }),

  getProfile: () => tryApi(["/profile", "/user/profile", "/users/me", "/auth/me"]),

  updateProfile: (profile) =>
    tryApi(["/profile", "/user/profile", "/users/me"], {
      method: "PUT",
      data: profile,
    }),

  getOrders: () => tryApi(["/orders", "/order", "/user/orders", "/orders/me"]),

  createOrder: (order) =>
    tryApi(["/orders", "/order", "/checkout"], {
      method: "POST",
      data: order,
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