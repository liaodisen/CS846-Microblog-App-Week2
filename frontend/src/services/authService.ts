import client from './apiClient';
import type { User, UserUpdateRequest, ApiResponse } from '@microblog/shared';

export const authService = {
  register: (data: {
    email: string;
    username: string;
    displayName: string;
    password: string;
  }) => client.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),

  login: (email: string, password: string) =>
    client.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      email,
      password,
    }),

  getCurrentUser: () => client.get<ApiResponse<User>>('/auth/me'),
};

export const userService = {
  getProfile: (username: string) => client.get<ApiResponse<User>>(`/users/${username}`),

  updateProfile: (data: UserUpdateRequest) =>
    client.patch<ApiResponse<User>>('/users/profile', data),

  getAllUsers: () => client.get<ApiResponse<User[]>>('/users'),
};
