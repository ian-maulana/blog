import nodemailer from 'nodemailer';
import logger from '../utils/logger';

async function sendEmail(options: {
  email: string;
  subject: string;
  message: string;
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);
  logger.info(info.messageId);
}

export default sendEmail;
