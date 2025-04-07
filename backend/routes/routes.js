const express = require("express");
const router = express.Router();
const { Member } = require("../models/gymSchemas");
router.use(express.json());

// Fetch all members (READ)
router.get("/members", async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Fetch a single member by ID (READ)
router.get("/members/:id", async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});




router.post("/members", async (req, res) => {
    try {
        const { name, email, phone, membershipType, joiningDate, status } = req.body;

        // ✅ Check if all required fields are provided
        if (!name || !email || !phone || !membershipType || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const memberID = req.body.memberID || Math.floor(100000 + Math.random() * 900000).toString();  

        const newMember = new Member({
            memberID,
            name,
            email,
            phone,
            membershipType,
            joiningDate: joiningDate || new Date(),
            status
        });

        await newMember.save();
        res.status(201).json({ message: "Member added successfully", member: newMember });
    } catch (error) {
        console.error("Error adding member:", error);
        res.status(500).json({ message: "Server error" });
    }
});










// Update a member by ID (UPDATE)
router.put("/members/:id", async (req, res) => {
    try {
        const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMember) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.json({ message: "Member updated successfully", updatedMember });
    } catch (error) {
        res.status(400).json({ message: "Error updating member", error });
    }
});

// Delete a member by ID (DELETE)
router.delete("/members/:id", async (req, res) => {
    try {
        const deletedMember = await Member.findByIdAndDelete(req.params.id);
        if (!deletedMember) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.json({ message: "Member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting member", error });
    }
});

module.exports = router;
