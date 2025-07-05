# Deployment Configuration Guide

This guide explains how to configure the frontend for different environments (development, production, staging).

## Configuration Files

### 1. Main Configuration (`src/config/config.js`)
This is the main configuration file that handles environment-specific settings:

- **Development**: 
  - API: `http://localhost:3000/api`
  - Frontend: `http://localhost:5173`
- **Production**: 
  - API: `https://s85-gym-management-system.onrender.com/api`
  - Frontend: `https://ironcorefit.netlify.app`
- **Staging**: 
  - API: `https://s85-gym-management-system.onrender.com/api`
  - Frontend: `https://ironcorefit.netlify.app`

### 2. Environment Files
- `env.development` - Development environment variables
- `env.production` - Production environment variables

## URLs

### Backend (Render)
- **URL**: https://s85-gym-management-system.onrender.com
- **API Base**: https://s85-gym-management-system.onrender.com/api

### Frontend (Netlify)
- **URL**: https://ironcorefit.netlify.app
- **Development**: http://localhost:5173

## How to Use

### For Development
```bash
npm run dev
```
This will automatically use the development configuration pointing to `localhost:3000`.

### For Production Build
```bash
npm run build
```
This will create a production build using the production configuration pointing to your Render backend.

### For Production Deployment
When deploying to platforms like Vercel, Netlify, or any other hosting service:

1. **Set Environment Variables** in your hosting platform:
   ```
   VITE_API_BASE_URL=https://s85-gym-management-system.onrender.com/api
   VITE_FRONTEND_URL=https://ironcorefit.netlify.app
   VITE_ENV=production
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   ```

## Configuration Functions

The config file provides several helper functions:

```javascript
import { appConfig, getApiUrl, getFrontendUrl, isProduction, isDevelopment } from './src/config/config.js';

// Get current configuration
console.log(appConfig.API_BASE_URL);
console.log(appConfig.FRONTEND_URL);

// Get full API URL for an endpoint
const userUrl = getApiUrl('/users');

// Get full frontend URL for a path
const profileUrl = getFrontendUrl('/profile');

// Check environment
if (isProduction()) {
  // Production-specific code
}

if (isDevelopment()) {
  // Development-specific code
}
```

## Important Notes

1. **CORS**: Make sure your backend allows requests from your frontend domain
2. **HTTPS**: Production uses HTTPS, ensure your backend supports it
3. **Environment Variables**: Always use environment variables for sensitive data
4. **Build Process**: The build process automatically detects the environment and uses the appropriate configuration

## Troubleshooting

### If API calls fail in production:
1. Check if the backend URL is correct
2. Verify CORS settings on the backend
3. Check browser console for any errors
4. Ensure the backend is running and accessible

### If you need to change the backend URL:
1. Update `src/config/config.js`
2. Update environment variables in your hosting platform
3. Rebuild and redeploy

### Netlify Build Issues:
1. Make sure `netlify.toml` is in the root directory
2. Set environment variables in Netlify dashboard
3. Check build logs for specific errors 