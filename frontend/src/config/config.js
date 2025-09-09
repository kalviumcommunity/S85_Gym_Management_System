// Environment configuration
const config = {
  // Development environment
  development: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
    ENV: import.meta.env.VITE_ENV || 'development',
    FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID
  },
  
  // Production environment
  production: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://s85-gym-management-system.onrender.com/api',
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'https://ironcorefit.netlify.app',
    ENV: import.meta.env.VITE_ENV || 'production',
    FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID
  },
  
  // Staging environment (if needed)
  staging: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://s85-gym-management-system.onrender.com/api',
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'https://ironcorefit.netlify.app',
    ENV: import.meta.env.VITE_ENV || 'staging',
    FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID
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
    env: appConfig.ENV,
    firebaseProject: appConfig.FIREBASE_PROJECT_ID
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

// Helper function to get Firebase config
export const getFirebaseConfig = () => ({
  apiKey: appConfig.FIREBASE_API_KEY,
  authDomain: appConfig.FIREBASE_AUTH_DOMAIN,
  projectId: appConfig.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
});

export default appConfig; 