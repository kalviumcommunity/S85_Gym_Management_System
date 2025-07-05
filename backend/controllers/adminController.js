// controllers/adminController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Create a new staff user
const createStaffUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'staff',
    });

    res.status(201).json({ message: 'Staff user created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create staff user' });
  }
};

// Delete a user
const deleteUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

module.exports = {
  getAllUsers,
  createStaffUser,
  deleteUserById,
};
