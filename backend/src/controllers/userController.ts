import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { userService } from '../services/userService.js';
import logger from '../config/logger.js';
import { saveAvatarFile, deleteAvatarFile } from '../utils/fileUpload.js';
import type { UserUpdateRequest } from '@microblog/shared';

export class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const { username } = req.params;

      const user = await userService.getUserByUsername(username);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ success: true, data: user });
    } catch (error) {
      logger.error('Get profile error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const data = req.body as UserUpdateRequest;

      if (data.displayName && data.displayName.length > 50) {
        res.status(400).json({ error: 'Display name cannot exceed 50 characters' });
        return;
      }

      if (data.bio && data.bio.length > 160) {
        res.status(400).json({ error: 'Bio cannot exceed 160 characters' });
        return;
      }

      const user = await userService.updateUser(req.userId, data);
      res.json({ success: true, data: user });
    } catch (error) {
      logger.error('Update profile error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async uploadAvatar(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No file provided' });
        return;
      }

      // Save the file
      const avatarPath = await saveAvatarFile(req.file.buffer, req.file.originalname);

      // Get current user to delete old avatar if needed
      const currentUser = await userService.getUserById(req.userId);
      if (currentUser?.avatar && !currentUser.avatar.startsWith('http')) {
        await deleteAvatarFile(currentUser.avatar);
      }

      // Update user with new avatar path
      const updatedUser = await userService.updateUser(req.userId, { avatar: avatarPath });

      res.json({ success: true, data: updatedUser });
    } catch (error) {
      logger.error('Upload avatar error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      logger.error('Get all users error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const userController = new UserController();
