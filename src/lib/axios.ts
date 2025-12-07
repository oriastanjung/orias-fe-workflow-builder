import axios from "axios";

// Define axios instance
const instance = axios.create({
  baseURL: window.env?.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Set request url that does not need to refresh token when got 401
const BLACKLISTED_URLS = [
  "/api/v1/auth/sign-out",
  "/api/v1/auth/sign-in",
  "/api/v1/auth/refresh",
];

// Interceptors after response if its 401, then try to refresh token, then do the initial request again
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      !BLACKLISTED_URLS.includes(error.config.url || "")
    ) {
      try {
        await instance.post(`/api/v1/auth/refresh`, {});
        return instance.request(error.config);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
