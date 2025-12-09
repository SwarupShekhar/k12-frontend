'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/app/Hooks/useAuth'; // adjust path if your hook lives elsewhere

type Props = {
  children: ReactNode;
  roles?: string[]; // allowed roles, e.g. ['parent','student']
};

/**
 * Protected client wrapper for pages that require auth.
 * - If auth is still loading: show nothing (or a simple loader).
 * - If not logged in: redirect to /login (after render via useEffect).
 * - If role mismatch: redirect to /403 or / (choose whichever you prefer).
 *
 * Important: router.replace / router.push must be called in useEffect,
 * otherwise React throws "Cannot update a component while rendering a different component".
 */
export default function ProtectedClient({ children, roles = [] }: Props) {
  const router = useRouter();
  const { user, loading } = useAuth(); // user may be null if not logged in

  // if we're still checking auth, don't attempt redirects yet
  useEffect(() => {
    if (loading) return;

    // not logged in -> redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // role check if roles specified
    if (roles.length > 0 && (!user.role || !roles.includes(user.role))) {
      // redirect to unauthorized page or dashboard based on role? 
      // User said "If user is authenticated BUT wrong role → redirect". 
      // Usually to a "not authorized" page or home. 
      // I'll stick to replacing '/unauthorized' with a push to '/unauthorized' or '/' 
      // but usually if they are logged in but wrong role, maybe redirect to their dashboard?
      // But for now, I will use '/unauthorized' as placeholder or maybe just '/'?
      // The prompt didn't specify destination for wrong role, just "redirect".
      // Previous code had '/unauthorized'.
      router.push('/unauthorized');
    }
    // only run when loading/user/roles change
  }, [loading, user, roles, router]);

  // While loading, show nothing or a spinner to avoid flicker
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading…</div>
      </div>
    );
  }

  // If not logged in (and we already attempted redirect in useEffect),
  // return null to avoid rendering protected children on the first render.
  if (!user) return null;

  // If roles are specified and user doesn't match, don't render children.
  if (roles.length > 0 && (!user.role || !roles.includes(user.role))) return null;

  // All good: render children
  return <>{children}</>;
}