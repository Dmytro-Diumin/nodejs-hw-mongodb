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
import { ENV_VARS } from '../сontact/index.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await registerUserService({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    if (error.status === 409) {
      next(createHttpError(409, 'Email in use'));
    } else {
      next(createHttpError(500, error.message));
    }
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const tokens = await loginUserService(req.body);
    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshSessionService(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(createHttpError(401, error.message));
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw createHttpError(401, 'No refresh token provided');
    }

    await logoutUserService(refreshToken);

    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(createHttpError(500, error.message));
  }
};

export const requestResetEmailController = async (req, res) => {
  try {
    await requestResetToken(req.body.email);

    res.json({
      message: 'Reset password email was successfully sent',
      status: 200,
      data: {},
    });
  } catch (error) {
    console.error('Error requesting reset email:', error);
    res.status(500).json({
      message: 'Failed to send reset password email',
      status: 500,
      data: {},
    });
  }
};

export const resetPassword = async (userData) => {
  let entries;

  try {
    entries = jwt.verify(userData.token, env(ENV_VARS.JWT_SECRET));
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
  await resetPassword(req.body);

  res.status(200).json({
    status: res.status,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
