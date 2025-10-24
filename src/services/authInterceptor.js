import axios from "axios";

const authAxios = axios.create();

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// REQUEST interceptor - Add auth token to all requests
authAxios.interceptors.request.use(
  (config) => {
    // Get token directly from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Check if token is expired before adding to request
      const tokenTimestamp = localStorage.getItem("tokenTimestamp");
      if (tokenTimestamp) {
        const tokenAge = Date.now() - parseInt(tokenTimestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (tokenAge > maxAge) {
          // Token expired, clear storage directly
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("tokenTimestamp");

          // Redirect to login
          window.location.href = "/";
          return Promise.reject(new Error("Token expired"));
        }
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE interceptor - ONLY ONCE, OUTSIDE request interceptor
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return authAxios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Clear tokens and redirect (no refresh token mechanism yet)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenTimestamp");

      window.location.href = "/";
      isRefreshing = false;
      processQueue(error, null);

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default authAxios;
