const sequelize = require('../config/database');
const User = require('./user');

const initModels = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
};

module.exports = {
  sequelize,
  User,
  initModels,
};
