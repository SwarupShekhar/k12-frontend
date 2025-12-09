// src/app/onboarding/page.tsx
'use client';
import ProtectedClient from '@/app/components/ProtectedClient';
import useAuth from '@/app/Hooks/useAuth';

export default function OnboardingPage() {
  const { user } = useAuth();

  return (
    <ProtectedClient roles={['parent']}>
      <div className="min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.first_name || user?.email}!</h1>
        <p className="mb-4">Let's get you set up. Complete your onboarding here.</p>
        <div className="max-w-2xl">
          <p className="text-slate-600">Onboarding form content goes here...</p>
        </div>
      </div>
    </ProtectedClient>
  );
}

