const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PendingPost, sequelize } = require('./models');
const vkService = require('./services/vkService');

async function testApproval() {
  try {
    console.log('🛠 Параметры подключения:', {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      host: process.env.DB_HOST
    });

    // Проверка соединения с БД
    await sequelize.authenticate();
    console.log('📡 Соединение с базой данных установлено.');

    console.log('🔍 Поиск последнего предложенного поста...');
    
    const post = await PendingPost.findOne({
      where: { status: 'pending' },
      order: [['createdAt', 'DESC']]
    });

    if (!post) {
      console.log('❌ Предложенных постов не найдено. Сначала напиши боту что-нибудь!');
      return;
    }

    console.log(`📝 Найден пост от ${post.authorName}:`);
    console.log(`--- Текст: ${post.text}`);
    console.log(`--- Media: ${post.mediaUrl || 'нет'}`);
    console.log('🚀 Публикация в ВК...');

    const vkPostId = await vkService.publishPost(post);

    if (vkPostId) {
      await post.update({ status: 'approved' });
      console.log(`✅ Успех! Пост опубликован. VK ID: ${vkPostId}`);
    }

  } catch (error) {
    console.error('💥 Ошибка при тесте:', error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testApproval();
