const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const send = async (email, subject, text) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject,
    text,
  });
};

module.exports = send;
