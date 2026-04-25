const { Telegraf, Markup } = require('telegraf');
const { PendingPost } = require('../models');
const { downloadFile } = require('../utils/fileDownloader');

const MAIN_MENU = Markup.keyboard([
  ['📝 Создать пост'],
  ['📊 Моя статистика', 'ℹ️ Инструкция']
]).resize();

const initBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN missing in .env. Bot not started.');
    return;
  }

  const bot = new Telegraf(token);

  bot.start((ctx) => {
    ctx.reply('Привет, волонтер! 👋\nЯ помогу тебе отправить контент на модерацию. Выбери действие в меню:', MAIN_MENU);
  });

  bot.hears('ℹ️ Инструкция', (ctx) => {
    ctx.reply('📖 Инструкция:\n1. Нажми "Создать пост"\n2. Пришли текст и/или фото\n3. Дождись одобрения модератором.\n\nВсе посты попадают в общую очередь медиа-центра.', MAIN_MENU);
  });

  bot.hears('📊 Моя статистика', async (ctx) => {
    try {
      const count = await PendingPost.count({ where: { telegramId: ctx.from.id.toString() } });
      ctx.reply(`📈 Твоя активность:\nВсего предложено постов: ${count}`, MAIN_MENU);
    } catch (error) {
      ctx.reply('Не удалось получить статистику.');
    }
  });

  bot.hears('📝 Создать пост', (ctx) => {
    ctx.reply('📝 Чтобы предложить пост:\n\n1. Прикрепите ФОТО (по желанию)\n2. Напишите ТЕКСТ поста в этом же сообщении или следующим.\n\nЯ сразу увижу твой материал и передам его на модерацию! ✨', MAIN_MENU);
  });

  bot.on(['text', 'photo'], async (ctx) => {
    try {
      const text = ctx.message.text || ctx.message.caption || '';
      
      // Игнорируем системные сообщения кнопок
      if (['📝 Создать пост', '📊 Моя статистика', 'ℹ️ Инструкция'].includes(text)) return;

      let mediaUrl = '';
      if (ctx.message.photo) {
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const link = await ctx.telegram.getFileLink(fileId);
        mediaUrl = await downloadFile(link.href);
      }

      if (!text && !mediaUrl) {
        return ctx.reply('Пожалуйста, пришли текст или фото для создания поста.');
      }

      await PendingPost.create({
        telegramId: ctx.from.id.toString(),
        authorName: ctx.from.first_name + (ctx.from.last_name ? ` ${ctx.from.last_name}` : ''),
        text: text,
        mediaUrl: mediaUrl,
        status: 'pending'
      });

      ctx.reply('✅ Принято! Твой материал отправлен на модерацию. Спасибо за вклад!', MAIN_MENU);
    } catch (error) {
      console.error('Bot Error:', error);
      ctx.reply('❌ Произошла ошибка при сохранении. Попробуй позже.');
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
