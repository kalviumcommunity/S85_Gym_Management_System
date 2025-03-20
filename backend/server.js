const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDatabase = require("./middleware/db");
const gymRoutes = require("./routes/routes"); // Correct path
const cors = require("cors");


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());  // Enable CORS

// Home Route - Show MongoDB Connection Status
app.get("/", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 
        ? "MongoDB Connected☑" 
        : "MongoDB Not Connected✖";
    
    res.send(`<h2>Hello, I am Madhav. This is my Gym Management System!</h2>${dbStatus}`);
});

// Use Routes
app.use("/api", gymRoutes); // Now all member routes are under "/api/members"

connectDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("❌ Server failed to start:", err);
}); 