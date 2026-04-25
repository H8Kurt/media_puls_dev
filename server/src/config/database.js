const { Sequelize } = require('sequelize');
require('dotenv').config(); // Добавляем загрузку .env здесь

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
