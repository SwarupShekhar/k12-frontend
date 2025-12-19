// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { decodeToken } from '@/app/lib/jwt';
import * as authLib from '@/app/lib/auth';
import { useRouter, usePathname } from 'next/navigation';

type User = {
  id?: string;
  email?: string;
  role?: string;
  email_verified?: boolean;
  force_password_change?: boolean;
  status?: string;
  [k: string]: any;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, shouldRedirect?: boolean) => Promise<void>;
  signup: (payload: any) => Promise<void>;
  logout: () => void;
  resendVerification: () => Promise<any>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  verificationModalOpen: boolean;
  setVerificationModalOpen: (open: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Use router for redirects
  const pathname = usePathname();

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

  // Suspended Route Guard
  if (!loading && user?.status === 'suspended') {
    if (pathname !== '/suspended') {
      router.push('/suspended');
    }
  }
}, [user, loading, pathname, router]);

// Force Password Change Route Guard
useEffect(() => {
  if (!loading && user?.force_password_change) {
    if (pathname !== '/change-password') {
      router.push('/change-password');
    }
  }
}, [user, loading, pathname, router]);

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
        // Check for password change requirement first
        if (userData.force_password_change) {
          router.push('/change-password');
          return;
        }

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

async function resendVerification() {
  try {
    await authLib.resendVerification();
    // You might want to return a success message or handle it in the UI
    return true;
  } catch (error) {
    console.error("Resend verification failed:", error);
    throw error;
  }
}

async function changePassword(current: string, newPass: string) {
  try {
    await authLib.changePassword({ currentPassword: current, newPassword: newPass });
    // Update user state locally to remove flag? 
    // Usually backend returns updated user/token.
    // For now, let's assume we need to manually update local state or re-fetch.
    // The simplest is to logout or assume backend handles generic 200.
    // If backend updates token, we should handle it.
    // But typically we just update the specific flag if we can.
    if (user) {
      const updated = { ...user, force_password_change: false };
      setUser(updated);
      localStorage.setItem('K12_USER', JSON.stringify(updated));
    }
  } catch (error) {
    console.error("Change password failed:", error);
    throw error;
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

// Verification Modal State
const [verificationModalOpen, setVerificationModalOpen] = useState(false);

useEffect(() => {
  const handleVerificationNeeded = () => {
    setVerificationModalOpen(true);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('k12:auth:verification_needed', handleVerificationNeeded);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('k12:auth:verification_needed', handleVerificationNeeded);
    }
  };
}, []);

const value: AuthContextValue = {
  user,
  token,
  loading,
  login,
  signup,
  logout,
  resendVerification,
  changePassword,
  verificationModalOpen,
  setVerificationModalOpen
};

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}