'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { useAuthContext } from '@/app/context/AuthContext';

export default function HomeCTA() {
    const router = useRouter();
    const { user } = useAuthContext();

    const handleBookClick = () => {
        if (user) {
            window.open('https://calendly.com/swarupshekhar-vaidikedu/30min', '_blank');
        } else {
            router.push('/signup?intent=advisor');
        }
    };

    const handleGetStartedClick = () => {
        if (user) {
            router.push(user.role === 'student' ? '/student/dashboard' : '/parent/dashboard');
        } else {
            router.push('/signup');
        }
    };

    return (
        <section className="w-full py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="relative rounded-[2.5rem] bg-[var(--color-primary)] overflow-hidden px-6 py-16 md:px-16 md:py-20 text-center shadow-2xl">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Give your child the right academic support
                        </h2>
                        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                            Personalized tutoring. Verified tutors. Measurable improvement.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleGetStartedClick}
                                className="px-8 py-4 rounded-full bg-white text-[var(--color-primary)] font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
                            >
                                Get started
                            </button>
                            <button
                                onClick={handleBookClick}
                                className="px-8 py-4 rounded-full bg-transparent border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all"
                            >
                                Talk to an academic advisor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
