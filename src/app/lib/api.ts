// src/app/lib/api.ts
import axios, { AxiosError } from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://k-12-backend.onrender.com';

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
    if (status === 401 || status === 403) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('K12_TOKEN');
          // optional: show message here (toast)
          window.location.href = '/login';
        }
      } catch { }
    }
    return Promise.reject(err);
  }
);

export default api;