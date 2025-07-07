import { getApiUrl, isProduction, isDevelopment } from '../config/config.js';
import api from '../axiosConfig';

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

// Common API error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Access denied. You do not have permission for this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return data.message || 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || 'An error occurred. Please try again.';
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection and try again.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
};

// API request wrapper with error handling
export const apiRequest = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await api.request({
      method,
      url: endpoint,
      data,
      ...config
    });
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

// Common API methods
export const apiGet = (endpoint, config = {}) => apiRequest('GET', endpoint, null, config);
export const apiPost = (endpoint, data, config = {}) => apiRequest('POST', endpoint, data, config);
export const apiPut = (endpoint, data, config = {}) => apiRequest('PUT', endpoint, data, config);
export const apiDelete = (endpoint, config = {}) => apiRequest('DELETE', endpoint, null, config);

// Utility function to format dates
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Utility function to format currency
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Utility function to validate email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility function to validate password strength
export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: {
      length: password.length < minLength ? `Password must be at least ${minLength} characters` : null,
      uppercase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
      lowercase: !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
      numbers: !hasNumbers ? 'Password must contain at least one number' : null
    }
  };
};

export default {
  getApiEndpoint,
  logApiCall,
  logApiResponse,
  logApiError,
  API_ENDPOINTS,
  getEndpoint,
  handleApiError,
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  formatDate,
  formatCurrency,
  validateEmail,
  validatePassword
}; 