import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const socketAuthMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    logger.error(`Socket authentication error: ${error.message}`);
    next(new Error('Authentication error'));
  }
};
