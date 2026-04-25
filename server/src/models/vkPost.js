const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VkPost = sequelize.define('VkPost', {
  vkId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
  },
  date: {
    type: DataTypes.DATE,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  comments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reposts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = VkPost;
