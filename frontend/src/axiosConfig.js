import axios from "axios";

// Create an Axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Your backend API base URL
  withCredentials: true, // Required for cookies (HTTP-only tokens)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request interceptor (for modifying requests before sending)
api.interceptors.request.use(
  (config) => {
    // You can modify headers here (e.g., add Authorization token)
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