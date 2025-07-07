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

# Netlify Deployment Configuration

This guide provides step-by-step instructions for deploying the Gym Management System frontend to Netlify.

## 🚀 Quick Deploy

### Prerequisites
- GitHub/GitLab repository with the project
- Netlify account
- Firebase project configured

### Step 1: Prepare Repository

1. **Ensure all files are committed**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Verify file structure**
   ```
   frontend/
   ├── src/
   ├── public/
   ├── package.json
   ├── vite.config.js
   ├── netlify.toml
   ├── env.production
   └── README.md
   ```

### Step 2: Connect to Netlify

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Sign in or create account

2. **Create New Site**
   - Click "New site from Git"
   - Choose your Git provider (GitHub/GitLab)
   - Select your repository

3. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: dist
   ```

### Step 3: Set Environment Variables

In Netlify dashboard, go to **Site settings > Environment variables** and add:

#### Required Variables
```env
VITE_API_BASE_URL=https://s85-gym-management-system.onrender.com/api
VITE_FRONTEND_URL=https://your-site-name.netlify.app
VITE_ENV=production
VITE_FIREBASE_API_KEY=AIzaSyCxJ2tNHnQ7YkLU5EJflD-dy5oTGM1b6rA
VITE_FIREBASE_AUTH_DOMAIN=ironcore-fitness-web.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ironcore-fitness-web
VITE_FIREBASE_STORAGE_BUCKET=ironcore-fitness-web.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=826745766393
VITE_FIREBASE_APP_ID=1:826745766393:web:54ca90c0171af28ba0bd28
VITE_FIREBASE_MEASUREMENT_ID=G-1FK6RXLCRJ
```

#### Optional Variables
```env
NODE_VERSION=18
NPM_FLAGS=--legacy-peer-deps
```

### Step 4: Deploy

1. **Trigger Deployment**
   - Click "Deploy site"
   - Netlify will build and deploy automatically

2. **Monitor Build**
   - Watch the build logs for any errors
   - Build should complete in 2-5 minutes

3. **Verify Deployment**
   - Check the live site URL
   - Test authentication flow
   - Verify all features work

## 🔧 Advanced Configuration

### Custom Domain
1. Go to **Domain settings**
2. Add custom domain
3. Configure DNS records
4. Update `VITE_FRONTEND_URL` environment variable

### Branch Deploys
1. Enable branch deploys in **Build & deploy settings**
2. Set up preview deployments for pull requests
3. Configure different environment variables per branch

### Build Optimization
The `netlify.toml` file includes:
- Code splitting configuration
- Security headers
- Cache optimization
- SPA routing support

## 🐛 Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Solution: Check dependencies
npm install --legacy-peer-deps
```

**Error: "Firebase not initialized"**
```bash
# Solution: Verify environment variables
# Check all VITE_FIREBASE_* variables are set
```

**Error: "Build timeout"**
```bash
# Solution: Optimize build
# Check for large dependencies
# Use dynamic imports
```

### Runtime Issues

**Authentication not working**
- Verify Firebase configuration
- Check CORS settings in Firebase
- Ensure auth domain is correct

**API calls failing**
- Verify backend URL is accessible
- Check CORS configuration
- Test API endpoints directly

**Routing issues**
- Ensure `netlify.toml` redirects are configured
- Test direct URL access
- Check for 404 errors

### Performance Issues

**Slow loading**
- Enable asset optimization
- Use CDN for static assets
- Implement lazy loading

**Large bundle size**
- Check bundle analyzer
- Remove unused dependencies
- Use code splitting

## 📊 Monitoring

### Build Analytics
- Monitor build times
- Check bundle sizes
- Review build logs

### Performance Monitoring
- Use Netlify Analytics
- Monitor Core Web Vitals
- Check Lighthouse scores

### Error Tracking
- Set up error monitoring
- Monitor 404 errors
- Track user interactions

## 🔒 Security

### Environment Variables
- Never commit sensitive data
- Use Netlify's environment variable system
- Rotate keys regularly

### Firebase Security
- Configure Firebase security rules
- Set up proper authentication
- Monitor usage

### HTTPS
- Netlify provides automatic HTTPS
- Configure security headers
- Enable HSTS

## 📈 Optimization

### Build Performance
- Use caching strategies
- Optimize dependencies
- Implement tree shaking

### Runtime Performance
- Enable code splitting
- Use lazy loading
- Optimize images

### SEO
- Configure meta tags
- Set up sitemap
- Optimize for search engines

## 🆘 Support

### Netlify Support
- [Netlify Docs](https://docs.netlify.com)
- [Community Forum](https://community.netlify.com)
- [Status Page](https://status.netlify.com)

### Project Support
- Check troubleshooting section
- Review error logs
- Test locally first

### Emergency Rollback
1. Go to **Deploys** tab
2. Find working deployment
3. Click "Publish deploy"
4. Revert to previous version 