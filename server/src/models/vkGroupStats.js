const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VkGroupStats = sequelize.define('VkGroupStats', {
  date: {
    type: DataTypes.DATEONLY,
    unique: true,
    allowNull: false,
  },
  reach: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reachSubscribers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  visitors: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  newSubscribers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  channelId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = VkGroupStats;
