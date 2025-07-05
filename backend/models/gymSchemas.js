const mongoose = require("mongoose");

// Member Schema
const memberSchema = new mongoose.Schema({
  memberID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  membershipType: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  status: { type: String,required: true, enum: ["active", "inactive","expired"] },
  membershipDuration: {
    type: String, // In days (e.g., 30, 60, 90)
    required: true
  },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Shop Item Schema
const shopItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Service Schema
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // e.g., "1 hour", "30 minutes"
  category: { type: String, required: true }, // e.g., "fitness", "wellness", "training"
  instructor: { type: String },
  maxCapacity: { type: Number },
  isActive: { type: Boolean, default: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Pending Signup Schema
const pendingSignupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  membershipType: { type: String, required: true },
  membershipDuration: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  notes: { type: String },
  created_at: { type: Date, default: Date.now },
  reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewed_at: { type: Date }
});

// Export Models
const Member = mongoose.model("Member", memberSchema);
const ShopItem = mongoose.model("ShopItem", shopItemSchema);
const Service = mongoose.model("Service", serviceSchema);
const PendingSignup = mongoose.model("PendingSignup", pendingSignupSchema);

module.exports = {
  Member,
  ShopItem,
  Service,
  PendingSignup
};
