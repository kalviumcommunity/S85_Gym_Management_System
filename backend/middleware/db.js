const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

const connectDatabase = async () => {
  try {
    const data = await mongoose.connect(process.env.DB_URL)
    console.log(`✅ MongoDB connected: ${data.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDatabase;
