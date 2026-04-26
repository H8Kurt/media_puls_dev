const axios = require('axios');
const { PendingPost } = require('../models');

const publishToVk = async (post) => {
  try {
    const groupId = process.env.VK_GROUP_ID;
    const accessToken = process.env.VK_GROUP_TOKEN;

    console.log(`[Publish] Начинаю публикацию поста #${post.id} в ВК...`);

    // 1. Если есть медиа, их нужно прикрепить (пока реализуем простую отправку текста)
    // В будущем здесь можно добавить загрузку фото через VK API
    let attachments = '';
    if (post.mediaUrl) {
      // Если mediaUrl уже является VK-аттачментом (например, photo123_456)
      if (post.mediaUrl.includes('photo') || post.mediaUrl.includes('video')) {
        attachments = post.mediaUrl;
      }
    }

    // 2. Публикация на стену группы
    const response = await axios.get('https://api.vk.com/method/wall.post', {
      params: {
        owner_id: `-${groupId}`,
        from_group: 1,
        message: post.content || post.title,
        attachments: attachments,
        access_token: accessToken,
        v: '5.131'
      }
    });

    if (response.data.error) {
      throw new Error(`VK API Error: ${response.data.error.error_msg}`);
    }

    console.log(`[Publish] Пост #${post.id} успешно опубликован! ID в ВК: ${response.data.response.post_id}`);
    
    // 3. Обновляем статус в нашей базе
    post.status = 'published';
    await post.save();

    return true;
  } catch (error) {
    console.error(`[Publish Error] Ошибка при публикации поста #${post.id}:`, error.message);
    post.status = 'error';
    await post.save();
    return false;
  }
};

module.exports = { publishToVk };
