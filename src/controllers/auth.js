import createHttpError from 'http-errors';
import {
  loginUserService,
  logoutUserService,
  refreshSessionService,
  registerUserService,
  requestResetToken,
} from '../services/auth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { env } from '../utils/env.js';

const setupSessionCookies = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expire: 7 * 24 * 60 * 60,
  });
};

export const registerUser = async (req, res) => {
  const user = await registerUserService(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: { user },
  });
};

export const loginUser = async (req, res) => {
  const tokens = await loginUserService(req.body);

  setupSessionCookies(res, tokens);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: tokens.accessToken },
  });
};

export const refreshSession = async (req, res) => {
  const session = await refreshSessionService({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSessionCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUser = async (req, res) => {
  await logoutUserService({
    sessionId: req.cookies.sessionId,
    sessionToken: req.cookies.sessionToken,
  });

  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');
  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    message: 'Reset password email was successfully sent',
    status: 200,
    data: {},
  });
};

export const resetPassword = async (userData) => {
  let entries;

  try {
    entries = jwt.verify(userData.token, env('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};

export const resetPasswordController = async (req, res) => {
  try {
    await resetPassword(req.body);

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to reset password.',
      error: error.message,
    });
  }
};
