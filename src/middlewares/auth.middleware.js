'use strict';

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader) {
    return res.status(401).send('email не авторизовано');
  }

  const [, token] = authHeader.split(' ');

  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).send('ytlsqcybq njrty');
  }
};

module.exports = authMiddleware;
