const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../middleware/dbmysql'); // MySQL connection instance
const User = require('./User');  // Import User model to associate with Entity

const Entity = sequelize.define('Entity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,  // Use Sequelize.NOW for default timestamp
  },
});

// Define associations after models are defined
Entity.belongsTo(User, { foreignKey: 'created_by', onDelete: 'CASCADE' });
User.hasMany(Entity, { foreignKey: 'created_by' });

module.exports = Entity;
