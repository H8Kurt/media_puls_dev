const { VK } = require('vk-io');
const { PendingPost } = require('../models');
const { downloadFile } = require('../utils/fileDownloader');

const initVkBot = () => {
  const token = process.env.VK_GROUP_TOKEN || process.env.VK_ACCESS_TOKEN;
  if (!token) {
    console.warn('VK_GROUP_TOKEN missing in .env. VK Bot not started.');
    return;
  }

  const vk = new VK({
    token: token
  });

  vk.updates.on('message_new', async (context) => {
    console.log(`New VK message from ${context.senderId}: ${context.text || '[attachment]'}`);
    if (context.isOutbox) return;

    try {
      const text = context.text || context.caption || '';
      let mediaUrl = '';

      // Проверяем наличие фото в сообщении
      const photos = context.attachments.filter(a => a.type === 'photo');
      if (photos.length > 0) {
        // Берем самое большое разрешение последнего фото
        const photo = photos[photos.length - 1];
        const remoteUrl = photo.largeSizeUrl || photo.mediumSizeUrl;
        mediaUrl = await downloadFile(remoteUrl);
      }

      if (!text && !mediaUrl) {
        return context.send('Привет! Пришли текст поста или фото с описанием, и я передам его на модерацию.');
      }

      // Сохраняем в общую базу модерации
      await PendingPost.create({
        telegramId: `vk_${context.senderId}`, // Префикс для отличия от ТГ
        authorName: `VK User ${context.senderId}`,
        text: text,
        mediaUrl: mediaUrl,
        status: 'pending'
      });

      await context.send('Спасибо! Твой пост принят и отправлен на модерацию SMM-менеджеру.');
    } catch (error) {
      console.error('VK Bot Error:', error);
      await context.send('Произошла ошибка при сохранении. Попробуй позже.');
    }
  });

  vk.updates.start()
    .then(() => console.log('VK Bot (LongPoll) started successfully'))
    .catch(err => console.error('Failed to start VK Bot:', err.message));
};

module.exports = initVkBot;
