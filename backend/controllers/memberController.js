// controllers/memberController.js
const User = require('../models/User');
const { Member } = require('../models/gymSchemas');

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

const getMyMembership = async (req, res) => {
  try {
    // Find member by email (since Firebase Auth users don't have backend User IDs)
    const member = await Member.findOne({ email: req.user.email });
    
    if (!member) {
      return res.status(404).json({ message: 'Membership not found' });
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
};

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

module.exports = {
  getMyProfile,
  updateMyProfile,
  getMyMembership,
};
