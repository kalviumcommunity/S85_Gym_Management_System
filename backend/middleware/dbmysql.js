const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a Sequelize instance for MySQL with the dialect explicitly provided
const sequelize = new Sequelize(
  'madhavdb',     // Database name
  'root',          // Database user
  'Mg2006@garg',   // Database password
  {
    host: process.env.DB_HOST || 'localhost', // Database host (default to 'localhost')
    dialect: 'mysql',                          // Explicitly specifying MySQL as the dialect
  }
);

module.exports = sequelize;
