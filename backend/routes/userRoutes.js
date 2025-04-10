const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name _id");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
