import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { postService } from '../services/postService.js';
import logger from '../config/logger.js';
import type { PostCreateRequest, PostUpdateRequest } from '@microblog/shared';

export class PostController {
  async createPost(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const data = req.body as PostCreateRequest;

      if (!data.content) {
        res.status(400).json({ error: 'Content is required' });
        return;
      }

      const post = await postService.createPost(req.userId, data);
      res.status(201).json({ success: true, data: post });
    } catch (error) {
      logger.error('Create post error', { error: (error as Error).message });
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getFeed(req: AuthRequest, res: Response) {
    try {
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

      const feed = await postService.getFeed(page, limit, req.userId);
      res.json({ success: true, data: feed });
    } catch (error) {
      logger.error('Get feed error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getUserPosts(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
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

      const posts = await postService.getUserPosts(userId, page, limit, req.userId);
      res.json({ success: true, data: posts });
    } catch (error) {
      logger.error('Get user posts error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getPost(req: AuthRequest, res: Response) {
    try {
      const { postId } = req.params;
      const post = await postService.getPostById(postId, req.userId);

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      res.json({ success: true, data: post });
    } catch (error) {
      logger.error('Get post error', { error: (error as Error).message });
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updatePost(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { postId } = req.params;
      const data = req.body as PostUpdateRequest;

      if (!data.content) {
        res.status(400).json({ error: 'Content is required' });
        return;
      }

      const post = await postService.updatePost(postId, req.userId, data);
      res.json({ success: true, data: post });
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        res.status(403).json({ error: (error as Error).message });
      } else if ((error as Error).message === 'Post not found') {
        res.status(404).json({ error: (error as Error).message });
      } else {
        logger.error('Update post error', { error: (error as Error).message });
        res.status(400).json({ error: (error as Error).message });
      }
    }
  }

  async deletePost(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { postId } = req.params;
      await postService.deletePost(postId, req.userId);
      res.json({ success: true, message: 'Post deleted' });
    } catch (error) {
      if ((error as Error).message === 'Unauthorized') {
        res.status(403).json({ error: (error as Error).message });
      } else if ((error as Error).message === 'Post not found') {
        res.status(404).json({ error: (error as Error).message });
      } else {
        logger.error('Delete post error', { error: (error as Error).message });
        res.status(500).json({ error: (error as Error).message });
      }
    }
  }
}

export const postController = new PostController();
