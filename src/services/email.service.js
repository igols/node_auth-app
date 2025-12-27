const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const send = (email, subject, html) => {
  return transporter.sendMail({
    to: email,
    subject,
    html,
  });
};
const activateSendEmail = (email, token) => {
  const subject = 'Activate';
  const href = `${process.env.CLIENT_HOST}/activation/${token}`;
  const html = `<h1>activate account</h1>
  <a href="${href}">${href}</a>`;

  return send(email, subject, html);
};

module.exports = {
  activateSendEmail,
  send,
};
