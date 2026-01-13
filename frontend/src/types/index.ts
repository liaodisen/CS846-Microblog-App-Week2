export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
