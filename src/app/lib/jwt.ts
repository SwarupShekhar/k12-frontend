// src/lib/jwt.ts
import { jwtDecode } from 'jwt-decode';

export function decodeToken<T = any>(token: string | null) {
  if (!token) return null;
  try {
    return jwtDecode<T>(token);
  } catch {
    return null;
  }
}