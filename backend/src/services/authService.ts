import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import prisma from '../config/db.js';
import type { User, UserCreateRequest, LoginRequest } from '@microblog/shared';

export class AuthService {
  async register(data: UserCreateRequest): Promise<{ user: User; token: string }> {
    const { email, username, displayName, password } = data;

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error('Email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName,
        password: hashedPassword,
      },
    });

    logger.info('User registered', { userId: user.id, email });

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default-secret', {
      expiresIn: process.env.JWT_EXPIRATION || '7d',
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

  async login(data: LoginRequest): Promise<{ user: User; token: string }> {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn('Login attempt with invalid password', { email });
      throw new Error('Invalid email or password');
    }

    logger.info('User logged in', { userId: user.id, email });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default-secret', {
      expiresIn: process.env.JWT_EXPIRATION || '7d',
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

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
}

export const authService = new AuthService();
