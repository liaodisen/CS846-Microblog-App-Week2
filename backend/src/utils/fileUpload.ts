import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'avatars');

// Ensure upload directory exists
export const ensureUploadDir = async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
  }
};

export const saveAvatarFile = async (buffer: Buffer, filename: string): Promise<string> => {
  await ensureUploadDir();
  
  const ext = path.extname(filename);
  const uniqueName = `${crypto.randomBytes(8).toString('hex')}${ext}`;
  const filepath = path.join(UPLOAD_DIR, uniqueName);
  
  await fs.writeFile(filepath, buffer);
  
  // Return relative URL path
  return `/uploads/avatars/${uniqueName}`;
};

export const deleteAvatarFile = async (avatarPath: string) => {
  if (!avatarPath || avatarPath.startsWith('http') || avatarPath === 'default') {
    return; // Don't delete remote URLs or default avatars
  }
  
  try {
    const filepath = path.join(process.cwd(), avatarPath);
    await fs.unlink(filepath);
  } catch (error) {
    console.error('Failed to delete avatar file:', error);
  }
};
