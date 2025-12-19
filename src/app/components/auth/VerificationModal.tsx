'use client';

import { useState } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';

export default function VerificationModal() {
    const { verificationModalOpen, setVerificationModalOpen, resendVerification } = useAuthContext();
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleResend = async () => {
        setBusy(true);
        setMessage(null);
        setError(null);
        try {
            await resendVerification();
            setMessage('Verification email sent! Please check your inbox.');
        } catch (err: any) {
            setError(err?.message || 'Failed to resend email.');
        } finally {
            setBusy(false);
        }
    };

    const closeModal = () => {
        setVerificationModalOpen(false);
        setMessage(null);
        setError(null);
    };

    if (!verificationModalOpen) return null;

    return (
        <div className="relative z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Background backdrop */}
            <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={closeModal}
            ></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                    <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <div>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                                <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                                <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">
                                    Email Verification Required
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-300">
                                        You need to verify your email address to access this feature. Please check your inbox for a verification link.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md text-sm text-center">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleResend}
                                disabled={busy}
                            >
                                {busy ? 'Sending...' : 'Resend Email'}
                            </button>
                            <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 sm:col-start-1 sm:mt-0"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
