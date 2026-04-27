const cron = require('node-cron');
const vkService = require('../services/vkService');
const { Channel } = require('../models');

const initVkJobs = () => {
  // Запуск каждый час
  cron.schedule('0 * * * *', async () => {
    console.log('Running VK stats update job...');
    await vkService.fetchAndSavePosts();
    await vkService.fetchAndSaveGroupStats();
  });

  // Также запустим один раз при старте сервера
  setTimeout(async () => {
    await vkService.fetchAndSavePosts();
    await vkService.fetchAndSaveGroupStats();
  }, 5000);
};

module.exports = initVkJobs;
