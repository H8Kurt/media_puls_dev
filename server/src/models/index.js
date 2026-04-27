const sequelize = require('../config/database');
const User = require('./user');
const VkPost = require('./vkPost');
const VkGroupStats = require('./vkGroupStats');
const PendingPost = require('./pendingPost');
const Channel = require('./channel');

// Отношения
Channel.hasMany(VkPost, { foreignKey: 'channelId' });
VkPost.belongsTo(Channel, { foreignKey: 'channelId' });

Channel.hasMany(VkGroupStats, { foreignKey: 'channelId' });
VkGroupStats.belongsTo(Channel, { foreignKey: 'channelId' });

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
  Channel,
  initModels,
};
