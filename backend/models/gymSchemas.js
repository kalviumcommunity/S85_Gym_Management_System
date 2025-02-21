const mongoose = require("mongoose");

// Member Schema
const memberSchema = new mongoose.Schema({
  memberID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  membershipType: { type: String, required: true },
  joiningDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});



// Export Models
const Member = mongoose.model("Member", memberSchema);


module.exports = {
  Member
};
