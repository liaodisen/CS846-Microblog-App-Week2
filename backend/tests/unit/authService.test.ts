import { authService } from '../../src/services/authService';
import prisma from '../../src/config/db';
import bcrypt from 'bcryptjs';

jest.mock('../../src/config/db', () => ({
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
        password: 'password123',
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');
      (prisma.user.create as jest.Mock).mockResolvedValueOnce({
        id: '1',
        ...userData,
        password: 'hashedPassword',
      });

      const result = await authService.register(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
        password: 'password123',
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce({ id: '1' });

      await expect(authService.register(userData)).rejects.toThrow(
        'Email or username already exists'
      );
    });

    it('should throw error if password is too short', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
        password: 'short',
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(null);

      await expect(authService.register(userData)).rejects.toThrow(
        'Password must be at least 8 characters long'
      );
    });
  });

  describe('login', () => {
    it('should login a user with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
        password: 'hashedPassword',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await authService.login(loginData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(authService.login(loginData)).rejects.toThrow(
        'Invalid email or password'
      );
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        displayName: 'Test User',
        password: 'hashedPassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(user);

      const result = await authService.getUserById('1');

      expect(result).not.toHaveProperty('password');
      expect(result?.email).toBe(user.email);
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.getUserById('nonexistent');

      expect(result).toBeNull();
    });
  });
});
