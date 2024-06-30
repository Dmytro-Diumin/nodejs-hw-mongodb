import createHttpError from 'http-errors';
import {
  loginUserService,
  logoutUserService,
  refreshSessionService,
  registerUserService,
} from '../services/auth.js';

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
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await loginUserService({
      email,
      password,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    if (error.status === 401) {
      next(createHttpError(401, 'Invalid email or password'));
    } else {
      next(createHttpError(500, error.message));
    }
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
