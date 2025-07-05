const express = require("express");
const { protect} = require("../middleware/authMiddleware");
const {authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  deleteUserById,
  createStaffUser,
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

// Shop Item routes
router.get("/shop-items", getAllShopItems);
router.post("/shop-items", createShopItem);
router.put("/shop-items/:id", updateShopItem);
router.delete("/shop-items/:id", deleteShopItem);

// Service routes
router.get("/services", getAllServices);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

// Pending Signup routes
router.get("/pending-signups", getPendingSignups);
router.put("/pending-signups/:id/approve", approveSignup);
router.put("/pending-signups/:id/reject", rejectSignup);

module.exports = router;
