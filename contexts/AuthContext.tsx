'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth state
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAuthState(parsed);
      } catch (error) {
        console.error('Error parsing stored auth:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    const newAuthState = {
      user,
      isAuthenticated: true
    };
    setAuthState(newAuthState);
    localStorage.setItem('auth', JSON.stringify(newAuthState));
  };

  const logout = () => {
    const newAuthState = {
      user: null,
      isAuthenticated: false
    };
    setAuthState(newAuthState);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};