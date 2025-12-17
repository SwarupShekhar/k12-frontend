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

  // init: read token and user from localStorage
  useEffect(() => {
    try {
      const t = localStorage.getItem('K12_TOKEN');
      const savedUserStr = localStorage.getItem('K12_USER');

      if (t) {
        setToken(t);
        let restoredUser = null;

        // 1. Try to restore full user object first (has names)
        if (savedUserStr) {
          try {
            restoredUser = JSON.parse(savedUserStr);
            // Basic validation
            if (restoredUser && !restoredUser.email) restoredUser = null;
          } catch (e) {
            console.error('Failed to parse saved user', e);
          }
        }

        // 2. Fallback to token (has only basic info)
        if (!restoredUser) {
          const payload: any = decodeToken(t);
          if (payload) {
            restoredUser = {
              id: payload.sub ?? payload.id,
              email: payload.email,
              role: payload.role,
              ...payload,
            };
          }
        }

        if (restoredUser) {
          console.log('[Auth] Restored user:', restoredUser);
          setUser(restoredUser);
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
          const savedUser = localStorage.getItem('K12_USER');
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              const payload: any = decodeToken(t);
              setUser(payload ? { id: payload.sub ?? payload.id, email: payload.email, role: payload.role, ...payload } : null);
            }
          } else {
            const payload: any = decodeToken(t);
            setUser(payload ? { id: payload.sub ?? payload.id, email: payload.email, role: payload.role, ...payload } : null);
          }
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

        // 2. Decode and store user (Prefer data.user from response if available)
        let userData: User | null = null;

        if (data.user) {
          userData = data.user;
          // Ensure ID is set if mixed formats
          if (userData && !userData.id && userData._id) userData.id = userData._id;
        } else {
          const payload: any = decodeToken(data.token);
          userData = payload ? {
            id: payload.sub ?? payload.id,
            email: payload.email,
            role: payload.role,
            ...payload
          } : null;
        }

        if (userData) {
          localStorage.setItem('K12_USER', JSON.stringify(userData));
          setUser(userData);
          console.log('[Auth] Login successful. User:', userData);
        }

        // 3. Redirect immediately based on role
        // Add a small artificial delay so the user sees the loader animation (REQ: 2-3 seconds window)
        await new Promise(resolve => setTimeout(resolve, 2000));

        setLoading(false); // Unblock the UI so ProtectedClient allows rendering

        if (shouldRedirect && userData) {
          if (userData.role === 'parent') {
            router.push('/parent/dashboard');
          } else if (userData.role === 'student') {
            router.push('/students/dashboard');
          } else if (userData.role === 'tutor') {
            router.push('/tutor/dashboard');
          } else if (userData.role === 'admin') {
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
    localStorage.removeItem('K12_USER'); // Remove saved user data
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