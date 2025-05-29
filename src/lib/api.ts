// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8184",
  timeout: 30000,
  withCredentials: true, // Sends cookies, including jwt
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log("api: Sending request", { url: config.url, method: config.method, headers: config.headers });
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("api: Response received", {
      url: response.config.url,
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error("api: Error occurred", {
      url: originalRequest.url,
      status: error.response?.status, 
      message: error.message,
      stack: error.stack
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            }, reject
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("api: Detected 401, attempting to refresh token");
        const response = await api.post("/v1/auth/refresh-token");
        const { accessToken } = response.data;
        localStorage.setItem("token", accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        console.error("api: Failed to refresh token", refreshError);
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;