// src/app/components/navbar.tsx
'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

import { useAuthContext } from '@/app/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuthContext();

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/40 dark:bg-black/40 backdrop-blur-md border-b border-white/10 dark:border-white/5 transition-all-fast">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
            K12
          </div>
          <div className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
            K12 Tutoring
          </div>
        </Link>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link href="/subjects" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors text-sm lg:text-base">
            Subjects
          </Link>
          <Link href="/experts" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors text-sm lg:text-base">
            Experts
          </Link>
          <Link href="/about" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors text-sm lg:text-base">
            About
          </Link>
          <Link href="/pricing" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors text-sm lg:text-base">
            Pricing
          </Link>

          {/* Show Dashboard link if logged in */}
          {user && (
            <Link
              href={user.role === 'student' ? '/students/dashboard' : '/parent/dashboard'}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors text-sm lg:text-base"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right: Auth & Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href={user ? 'https://calendly.com/swarupshekhar-vaidikedu/30min' : '/signup?intent=assessment'}
            className="hidden lg:block px-5 py-2 rounded-full bg-[var(--color-primary)] text-white font-bold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
            {...(user ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            Book Free Demo Session
          </Link>

          {user ? (
            <button
              onClick={logout}
              className="hidden sm:block px-4 py-2 text-sm rounded-full border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-surface)] transition-all"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden sm:block px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-all"
            >
              Login
            </Link>
          )}

          <div className="scale-75 origin-right">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}