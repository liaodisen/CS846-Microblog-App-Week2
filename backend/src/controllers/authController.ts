import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { authService } from '../services/authService.js';
import logger from '../config/logger.js';
import type { UserCreateRequest, LoginRequest } from '@microblog/shared';

export class AuthController {
  async register(req: AuthRequest, res: Response) {
    try {
      const data = req.body as UserCreateRequest;

      // Validation
      if (!data.email || !data.username || !data.displayName || !data.password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      if (data.username.length < 3 || data.username.length > 30) {
        res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
        return;
      }

      if (data.displayName.length > 50) {
        res.status(400).json({ error: 'Display name cannot exceed 50 characters' });
        return;
      }

      const result = await authService.register(data);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      logger.error('Registration error', { error: (error as Error).message });
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const data = req.body as LoginRequest;

      if (!data.email || !data.password) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const result = await authService.login(data);
      res.json({ success: true, data: result });
    } catch (error) {
      logger.error('Login error', { error: (error as Error).message });
      res.status(401).json({ error: (error as Error).message });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await authService.getUserById(req.userId);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ success: true, data: user });
    } catch (error) {
      logger.error('Get current user error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const authController = new AuthController();
