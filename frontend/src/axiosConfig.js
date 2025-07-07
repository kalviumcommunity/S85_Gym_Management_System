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

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    // Get Firebase ID token for authentication
    try {
      // Import auth dynamically to avoid circular dependencies
      const { auth } = await import('./firebase/config');
      const { getIdToken } = await import('firebase/auth');
      
      if (auth.currentUser) {
        const token = await getIdToken(auth.currentUser, true);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error getting Firebase token for request:', error);
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      if (config.headers.Authorization) {
        console.log('🔐 Request includes Firebase token');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.DEV) {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`✅ API Response: ${response.status} (${duration}ms)`);
    }
    return response;
  },
  (error) => {
    // Log error details
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });

    // Handle different error statuses
    switch (error.response?.status) {
      case 401:
        console.error("🔒 Unauthorized! Redirecting to login...");
        window.location.href = "/login";
        break;
      case 403:
        console.error("🚫 Forbidden! Access denied.");
        break;
      case 404:
        console.error("🔍 Resource not found.");
        break;
      case 500:
        console.error("💥 Server error occurred.");
        break;
      default:
        if (!error.response) {
          console.error("🌐 Network error - check your connection.");
        }
    }
    
    return Promise.reject(error);
  }
);

export default api;