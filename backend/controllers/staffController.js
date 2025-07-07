// controllers/staffController.js
const { Member } = require('../models/gymSchemas');
const { User } = require('../models/User');

const addMember = async (req, res) => {
  try {
    const member = new Member({ ...req.body, created_by: req.user._id });
    await member.save();
    res.status(201).json({ message: 'Member added successfully', member });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member updated successfully', member });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ message: 'Error updating member', error: error.message });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().populate('created_by', 'name email');
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Error fetching members', error: error.message });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate('created_by', 'name email');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'Error fetching member', error: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { date, status, notes } = req.body;
    
    // You can implement your own attendance schema here
    // For now, we'll just return a success message
    res.json({ 
      message: 'Attendance marked successfully',
      data: {
        memberId,
        date: date || new Date(),
        status: status || 'present',
        notes: notes || '',
        markedBy: req.user._id
      }
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { title, message, type, priority, recipients, selectedMembers } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    // You can implement your own notification schema here
    // For now, we'll just return a success message
    const notification = {
      id: Date.now(),
      title,
      message,
      type: type || 'general',
      priority: priority || 'normal',
      recipients,
      selectedMembers: selectedMembers || [],
      sentBy: req.user._id,
      sentAt: new Date(),
      status: 'sent'
    };

    res.json({ 
      message: 'Notification sent successfully',
      notification
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification', error: error.message });
  }
};

const getNotificationHistory = async (req, res) => {
  try {
    // You can implement your own notification schema here
    // For now, we'll return mock data
    const notifications = [
      {
        id: 1,
        title: 'Gym Maintenance Notice',
        message: 'The gym will be closed for maintenance on Sunday from 2-6 PM.',
        type: 'maintenance',
        priority: 'high',
        recipients: 'all',
        sentAt: new Date(Date.now() - 86400000), // 1 day ago
        status: 'sent'
      },
      {
        id: 2,
        title: 'New Class Available',
        message: 'Join our new HIIT class every Monday at 6 AM!',
        type: 'announcement',
        priority: 'normal',
        recipients: 'active',
        sentAt: new Date(Date.now() - 172800000), // 2 days ago
        status: 'sent'
      }
    ];

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notification history:', error);
    res.status(500).json({ message: 'Failed to fetch notification history', error: error.message });
  }
};

module.exports = {
  addMember,
  updateMember,
  markAttendance,
  getAllMembers,
  getMemberById,
  sendNotification,
  getNotificationHistory
};
