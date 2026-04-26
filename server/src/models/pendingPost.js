const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PendingPost = sequelize.define('PendingPost', {
  telegramId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  authorName: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  platform: {
    type: DataTypes.STRING,
    defaultValue: 'vk',
  },
  category: {
    type: DataTypes.STRING,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'scheduled', 'published', 'error'),
    defaultValue: 'pending',
  },
});

module.exports = PendingPost;
