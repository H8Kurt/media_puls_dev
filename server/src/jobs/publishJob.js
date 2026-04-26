const cron = require('node-cron');
const { PendingPost } = require('../models');
const { Op } = require('sequelize');
const { publishToVk } = require('../services/publishService');

const initPublishJob = () => {
  // Запуск каждую минуту
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // Ищем посты, время публикации которых наступило или прошло
      const postsToPublish = await PendingPost.findAll({
        where: {
          status: 'scheduled',
          scheduledAt: {
            [Op.lte]: now
          }
        }
      });

      if (postsToPublish.length > 0) {
        console.log(`[Cron] Найдено постов для публикации: ${postsToPublish.length}`);
        
        for (const post of postsToPublish) {
          await publishToVk(post);
        }
      }
    } catch (error) {
      console.error('[Cron Error] Ошибка в задаче автопубликации:', error.message);
    }
  });

  console.log('[Cron] Задача автопубликации запущена (интервал: 1 мин)');
};

module.exports = initPublishJob;
