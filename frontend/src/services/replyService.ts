import client from './apiClient';
import type {
  Reply,
  ReplyCreateRequest,
  ReplyUpdateRequest,
  PaginatedResponse,
  ApiResponse,
} from '@microblog/shared';

export const replyService = {
  createReply: (data: ReplyCreateRequest) =>
    client.post<ApiResponse<Reply>>('/replies', data),

  getPostReplies: (postId: string, page: number = 1, limit: number = 20) =>
    client.get<ApiResponse<PaginatedResponse<Reply>>>(`/replies/post/${postId}`, {
      params: { page, limit },
    }),

  getReply: (replyId: string) => client.get<ApiResponse<Reply>>(`/replies/${replyId}`),

  updateReply: (replyId: string, data: ReplyUpdateRequest) =>
    client.patch<ApiResponse<Reply>>(`/replies/${replyId}`, data),

  deleteReply: (replyId: string) => client.delete(`/replies/${replyId}`),
};
