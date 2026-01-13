import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';
import { PostCard } from '../components/PostCard';
import styles from './Feed.module.css';
import { postService } from '../services/postService';
import { replyService } from '../services/replyService';
import { likeService } from '../services/likeService';
import { Avatar } from '../components/Avatar';
import { timeAgo } from '../utils/formatters';
import type { Post, Reply } from '../types';

export const FeedPage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [leftWidth, setLeftWidth] = useState(60); // percentage
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    loadFeed();
  }, [page]);

  useEffect(() => {
    if (selectedPostId) {
      loadReplies(selectedPostId);
    } else {
      setReplies([]);
    }
  }, [selectedPostId]);

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      const response = await postService.getFeed(page, 20);
      const feedData = response.data.data;
      if (feedData) {
        setPosts((prev) => (page === 1 ? feedData.data : [...prev, ...feedData.data]));
        setHasMore(page < feedData.totalPages);
      }
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReplies = async (postId: string) => {
    try {
      setIsLoadingReplies(true);
      const response = await replyService.getPostReplies(postId, 1, 50);
      const repliesData = response.data.data;
      if (repliesData) {
        setReplies(repliesData.data);
      }
    } catch (error) {
      console.error('Failed to load replies:', error);
      setReplies([]);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    try {
      const response = await postService.createPost({ content: postContent });
      const newPost = response.data.data;
      if (newPost) {
        setPosts((prev) => [newPost, ...prev]);
      }
      setPostContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (post?.liked) {
        await likeService.unlikePost(postId);
      } else {
        await likeService.likePost(postId);
      }

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                liked: !p.liked,
                likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1,
              }
            : p
        )
      );
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleReply = (postId: string) => {
    if (!user) {
      setReplyError('Please log in to reply');
      setSelectedPostId(null);
      setTimeout(() => setReplyError(''), 3000);
      return;
    }
    setSelectedPostId(postId);
    setReplyContent('');
    setReplyError('');
  };

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedPostId) return;
    if (!user) {
      setReplyError('Please log in to reply');
      return;
    }

    try {
      setIsReplyLoading(true);
      setReplyError('');
      await replyService.createReply({ content: replyContent, postId: selectedPostId });
      setReplyContent('');
      // Reload replies to show the new one
      await loadReplies(selectedPostId);
      // Update reply count in posts list
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPostId
            ? { ...p, replyCount: p.replyCount + 1 }
            : p
        )
      );
    } catch (error) {
      console.error('Failed to create reply:', error);
      setReplyError(error instanceof Error ? error.message : 'Failed to create reply');
    } finally {
      setIsReplyLoading(false);
    }
  };

  const handleCancelReply = () => {
    setSelectedPostId(null);
    setReplyContent('');
    setReplyError('');
  };

  const selectedPost = selectedPostId ? posts.find((p) => p.id === selectedPostId) : null;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.querySelector(`.${styles.feedContainer}`) as HTMLElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        
        // Constrain between 20% and 80%
        if (newLeftWidth >= 20 && newLeftWidth <= 80) {
          setLeftWidth(newLeftWidth);
        }
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Layout>
      <div className={styles.feedContainer}>
        <div className={styles.postsSection} style={{ width: `${leftWidth}%` }}>
          <div className={styles.posts}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onReply={handleReply}
              />
            ))}
          </div>

          {hasMore && (
            <button className={styles.loadMore} onClick={() => setPage((p) => p + 1)}>
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>

        <div className={styles.resizer} onMouseDown={handleMouseDown} />

        {user && (
          <div className={styles.composeArea} style={{ width: `${100 - leftWidth}%` }}>
            {selectedPostId && selectedPost ? (
              // Reply compose mode
              <>
                <div className={styles.replyHeader}>
                  <button
                    className={styles.backBtn}
                    onClick={handleCancelReply}
                  >
                    ← Back
                  </button>
                  <h2>Reply to {selectedPost.user.displayName}</h2>
                </div>

                <div className={styles.replyTarget}>
                  <div className={styles.replyTargetAvatar}>
                    <Avatar
                      username={selectedPost.user.username}
                      avatar={selectedPost.user.avatar}
                      displayName={selectedPost.user.displayName}
                      size="small"
                    />
                  </div>
                  <div className={styles.replyTargetContent}>
                    <div className={styles.replyTargetHeader}>
                      <strong>{selectedPost.user.displayName}</strong>
                      <span className={styles.replyTargetUsername}>@{selectedPost.user.username}</span>
                    </div>
                    <p className={styles.replyTargetText}>{selectedPost.content}</p>
                  </div>
                </div>

                {replyError && (
                  <div className={styles.errorMessage}>{replyError}</div>
                )}

                <form onSubmit={handleCreateReply}>
                  <div className={styles.userHeader}>
                    <div>{user.displayName}</div>
                    <div className={styles.username}>@{user.username}</div>
                  </div>
                  <textarea
                    className={styles.textarea}
                    placeholder="Post your reply!"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    maxLength={280}
                  />
                  <div className={styles.footer}>
                    <div className={styles.charCount}>
                      {replyContent.length}/280
                    </div>
                    <button
                      type="submit"
                      className={styles.postBtn}
                      disabled={!replyContent.trim() || isReplyLoading}
                    >
                      {isReplyLoading ? 'Replying...' : 'Reply'}
                    </button>
                  </div>
                </form>

                {/* Existing Replies */}
                <div className={styles.repliesSection}>
                  <h3 className={styles.repliesTitle}>
                    Replies ({replies.length})
                  </h3>
                  {isLoadingReplies ? (
                    <div className={styles.loadingReplies}>Loading replies...</div>
                  ) : replies.length === 0 ? (
                    <div className={styles.noReplies}>No replies yet. Be the first to reply!</div>
                  ) : (
                    <div className={styles.repliesList}>
                      {replies.map((reply) => (
                        <div key={reply.id} className={styles.replyItem}>
                          <div className={styles.replyAvatar}>
                            <Avatar
                              username={reply.user.username}
                              avatar={reply.user.avatar}
                              displayName={reply.user.displayName}
                              size="small"
                            />
                          </div>
                          <div className={styles.replyContent}>
                            <div className={styles.replyHeader}>
                              <strong>{reply.user.displayName}</strong>
                              <span className={styles.replyUsername}>@{reply.user.username}</span>
                              <span className={styles.replyTime}>
                                {timeAgo(reply.createdAt)}
                              </span>
                            </div>
                            <p className={styles.replyText}>{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // New post compose mode
              <form onSubmit={handleCreatePost}>
                <div className={styles.userHeader}>
                  <div>{user.displayName}</div>
                  <div className={styles.username}>@{user.username}</div>
                </div>
                <textarea
                  className={styles.textarea}
                  placeholder="What's happening!"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  maxLength={280}
                />
                <div className={styles.footer}>
                  <div className={styles.charCount}>
                    {postContent.length}/280
                  </div>
                  <button
                    type="submit"
                    className={styles.postBtn}
                    disabled={!postContent.trim() || isLoading}
                  >
                    Post
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};
