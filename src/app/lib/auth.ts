// src/lib/auth.ts
import api from '@/app/lib/api';

export type SignupPayload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'parent' | 'student'; // Tutor accounts are only created by admin, not via public signup
};

export type LoginResp = {
  message?: string;
  token: string;
  user?: any;
};

export async function signup(payload: SignupPayload) {
  try {
    const res = await api.post('/auth/signup', payload);
    return res.data;
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw new Error('Unable to connect to server. Please check if the API server is running.');
    }
    // Re-throw with better message if available
    const message = error?.response?.data?.message || error?.message || 'Signup failed';
    throw new Error(message);
  }
}

export async function login(email: string, password: string): Promise<LoginResp> {
  try {
    const res = await api.post<LoginResp>('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('K12_TOKEN', res.data.token);
    }
    return res.data;
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw new Error('Unable to connect to server. Please check if the API server is running.');
    }
    // Re-throw with better message if available
    const message = error?.response?.data?.message || error?.message || 'Login failed';
    throw new Error(message);
  }
}

export function logout() {
  localStorage.removeItem('K12_TOKEN');
  // redirect client-side
  if (typeof window !== 'undefined') window.location.href = '/login';
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('K12_TOKEN');
}