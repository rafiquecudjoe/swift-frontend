'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { setTokens, removeTokens, getAccessToken } from '@/lib/auth';
import type { User, LoginCredentials, RegisterData } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getAccessToken();
        if (token) {
          const profile = await authAPI.getProfile();
          setUser(profile);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        removeTokens();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authAPI.login(credentials);
    setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
    router.push('/dashboard');
  };

  const register = async (data: RegisterData) => {
    const response = await authAPI.register(data);
    setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
    router.push('/dashboard');
  };

  const logout = () => {
    removeTokens();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
