const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { upload, uploadFile } = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats/vk', postController.getStats);
router.get('/posts', postController.getPosts);
router.post('/posts', postController.createPost);
router.get('/moderation', postController.getModerationPosts);
router.patch('/posts/:id/status', postController.updatePostStatus);
router.post('/upload', upload.single('file'), uploadFile);


module.exports = router;
