'use strict';

const { User } = require('../models/user.js');
const emailService = require('../services/email.service.js');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .send('Будь ласка, надішліть email та password через POST запит');
    }

    if (password.length < 10) {
      return res.status(400).send('Пароль має бути не менше 10 символів');
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).send('Користувач з такою поштою вже є');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const activationToken = uuidv4();

    const newUser = await User.create({
      email,
      password: hashedPassword,
      activationToken,
    });

    await emailService.activateSendEmail(email, activationToken);

    res.status(201).send({
      message: 'Користувача створено. Перевірте пошту для активації',
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const activation = async (req, res) => {
  try {
    const { activationToken } = req.params;

    const user = await User.findOne({ where: { activationToken } });

    if (!user) {
      return res.status(404).send('Користувача не знайдено');
    }

    user.activationToken = null;
    await user.save();

    res.send({
      message: 'Акаунт успішно активовано!',
      email: user.email,
    });
  } catch (error) {
    res.status(500).send({ error: 'Внутрішня помилка сервера' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send('Невірна пошта');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send('Невірний пароль');
    }

    if (user.activationToken !== null) {
      return res.status(403).send('акаунт ще не активовано');
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '30m' },
    );

    res.send({
      message: 'з поверненням!',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).send({ error: 'Внутрішня помилка сервера' });
  }
};

module.exports = {
  register,
  activation,
  login,
};
