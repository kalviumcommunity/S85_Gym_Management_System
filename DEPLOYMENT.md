# Deployment Guide for Gym Management System

## Overview
This guide covers deploying the Gym Management System with:
- **Frontend**: Netlify (React/Vite app)
- **Backend**: Render (Node.js/Express API)
- **Database**: MongoDB Atlas

## Backend Deployment (Render)

### 1. Prepare Backend for Deployment

The backend is already configured for production deployment. Key files:
- `backend/config/.env.production` - Production environment variables
- `backend/server.js` - Main server file with proper CORS and security
- `package.json` - Contains start script and Node.js version

### 2. Deploy to Render

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - **Name**: `gym-management-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `20.x`

3. **Environment Variables**:
   Set these in Render dashboard:
   ```
   NODE_ENV=production
   DB_URL=mongodb+srv://madhavgarg3300:asap@gym.2zian.mongodb.net/
   JWT_SECRET=Madhav123!
   PORT=3000
   FRONTEND_URL=https://ironcorefit.netlify.app
   BACKEND_URL=https://s85-gym-management-system.onrender.com
   ```

4. **Deploy**: Click "Create Web Service"

## Frontend Deployment (Netlify)

### 1. Prepare Frontend for Deployment

The frontend is configured with:
- `frontend/.env` - Production environment variables
- `frontend/netlify.toml` - Netlify configuration
- `frontend/public/_redirects` - SPA routing support

### 2. Deploy to Netlify

#### Option A: Git Integration (Recommended)
1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build:prod`
   - **Publish directory**: `frontend/dist`
   - **Node version**: `20.x`

3. **Environment Variables**:
   Set these in Netlify dashboard:
   ```
   VITE_API_BASE_URL=https://s85-gym-management-system.onrender.com/api
   VITE_FRONTEND_URL=https://ironcorefit.netlify.app
   VITE_ENV=production
   VITE_FIREBASE_API_KEY=AIzaSyCxJ2tNHnQ7YkLU5EJflD-dy5oTGM1b6rA
   VITE_FIREBASE_AUTH_DOMAIN=ironcore-fitness-web.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=ironcore-fitness-web
   VITE_FIREBASE_STORAGE_BUCKET=ironcore-fitness-web.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=826745766393
   VITE_FIREBASE_APP_ID=1:826745766393:web:54ca90c0171af28ba0bd28
   VITE_FIREBASE_MEASUREMENT_ID=G-1FK6RXLCRJ
   ```

#### Option B: Manual Deploy
1. **Build Locally**:
   ```bash
   cd frontend
   npm install
   npm run build:prod
   ```

2. **Deploy**: Drag and drop the `dist` folder to Netlify

### 3. Custom Domain (Optional)
- In Netlify dashboard, go to "Domain settings"
- Add your custom domain
- Update `FRONTEND_URL` in both backend and frontend configs

## Environment Configuration

### Development vs Production

**Development** (`.env.development`):
- API URL: `http://localhost:3000/api`
- Frontend URL: `http://localhost:5173`

**Production** (`.env` / `.env.production`):
- API URL: `https://s85-gym-management-system.onrender.com/api`
- Frontend URL: `https://ironcorefit.netlify.app`

## Security Considerations

1. **Environment Variables**: Never commit `.env` files with sensitive data
2. **CORS**: Configured to only allow your frontend domain
3. **Security Headers**: Added in both backend and Netlify config
4. **JWT Secret**: Use a strong, unique secret in production

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Verify `FRONTEND_URL` matches your Netlify domain
   - Check CORS configuration in `backend/config/config.js`

2. **API Connection Issues**:
   - Verify `VITE_API_BASE_URL` points to your Render backend
   - Check backend logs in Render dashboard

3. **Build Failures**:
   - Ensure Node.js version is 20.x on both platforms
   - Check build logs for missing dependencies

4. **Database Connection**:
   - Verify MongoDB Atlas connection string
   - Ensure IP whitelist includes 0.0.0.0/0 for Render

### Logs and Monitoring:
- **Render**: View logs in service dashboard
- **Netlify**: Check deploy logs and function logs
- **MongoDB**: Monitor connections in Atlas dashboard

## Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend.onrender.com/health`
- [ ] Frontend loads correctly
- [ ] API calls work from frontend
- [ ] Authentication flow works
- [ ] Database operations function
- [ ] All routes accessible (SPA routing)

## Updates and Maintenance

1. **Code Updates**: Push to main branch for auto-deployment
2. **Environment Changes**: Update via platform dashboards
3. **Database Migrations**: Handle via backend API or direct MongoDB access
4. **Monitoring**: Set up uptime monitoring for both services
