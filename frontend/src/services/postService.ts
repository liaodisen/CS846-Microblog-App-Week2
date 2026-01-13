import client from './apiClient';
import type {
  Post,
  PostCreateRequest,
  PostUpdateRequest,
  PaginatedResponse,
  ApiResponse,
} from '@microblog/shared';

export const postService = {
  createPost: (data: PostCreateRequest) =>
    client.post<ApiResponse<Post>>('/posts', data),

  getFeed: (page: number = 1, limit: number = 20) =>
    client.get<ApiResponse<PaginatedResponse<Post>>>('/posts/feed', {
      params: { page, limit },
    }),

  getUserPosts: (userId: string, page: number = 1, limit: number = 20) =>
    client.get<ApiResponse<PaginatedResponse<Post>>>(`/posts/user/${userId}`, {
      params: { page, limit },
    }),

  getPost: (postId: string) => client.get<ApiResponse<Post>>(`/posts/${postId}`),

  updatePost: (postId: string, data: PostUpdateRequest) =>
    client.patch<ApiResponse<Post>>(`/posts/${postId}`, data),

  deletePost: (postId: string) => client.delete(`/posts/${postId}`),
};
