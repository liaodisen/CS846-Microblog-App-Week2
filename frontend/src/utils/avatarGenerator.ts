// Generate a default cartoon avatar for users
export const getDefaultAvatar = (username: string): string => {
  // Using DiceBear Avatars API for cartoon avatars
  // Available styles: adventurer, avataaars, big-ears, etc.
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    username
  )}&scale=80`;
};

export const getAvatarUrl = (avatar: string | undefined, username: string): string => {
  if (!avatar || avatar === 'default') {
    return getDefaultAvatar(username);
  }
  return avatar;
};
