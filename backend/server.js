// Load environment variables
const path = require("path");
const dotenv = require("dotenv");

// Load environment-specific config
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.join(__dirname, 'config', envFile) });
const express = require("express");
const mongoose = require("mongoose");
const connectDatabase = require("./middleware/db");
const gymRoutes = require("./routes/routes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config/config");

const adminRoutes = require("./routes/adminRoutes");
const staffRoutes = require("./routes/staffRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

// Security middleware
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration using config
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (config.CORS_ORIGINS.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Home route
app.get("/", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 
        ? "MongoDB Connected☑" 
        : "MongoDB Not Connected✖";
    res.send(`<h2>Hello, I am Madhav. This is my Gym Management System!</h2>${dbStatus}`);
});

// Health check endpoint
app.get("/health", (req, res) => {
    const health = {
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    };
    res.status(200).json(health);
});

// Use Routes
app.use("/api", gymRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/member", memberRoutes);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ 
        error: "Route not found", 
        message: `Cannot ${req.method} ${req.originalUrl}` 
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: "Internal Server Error",
        message: config.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Connect to DB and start server
connectDatabase().then(() => {
    app.listen(config.PORT, () => {
        console.log(`🚀 Server is running on port ${config.PORT}`);
        console.log(`🌍 Environment: ${config.NODE_ENV}`);
        console.log(`🔗 Frontend URL: ${config.FRONTEND_URL}`);
        console.log(`🔒 CORS Origins: ${config.CORS_ORIGINS.join(', ')}`);
    });
}).catch(err => {
    console.error("❌ Server failed to start:", err);
});
