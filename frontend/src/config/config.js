// Environment configuration
const config = {
  // Development environment
  development: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
    ENV: import.meta.env.VITE_ENV || 'development'
  },
  
  // Production environment
  production: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://s85-gym-management-system.onrender.com/api',
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'https://ironcorefit.netlify.app',
    ENV: import.meta.env.VITE_ENV || 'production'
  },
  
  // Staging environment (if needed)
  staging: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://s85-gym-management-system.onrender.com/api',
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'https://ironcorefit.netlify.app',
    ENV: import.meta.env.VITE_ENV || 'staging'
  }
};

// Get current environment
const currentEnv = import.meta.env.MODE || 'development';

// Export the configuration for current environment
export const appConfig = config[currentEnv] || config.development;

// Log current configuration (only in development)
if (import.meta.env.DEV) {
  console.log('🔧 Environment Configuration:', {
    mode: currentEnv,
    apiUrl: appConfig.API_BASE_URL,
    frontendUrl: appConfig.FRONTEND_URL,
    env: appConfig.ENV
  });
}

// Export all configs for reference
export const allConfigs = config;

// Helper function to get API URL
export const getApiUrl = (endpoint = '') => {
  return `${appConfig.API_BASE_URL}${endpoint}`;
};

// Helper function to get frontend URL
export const getFrontendUrl = (path = '') => {
  return `${appConfig.FRONTEND_URL}${path}`;
};

// Helper function to check if in production
export const isProduction = () => appConfig.ENV === 'production';

// Helper function to check if in development
export const isDevelopment = () => appConfig.ENV === 'development';

export default appConfig; 