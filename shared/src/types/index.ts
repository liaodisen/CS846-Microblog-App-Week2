// User types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string; // URL or identifier for avatar
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateRequest {
  email: string;
  username: string;
  displayName: string;
  password: string;
}

export interface UserUpdateRequest {
  displayName?: string;
  bio?: string;
  avatar?: string;
}

// Post types
export interface Post {
  id: string;
  content: string;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  replyCount: number;
  liked?: boolean;
}

export interface PostCreateRequest {
  content: string;
}

export interface PostUpdateRequest {
  content: string;
}

// Reply types
export interface Reply {
  id: string;
  content: string;
  postId: string;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  liked?: boolean;
}

export interface ReplyCreateRequest {
  content: string;
  postId: string;
}

export interface ReplyUpdateRequest {
  content: string;
}

// Like types
export interface Like {
  id: string;
  userId: string;
  postId?: string;
  replyId?: string;
  createdAt: Date;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Pagination types
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Constants
export const POST_MAX_LENGTH = 280;
export const REPLY_MAX_LENGTH = 280;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const PASSWORD_MIN_LENGTH = 8;
export const DISPLAY_NAME_MAX_LENGTH = 50;
export const BIO_MAX_LENGTH = 160;
