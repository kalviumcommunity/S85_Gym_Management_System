// Backend Environment Configuration
const config = {
  // Development environment
  development: {
    PORT: process.env.PORT || 3000,
    NODE_ENV: 'development',
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/gym_management_system',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here_dev',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
    CORS_ORIGINS: [
      'http://localhost:5173',
      'http://localhost:3000'
    ]
  },
  
  // Production environment
  production: {
    PORT: process.env.PORT || 3000,
    NODE_ENV: 'production',
    DB_URL: process.env.DB_URL || 'mongodb+srv://your_mongodb_atlas_connection_string_here',
    JWT_SECRET: process.env.JWT_SECRET || 'your_secure_jwt_secret_key_here_prod',
    FRONTEND_URL: process.env.FRONTEND_URL || 'https://ironcorefit.netlify.app',
    BACKEND_URL: process.env.BACKEND_URL || 'https://s85-gym-management-system.onrender.com',
    CORS_ORIGINS: [
      'https://ironcorefit.netlify.app',
      'https://ironcorefit.netlify.app/',
      'https://s85-gym-management-system.onrender.com',
      'https://s85-gym-management-system.onrender.com/',
      'http://localhost:5173'
    ]
  }
};

// Get current environment
const currentEnv = process.env.NODE_ENV || 'development';

// Export the configuration for current environment
const appConfig = config[currentEnv] || config.development;

// Log configuration (only in development)
if (currentEnv === 'development') {
  console.log('🔧 Backend Environment Configuration:', {
    environment: appConfig.NODE_ENV,
    port: appConfig.PORT,
    database: appConfig.DB_URL ? 'configured' : 'not configured',
    frontendUrl: appConfig.FRONTEND_URL,
    corsOrigins: appConfig.CORS_ORIGINS
  });
}

module.exports = appConfig; 