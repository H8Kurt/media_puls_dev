const sequelize = require('../config/database');
const User = require('./user');
const VkPost = require('./vkPost');
const VkGroupStats = require('./vkGroupStats');
const PendingPost = require('./pendingPost');

const initModels = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};

module.exports = {
  sequelize,
  User,
  VkPost,
  VkGroupStats,
  PendingPost,
  initModels,
};
