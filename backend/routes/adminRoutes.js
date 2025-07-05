const express = require("express");
const { protect} = require("../middleware/authMiddleware");
const {authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  deleteUserById,
  createStaffUser,
} = require("../controllers/adminController");

const router = express.Router();

// Apply `protect` first to ensure user is authenticated
router.use(protect);

// Apply `authorizeRoles` to check for 'admin' role
router.use(authorizeRoles("admin"));

// Admin-only routes
router.get("/users", getAllUsers);              // Get all users
router.delete("/users/:id", deleteUserById);        // Delete a user
router.post("/createstaff", createStaffUser); // Admin creates staff account

module.exports = router;
