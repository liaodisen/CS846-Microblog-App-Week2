import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '@microblog/shared';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  register: (data: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      const authData = response.data.data;
      setToken(authData?.token ?? null);
      setUser(authData?.user ?? null);
      if (authData?.token) {
        localStorage.setItem('token', authData.token);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      const authData = response.data.data;
      setToken(authData?.token ?? null);
      setUser(authData?.user ?? null);
      if (authData?.token) {
        localStorage.setItem('token', authData.token);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const checkAuth = useCallback(async () => {
    if (token) {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.data.data ?? null);
      } catch (error) {
        logout();
      }
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, register, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
