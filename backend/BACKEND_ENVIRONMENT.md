# Backend Environment Configuration

## 🔧 **Configuration System**

### **Main Configuration File**: `config/config.js`
This file centralizes all environment-specific settings and automatically detects the environment.

### **Environment Detection**:
- **Development**: `NODE_ENV=development` or not set
- **Production**: `NODE_ENV=production`

## 📋 **Environment Variables**

### **Required Variables**:
```bash
# Environment
NODE_ENV=development

# Server
PORT=3000

# Database
DB_URL=mongodb://localhost:27017/gym_management_system

# Security
JWT_SECRET=your_jwt_secret_key_here

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

### **Production Variables** (for Render):
```bash
NODE_ENV=production
PORT=3000
DB_URL=your_mongodb_atlas_url
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://ironcorefit.netlify.app
BACKEND_URL=https://s85-gym-management-system.onrender.com
```

## 🚀 **Environment Configurations**

### **Development Environment**:
- **Port**: 3000
- **Database**: Local MongoDB
- **Frontend**: `http://localhost:5173`
- **CORS**: Allows localhost origins
- **JWT**: Development secret

### **Production Environment**:
- **Port**: 3000 (or Render's assigned port)
- **Database**: MongoDB Atlas (cloud)
- **Frontend**: `https://ironcorefit.netlify.app`
- **CORS**: Allows Netlify origin
- **JWT**: Production secret

## 🔗 **URLs Configuration**

### **Current URLs**:
- **Backend (Render)**: `https://s85-gym-management-system.onrender.com`
- **Frontend (Netlify)**: `https://ironcorefit.netlify.app`
- **API Base**: `https://s85-gym-management-system.onrender.com/api`

### **CORS Configuration**:
The backend automatically allows requests from:
- Development: `http://localhost:5173`
- Production: `https://ironcorefit.netlify.app`

## 📁 **Files Structure**

```
backend/
├── config/
│   ├── config.js          # Main configuration
│   └── env.example        # Environment template
├── env.development        # Development variables
├── env.production         # Production variables
├── server.js              # Main server file
└── middleware/
    └── db.js              # Database connection
```

## 🛠️ **Setup Instructions**

### **Local Development**:
1. Copy `config/env.example` to `.env`
2. Fill in your values
3. Run: `npm start` or `node server.js`

### **Production (Render)**:
1. Set environment variables in Render dashboard
2. Deploy automatically on git push
3. Backend will use production configuration

## 🔍 **Configuration Usage**

### **In server.js**:
```javascript
const config = require("./config/config");

app.listen(config.PORT, () => {
    console.log(`🚀 Server running on port ${config.PORT}`);
    console.log(`🌍 Environment: ${config.NODE_ENV}`);
});
```

### **In middleware**:
```javascript
const config = require("../config/config");

mongoose.connect(config.DB_URL);
```

### **CORS Configuration**:
```javascript
app.use(cors({
    origin: config.CORS_ORIGINS,
    credentials: true
}));
```

## 🧪 **Testing**

### **Local Testing**:
```bash
cd backend
npm start
```

**Expected Output**:
```
🔧 Backend Environment Configuration: {
  environment: 'development',
  port: 3000,
  database: 'configured',
  frontendUrl: 'http://localhost:5173',
  corsOrigins: ['http://localhost:5173', 'http://localhost:3000']
}
✅ MongoDB connected: localhost
🗄️ Database: gym_management_system
🚀 Server is running on port 3000
🌍 Environment: development
🔗 Frontend URL: http://localhost:5173
```

### **Production Testing**:
Visit: `https://s85-gym-management-system.onrender.com`

**Expected Output**:
```
🚀 Server is running on port 3000
🌍 Environment: production
🔗 Frontend URL: https://ironcorefit.netlify.app
```

## 🔒 **Security Notes**

1. **JWT Secret**: Use strong, unique secrets in production
2. **Database URL**: Use MongoDB Atlas in production
3. **CORS**: Only allow trusted origins
4. **Environment Variables**: Never commit `.env` files

## ✅ **Current Status**

Your backend environment is properly configured for:
- ✅ Local development
- ✅ Production deployment on Render
- ✅ CORS with your Netlify frontend
- ✅ Environment-specific settings
- ✅ Centralized configuration management

## 🎯 **Next Steps**

1. **Set up MongoDB Atlas** for production database
2. **Configure environment variables** in Render dashboard
3. **Test the connection** between frontend and backend
4. **Deploy and verify** everything works in production 