import React from 'react';
import styles from './PostCard.module.css';
import { Avatar } from './Avatar';
import { Post } from '../types';
import { timeAgo } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onReply?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onReply }) => {
  const navigate = useNavigate();

  return (
    <article className={styles.postCard}>
      <div className={styles.avatarContainer}>
        <Avatar
          username={post.user.username}
          avatar={post.user.avatar}
          displayName={post.user.displayName}
          size="small"
        />
      </div>
      
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <div onClick={() => navigate(`/profile/${post.user.username}`)} className={styles.userInfo}>
            <div className={styles.displayName}>{post.user.displayName}</div>
            <div className={styles.username}>@{post.user.username}</div>
          </div>
          <div className={styles.timestamp}>{timeAgo(post.createdAt)}</div>
        </div>

        <div className={styles.content}>{post.content}</div>

        <div className={styles.footer}>
          <button className={styles.action} onClick={() => onReply?.(post.id)}>
            <span>💬</span> {post.replyCount}
          </button>
          <button
            className={`${styles.action} ${post.liked ? styles.liked : ''}`}
            onClick={() => onLike?.(post.id)}
          >
            <span>{post.liked ? '❤️' : '🤍'}</span> {post.likeCount}
          </button>
        </div>
      </div>
    </article>
  );
};
