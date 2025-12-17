'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuthContext } from '@/app/context/AuthContext';

export default function HomeHero() {
    const router = useRouter();
    const { user } = useAuthContext();

    const handleBookClick = () => {
        if (user) {
            window.open('https://calendly.com/swarupshekhar-vaidikedu/30min', '_blank');
        } else {
            router.push('/signup?intent=assessment');
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
        <section className="relative w-full py-20 lg:py-32 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--color-primary)] opacity-10 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--color-secondary)] opacity-10 blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="max-w-3xl">
                    {/* Badge (Optional context) */}
                    <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-primary)] mb-6 shadow-sm">
                        Trusted by parents across Grades K-12
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-text-primary)] mb-6 leading-[1.1]">
                        Personalized Vaidik Tutoring That Builds Confidence and Real Results
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl leading-relaxed">
                        One-on-one online tutoring built around your child’s goals, curriculum, and learning style.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleGetStartedClick}
                            className="px-8 py-4 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg hover:shadow-xl shadow-blue-500/20"
                        >
                            Get started
                        </button>
                        <button
                            onClick={handleBookClick}
                            className="px-8 py-4 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                        >
                            Book a free academic consultation
                        </button>
                    </div>

                    <p className="mt-6 text-sm text-[var(--color-text-secondary)] opacity-80">
                        Trusted by parents across Grades K-12 for Math, Science, and critical thinking skills.
                    </p>
                </div>
            </div>
        </section>
    );
}
