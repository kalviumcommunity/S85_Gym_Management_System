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

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Static frontend path
// app.use(express.static(path.join(__dirname, "frontend", "build")));

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

// Wildcard route (for SPA)
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
// });

// Connect to DB and start server
connectDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("❌ Server failed to start:", err);
});
