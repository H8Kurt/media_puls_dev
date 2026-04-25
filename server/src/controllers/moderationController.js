const { PendingPost } = require('../models');

exports.getPendingPosts = async (req, res) => {
  try {
    const posts = await PendingPost.findAll({
      where: { status: 'pending' },
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении постов', error: error.message });
  }
};

exports.approvePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PendingPost.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });

    post.status = 'approved';
    await post.save();

    // В будущем здесь будет вызов vkService.publishPost(post)
    res.json({ message: 'Пост одобрен', post });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при одобрении', error: error.message });
  }
};

exports.rejectPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PendingPost.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Пост не найден' });

    post.status = 'rejected';
    await post.save();
    res.json({ message: 'Пост отклонен' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при отклонении', error: error.message });
  }
};
