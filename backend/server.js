require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const entitiesRoute = require('./routes/entitiesRoute'); // Import your new route

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const connectDatabase = require("./middleware/db");

// MySQL Sequelize setup
const sequelize = require("./middleware/dbmysql");
const User = require("./models/User");
const Entity = require("./models/Entity");

// ✅ Define MySQL associations
Entity.belongsTo(User, {
    foreignKey: "created_by",
    onDelete: "CASCADE"
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // your Vite frontend
    credentials: true
}));

// ✅ Sync MySQL models after defining associations
sequelize.sync({ force: false })
.then(() => {
    console.log("✅ MySQL Database & tables synced!");
})
.catch((error) => {
    console.error("❌ Error syncing MySQL DB:", error);
});

// Home Route - MongoDB status
app.get("/", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 
    ? "MongoDB Connected☑" 
    : "MongoDB Not Connected✖";
    
    res.send(`<h2>Hello, I am Madhav. This is my Gym Management System!</h2><p>${dbStatus}</p>`);
});

// API Routes
const gymRoutes = require("./routes/routes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use('/api/entities', entitiesRoute);
app.use("/api", gymRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

// Serve frontend (React build)
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Start server after MongoDB connects
connectDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("❌ Server failed to start:", err);
});
