import client from './apiClient';
import type { ApiResponse } from '@microblog/shared';

export const likeService = {
  likePost: (postId: string) =>
    client.post<ApiResponse<null>>(`/likes/posts/${postId}`),

  unlikePost: (postId: string) =>
    client.delete<ApiResponse<null>>(`/likes/posts/${postId}`),

  likeReply: (replyId: string) =>
    client.post<ApiResponse<null>>(`/likes/replies/${replyId}`),

  unlikeReply: (replyId: string) =>
    client.delete<ApiResponse<null>>(`/likes/replies/${replyId}`),
};
