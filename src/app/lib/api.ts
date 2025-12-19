// src/app/lib/api.ts
import axios, { AxiosError } from 'axios';

const API_URL =
  (process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://k-12-backend.onrender.com').replace(/\/$/, '');

console.log('[API] Connected to:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

/**
 * Request interceptor -> attach token from localStorage
 */
api.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('K12_TOKEN');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
});

/**
 * Response interceptor -> handle 401 centrally
 */
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    // If unauthorized, remove token and redirect to login
    const status = err?.response?.status;
    const data: any = err?.response?.data;

    // Check for specific 403 regarding verification
    // Match leniently: "verify" and "email"
    const msg = data?.message?.toLowerCase() || '';
    if (status === 403 && (msg.includes('verify') && msg.includes('email'))) {
      // Emit event for AuthContext to pick up
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('k12:auth:verification_needed'));
      }
      // Return a non-resolving promise to halt downstream error handling (prevents generic toasts)
      return new Promise(() => { });
    }

    // Password Reset Required
    if (status === 403 && msg.includes('password') && (msg.includes('reset') || msg.includes('change')) && msg.includes('required')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/change-password';
      }
      return new Promise(() => { });
    }



    if (status === 401) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('K12_TOKEN');
          localStorage.removeItem('K12_USER');
          // optional: show message here (toast)
          window.location.href = '/login';
        }
      } catch { }
      return new Promise(() => { }); // Also halt for 401 redirect
    }
    return Promise.reject(err);
  }
);

export default api;