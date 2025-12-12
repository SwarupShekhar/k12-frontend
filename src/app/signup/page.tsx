'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup, login, user, loading } = useAuthContext();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'parent',
  });
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'student') {
        router.push('/students/dashboard');
      } else if (user.role === 'tutor') {
        router.push('/tutor/dashboard');
      } else {
        router.push('/parent/dashboard');
      }
    }
  }, [user, loading, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    // Ensure role is only 'parent' or 'student'
    const validRole = form.role === 'parent' || form.role === 'student' ? form.role : 'parent';
    const signupPayload = { ...form, role: validRole };

    try {
      await signup(signupPayload);
      // Login without auto-redirect so we can route to onboarding
      await login(form.email, form.password, false);

      // Redirect explicitly based on role
      if (validRole === 'student') {
        router.push('/onboarding/student-welcome');
      } else {
        router.push('/onboarding'); // Parents go to onboarding welcome
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Signup failed. Please try again.');
    } finally {
      // If we redirected, we might be unmounted, but safe to setBusy false if error
      setBusy(false);
    }
  }

  // If redirected, show loading or nothing
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Animated Blobs Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/40 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-200/40 dark:bg-yellow-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-300/40 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-2xl p-8 space-y-8">

          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Join us to start your personalized learning journey.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-sm text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="sr-only">First Name</label>
                  <input
                    id="first-name"
                    name="first_name"
                    type="text"
                    required
                    placeholder="First Name"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:z-10 sm:text-sm bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all font-medium"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="sr-only">Last Name</label>
                  <input
                    id="last-name"
                    name="last_name"
                    type="text"
                    required
                    placeholder="Last Name"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:z-10 sm:text-sm bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:z-10 sm:text-sm bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all font-medium"
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:z-10 sm:text-sm bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all font-medium"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: 'parent' })}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${form.role === 'parent'
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-blue-500/20'
                      : 'bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-white/80 dark:hover:bg-white/10'}`}
                  >
                    Parent
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: 'student' })}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${form.role === 'student'
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-blue-500/20'
                      : 'bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-white/80 dark:hover:bg-white/10'}`}
                  >
                    Student
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={busy}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[var(--color-primary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {busy ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create account'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <a href="/login" className="font-bold text-[var(--color-primary)] hover:underline hover:text-blue-500 transition-colors">
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}