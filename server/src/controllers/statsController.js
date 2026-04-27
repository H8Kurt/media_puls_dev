const { VkPost, VkGroupStats, Channel } = require('../models');
const { Op } = require('sequelize');
const vkService = require('../services/vkService');

exports.syncStats = async (req, res) => {
  try {
    await vkService.fetchAndSavePosts();
    await vkService.fetchAndSaveGroupStats();
    res.json({ message: 'Статистика успешно обновлена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при синхронизации', error: error.message });
  }
};

exports.getVkStats = async (req, res) => {
  try {
    const { period, category } = req.query;
    let dateFilter = {};

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const now = new Date();
    if (period === 'week') {
      dateFilter = { [Op.gte]: new Date(now.setDate(now.getDate() - 7)) };
    } else if (period === 'month') {
      dateFilter = { [Op.gte]: new Date(now.setMonth(now.getMonth() - 1)) };
    } else if (period === 'quarter') {
      dateFilter = { [Op.gte]: new Date(now.setMonth(now.getMonth() - 3)) };
    }

    const postWhere = {};
    if (Object.keys(dateFilter).length > 0) {
      postWhere.date = { ...dateFilter, [Op.lte]: endOfToday };
    }

    const posts = await VkPost.findAll({
      where: postWhere,
      order: [['date', 'DESC']]
    });

    const statsWhere = {};
    if (Object.keys(dateFilter).length > 0) {
      statsWhere.date = { ...dateFilter, [Op.lte]: endOfToday };
    }

    const groupStats = await VkGroupStats.findAll({
      where: statsWhere,
      order: [['date', 'ASC']]
    });

    res.json({ posts, groupStats });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении статистики', error: error.message });
  }
};
