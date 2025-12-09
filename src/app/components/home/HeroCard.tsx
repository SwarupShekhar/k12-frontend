'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import GetStartedButton from './GetStartedButton';
import BookConsultationButton from './BookConsultationButton';

export default function HeroCard() {
    const router = useRouter();
    const { user } = useAuthContext();

    const handleBookClick = () => {
        if (user) {
            window.open('https://calendly.com/swarupshekhar-vaidikedu/30min', '_blank');
        } else {
            router.push('/signup?intent=consultation'); // prompt said /signup or /onboarding, keeping consistent with previous
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
        <section className="w-full py-8 md:py-12 px-4 flex justify-center">
            {/* Card Container */}
            <div className="relative w-full max-w-[95%] h-auto min-h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20">

                {/* Animated Background Layer */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    {/* Blob 1: Primary Blueish */}
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[var(--color-primary)] opacity-20 rounded-full blur-[80px] animate-blob mix-blend-multiply dark:mix-blend-screen" />

                    {/* Blob 2: Accent Yellowish */}
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--color-secondary)] opacity-20 rounded-full blur-[80px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />

                    {/* Blob 3: Center Light */}
                    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-300 dark:bg-blue-900 opacity-20 rounded-full blur-[80px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen" />
                </div>

                {/* Content Layer */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full px-6 md:px-12 py-12 md:py-16 max-w-6xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/80 dark:bg-black/60 border border-white/30 text-sm font-bold text-gray-900 dark:text-white mb-6 shadow-sm backdrop-blur-md">
                        Trusted by parents across Grades K-12
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--color-text-primary)] mb-6 leading-[1.15]">
                        Personalized K-12 Tutoring That Builds Confidence and Real Results
                    </h1>

                    {/* Subtext */}
                    <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 max-w-3xl leading-relaxed">
                        One-on-one online tutoring built around your child’s goals, curriculum, and learning style.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 mb-8 justify-center w-full items-center">
                        <GetStartedButton onClick={handleGetStartedClick} />
                        <BookConsultationButton onClick={handleBookClick} />
                    </div>

                    {/* Trust Text */}
                    <p className="text-sm font-medium text-[var(--color-text-secondary)] opacity-80">
                        Trusted by parents across Grades K-12 for Math, Science, and critical thinking skills.
                    </p>
                </div>
            </div>
        </section>
    );
}
