import logger from '../config/logger.js';
import prisma from '../config/db.js';

export class LikeService {
  async likePost(userId: string, postId: string): Promise<void> {
    // Verify post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new Error('Post not found');
    }

    // Check if already liked
    const existing = await prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existing) {
      logger.warn('Like already exists', { userId, postId });
      return;
    }

    await prisma.like.create({
      data: { userId, postId },
    });

    logger.info('Post liked', { postId, userId });
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    await prisma.like.deleteMany({
      where: { userId, postId },
    });

    logger.info('Post unliked', { postId, userId });
  }

  async likeReply(userId: string, replyId: string): Promise<void> {
    // Verify reply exists
    const reply = await prisma.reply.findUnique({ where: { id: replyId } });
    if (!reply) {
      throw new Error('Reply not found');
    }

    // Check if already liked
    const existing = await prisma.like.findFirst({
      where: { userId, replyId },
    });

    if (existing) {
      logger.warn('Like already exists', { userId, replyId });
      return;
    }

    await prisma.like.create({
      data: { userId, replyId },
    });

    logger.info('Reply liked', { replyId, userId });
  }

  async unlikeReply(userId: string, replyId: string): Promise<void> {
    await prisma.like.deleteMany({
      where: { userId, replyId },
    });

    logger.info('Reply unliked', { replyId, userId });
  }

  async isPostLiked(userId: string, postId: string): Promise<boolean> {
    const like = await prisma.like.findFirst({
      where: { userId, postId },
    });
    return !!like;
  }

  async isReplyLiked(userId: string, replyId: string): Promise<boolean> {
    const like = await prisma.like.findFirst({
      where: { userId, replyId },
    });
    return !!like;
  }
}

export const likeService = new LikeService();
