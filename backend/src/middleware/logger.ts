import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
};

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Request Error', {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: err.stack,
  });
  next(err);
};
