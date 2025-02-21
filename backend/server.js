const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // ✅ Import mongoose
const connectDatabase = require("./config/db");
const { Member } = require("./models/gymSchemas"); // ✅ Only importing Member

dotenv.config(); // Load environment variables
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDatabase();

// Home Route  - Show MongoDB Connection Status
app.get("/", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 
        ? "MongoDB Connected☑" 
        : "MongoDB Not Connected✖";
    
    res.send(`<h2>Hello, I am Madhav. This is my Gym Management System!</h2>${dbStatus}`);
});

// Fetch all members
app.get("/members", async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
 
// Add a new member
app.post("/members", async (req, res) => {
    try {
        const { memberID, name, email, phone, membershipType } = req.body;
        const newMember = new Member({ memberID, name, email, phone, membershipType });
        await newMember.save();
        res.status(201).json({ message: "Member added successfully", newMember });
    } catch (error) {
        res.status(400).json({ message: "Error adding member", error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
