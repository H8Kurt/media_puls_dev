require('dotenv').config();
const vkService = require('./src/services/vkService');
const { PendingPost, initModels } = require('./src/models');

async function testPublish() {
  try {
    console.log('Инициализация моделей...');
    await initModels();

    console.log('Создание тестового поста в базе...');
    const post = await PendingPost.create({
      telegramId: 'test_admin',
      authorName: 'Система тестирования',
      text: 'Тестовый пост из MediaPuls! 🚀\nПроверка автоматической публикации через бэкенд.',
      status: 'pending'
    });

    console.log(`Пост создан (ID: ${post.id}). Начинаю публикацию в ВК...`);
    
    const vkPostId = await vkService.publishPost(post);
    
    if (vkPostId) {
      post.status = 'approved';
      await post.save();
      console.log('\n✅ УСПЕХ!');
      console.log(`Пост опубликован. Ссылка: https://vk.com/wall-${process.env.VK_GROUP_ID}_${vkPostId}`);
    }
  } catch (error) {
    console.error('\n❌ ОШИБКА ТЕСТИРОВАНИЯ:');
    console.error(error.message);
  } finally {
    process.exit();
  }
}

testPublish();
