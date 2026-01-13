import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { replyService } from '../services/replyService.js';
import logger from '../config/logger.js';
import type { ReplyCreateRequest, ReplyUpdateRequest } from '@microblog/shared';

export class ReplyController {
  async createReply(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const data = req.body as ReplyCreateRequest;

      if (!data.content || !data.postId) {
        res.status(400).json({ error: 'Content and postId are required' });
        return;
      }

      const reply = await replyService.createReply(req.userId, data);
      res.status(201).json({ success: true, data: reply });
    } catch (error) {
      logger.error('Create reply error', { error: (error as Error).message });
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getPostReplies(req: AuthRequest, res: Response) {
    try {
      const { postId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (page < 1) {
        res.status(400).json({ error: 'Page must be at least 1' });
        return;
      }

      if (limit < 1 || limit > 100) {
        res.status(400).json({ error: 'Limit must be between 1 and 100' });
        return;
      }

      const replies = await replyService.getPostReplies(postId, page, limit, req.userId);
      res.json({ success: true, data: replies });
    } catch (error) {
      logger.error('Get post replies error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getReply(req: AuthRequest, res: Response) {
    try {
      const { replyId } = req.params;
      const reply = await replyService.getReplyById(replyId, req.userId);

      if (!reply) {
        res.status(404).json({ error: 'Reply not found' });
        return;
      }

      res.json({ success: true, data: reply });
    } catch (error) {
      logger.error('Get reply error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateReply(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { replyId } = req.params;
      const data = req.body as ReplyUpdateRequest;

      if (!data.content) {
        res.status(400).json({ error: 'Content is required' });
        return;
      }

      const reply = await replyService.updateReply(replyId, req.userId, data);
      res.json({ success: true, data: reply });
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        res.status(403).json({ error: (error as Error).message });
      } else if ((error as Error).message === 'Reply not found') {
        res.status(404).json({ error: (error as Error).message });
      } else {
        logger.error('Update reply error', { error: (error as Error).message });
        res.status(400).json({ error: (error as Error).message });
      }
    }
  }

  async deleteReply(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { replyId } = req.params;
      await replyService.deleteReply(replyId, req.userId);
      res.json({ success: true, message: 'Reply deleted' });
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        res.status(403).json({ error: (error as Error).message });
      } else if ((error as Error).message === 'Reply not found') {
        res.status(404).json({ error: (error as Error).message });
      } else {
        logger.error('Delete reply error', { error: (error as Error).message });
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }
}

export const replyController = new ReplyController();
