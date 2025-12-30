'use strict';

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('email не авторизовано');
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).send('email не авторизовано');
  }

  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = userData;

    if (!userData) {
      return res.status(401).send('email не авторизовано');
    }

    next();
  } catch (error) {
    return res.status(401).send('недійсний токен');
  }
};

module.exports = authMiddleware;
