const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Store token in HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });
    generateToken(res, user._id);

    res.status(201).json({ message: "Signup successful", user: { name, email } });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    generateToken(res, user._id);

    res.status(200).json({ message: "Login successful", user: { name: user.name, email } });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { signupUser, loginUser, logoutUser };
