'use client';

import Link from 'next/link';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';

export default function OnboardingPage() {
  const { user } = useAuthContext();

  return (
    <ProtectedClient roles={['parent']}>
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 p-6">

        {/* Animated Blobs Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl text-center">

          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[2.5rem] shadow-2xl p-10 md:p-14 mb-8">

            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-primary)] text-white text-4xl mb-8 shadow-lg shadow-blue-500/30">
              👋
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome, {user?.first_name || 'Parent'}!
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-lg mx-auto">
              We're excited to partner with you in your child's education. Let's start by setting up a profile for your student.
            </p>

            <div className="space-y-4">
              <Link
                href="/onboarding/add-student"
                className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 text-lg font-bold text-white bg-[var(--color-primary)] rounded-full hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Add Your First Child →
              </Link>

              <div className="pt-4">
                <Link href="/parent/dashboard" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                  Skip for now
                </Link>
              </div>
            </div>

          </div>

          <p className="text-sm text-gray-500 dark:text-gray-500">
            Step 1 of 2
          </p>

        </div>
      </div>
    </ProtectedClient>
  );
}
