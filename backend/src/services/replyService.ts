import logger from '../config/logger.js';
import prisma from '../config/db.js';
import type { Reply, ReplyCreateRequest, ReplyUpdateRequest, PaginatedResponse } from '@microblog/shared';

export class ReplyService {
  async createReply(userId: string, data: ReplyCreateRequest): Promise<Reply> {
    if (data.content.length === 0) {
      throw new Error('Reply content cannot be empty');
    }

    if (data.content.length > 280) {
      throw new Error('Reply content cannot exceed 280 characters');
    }

    // Verify post exists
    const post = await prisma.post.findUnique({ where: { id: data.postId } });
    if (!post) {
      throw new Error('Post not found');
    }

    const reply = await prisma.reply.create({
      data: {
        content: data.content,
        postId: data.postId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            bio: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    logger.info('Reply created', { replyId: reply.id, postId: data.postId, userId });

    return this.formatReply(reply);
  }

  async getReplyById(replyId: string, userId?: string): Promise<Reply | null> {
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            bio: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        likes: userId ? { where: { userId } } : false,
      },
    });

    if (!reply) {
      return null;
    }

    return this.formatReply(reply, userId);
  }

  async getPostReplies(
    postId: string,
    page: number = 1,
    limit: number = 20,
    userId?: string
  ): Promise<PaginatedResponse<Reply>> {
    const skip = (page - 1) * limit;

    const [replies, total] = await Promise.all([
      prisma.reply.findMany({
        where: { postId },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              displayName: true,
              bio: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
          likes: userId ? { where: { userId } } : false,
        },
      }),
      prisma.reply.count({ where: { postId } }),
    ]);

    const formattedReplies = replies.map((reply) => this.formatReply(reply, userId));

    return {
      data: formattedReplies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateReply(replyId: string, userId: string, data: ReplyUpdateRequest): Promise<Reply> {
    const reply = await prisma.reply.findUnique({ where: { id: replyId } });

    if (!reply) {
      throw new Error('Reply not found');
    }

    if (reply.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (data.content.length === 0) {
      throw new Error('Reply content cannot be empty');
    }

    if (data.content.length > 280) {
      throw new Error('Reply content cannot exceed 280 characters');
    }

    const updatedReply = await prisma.reply.update({
      where: { id: replyId },
      data: {
        content: data.content,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            bio: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    logger.info('Reply updated', { replyId, userId });

    return this.formatReply(updatedReply);
  }

  async deleteReply(replyId: string, userId: string): Promise<void> {
    const reply = await prisma.reply.findUnique({ where: { id: replyId } });

    if (!reply) {
      throw new Error('Reply not found');
    }

    if (reply.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await prisma.reply.delete({ where: { id: replyId } });

    logger.info('Reply deleted', { replyId, userId });
  }

  private formatReply(reply: any, userId?: string): Reply {
    return {
      id: reply.id,
      content: reply.content,
      postId: reply.postId,
      userId: reply.userId,
      user: reply.user,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
      likeCount: reply._count.likes,
      liked: userId && reply.likes && reply.likes.length > 0,
    };
  }
}

export const replyService = new ReplyService();
