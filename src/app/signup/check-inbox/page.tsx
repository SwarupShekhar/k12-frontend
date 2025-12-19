'use client';

import Link from 'next/link';

export default function CheckInboxPage() {
    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            {/* Animated Blobs Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/40 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-200/40 dark:bg-yellow-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-300/40 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-2xl p-8 text-center space-y-6">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                        <svg className="h-10 w-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Check your inbox
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        We've sent a verification link to your email address. Please check your inbox (and spam folder) to activate your account.
                    </p>

                    <div className="pt-6">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3 text-base font-bold text-white shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
                        >
                            Back to Login
                        </Link>
                    </div>

                </div>
            </div>
        </main>
    );
}
