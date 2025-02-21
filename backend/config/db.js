const mongoose = require("mongoose");
require("dotenv").config();

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`MongoDB connected: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
};

module.exports = connectDatabase;
