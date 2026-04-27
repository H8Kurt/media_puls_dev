const { Channel } = require('../models');
const axios = require('axios');

exports.getChannels = async (req, res) => {
  try {
    const channels = await Channel.findAll({ where: { isActive: true } });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении каналов', error: error.message });
  }
};

exports.addChannel = async (req, res) => {
  try {
    const { externalId, platform, name } = req.body;
    
    // Простая проверка существования
    let channel = await Channel.findOne({ where: { externalId, platform } });
    if (channel) {
      return res.status(400).json({ message: 'Этот канал уже добавлен' });
    }

    channel = await Channel.create({
      externalId,
      platform: platform || 'vk',
      name: name || `Группа ${externalId}`,
      isActive: true
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при добавлении канала', error: error.message });
  }
};

exports.deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    await Channel.update({ isActive: false }, { where: { id } });
    res.json({ message: 'Канал удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении канала', error: error.message });
  }
};
