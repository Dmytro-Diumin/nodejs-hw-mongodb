import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import Session from '../models/session.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'No token provided'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of bearer type'));
  }

  try {
    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      return next(createHttpError(401, 'Invalid session'));
    }

    const user = await User.findById(session.userId);
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
