import { likeService } from '../../src/services/likeService';
import prisma from '../../src/config/db';

jest.mock('../../src/config/db', () => ({
  post: {
    findUnique: jest.fn(),
  },
  like: {
    create: jest.fn(),
    deleteMany: jest.fn(),
    findFirst: jest.fn(),
  },
}));

describe('LikeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('likePost', () => {
    it('should like a post', async () => {
      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce({ id: '1' });
      (prisma.like.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (prisma.like.create as jest.Mock).mockResolvedValueOnce({});

      await expect(
        likeService.likePost('user1', 'post1')
      ).resolves.not.toThrow();

      expect(prisma.like.create).toHaveBeenCalled();
    });

    it('should not like if post does not exist', async () => {
      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(likeService.likePost('user1', 'post1')).rejects.toThrow(
        'Post not found'
      );
    });

    it('should not duplicate like', async () => {
      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce({ id: '1' });
      (prisma.like.findFirst as jest.Mock).mockResolvedValueOnce({ id: '1' });

      await expect(
        likeService.likePost('user1', 'post1')
      ).resolves.not.toThrow();

      expect(prisma.like.create).not.toHaveBeenCalled();
    });
  });

  describe('unlikePost', () => {
    it('should unlike a post', async () => {
      (prisma.like.deleteMany as jest.Mock).mockResolvedValueOnce({});

      await expect(
        likeService.unlikePost('user1', 'post1')
      ).resolves.not.toThrow();

      expect(prisma.like.deleteMany).toHaveBeenCalled();
    });
  });

  describe('isPostLiked', () => {
    it('should return true if post is liked', async () => {
      (prisma.like.findFirst as jest.Mock).mockResolvedValueOnce({ id: '1' });

      const result = await likeService.isPostLiked('user1', 'post1');

      expect(result).toBe(true);
    });

    it('should return false if post is not liked', async () => {
      (prisma.like.findFirst as jest.Mock).mockResolvedValueOnce(null);

      const result = await likeService.isPostLiked('user1', 'post1');

      expect(result).toBe(false);
    });
  });
});
