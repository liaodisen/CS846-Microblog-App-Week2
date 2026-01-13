import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { likeService } from '../services/likeService.js';
import logger from '../config/logger.js';

export class LikeController {
  async likePost(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { postId } = req.params;
      await likeService.likePost(req.userId, postId);
      res.status(201).json({ success: true, message: 'Post liked' });
    } catch (error) {
      if ((error as Error).message === 'Post not found') {
        res.status(404).json({ error: (error as Error).message });
      } else {
        logger.error('Like post error', { error: (error as Error).message });
        res.status(400).json({ error: (error as Error).message });
      }
    }
  }

  async unlikePost(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { postId } = req.params;
      await likeService.unlikePost(req.userId, postId);
      res.json({ success: true, message: 'Post unliked' });
    } catch (error) {
      logger.error('Unlike post error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async likeReply(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { replyId } = req.params;
      await likeService.likeReply(req.userId, replyId);
      res.status(201).json({ success: true, message: 'Reply liked' });
    } catch (error) {
      if ((error as Error).message === 'Reply not found') {
        res.status(404).json({ error: (error as Error).message });
      } else {
        logger.error('Like reply error', { error: (error as Error).message });
        res.status(400).json({ error: (error as Error).message });
      }
    }
  }

  async unlikeReply(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { replyId } = req.params;
      await likeService.unlikeReply(req.userId, replyId);
      res.json({ success: true, message: 'Reply unliked' });
    } catch (error) {
      logger.error('Unlike reply error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export const likeController = new LikeController();
