import React, { useState } from 'react';
import styles from './Avatar.module.css';
import { getAvatarUrl } from '../utils/avatarGenerator';

interface AvatarProps {
  username: string;
  avatar?: string;
  displayName?: string;
  onUpload?: (file: File) => Promise<void>;
  isOwnProfile?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Avatar: React.FC<AvatarProps> = ({
  username,
  avatar,
  displayName,
  onUpload,
  isOwnProfile = false,
  size = 'medium',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const avatarUrl = getAvatarUrl(avatar, username);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      if (onUpload) {
        await onUpload(file);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      <img
        src={avatarUrl}
        alt={displayName || username}
        className={styles.image}
        title={isOwnProfile ? 'Click to upload avatar' : ''}
      />
      {isOwnProfile && (
        <>
          <button
            className={styles.uploadButton}
            onClick={handleClick}
            disabled={isLoading}
            title="Upload avatar"
          >
            {isLoading ? '...' : '+'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={isLoading}
          />
        </>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
