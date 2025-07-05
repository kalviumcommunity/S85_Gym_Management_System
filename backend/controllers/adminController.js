// controllers/adminController.js
const User = require('../models/User');
const { ShopItem, Service, PendingSignup } = require('../models/gymSchemas');
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

// Shop Item Controllers
const getAllShopItems = async (req, res) => {
  try {
    const items = await ShopItem.find().populate('created_by', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shop items' });
  }
};

const createShopItem = async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  try {
    const newItem = await ShopItem.create({
      name,
      description,
      price,
      category,
      stock,
      image,
      created_by: req.user._id
    });
    res.status(201).json({ message: 'Shop item created successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create shop item' });
  }
};

const updateShopItem = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body, updated_at: Date.now() };
  try {
    const updatedItem = await ShopItem.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Shop item not found' });
    res.json({ message: 'Shop item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update shop item' });
  }
};

const deleteShopItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ShopItem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Shop item not found' });
    res.json({ message: 'Shop item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete shop item' });
  }
};

// Service Controllers
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('created_by', 'name');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};

const createService = async (req, res) => {
  const { name, description, price, duration, category, instructor, maxCapacity } = req.body;
  try {
    const newService = await Service.create({
      name,
      description,
      price,
      duration,
      category,
      instructor,
      maxCapacity,
      created_by: req.user._id
    });
    res.status(201).json({ message: 'Service created successfully', service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service' });
  }
};

const updateService = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body, updated_at: Date.now() };
  try {
    const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedService) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service updated successfully', service: updatedService });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update service' });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service' });
  }
};

// Pending Signup Controllers
const getPendingSignups = async (req, res) => {
  try {
    const signups = await PendingSignup.find().populate('reviewed_by', 'name');
    res.json(signups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending signups' });
  }
};

const approveSignup = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  try {
    const signup = await PendingSignup.findById(id);
    if (!signup) return res.status(404).json({ message: 'Signup request not found' });
    
    signup.status = 'approved';
    signup.notes = notes;
    signup.reviewed_by = req.user._id;
    signup.reviewed_at = Date.now();
    
    await signup.save();
    res.json({ message: 'Signup approved successfully', signup });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve signup' });
  }
};

const rejectSignup = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  try {
    const signup = await PendingSignup.findById(id);
    if (!signup) return res.status(404).json({ message: 'Signup request not found' });
    
    signup.status = 'rejected';
    signup.notes = notes;
    signup.reviewed_by = req.user._id;
    signup.reviewed_at = Date.now();
    
    await signup.save();
    res.json({ message: 'Signup rejected successfully', signup });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject signup' });
  }
};

module.exports = {
  getAllUsers,
  createStaffUser,
  deleteUserById,
  getAllShopItems,
  createShopItem,
  updateShopItem,
  deleteShopItem,
  getAllServices,
  createService,
  updateService,
  deleteService,
  getPendingSignups,
  approveSignup,
  rejectSignup,
};
