const express = require("express");
const router = express.Router();
const { Member } = require("../models/gymSchemas");
const { User } = require("../models/User");
const {verifyFirebaseToken, protect} = require("../middleware/authMiddleware");

router.use(express.json());

// Test endpoint to verify authentication
router.get("/test-auth", verifyFirebaseToken, async (req, res) => {
    try {
        console.log('✅ Test auth endpoint hit successfully');
        console.log('👤 User:', req.user);
        res.json({ 
            message: 'Authentication successful!', 
            user: req.user,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Test auth error:', error);
        res.status(500).json({ error: 'Test auth failed' });
    }
});

// 📊 Get dashboard statistics
router.get("/stats/dashboard", verifyFirebaseToken, async (req, res) => {
    try {
        const userRole = req.user.role;
        let stats = {};

        if (userRole === 'admin') {
            // Admin stats - comprehensive data
            const totalMembers = await Member.countDocuments();
            const activeMembers = await Member.countDocuments({ status: 'active' });
            const inactiveMembers = await Member.countDocuments({ status: 'inactive' });
            const expiredMembers = await Member.countDocuments({ status: 'expired' });
            const totalUsers = await User.countDocuments();
            const staffUsers = await User.countDocuments({ role: 'staff' });
            
            // Calculate revenue based on membership types
            const memberships = await Member.find({ status: 'active' });
            const membershipPrices = { 
                'Gold': 50, 
                'Platinum': 75, 
                'Diamond': 100,
                'Basic': 30,
                'Premium': 60
            };
            
            const monthlyRevenue = memberships.reduce((total, member) => {
                return total + (membershipPrices[member.membershipType] || 50);
            }, 0);

            // Calculate growth percentage (mock calculation)
            const lastMonthMembers = Math.floor(totalMembers * 0.9); // Mock: 10% growth
            const growthPercentage = totalMembers > lastMonthMembers ? 
                `+${Math.round(((totalMembers - lastMonthMembers) / lastMonthMembers) * 100)}%` : 
                `${Math.round(((totalMembers - lastMonthMembers) / lastMonthMembers) * 100)}%`;

            // Get membership type distribution
            const membershipDistribution = await Member.aggregate([
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

            stats = {
                totalMembers,
                activeMembers,
                inactiveMembers,
                expiredMembers,
                totalUsers,
                staffUsers,
                monthlyRevenue,
                monthlyGrowth: growthPercentage,
                pendingPayments: Math.floor(Math.random() * 15) + 5,
                todayCheckins: Math.floor(Math.random() * 40) + 15,
                thisWeekCheckins: Math.floor(Math.random() * 150) + 80,
                recentMembers,
                membershipDistribution
            };
        } else if (userRole === 'staff') {
            // Staff stats - focused on member management
            const totalMembers = await Member.countDocuments();
            const activeMembers = await Member.countDocuments({ status: 'active' });
            const inactiveMembers = await Member.countDocuments({ status: 'inactive' });
            
            // Get members created by this staff member
            const myMembers = await Member.countDocuments({ created_by: req.user.id });
            
            // Get recent check-ins (mock data)
            const todayCheckins = Math.floor(Math.random() * 30) + 10;
            const thisWeekCheckins = Math.floor(Math.random() * 100) + 50;
            
            // Calculate revenue for members managed by this staff
            const myActiveMembers = await Member.find({ 
                created_by: req.user.id, 
                status: 'active' 
            });
            
            const membershipPrices = { 
                'Gold': 50, 
                'Platinum': 75, 
                'Diamond': 100,
                'Basic': 30,
                'Premium': 60
            };
            
            const myRevenue = myActiveMembers.reduce((total, member) => {
                return total + (membershipPrices[member.membershipType] || 50);
            }, 0);
            
            stats = {
                totalMembers,
                activeMembers,
                inactiveMembers,
                myMembers,
                myRevenue,
                pendingPayments: Math.floor(Math.random() * 10) + 1,
                todayCheckins,
                thisWeekCheckins,
                monthlyRevenue: Math.floor(Math.random() * 15000) + 10000
            };
        } else {
            // Member stats - personal data
            const member = await Member.findOne({ email: req.user.email });
            if (member) {
                // Calculate days remaining
                const joiningDate = new Date(member.joiningDate);
                const membershipDuration = parseInt(member.membershipDuration) || 30;
                const expiryDate = new Date(joiningDate.getTime() + (membershipDuration * 24 * 60 * 60 * 1000));
                const now = new Date();
                const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                
                // Update member status based on expiry
                let currentStatus = member.status;
                if (daysRemaining <= 0 && member.status === 'active') {
                    currentStatus = 'expired';
                    // Update in database
                    await Member.findByIdAndUpdate(member._id, { status: 'expired' });
                }
                
                // Calculate membership progress
                const daysElapsed = Math.floor((now.getTime() - joiningDate.getTime()) / (1000 * 60 * 60 * 24));
                const progressPercentage = Math.min(100, Math.round((daysElapsed / membershipDuration) * 100));
                
                // Generate consistent workout data based on user ID
                const userIdNum = parseInt(req.user.id.slice(-6), 16) || 1000;
                const totalWorkouts = Math.floor((userIdNum % 20) + 8);
                const lastWorkoutDays = Math.floor((userIdNum % 7) + 1);
                const lastWorkout = lastWorkoutDays === 1 ? 'Yesterday' : 
                                  lastWorkoutDays === 2 ? '2 days ago' : 
                                  `${lastWorkoutDays} days ago`;
                
                // Calculate membership value
                const membershipPrices = { 
                    'Gold': 50, 
                    'Platinum': 75, 
                    'Diamond': 100,
                    'Basic': 30,
                    'Premium': 60,
                    'Standard': 40,
                    'Elite': 90
                };
                const membershipValue = membershipPrices[member.membershipType] || 50;
                
                stats = {
                    membershipStatus: currentStatus,
                    daysRemaining: `${daysRemaining} days`,
                    lastWorkout,
                    totalWorkouts,
                    progressPercentage,
                    membershipValue,
                    membershipType: member.membershipType,
                    joiningDate: member.joiningDate,
                    nextPaymentDate: expiryDate.toISOString().split('T')[0]
                };
            } else {
                // Create a basic member profile if none exists
                const newMember = new Member({
                    memberID: Math.floor(100000 + Math.random() * 900000).toString(),
                    name: req.user.displayName || req.user.name || 'Unknown',
                    email: req.user.email,
                    phone: '000-000-0000',
                    membershipType: 'Basic',
                    joiningDate: new Date(),
                    status: 'active',
                    membershipDuration: 30,
                    created_by: req.user.id
                });
                
                await newMember.save();
                
                stats = {
                    membershipStatus: 'active',
                    daysRemaining: '30 days',
                    lastWorkout: 'Never',
                    totalWorkouts: 0,
                    progressPercentage: 0,
                    membershipValue: 30,
                    membershipType: 'Basic',
                    joiningDate: new Date().toISOString(),
                    nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
router.get("/stats/members", verifyFirebaseToken, async (req, res) => {
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
router.get("/members", verifyFirebaseToken, async (req, res) => {
    try {
        const members = await Member.find({ created_by: req.user.id });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// 🔍 Get members by any user ID (admin use)
router.get("/members/by-user/:userId", verifyFirebaseToken, async (req, res) => {
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
router.get("/members/all", verifyFirebaseToken, async (req, res) => {
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
router.post("/members", verifyFirebaseToken, async (req, res) => {
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
router.put("/members/:id", verifyFirebaseToken, async (req, res) => {
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
router.delete("/members/:id", verifyFirebaseToken, async (req, res) => {
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

// 📊 Get analytics data
router.get("/analytics", verifyFirebaseToken, async (req, res) => {
    try {
        const userRole = req.user.role;
        const { range = 'month' } = req.query;

        if (userRole !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admin only." });
        }

        // Calculate date range
        const now = new Date();
        let startDate;
        switch (range) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'quarter':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get member statistics
        const totalMembers = await Member.countDocuments();
        const activeMembers = await Member.countDocuments({ status: 'active' });
        const newMembers = await Member.countDocuments({ 
            joiningDate: { $gte: startDate } 
        });
        const expiredMembers = await Member.countDocuments({ 
            status: 'expired',
            endDate: { $gte: startDate }
        });

        // Calculate growth percentage (mock calculation)
        const growth = Math.floor(Math.random() * 20) + 5; // 5-25% growth

        // Revenue calculations (mock data)
        const monthlyRevenue = totalMembers * 50; // $50 per member
        const totalRevenue = monthlyRevenue * 12;
        const averageRevenue = monthlyRevenue / totalMembers;

        // Attendance data (mock)
        const totalCheckins = Math.floor(Math.random() * 5000) + 2000;
        const averageCheckins = (totalCheckins / activeMembers / 4).toFixed(1); // per week
        const peakHours = 'Monday 6-8 PM';

        // Recent activities (mock data)
        const activities = [
            {
                id: 1,
                type: 'new_member',
                title: 'New member registered',
                description: 'John Doe',
                time: '2 hours ago',
                status: 'positive'
            },
            {
                id: 2,
                type: 'payment',
                title: 'Payment received',
                description: '$99.99 from Jane Smith',
                time: '4 hours ago',
                status: 'positive'
            },
            {
                id: 3,
                type: 'maintenance',
                title: 'Equipment maintenance',
                description: 'Treadmill #3 serviced',
                time: '6 hours ago',
                status: 'neutral'
            },
            {
                id: 4,
                type: 'expired',
                title: 'Membership expired',
                description: 'Mike Johnson',
                time: '1 day ago',
                status: 'negative'
            }
        ];

        const analyticsData = {
            members: {
                total: totalMembers,
                active: activeMembers,
                new: newMembers,
                expired: expiredMembers,
                growth: growth
            },
            revenue: {
                total: totalRevenue,
                monthly: monthlyRevenue,
                growth: growth + 3, // Revenue grows slightly more than members
                average: averageRevenue
            },
            attendance: {
                total: totalCheckins,
                average: parseFloat(averageCheckins),
                peak: peakHours,
                growth: Math.floor(Math.random() * 10) - 5 // -5 to +5%
            },
            activities: activities
        };

        res.json(analyticsData);
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ error: "Failed to fetch analytics data" });
    }
});

module.exports = router;
