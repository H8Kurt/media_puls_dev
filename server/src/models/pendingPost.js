const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PendingPost = sequelize.define('PendingPost', {
  telegramId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorName: {
    type: DataTypes.STRING,
  },
  text: {
    type: DataTypes.TEXT,
  },
  mediaUrl: {
    type: DataTypes.STRING, // Ссылка на фото/видео
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
});

module.exports = PendingPost;
