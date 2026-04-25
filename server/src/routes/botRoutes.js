const express = require('express');
const router = express.Router();
const { PendingPost } = require('../models');

// Эндпоинт для приема постов от внешних ботов (например, на Python)
router.post('/suggest', async (req, res) => {
  try {
    const { telegramId, authorName, text, mediaUrl } = req.body;

    if (!text && !mediaUrl) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = await PendingPost.create({
      telegramId,
      authorName,
      text,
      mediaUrl,
      status: 'pending'
    });

    res.status(201).json({ success: true, postId: post.id });
  } catch (error) {
    console.error('External Bot API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Эндпоинт для получения статистики волонтера
router.get('/stats/:tgId', async (req, res) => {
  try {
    const count = await PendingPost.count({ where: { telegramId: req.params.tgId } });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
