import { getApiUrl, isProduction, isDevelopment } from '../config/config.js';

/**
 * Utility functions for API calls
 */

// Get the full API URL for a specific endpoint
export const getApiEndpoint = (endpoint) => {
  return getApiUrl(endpoint);
};

// Log API calls in development mode
export const logApiCall = (method, endpoint, data = null) => {
  if (isDevelopment()) {
    console.log(`🚀 API Call: ${method.toUpperCase()} ${getApiEndpoint(endpoint)}`);
    if (data) {
      console.log('📦 Request Data:', data);
    }
  }
};

// Log API responses in development mode
export const logApiResponse = (method, endpoint, response) => {
  if (isDevelopment()) {
    console.log(`✅ API Response: ${method.toUpperCase()} ${getApiEndpoint(endpoint)}`, response);
  }
};

// Log API errors in development mode
export const logApiError = (method, endpoint, error) => {
  if (isDevelopment()) {
    console.error(`❌ API Error: ${method.toUpperCase()} ${getApiEndpoint(endpoint)}`, error);
  }
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User endpoints
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  
  // Member endpoints
  MEMBERS: '/members',
  MEMBER_BY_ID: (id) => `/members/${id}`,
  ADD_MEMBER: '/members',
  UPDATE_MEMBER: (id) => `/members/${id}`,
  DELETE_MEMBER: (id) => `/members/${id}`,
  
  // Staff endpoints
  STAFF: '/staff',
  STAFF_BY_ID: (id) => `/staff/${id}`,
  ADD_STAFF: '/staff',
  UPDATE_STAFF: (id) => `/staff/${id}`,
  DELETE_STAFF: (id) => `/staff/${id}`,
  
  // Admin endpoints
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_PENDING_SIGNUPS: '/admin/pending-signups',
  
  // Shop endpoints
  SHOP_ITEMS: '/shop',
  SHOP_ITEM_BY_ID: (id) => `/shop/${id}`,
  
  // Notification endpoints
  NOTIFICATIONS: '/notifications',
  SEND_NOTIFICATION: '/notifications/send',
  
  // Payment endpoints
  PAYMENTS: '/payments',
  PAYMENT_BY_ID: (id) => `/payments/${id}`,
  
  // Membership endpoints
  MEMBERSHIPS: '/memberships',
  MEMBERSHIP_BY_ID: (id) => `/memberships/${id}`,
};

// Helper function to get endpoint with parameters
export const getEndpoint = (endpoint, params = {}) => {
  let url = endpoint;
  
  // Replace parameters in the URL
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

export default {
  getApiEndpoint,
  logApiCall,
  logApiResponse,
  logApiError,
  API_ENDPOINTS,
  getEndpoint
}; 