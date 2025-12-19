'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmail } from '@/app/lib/auth';
import Link from 'next/link';

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        let mounted = true;

        async function verify() {
            if (!token) {
                if (mounted) {
                    setStatus('error');
                    setErrorMsg('No verification token found.');
                }
                return;
            }

            try {
                await verifyEmail(token);
                if (mounted) {
                    setStatus('success');
                    // Redirect after a short delay
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                }
            } catch (err: any) {
                if (mounted) {
                    setStatus('error');
                    setErrorMsg(err.message || 'Verification failed. The link may be invalid or expired.');
                }
            }
        }

        verify();

        return () => { mounted = false; };
    }, [token, router]);

    return (
        <div className="bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-2xl p-8 text-center space-y-6 w-full max-w-md">
            {status === 'verifying' && (
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verifying your email...</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your account.</p>
                </div>
            )}

            {status === 'success' && (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email verified</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">You can continue.</p>
                    <Link href="/login" className="text-[var(--color-primary)] font-bold hover:underline">
                        Go to Login now &rarr;
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h2>
                    <p className="text-red-600 dark:text-red-400 mb-6">{errorMsg === 'No verification token found.' ? 'No verification token found.' : 'Link expired or invalid'}</p>
                    <Link href="/login" className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:opacity-90">
                        Back to Login
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/40 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-200/40 dark:bg-yellow-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 w-full flex justify-center">
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <VerifyContent />
                </Suspense>
            </div>
        </main>
    );
}
