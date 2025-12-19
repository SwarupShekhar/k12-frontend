'use client';

import { useAuthContext } from '@/app/context/AuthContext';
import { useState } from 'react';
import Loader from '@/app/components/Loader';

export default function VerificationBanner() {
    const { user, resendVerification, loading } = useAuthContext();
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);

    // Don't show if loading, user not logged in, or verified
    // Note: user.email_verified might be undefined for old usage, assume false if explicitly false
    // Logic: if (user && user.email_verified === false)
    if (loading || !user || user.email_verified !== false) return null;

    const handleResend = async () => {
        setBusy(true);
        try {
            await resendVerification();
            setSent(true);
            setTimeout(() => setSent(false), 5000); // Reset after 5s
        } catch (e) {
            console.error(e);
            // Optional: show error locally?
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="bg-amber-100 dark:bg-amber-900/40 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-200 dark:bg-amber-800/50 rounded-full shrink-0">
                        <svg className="w-5 h-5 text-amber-900 dark:text-amber-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        Please verify your email to start sessions.
                    </p>
                </div>

                {sent ? (
                    <span className="text-sm font-bold text-green-700 dark:text-green-400 animate-fade-in px-4 py-2">
                        Email Sent! Check your inbox.
                    </span>
                ) : (
                    <button
                        onClick={handleResend}
                        disabled={busy}
                        className="whitespace-nowrap px-4 py-2 bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {busy ? (
                            <span className="flex items-center gap-2">
                                <Loader />
                                <span>Sending...</span>
                            </span>
                        ) : 'Resend Verification'}
                    </button>
                )}
            </div>
        </div>
    );
}
