'use client';

import React from 'react';
import { useAuthContext } from '@/app/context/AuthContext';

export default function SuspendedPage() {
    const { logout } = useAuthContext();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 text-center border border-red-100 dark:border-red-900/30">
                <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mb-6">
                    🚫
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Account Suspended
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Your tutoring account has been temporarily suspended.
                    <br />
                    Please contact support for more information.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={logout}
                        className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-colors"
                    >
                        Sign Out
                    </button>
                    <a
                        href="mailto:support@k12.com"
                        className="block text-sm text-[var(--color-primary)] hover:underline"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
