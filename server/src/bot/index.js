const { Telegraf } = require('telegraf');
const { PendingPost } = require('../models');
const { downloadFile } = require('../utils/fileDownloader');

const initBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN missing in .env. Bot not started.');
    return;
  }

  const bot = new Telegraf(token);

  bot.start((ctx) => {
    ctx.reply('Привет, волонтер! Пришли текст поста или фото с описанием, и я отправлю его на модерацию.');
  });

  bot.on(['text', 'photo'], async (ctx) => {
    try {
      let text = ctx.message.text || ctx.message.caption || '';
      let mediaUrl = '';

      if (ctx.message.photo) {
        // Берем самое большое фото из массива
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const link = await ctx.telegram.getFileLink(fileId);
        mediaUrl = await downloadFile(link.href);
      }

      if (!text && !mediaUrl) {
        return ctx.reply('Пожалуйста, пришли текст или фото.');
      }

      await PendingPost.create({
        telegramId: ctx.from.id.toString(),
        authorName: ctx.from.first_name + (ctx.from.last_name ? ` ${ctx.from.last_name}` : ''),
        text: text,
        mediaUrl: mediaUrl,
        status: 'pending'
      });

      ctx.reply('Спасибо! Твой пост отправлен на модерацию. Ты увидишь его в ленте, когда SMM-менеджер его одобрит.');
    } catch (error) {
      console.error('Bot Error:', error);
      ctx.reply('Произошла ошибка при сохранении поста. Попробуй позже.');
    }
  });

  bot.launch().then(() => {
    console.log('Telegram Bot started successfully');
  }).catch(err => {
    console.error('Failed to start Telegram Bot:', err.message);
  });

  // Graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

module.exports = initBot;
