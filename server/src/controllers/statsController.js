const { VkPost, VkGroupStats } = require('../models');

exports.getVkStats = async (req, res) => {
  try {
    const posts = await VkPost.findAll({
      order: [['date', 'DESC']],
      limit: 10
    });

    const groupStats = await VkGroupStats.findAll({
      order: [['date', 'DESC']],
      limit: 30
    });

    res.json({
      posts,
      groupStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении статистики', error: error.message });
  }
};
