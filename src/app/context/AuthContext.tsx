// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { decodeToken } from '@/app/lib/jwt';
import * as authLib from '@/app/lib/auth';
import { useRouter } from 'next/navigation';

type User = {
  id?: string;
  email?: string;
  role?: string;
  [k: string]: any;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, shouldRedirect?: boolean) => Promise<void>;
  signup: (payload: any) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Use router for redirects

  // init: read token from localStorage
  useEffect(() => {
    try {
      const t = localStorage.getItem('K12_TOKEN');
      if (t) {
        setToken(t);
        const payload: any = decodeToken(t);
        if (payload) {
          setUser({
            id: payload.sub ?? payload.id,
            email: payload.email,
            role: payload.role,
            ...payload,
          });
        }
      }
    } catch (e) {
      console.error('auth init err', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // listen for token changes in other tabs (optional)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'K12_TOKEN') {
        const t = e.newValue;
        setToken(t);
        if (t) {
          const payload: any = decodeToken(t);
          setUser(payload ? { id: payload.sub ?? payload.id, email: payload.email, role: payload.role, ...payload } : null);
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  async function login(email: string, password: string, shouldRedirect = true) {
    setLoading(true);
    try {
      const data = await authLib.login(email, password);

      if (data?.token) {
        // 1. Store token
        localStorage.setItem('K12_TOKEN', data.token);
        setToken(data.token);

        // 2. Decode and store user
        const payload: any = decodeToken(data.token);
        const userData = payload ? {
          id: payload.sub ?? payload.id,
          email: payload.email,
          role: payload.role,
          ...payload
        } : null;

        setUser(userData);

        // 3. Redirect immediately based on role
        console.log('[Auth] Login successful. User:', userData);
        setLoading(false); // <--- CRITICAL FIX: Ensure loading is disabled before/during navigation

        if (shouldRedirect) {
          if (userData?.role === 'parent') {
            router.push('/parent/dashboard');
          } else if (userData?.role === 'student') {
            router.push('/student/dashboard'); // Fixed path
          } else if (userData?.role === 'tutor') {
            router.push('/tutor/dashboard');
          } else if (userData?.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/parent/dashboard');
          }
        }
      } else {
        // No token? unexpected
        setLoading(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false); // Only stop loading on error
      throw error;
    }
  }

  async function signup(payload: any) {
    setLoading(true);
    try {
      await authLib.signup(payload);
      // Removed automatic redirect to login
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    authLib.logout();
    localStorage.removeItem('K12_TOKEN'); // Ensure token is removed from storage
    setToken(null);
    setUser(null);
    router.push('/login'); // Optional: Redirect to login on logout
  }

  const value: AuthContextValue = { user, token, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}