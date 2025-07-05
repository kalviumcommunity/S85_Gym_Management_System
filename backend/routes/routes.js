const express = require("express");
const router = express.Router();
const { Member } = require("../models/gymSchemas");
const {protect} = require("../middleware/authMiddleware");

router.use(express.json());

// 🔐 Get members created by the logged-in user
router.get("/members", protect, async (req, res) => {
    try {
        const members = await Member.find({ created_by: req.user.id });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// 🔍 Get members by any user ID (admin use)
router.get("/members/by-user/:userId", protect, async (req, res) => {
    console.log("📡 Route hit with userId:", req.params.userId);
    try {
        const members = await Member.find({ created_by: req.params.userId });

        if (!members || members.length === 0) {
            return res.status(404).json({ message: "No members found for this user" });
        }

        res.status(200).json(members);
    } catch (error) {
        console.error("Error fetching members by user ID:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 🌐 Get ALL members (regardless of user)
router.get("/members/all", protect, async (req, res) => {
    try {
        const allMembers = await Member.find().populate("created_by", "name email");
        res.json(allMembers);
    } catch (error) {
        console.error("Error fetching all members:", error);
        res.status(500).json({ error: "Failed to fetch all members" });
    }
});

// 🔎 Get a single member by ID
router.get("/members/:id", protect, async (req, res) => {
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

// ➕ Add a new member
router.post("/members", protect, async (req, res) => {
    try {
        const { name, email, phone, membershipType, joiningDate, status,membershipDuration } = req.body;

        if (!name || !email || !phone || !membershipType || !status ||!membershipDuration) {
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
            status,
            created_by: req.user.id,
            membershipDuration
        });

        await newMember.save();
        res.status(201).json({ message: "Member added successfully", member: newMember });
    } catch (error) {
        console.error("Error adding member:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// 🔁 Update member by ID
router.put("/members/:id", protect, async (req, res) => {
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

// ❌ Delete member by ID
router.delete("/members/:id", protect, async (req, res) => {
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
