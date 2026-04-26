const axios = require('axios');
const { VkPost, VkGroupStats } = require('../models');

const VK_API_VERSION = '5.131';

class VkService {
  constructor() {
    this.accessToken = process.env.VK_SERVICE_TOKEN || process.env.VK_ACCESS_TOKEN;
    this.groupId = process.env.VK_GROUP_ID;
  }

  async fetchAndSavePosts() {
    try {
      if (!this.accessToken || !this.groupId) {
        console.warn('VK credentials missing in .env');
        return;
      }

      // Очищаем ID группы от возможных префиксов, оставляем только цифры
      const cleanGroupId = this.groupId.toString().replace(/[^0-9]/g, '');

      const response = await axios.get('https://api.vk.com/method/wall.get', {
        params: {
          owner_id: `-${cleanGroupId}`,
          count: 10,
          access_token: this.accessToken,
          v: VK_API_VERSION,
        },
      });

      // Если сервисный ключ не сработал для wall.get (редко, но бывает), 
      // попробуем подсказать пользователю
      if (response.data.error) {
        if (response.data.error.error_code === 28 || response.data.error.error_code === 27) {
          console.error('❌ VK Error: Этот токен не может читать стену. Пожалуйста, используйте СЕРВИСНЫЙ КЛЮЧ из настроек приложения ВК.');
        } else {
          console.error('VK API Error (wall.get):', response.data.error.error_msg);
        }
        return;
      }

      const posts = response.data.response.items;
      if (!posts) {
        console.warn('VK returned no posts. Check if the group is private or empty.');
        return;
      }

      for (const post of posts) {
        await VkPost.upsert({
          vkId: post.id,
          text: post.text,
          date: new Date(post.date * 1000),
          likes: post.likes?.count || 0,
          comments: post.comments?.count || 0,
          reposts: post.reposts?.count || 0,
          views: post.views?.count || 0,
        });
      }

      console.log(`✅ SUCCESS: Updated ${posts.length} posts from VK`);
    } catch (error) {
      console.error('❌ VK Service Critical Error:', error.message);
    }
  }

  async fetchAndSaveGroupStats() {
    try {
      if (!this.accessToken || !this.groupId) return;

      const response = await axios.get('https://api.vk.com/method/stats.get', {
        params: {
          group_id: this.groupId,
          interval: 'day',
          intervals_count: 7,
          access_token: this.accessToken,
          v: VK_API_VERSION,
        },
      });

      if (response.data.error) {
        // Если это ошибка доступа к статистике, просто выводим инфо, но не считаем это критическим сбоем
        if (response.data.error.error_code === 15 || response.data.error.error_code === 7) {
          console.info('VK Group Stats: Access denied (requires User Token). Skipping group stats.');
        } else {
          console.error('VK API Error (stats.get):', response.data.error.error_msg);
        }
        return;
      }

      const statsArray = response.data.response;

      if (!Array.isArray(statsArray)) {
        console.warn('VK stats.get returned non-array response:', statsArray);
        return;
      }

      for (const dayStat of statsArray) {
        await VkGroupStats.upsert({
          date: dayStat.day,
          reach: dayStat.reach?.reach || 0,
          reachSubscribers: dayStat.reach?.reach_subscribers || 0,
          views: dayStat.activity?.views || 0,
          visitors: dayStat.visitors?.visitors || 0,
          newSubscribers: dayStat.subscribed || 0,
        });
      }

      console.log('Successfully updated VK group stats');
    } catch (error) {
      console.error('Error fetching VK group stats:', error.message);
    }
  }

  async publishPost(post) {
    try {
      const groupToken = process.env.VK_GROUP_TOKEN || process.env.VK_ACCESS_TOKEN;
      if (!groupToken || !this.groupId) {
        throw new Error('Missing VK_GROUP_TOKEN or VK_GROUP_ID');
      }

      const params = {
        owner_id: `-${this.groupId.toString().replace(/[^0-9]/g, '')}`,
        message: post.content || post.text,
        access_token: groupToken,
        v: VK_API_VERSION,
      };

      // Если есть картинка, её нужно загрузить в ВК
      if (post.mediaUrl) {
        try {
          const path = require('path');
          const fs = require('fs');
          const FormData = require('form-data');
          
          // 1. Получаем адрес для загрузки
          const uploadServer = await axios.get('https://api.vk.com/method/photos.getWallUploadServer', {
            params: {
              group_id: this.groupId.toString().replace(/[^0-9]/g, ''),
              access_token: groupToken,
              v: VK_API_VERSION
            }
          });

          if (uploadServer.data.response) {
            const { upload_url } = uploadServer.data.response;
            const filePath = path.join(__dirname, '../../', post.mediaUrl);
            
            if (fs.existsSync(filePath)) {
              // 2. Загружаем файл на сервер ВК
              const formData = new FormData();
              formData.append('photo', fs.createReadStream(filePath));
              
              const uploadRes = await axios.post(upload_url, formData, {
                headers: formData.getHeaders()
              });

              // 3. Сохраняем фото в ВК
              const savedPhoto = await axios.get('https://api.vk.com/method/photos.saveWallPhoto', {
                params: {
                  group_id: this.groupId.toString().replace(/[^0-9]/g, ''),
                  photo: uploadRes.data.photo,
                  server: uploadRes.data.server,
                  hash: uploadRes.data.hash,
                  access_token: groupToken,
                  v: VK_API_VERSION
                }
              });

              if (savedPhoto.data.response && savedPhoto.data.response[0]) {
                const photo = savedPhoto.data.response[0];
                params.attachments = `photo${photo.owner_id}_${photo.id}`;
              }
            }
          }
        } catch (uploadError) {
          console.error('Failed to upload image to VK, sending without it:', uploadError.message);
        }
      }

      const response = await axios.get('https://api.vk.com/method/wall.post', { params });

      if (response.data.error) {
        throw new Error(`VK Publish Error: ${response.data.error.error_msg}`);
      }

      console.log(`✅ Post ${post.id} published to VK. Post ID: ${response.data.response.post_id}`);
      return response.data.response.post_id;
    } catch (error) {
      console.error('❌ Failed to publish post to VK:', error.message);
      throw error;
    }
  }
}

module.exports = new VkService();
