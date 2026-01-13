import logger from '../config/logger.js';
import prisma from '../config/db.js';
import type { User, UserUpdateRequest } from '@microblog/shared';

export class UserService {
  async getUserById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async updateUser(userId: string, data: UserUpdateRequest): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    logger.info('User updated', { userId });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users as User[];
  }
}

export const userService = new UserService();
