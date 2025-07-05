const mongoose = require("mongoose");
const config = require("../config/config");

const connectDatabase = async () => {
  try {
    const data = await mongoose.connect(config.DB_URL);
    console.log(`✅ MongoDB connected: ${data.connection.host}`);
    console.log(`🗄️ Database: ${config.DB_URL.split('/').pop()}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDatabase;
