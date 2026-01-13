import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';
import { Avatar } from '../components/Avatar';
import { PostCard } from '../components/PostCard';
import styles from './Profile.module.css';
import { userService } from '../services/authService';
import { postService } from '../services/postService';
import { likeService } from '../services/likeService';
import type { User, Post } from '../types';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileRes = await userService.getProfile(username!);
      const profileData = profileRes.data.data;
      if (profileData) {
        setProfile(profileData);
        setBio(profileData.bio || '');

        const postsRes = await postService.getUserPosts(profileData.id);
        const postsData = postsRes.data.data;
        if (postsData) {
          setPosts(postsData.data);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBio = async () => {
    if (!currentUser || currentUser.username !== username) return;

    try {
      const updatedUser = await userService.updateProfile({ bio });
      const userData = updatedUser.data.data;
      if (userData) {
        setProfile(userData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update bio:', error);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!currentUser || currentUser.username !== username) {
      throw new Error('Unauthorized');
    }

    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/users/upload-avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      if (data.data) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    } finally {
      setIsUploadingAvatar(false);
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
    navigate(`/post/${postId}`);
  };

  if (isLoading) return <Layout><div className={styles.loading}>Loading...</div></Layout>;
  if (!profile) return <Layout><div className={styles.error}>Profile not found</div></Layout>;

  const isOwnProfile = currentUser?.username === username;

  return (
    <Layout>
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <Avatar
            username={profile.username}
            avatar={profile.avatar}
            displayName={profile.displayName}
            isOwnProfile={isOwnProfile}
            size="large"
            onUpload={isOwnProfile ? handleAvatarUpload : undefined}
          />
          <div className={styles.profileInfo}>
            <h1>{profile.displayName}</h1>
            <p className={styles.username}>@{profile.username}</p>
            {profile.bio && <p className={styles.bio}>{profile.bio}</p>}

            {isOwnProfile && (
              <button
                className={styles.editBtn}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>

        {isEditing && isOwnProfile && (
          <div className={styles.editForm}>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              maxLength={160}
            />
            <div className={styles.editFooter}>
              <span className={styles.charCount}>{bio.length}/160</span>
              <button onClick={handleSaveBio} className={styles.saveBtn}>
                Save
              </button>
            </div>
          </div>
        )}

        <div className={styles.posts}>
          <h2>Posts</h2>
          {posts.length === 0 ? (
            <div className={styles.emptyState}>
              {profile.displayName} hasn't posted yet
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onReply={handleReply}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};
