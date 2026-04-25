const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const vkLogin = async (req, res) => {
  try {
    const { code, device_id } = req.body;

    if (!code || !device_id) {
      return res.status(400).json({ message: 'Code and device_id are required' });
    }

    // 1. Обмениваем code на access_token согласно документации, которую ты прислал
    const vkResponse = await axios.post('https://id.vk.ru/oauth2/auth', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        device_id: device_id,
        client_id: process.env.VK_APP_ID,
        state: 'static_state_for_now_32_chars_min_12345', // В идеале генерировать динамически
        redirect_uri: 'https://localhost/ru'
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, user_id, refresh_token } = vkResponse.data;

    // 2. Находим или создаем пользователя
    let user = await User.findOne({ where: { email: `vk_${user_id}@vk.com` } });

    if (!user) {
      user = await User.create({
        name: `VK User ${user_id}`,
        email: `vk_${user_id}@vk.com`,
        password: await bcrypt.hash(Math.random().toString(36), 10),
      });
    }

    // 3. Выдаем наш внутренний JWT
    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      // Можно также сохранить refresh_token в базу, если нужно обновлять доступ к VK API позже
    });
  } catch (error) {
    console.error('VK Auth Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Ошибка при проверке авторизации VK', 
      details: error.response?.data || error.message 
    });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: 'Поля email, password и name обязательны',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Пароль должен быть не короче 6 символов',
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: 'Пользователь с таким email уже существует',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Регистрация успешна',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Внутренняя ошибка сервера',
      details: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email и пароль обязательны',
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        message: 'Неверный email или пароль',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Неверный email или пароль',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Вход выполнен успешно',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Внутренняя ошибка сервера',
      details: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  vkLogin,
};
