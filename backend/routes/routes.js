const express = require("express");
const router = express.Router();
const { Member } = require("../models/gymSchemas");

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

// Add a new member (CREATE)
router.post("/members", async (req, res) => {
    try {
        const { memberID, name, email, phone, membershipType } = req.body;
        const newMember = new Member({ memberID, name, email, phone, membershipType });
        await newMember.save();
        res.status(201).json({ message: "Member added successfully", newMember });
    } catch (error) {
        res.status(400).json({ message: "Error adding member", error });
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
