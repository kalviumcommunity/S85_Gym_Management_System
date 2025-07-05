require("dotenv").config();
const express = require("express");
const { body } = require("express-validator");

const {
  signupUser,
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
