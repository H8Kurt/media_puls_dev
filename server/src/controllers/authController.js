const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

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
};
