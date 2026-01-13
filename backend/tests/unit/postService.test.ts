import { postService } from '../../src/services/postService';
import prisma from '../../src/config/db';

jest.mock('../../src/config/db', () => ({
  post: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('PostService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const postData = { content: 'Test post' };
      const mockPost = {
        id: '1',
        content: 'Test post',
        userId: 'user1',
        user: {
          id: 'user1',
          email: 'test@example.com',
          username: 'testuser',
          displayName: 'Test User',
          bio: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        _count: { likes: 0, replies: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.post.create as jest.Mock).mockResolvedValueOnce(mockPost);

      const result = await postService.createPost('user1', postData);

      expect(result).toHaveProperty('id');
      expect(result.content).toBe('Test post');
      expect(result.userId).toBe('user1');
    });

    it('should throw error if content is empty', async () => {
      const postData = { content: '' };

      await expect(postService.createPost('user1', postData)).rejects.toThrow(
        'Post content cannot be empty'
      );
    });

    it('should throw error if content exceeds 280 characters', async () => {
      const postData = { content: 'a'.repeat(281) };

      await expect(postService.createPost('user1', postData)).rejects.toThrow(
        'Post content cannot exceed 280 characters'
      );
    });
  });

  describe('getPostById', () => {
    it('should return a post by ID', async () => {
      const mockPost = {
        id: '1',
        content: 'Test post',
        userId: 'user1',
        user: {
          id: 'user1',
          email: 'test@example.com',
          username: 'testuser',
          displayName: 'Test User',
          bio: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        _count: { likes: 5, replies: 2 },
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(mockPost);

      const result = await postService.getPostById('1');

      expect(result).toHaveProperty('id', '1');
      expect(result?.likeCount).toBe(5);
      expect(result?.replyCount).toBe(2);
    });

    it('should return null if post not found', async () => {
      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const result = await postService.getPostById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('deletePost', () => {
    it('should delete a post by owner', async () => {
      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '1',
        userId: 'user1',
      });

      (prisma.post.delete as jest.Mock).mockResolvedValueOnce({ id: '1' });

      await expect(postService.deletePost('1', 'user1')).resolves.not.toThrow();
      expect(prisma.post.delete).toHaveBeenCalled();
    });

    it('should throw error if not post owner', async () => {
      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '1',
        userId: 'user1',
      });

      await expect(postService.deletePost('1', 'user2')).rejects.toThrow(
        'Unauthorized'
      );
    });
  });
});
