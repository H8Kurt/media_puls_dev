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
        console.warn('VK credentials missing');
        return;
      }

      const cleanGroupId = this.groupId.toString().replace(/[^0-9]/g, '');

      const response = await axios.get('https://api.vk.com/method/wall.get', {
        params: {
          owner_id: `-${cleanGroupId}`,
          count: 10,
          access_token: this.accessToken,
          v: VK_API_VERSION,
        },
      });

      if (response.data.error) {
        console.error('VK API Error (wall.get):', response.data.error.error_msg);
        return;
      }

      const posts = response.data.response.items;
      if (!posts) return;

      for (const post of posts) {
        await VkPost.upsert({
          vkId: post.id,
          text: post.text,
          date: new Date(post.date * 1000),
          likes: post.likes?.count || 0,
          comments: post.comments?.count || 0,
          reposts: post.reposts?.count || 0,
          views: post.views?.count || 0
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

      const cleanGroupId = this.groupId.toString().replace(/[^0-9]/g, '');
      
      const response = await axios.get('https://api.vk.com/method/stats.get', {
        params: {
          group_id: cleanGroupId,
          interval: 'day',
          intervals_count: 30,
          access_token: this.accessToken,
          v: VK_API_VERSION,
        },
      });

      if (response.data.error) {
        console.error('VK API Error (stats.get):', response.data.error.error_msg);
        return;
      }

      const statsArray = response.data.response;
      if (!Array.isArray(statsArray)) return;

      for (const dayStat of statsArray) {
        const timestamp = dayStat.day || dayStat.period_from;
        if (!timestamp) continue;

        const statDate = new Date(timestamp * 1000).toISOString().split('T')[0];

        await VkGroupStats.upsert({
          date: statDate,
          reach: dayStat.reach?.reach || 0,
          reachSubscribers: dayStat.reach?.reach_subscribers || 0,
          views: dayStat.activity?.views || 0,
          visitors: dayStat.visitors?.visitors || 0,
          newSubscribers: dayStat.activity?.subscribed || dayStat.subscribed || 0,
        });
      }

      console.log(`✅ SUCCESS: Updated VK group stats`);
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
      const mediaUrl = post.mediaUrl || post.media;
      if (mediaUrl) {
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
            // Убираем начальный слэш если он есть
            const relativePath = mediaUrl.startsWith('/') ? mediaUrl.substring(1) : mediaUrl;
            const filePath = path.join(__dirname, '../../', relativePath);
            
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
            } else {
              console.error('File not found for VK upload:', filePath);
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
