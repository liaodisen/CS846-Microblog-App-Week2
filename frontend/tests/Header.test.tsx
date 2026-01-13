import { render, screen } from '@testing-library/react';
import { Header } from '../../src/components/Header';
import { BrowserRouter } from 'react-router-dom';
import * as useAuthModule from '../../src/hooks/useAuth';

jest.mock('../../src/hooks/useAuth');

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show login and register buttons when not authenticated', () => {
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      logout: jest.fn(),
    });

    renderWithRouter(<Header />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('should show user info and logout button when authenticated', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
      bio: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (useAuthModule.useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      token: 'test-token',
      logout: jest.fn(),
    });

    renderWithRouter(<Header />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should render Microblog logo', () => {
    (useAuthModule.useAuth as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      logout: jest.fn(),
    });

    renderWithRouter(<Header />);

    expect(screen.getByText('Microblog')).toBeInTheDocument();
  });
});
