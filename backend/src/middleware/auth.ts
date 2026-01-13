import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.warn('Missing authorization token');
    res.status(401).json({ error: 'Missing authorization token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    logger.warn('Invalid authorization token', { error: (error as Error).message });
    res.status(401).json({ error: 'Invalid authorization token' });
  }
};
