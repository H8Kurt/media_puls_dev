require('dotenv').config();

const app = require('./app');
const { initModels } = require('./models');
const initVkJobs = require('./jobs/vkStatsJob');
const initBot = require('./bot');
const initVkBot = require('./bot/vkBot');

const PORT = Number(process.env.PORT) || 4000;

const startServer = async () => {
  try {
    await initModels();
    initVkJobs(); // Инициализация сбора статистики ВК
    // initBot();    // Запуск Telegram-бота (отключено, используем Python-бота)
    initVkBot();  // Запуск ВК-бота
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
