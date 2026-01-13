import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostCard } from '../../src/components/PostCard';
import { BrowserRouter } from 'react-router-dom';
import type { Post } from '../../src/types';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockPost: Post = {
  id: '1',
  content: 'Test post content',
  userId: 'user1',
  user: {
    id: 'user1',
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'Test User',
    bio: 'Test bio',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  likeCount: 5,
  replyCount: 2,
  liked: false,
};

describe('PostCard Component', () => {
  it('should render post content', () => {
    renderWithRouter(<PostCard post={mockPost} />);

    expect(screen.getByText('Test post content')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  it('should display like and reply counts', () => {
    renderWithRouter(<PostCard post={mockPost} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should call onLike when like button is clicked', () => {
    const mockOnLike = jest.fn();
    renderWithRouter(<PostCard post={mockPost} onLike={mockOnLike} />);

    const likeButton = screen.getByText(/❤️|🤍/).parentElement;
    if (likeButton) {
      fireEvent.click(likeButton);
    }

    expect(mockOnLike).toHaveBeenCalledWith('1');
  });

  it('should call onReply when reply button is clicked', () => {
    const mockOnReply = jest.fn();
    renderWithRouter(<PostCard post={mockPost} onReply={mockOnReply} />);

    const replyButton = screen.getByText('💬').parentElement;
    if (replyButton) {
      fireEvent.click(replyButton);
    }

    expect(mockOnReply).toHaveBeenCalledWith('1');
  });

  it('should show liked heart when post is liked', () => {
    const likedPost = { ...mockPost, liked: true };
    renderWithRouter(<PostCard post={likedPost} />);

    expect(screen.getByText('❤️')).toBeInTheDocument();
  });
});
