import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import Session from '../models/session.js';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { sendEmail } from '../utils/sendEmail.js';
import { EMAIL_VARS, ENV_VARS, TEMPLATES_DIR } from '../сontact/index.js';
import { env } from '../utils/env.js';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import path from 'path';
import crypto from 'crypto';

const createSession = () => {
  return {
    accessToken: crypto.randomBytes(20).toString('base64'),
    refreshToken: crypto.randomBytes(20).toString('base64'),
    accessTokenValidUntil: Date.now() + 1000 * 60 * 15,
    refreshTokenValidUntil: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
};

export const registerUserService = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return await User.create({
    ...userData,
    password: hashedPassword,
  });
};

export const loginUserService = async (userData) => {
  const user = await User.findOne({ email: userData.email });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(
    userData.password,
    user.password,
  );
  if (!isPasswordValid) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ userId: user._id });

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
};

export const logoutUserService = async ({ sessionId, sessionToken }) => {
  return await Session.deleteOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });
};

export const refreshSessionService = async ({ sessionId, sessionToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token is expired!');
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'Session not found');
  }

  await Session.deleteOne({ _id: sessionId, sessionToken });

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'send-reset-password-email.html',
  );

  try {
    const templateSource = (
      await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);

    const html = template({
      name: user.name,
      link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
      from: env(EMAIL_VARS.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.log('Failed to send email:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later',
    );
  }
};
