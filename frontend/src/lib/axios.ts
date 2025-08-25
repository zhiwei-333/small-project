import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";


export const axiosInstance = axios.create({
  baseURL: "/api", // Let Vite proxy handle backend forwarding in dev
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 fallback
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    // Only retry once to prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await useAuthStore.getState().refreshAccessToken();
        return axiosInstance(originalRequest); // Retry request
      } catch (refreshError) {
        useAuthStore.getState().logout();
      }
    }


    return Promise.reject(error);
  }
);
