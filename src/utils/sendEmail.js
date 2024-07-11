import nodemailer from 'nodemailer';
import { env } from './env.js';
import { EMAIL_VARS } from '../сontact/index.js';

const transporter = nodemailer.createTransport({
  host: env(EMAIL_VARS.SMTP_HOST),
  port: Number(env(EMAIL_VARS.SMTP_PORT)),
  auth: {
    user: env(EMAIL_VARS.SMTP_USER),
    pass: env(EMAIL_VARS.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  console.log('Sending email with options:', options);
  const mailOptions = {
    ...options,
    text: options.html.replace(/<[^>]*>/g, ''),
  };
  return await transporter.sendMail(mailOptions);
};
