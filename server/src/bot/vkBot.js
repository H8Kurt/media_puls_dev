const { VK, Keyboard } = require('vk-io');
const { PendingPost } = require('../models');
const { downloadFile } = require('../utils/fileDownloader');

const MAIN_KEYBOARD = Keyboard.builder()
  .textButton({
    label: '📝 Создать пост',
    payload: { command: 'create_post' },
    color: 'primary'
  })
  .row()
  .textButton({
    label: '📊 Моя статистика',
    payload: { command: 'stats' },
    color: 'secondary'
  })
  .textButton({
    label: 'ℹ️ Инструкция',
    payload: { command: 'help' },
    color: 'secondary'
  });

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

    const { text, payload } = context;
    const command = payload?.command || text?.toLowerCase();

    try {
      // Обработка команд из кнопок или текста
      if (command === 'start' || command === 'начать' || command === 'меню') {
        return context.send('Привет, волонтер! 👋\nЯ помогу тебе отправить контент на модерацию. Выбери действие:', {
          keyboard: MAIN_KEYBOARD
        });
      }

      if (command === 'create_post' || command === '📝 создать пост') {
        return context.send('📝 Чтобы предложить пост:\n\n1. Прикрепите ФОТО (по желанию)\n2. Напишите ТЕКСТ поста в этом же сообщении или следующим.\n\nЯ сразу увижу твой материал и передам его SMM-менеджеру! ✨', {
          keyboard: MAIN_KEYBOARD
        });
      }

      if (command === 'help' || command === 'ℹ️ инструкция') {
        return context.send('📖 Инструкция:\n1. Нажми "Создать пост"\n2. Пришли текст и/или фото\n3. Дождись одобрения модератором.\n\nВсе посты попадают в общую очередь медиа-центра.', {
          keyboard: MAIN_KEYBOARD
        });
      }

      // ... (статистика остается прежней)

      // Если это не команда, проверяем наличие контента
      const messageText = context.text || context.caption || '';
      
      // Игнорируем, если текст совпадает с названием кнопки создания поста
      if (messageText === '📝 Создать пост') return;

      let mediaUrl = '';

      const photos = context.attachments.filter(a => a.type === 'photo');
      if (photos.length > 0) {
        const photo = photos[photos.length - 1];
        const remoteUrl = photo.largeSizeUrl || photo.mediumSizeUrl;
        mediaUrl = await downloadFile(remoteUrl);
      }

      if (!messageText && !mediaUrl) {
        return context.send('Чтобы создать пост, просто пришли мне текст или фото с описанием.', {
          keyboard: MAIN_KEYBOARD
        });
      }

      await PendingPost.create({
        telegramId: `vk_${context.senderId}`,
        authorName: `VK User ${context.senderId}`,
        text: messageText,
        mediaUrl: mediaUrl,
        status: 'pending'
      });

      await context.send('✅ Принято! Твой материал отправлен на модерацию. Спасибо за вклад!', {
        keyboard: MAIN_KEYBOARD
      });

    } catch (error) {
      console.error('VK Bot Error:', error);
      await context.send('❌ Произошла ошибка. Попробуй позже.');
    }
  });

  vk.updates.start()
    .then(() => console.log('VK Bot (LongPoll) started successfully'))
    .catch(err => console.error('Failed to start VK Bot:', err.message));
};

module.exports = initVkBot;
