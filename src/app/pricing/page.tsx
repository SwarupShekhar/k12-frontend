'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/app/context/AuthContext';

export default function PricingPage() {
    const { user } = useAuthContext();
    return (
        <main className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-glass p-12 rounded-[2rem] border border-white/20 text-center shadow-xl">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[var(--color-primary)] flex items-center justify-center text-3xl mx-auto mb-6">
                    💎
                </div>
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
                    Pricing & Enrollment
                </h1>
                <p className="text-[var(--color-text-secondary)] mb-8">
                    We are updating our enrollment plans for the new term. Please check back soon or book a consultation for details.
                </p>

                <Link
                    href={user ? 'https://calendly.com/swarupshekhar-vaidikedu/30min' : '/signup?intent=assessment'}
                    className="block w-full py-3 rounded-full bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-all"
                    {...(user ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                    Book a free consultation
                </Link>
            </div>
        </main>
    );
}
