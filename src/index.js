'use strict';

const express = require('express');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

const { authRouter } = require('./routers/auth.router.js');

app.use(authRouter);

app.get('/', (req, res) => {
  res.send('index!');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server is runn');
});
