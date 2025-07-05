const express = require("express");
const router = express.Router();
const { Member } = require("../models/gymSchemas");
const { User } = require("../models/User");
const {protect} = require("../middleware/authMiddleware");

router.use(express.json());

// 📊 Get dashboard statistics
router.get("/stats/dashboard", protect, async (req, res) => {
    try {
        const userRole = req.user.role;
        let stats = {};

        if (userRole === 'admin') {
            // Admin stats - all data
            const totalMembers = await Member.countDocuments();
            const activeMembers = await Member.countDocuments({ status: 'active' });
            const totalUsers = await User.countDocuments();
            const staffUsers = await User.countDocuments({ role: 'staff' });
            
            // Calculate revenue (mock calculation based on memberships)
            const memberships = await Member.find();
            const monthlyRevenue = memberships.reduce((total, member) => {
                const membershipPrices = { 'Gold': 50, 'Platinum': 75, 'Diamond': 100 };
                return total + (membershipPrices[member.membershipType] || 50);
            }, 0);

            stats = {
                totalMembers,
                activeMembers,
                totalUsers,
                staffUsers,
                monthlyRevenue,
                monthlyGrowth: '+12%', // Mock growth percentage
                pendingPayments: Math.floor(Math.random() * 10) + 1, // Mock pending payments
                todayCheckins: Math.floor(Math.random() * 30) + 10, // Mock check-ins
                thisWeekCheckins: Math.floor(Math.random() * 100) + 50 // Mock weekly check-ins
            };
        } else if (userRole === 'staff') {
            // Staff stats - limited to their scope
            const totalMembers = await Member.countDocuments();
            const activeMembers = await Member.countDocuments({ status: 'active' });
            
            stats = {
                totalMembers,
                activeMembers,
                pendingPayments: Math.floor(Math.random() * 10) + 1,
                todayCheckins: Math.floor(Math.random() * 30) + 10,
                thisWeekCheckins: Math.floor(Math.random() * 100) + 50,
                monthlyRevenue: Math.floor(Math.random() * 15000) + 10000
            };
        } else {
            // Member stats - personal data
            const member = await Member.findOne({ email: req.user.email });
            if (member) {
                const daysRemaining = member.membershipDuration ? 
                    Math.max(0, parseInt(member.membershipDuration) - 
                    Math.floor((Date.now() - new Date(member.joiningDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;
                
                stats = {
                    membershipStatus: member.status,
                    daysRemaining: `${daysRemaining} days`,
                    lastWorkout: '2 days ago', // Mock data
                    totalWorkouts: Math.floor(Math.random() * 20) + 5 // Mock data
                };
            }
        }

        res.json(stats);
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
});

// 📈 Get member statistics
router.get("/stats/members", protect, async (req, res) => {
    try {
        const totalMembers = await Member.countDocuments();
        const activeMembers = await Member.countDocuments({ status: 'active' });
        const inactiveMembers = await Member.countDocuments({ status: 'inactive' });
        const expiredMembers = await Member.countDocuments({ status: 'expired' });

        // Get membership type distribution
        const membershipTypes = await Member.aggregate([
            {
                $group: {
                    _id: '$membershipType',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get recent members (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentMembers = await Member.countDocuments({
            joiningDate: { $gte: thirtyDaysAgo }
        });

        res.json({
            totalMembers,
            activeMembers,
            inactiveMembers,
            expiredMembers,
            membershipTypes,
            recentMembers
        });
    } catch (error) {
        console.error("Error fetching member stats:", error);
        res.status(500).json({ error: "Failed to fetch member statistics" });
    }
});

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

// 🔍 Get membership by email (for Firebase Auth users)
router.get("/membership/:email", async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const member = await Member.findOne({ email: email });
        
        if (!member) {
            return res.status(404).json({ message: "Membership not found" });
        }

        // Calculate membership details
        const now = new Date();
        const joiningDate = new Date(member.joiningDate);
        const daysSinceJoining = Math.floor((now - joiningDate) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, parseInt(member.membershipDuration) - daysSinceJoining);
        
        // Determine membership status
        let status = member.status;
        if (daysRemaining <= 0 && member.status === 'active') {
            status = 'expired';
        }

        // Helper function to get membership price
        const getMembershipPrice = (membershipType) => {
            const prices = {
                'Gold': 50,
                'Platinum': 75,
                'Diamond': 100,
                'Basic': 30,
                'Standard': 40,
                'Premium': 50,
                'Elite': 75
            };
            return prices[membershipType] || 50;
        };

        // Helper function to get membership features
        const getMembershipFeatures = (membershipType) => {
            const features = {
                'Gold': [
                    'Access to gym facilities',
                    'Basic equipment usage',
                    'Locker room access',
                    'Free parking'
                ],
                'Platinum': [
                    'Access to gym facilities',
                    'Group fitness classes',
                    'Locker room access',
                    'Towel service',
                    'Guest passes (1/month)'
                ],
                'Diamond': [
                    'Access to all gym facilities',
                    'Unlimited group fitness classes',
                    'Personal training sessions (4/month)',
                    'Locker room access',
                    'Towel service',
                    'Guest passes (4/month)',
                    'Fitness assessment (monthly)',
                    'Nutrition consultation (weekly)',
                    'Spa access',
                    'Priority booking'
                ],
                'Basic': [
                    'Access to gym facilities',
                    'Basic equipment usage',
                    'Locker room access',
                    'Free parking'
                ],
                'Standard': [
                    'Access to gym facilities',
                    'Group fitness classes',
                    'Locker room access',
                    'Towel service',
                    'Guest passes (1/month)'
                ],
                'Premium': [
                    'Access to all gym facilities',
                    'Group fitness classes',
                    'Personal training sessions (2/month)',
                    'Locker room access',
                    'Towel service',
                    'Guest passes (2/month)',
                    'Fitness assessment (quarterly)',
                    'Nutrition consultation (monthly)'
                ],
                'Elite': [
                    'Access to all gym facilities',
                    'Unlimited group fitness classes',
                    'Personal training sessions (4/month)',
                    'Locker room access',
                    'Towel service',
                    'Guest passes (4/month)',
                    'Fitness assessment (monthly)',
                    'Nutrition consultation (weekly)',
                    'Spa access',
                    'Priority booking'
                ]
            };
            return features[membershipType] || features['Basic'];
        };

        // Create membership response object
        const membershipData = {
            id: member._id,
            type: member.membershipType,
            status: status,
            startDate: member.joiningDate,
            endDate: new Date(joiningDate.getTime() + (parseInt(member.membershipDuration) * 24 * 60 * 60 * 1000)),
            price: getMembershipPrice(member.membershipType),
            billingCycle: 'monthly',
            autoRenew: true,
            features: getMembershipFeatures(member.membershipType),
            usage: {
                totalVisits: Math.floor(Math.random() * 50) + 10, // Mock data for now
                thisMonth: Math.floor(Math.random() * 15) + 5,
                averagePerWeek: Math.floor(Math.random() * 5) + 1,
                lastVisit: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
            },
            paymentMethod: {
                type: 'credit_card',
                last4: '1234',
                expiry: '12/25'
            }
        };

        res.json(membershipData);
    } catch (error) {
        console.error('Error fetching membership:', error);
        res.status(500).json({ message: 'Failed to fetch membership' });
    }
});

module.exports = router;
