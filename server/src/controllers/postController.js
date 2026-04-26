const { VkPost, VkGroupStats, PendingPost } = require('../models');
const { Op } = require('sequelize');

const getStats = async (req, res) => {
  try {
    // Получаем посты из БД
    const posts = await VkPost.findAll({
      order: [['date', 'DESC']],
      limit: 50
    });

    // Получаем статистику группы за последние 30 дней
    const groupStats = await VkGroupStats.findAll({
      where: {
        date: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      order: [['date', 'ASC']]
    });

    res.json({
      posts,
      groupStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Ошибка при получении статистики' });
  }
};

const getPosts = async (req, res) => {
  try {
    const publishedPosts = await VkPost.findAll();
    // В календарь и список постов попадают одобренные, запланированные и уже опубликованные нами посты
    const pendingPosts = await PendingPost.findAll({
      where: {
        status: { [Op.in]: ['approved', 'scheduled', 'published', 'error'] }
      }
    });

    // Приводим к единому формату для фронтенда
    const formattedPublished = publishedPosts.map(p => {
      const date = new Date(p.date * 1000);
      return {
        id: `pub_${p.id}`,
        title: p.text ? (p.text.substring(0, 50) + (p.text.length > 50 ? '...' : '')) : 'Без заголовка',
        content: p.text,
        publish_date: date.toLocaleDateString('en-CA'), // Формат YYYY-MM-DD без смещения часового пояса
        publish_time: date.toTimeString().split(' ')[0].substring(0, 5),
        status: 'published',
        channel: 'vk',
        views: p.views,
        likes: p.likes,
        comments: p.comments,
        reposts: p.reposts
      };
    });

    const formattedPending = pendingPosts.map(p => {
      const dateObj = p.scheduledAt ? new Date(p.scheduledAt) : new Date();
      return {
        id: `pend_${p.id}`,
        title: p.title || (p.content ? p.content.substring(0, 50) + '...' : 'Запланированный пост'),
        content: p.content,
        mediaUrl: p.mediaUrl,
        publish_date: dateObj.toLocaleDateString('en-CA'), // Формат YYYY-MM-DD
        publish_time: dateObj.toTimeString().split(' ')[0].substring(0, 5),
        status: p.status === 'pending' ? 'scheduled' : p.status,
        channel: p.platform || 'vk',
        category: p.category
      };
    });

    res.json([...formattedPending, ...formattedPublished]);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Ошибка при получении постов' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, scheduledAt, platform, category } = req.body;
    
    const post = await PendingPost.create({
      title,
      content,
      scheduledAt: new Date(scheduledAt),
      platform: platform || 'vk',
      category,
      status: 'scheduled', // Посты с сайта сразу запланированы
      userId: req.user?.id
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Ошибка при создании поста' });
  }
};

const getModerationPosts = async (req, res) => {
  try {
    const posts = await PendingPost.findAll({
      where: { status: 'pending' },
      order: [['createdAt', 'DESC']]
    });

    const formatted = posts.map(p => ({
      id: p.id,
      title: p.title || (p.content ? p.content.substring(0, 50) : (p.text ? p.text.substring(0, 50) : 'Предложенный пост')),
      content: p.content || p.text || '', // Проверяем оба поля
      author: p.authorName || 'Аноним',
      platform: p.platform || 'telegram',
      createdAt: p.createdAt,
      status: 'pending'
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching moderation posts:', error);
    res.status(500).json({ message: 'Ошибка при получении постов на модерацию' });
  }
};

const updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduledAt, title, content, category } = req.body;

    const post = await PendingPost.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });

    if (status) {
      // Если пост одобряется, он должен стать запланированным
      post.status = status === 'approved' ? 'scheduled' : status;
    }
    if (scheduledAt) {
      const date = new Date(scheduledAt);
      if (!isNaN(date.getTime())) {
        post.scheduledAt = date;
      }
    }
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (req.body.media) post.mediaUrl = Array.isArray(req.body.media) ? req.body.media[0] : req.body.media;
    
    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error updating post status:', error);
    res.status(500).json({ message: 'Ошибка при обновлении поста', details: error.message });
  }
};

module.exports = { getStats, getPosts, createPost, getModerationPosts, updatePostStatus };
