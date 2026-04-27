const axios = require('axios');
const { PendingPost } = require('../models');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

const publishToVk = async (post) => {
  try {
    const groupId = process.env.VK_GROUP_ID;
    // Для загрузки фото ОБЯЗАТЕЛЬНО нужен User Token, поэтому ставим VK_ACCESS_TOKEN первым
    const accessToken = process.env.VK_ACCESS_TOKEN || process.env.VK_GROUP_TOKEN;

    console.log(`[Publish] Начинаю публикацию поста #${post.id} в ВК...`);

    let attachments = '';
    const mediaUrl = post.mediaUrl || post.media;

    if (mediaUrl) {
      console.log(`[Publish] Обнаружено медиа: ${mediaUrl}`);
      if (mediaUrl.includes('photo') || mediaUrl.includes('video')) {
        attachments = mediaUrl;
      } else {
        try {
          // 1. Получаем адрес для загрузки
          const uploadServer = await axios.get('https://api.vk.com/method/photos.getWallUploadServer', {
            params: {
              group_id: groupId.toString().replace(/[^0-9]/g, ''),
              access_token: accessToken,
              v: '5.131'
            }
          });

          if (uploadServer.data.response) {
            const { upload_url } = uploadServer.data.response;
            const relativePath = mediaUrl.startsWith('/') ? mediaUrl.substring(1) : mediaUrl;
            const filePath = path.resolve(__dirname, '../../', relativePath);
            
            console.log(`[Publish] Пытаюсь загрузить файл: ${filePath}`);

            if (fs.existsSync(filePath)) {
              const formData = new FormData();
              formData.append('photo', fs.createReadStream(filePath));
              
              const uploadRes = await axios.post(upload_url, formData, {
                headers: formData.getHeaders()
              });

              console.log(`[Publish] Файл загружен на сервер ВК, сохраняю...`);

              const savedPhoto = await axios.get('https://api.vk.com/method/photos.saveWallPhoto', {
                params: {
                  group_id: groupId.toString().replace(/[^0-9]/g, ''),
                  photo: uploadRes.data.photo,
                  server: uploadRes.data.server,
                  hash: uploadRes.data.hash,
                  access_token: accessToken,
                  v: '5.131'
                }
              });

              if (savedPhoto.data.response && savedPhoto.data.response[0]) {
                const photo = savedPhoto.data.response[0];
                attachments = `photo${photo.owner_id}_${photo.id}`;
                console.log(`[Publish] Фото успешно сохранено как: ${attachments}`);
              }
            } else {
              console.error(`[Publish] Файл не найден по пути: ${filePath}`);
            }
          } else {
            console.error(`[Publish] Не удалось получить сервер загрузки:`, uploadServer.data.error);
          }
        } catch (uploadError) {
          console.error('[Publish] Критическая ошибка загрузки медиа:', uploadError.message);
        }
      }
    }

    // 2. Публикация на стену группы
    const response = await axios.get('https://api.vk.com/method/wall.post', {
      params: {
        owner_id: `-${groupId.toString().replace(/[^0-9]/g, '')}`,
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
