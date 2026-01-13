import logger from '../config/logger.js';
import prisma from '../config/db.js';
import type { Post, PostCreateRequest, PostUpdateRequest, PaginatedResponse } from '@microblog/shared';

export class PostService {
  async createPost(userId: string, data: PostCreateRequest): Promise<Post> {
    if (data.content.length === 0) {
      throw new Error('Post content cannot be empty');
    }

    if (data.content.length > 280) {
      throw new Error('Post content cannot exceed 280 characters');
    }

    const post = await prisma.post.create({
      data: {
        content: data.content,
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
            replies: true,
          },
        },
      },
    });

    logger.info('Post created', { postId: post.id, userId });

    return this.formatPost(post);
  }

  async getPostById(postId: string, userId?: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
            replies: true,
          },
        },
        likes: userId ? { where: { userId } } : false,
      },
    });

    if (!post) {
      return null;
    }

    return this.formatPost(post, userId);
  }

  async getFeed(page: number = 1, limit: number = 20, userId?: string): Promise<PaginatedResponse<Post>> {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
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
              replies: true,
            },
          },
          likes: userId ? { where: { userId } } : false,
        },
      }),
      prisma.post.count(),
    ]);

    const formattedPosts = posts.map((post) => this.formatPost(post, userId));

    return {
      data: formattedPosts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserPosts(
    userIdParam: string,
    page: number = 1,
    limit: number = 20,
    userId?: string
  ): Promise<PaginatedResponse<Post>> {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { userId: userIdParam },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
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
              replies: true,
            },
          },
          likes: userId ? { where: { userId } } : false,
        },
      }),
      prisma.post.count({ where: { userId: userIdParam } }),
    ]);

    const formattedPosts = posts.map((post) => this.formatPost(post, userId));

    return {
      data: formattedPosts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updatePost(postId: string, userId: string, data: PostUpdateRequest): Promise<Post> {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (data.content.length === 0) {
      throw new Error('Post content cannot be empty');
    }

    if (data.content.length > 280) {
      throw new Error('Post content cannot exceed 280 characters');
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
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
            replies: true,
          },
        },
      },
    });

    logger.info('Post updated', { postId, userId });

    return this.formatPost(updatedPost);
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.userId !== userId) {
      throw new Error('Unauthorized');
    }

    await prisma.post.delete({ where: { id: postId } });

    logger.info('Post deleted', { postId, userId });
  }

  private formatPost(
    post: any,
    userId?: string
  ): Post {
    return {
      id: post.id,
      content: post.content,
      userId: post.userId,
      user: post.user,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likeCount: post._count.likes,
      replyCount: post._count.replies,
      liked: userId && post.likes && post.likes.length > 0,
    };
  }
}

export const postService = new PostService();
