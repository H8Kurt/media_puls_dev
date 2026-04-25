const bcrypt = require('bcryptjs');
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

    return res.status(201).json({
      message: 'Регистрация успешна',
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
};
