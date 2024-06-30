import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/user.js';
import Session from '../models/session.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      return next(createHttpError(401, 'Invalid session'));
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }
    next(createHttpError(401, 'Invalid token'));
  }
};

export default authenticate;
