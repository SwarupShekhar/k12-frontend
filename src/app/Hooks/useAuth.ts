// src/hooks/useAuth.ts
import { useAuthContext } from '@/app/context/AuthContext';

export default function useAuth() {
  return useAuthContext();
}