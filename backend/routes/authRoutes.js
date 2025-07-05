require("dotenv").config();
const express = require("express");
const { body } = require("express-validator");

const {
  signupUser,
  submitPendingSignup,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const router = express.Router();

// Signup (optionally accept role from admin panel)
router.post(
  "/signup",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  signupUser
);

// Submit pending signup (for member registration)
router.post(
  "/pending-signup",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("phone").notEmpty(),
    body("membershipType").notEmpty(),
    body("membershipDuration").notEmpty(),
  ],
  submitPendingSignup
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").exists(),
  ],
  loginUser
);

// Logout
router.post("/logout", logoutUser);

module.exports = router;
