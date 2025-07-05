import axios from "axios";
import { appConfig } from "./config/config.js";

// Create an Axios instance with default config
const api = axios.create({
  baseURL: appConfig.API_BASE_URL, // Using config from environment
  withCredentials: true, // Required for cookies (HTTP-only tokens)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request interceptor (for modifying requests before sending)
api.interceptors.request.use(
  (config) => {
    // You can modify headers here (e.g., add Authorization token)
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor (for handling errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error("Unauthorized! Redirecting to login...");
      window.location.href = "/login"; // Adjust based on your routing
    }
    return Promise.reject(error);
  }
);

export default api;