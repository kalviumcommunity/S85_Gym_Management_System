const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);
module.exports = User;




///////////////////////////??????????my-sql///////////////////////////



// const { DataTypes } = require('sequelize');
// const sequelize = require('../middleware/dbmysql'); // MySQL connection instance

// const User = sequelize.define('User', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false,
//     validate: {
//       isEmail: true, // Ensure it's a valid email format
//     },
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// }, {
//   // Automatically add createdAt and updatedAt timestamps
//   timestamps: true,
//   createdAt: 'createdAt',
//   updatedAt: 'updatedAt',
// });

// If you need to set up relationships, you can do it here
// For example, if a User has many Entities:


module.exports = User;

