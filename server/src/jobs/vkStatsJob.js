const cron = require('node-cron');
const vkService = require('../services/vkService');

const initVkJobs = () => {
  // Запуск каждый час
  cron.schedule('0 * * * *', async () => {
    console.log('Running VK stats update job...');
    await vkService.fetchAndSavePosts();
    await vkService.fetchAndSaveGroupStats();
  });

  // Также запустим один раз при старте сервера
  vkService.fetchAndSavePosts();
  vkService.fetchAndSaveGroupStats();
};

module.exports = initVkJobs;
