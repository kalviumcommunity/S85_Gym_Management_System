require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDatabase = require("./middleware/db");
const gymRoutes = require("./routes/routes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const config = require("./config/config");

const adminRoutes = require("./routes/adminRoutes");
const staffRoutes = require("./routes/staffRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS configuration using config
app.use(cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Home route
app.get("/", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 
        ? "MongoDB Connected☑" 
        : "MongoDB Not Connected✖";
    res.send(`<h2>Hello, I am Madhav. This is my Gym Management System!</h2>${dbStatus}`);
});

// Use Routes
app.use("/api", gymRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/member", memberRoutes);

// Connect to DB and start server
connectDatabase().then(() => {
    app.listen(config.PORT, () => {
        console.log(`🚀 Server is running on port ${config.PORT}`);
        console.log(`🌍 Environment: ${config.NODE_ENV}`);
        console.log(`🔗 Frontend URL: ${config.FRONTEND_URL}`);
    });
}).catch(err => {
    console.error("❌ Server failed to start:", err);
});
