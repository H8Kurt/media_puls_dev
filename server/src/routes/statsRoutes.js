const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// В будущем здесь можно добавить middleware для проверки авторизации
router.get('/vk', statsController.getVkStats);

module.exports = router;
