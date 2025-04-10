const mongoose = require("mongoose");

// Member Schema
const memberSchema = new mongoose.Schema({
  memberID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  membershipType: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  status: { type: String,required: true, enum: ["Active", "Inactive","Expired"] },
  membershipDuration: {
    type: Number, // In days (e.g., 30, 60, 90)
    required: true
  },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});



// Export Models
const Member = mongoose.model("Member", memberSchema);


module.exports = {
  Member
};
