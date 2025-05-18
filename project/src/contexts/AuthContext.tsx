import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { auth } from '../api';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('threadspire_token');
    if (token) {
      // Validate token and get user data
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await auth.login({ email, password });
      const token = response.data;
      localStorage.setItem('threadspire_token', token);
      
      // Get user data and set current user
      setCurrentUser({
        id: 'user-1', // This should come from the backend
        email,
        username: email.split('@')[0],
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await auth.register({ email, username, password });
      const token = response.data;
      localStorage.setItem('threadspire_token', token);
      
      setCurrentUser({
        id: 'user-1', // This should come from the backend
        email,
        username,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed. Please try again with a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('threadspire_token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};