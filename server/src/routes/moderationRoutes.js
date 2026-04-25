const express = require('express');
const router = express.Router();
const moderationController = require('../controllers/moderationController');

router.get('/pending', moderationController.getPendingPosts);
router.post('/:id/approve', moderationController.approvePost);
router.post('/:id/reject', moderationController.rejectPost);

module.exports = router;
