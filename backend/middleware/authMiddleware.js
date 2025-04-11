const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("📦 Token received:", token);
    
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token decoded:", decoded);
    
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("❌ Auth error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
    
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
  console.log("🔐 Middleware triggered for user:", req.user?.id);

};

module.exports = protect;
