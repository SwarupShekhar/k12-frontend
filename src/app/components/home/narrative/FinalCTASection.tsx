'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import FadeUpSection from './FadeUpSection';
import NarrativeButton from './NarrativeButton';

export default function FinalCTASection() {
    const router = useRouter();
    const { user } = useAuthContext();

    const handleBookSession = () => {
        if (user) {
            router.push('/bookings/new');
        } else {
            router.push('/login?redirect=/bookings/new');
        }
    };

    return (
        <section className="py-32 bg-gray-900 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full -ml-48 -mb-48" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <FadeUpSection>
                    <p className="text-purple-400 font-bold italic mb-6">
                        “When children feel understood, they start to understand.”
                    </p>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-12 max-w-3xl mx-auto leading-[0.95]">
                        Give your child the kind of learning attention classrooms can’t provide.
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <NarrativeButton
                            variant="secondary"
                            className="text-lg px-12 py-5 w-full md:w-auto"
                            onClick={handleBookSession}
                        >
                            Start Free Session
                        </NarrativeButton>
                        <NarrativeButton
                            variant="outline"
                            className="text-lg px-12 py-5 w-full md:w-auto !text-white !border-white/20 hover:!bg-white/5"
                            onClick={() => router.push('/contact')}
                        >
                            Speak with an Advisor
                        </NarrativeButton>
                    </div>

                    <p className="mt-8 text-white/40 text-xs font-medium">
                        No credit card required. Sessions available for K-12 subjects.
                    </p>
                </FadeUpSection>
            </div>
        </section>
    );
}
