'use client';

import React from 'react';
import { motion } from 'framer-motion';
import NarrativeButton from './NarrativeButton';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import { WavyBackground } from '../../ui/wavy-background';

const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.8,
            ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number]
        }
    })
};

export default function HeroSection() {
    const router = useRouter();
    const { user } = useAuthContext();

    const headline = "Your child doesn’t need more classes. They need the right kind of attention.";
    const words = headline.split(" ");

    const handleBookSession = () => {
        if (user) {
            router.push('/bookings/new');
        } else {
            router.push('/login?redirect=/bookings/new');
        }
    };

    const handleScroll = () => {
        const problemSection = document.getElementById('problem-section');
        if (problemSection) {
            problemSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-background">
            <WavyBackground blur={30} className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center min-h-screen">
                <div className="mb-8 flex flex-wrap justify-center gap-x-3 gap-y-1">
                    {words.map((word, i) => (
                        <motion.span
                            key={i}
                            custom={i}
                            initial="hidden"
                            animate="visible"
                            variants={wordVariants}
                            className={`text-5xl md:text-7xl font-black tracking-tighter ${word.includes("attention") ? "text-purple-600 dark:text-purple-400" : "text-foreground"}`}
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mb-12 max-w-2xl mx-auto"
                >
                    <div className="relative p-6 rounded-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-background/40 dark:bg-background/20 backdrop-blur-md rounded-2xl transition-opacity opacity-80 group-hover:opacity-100" />
                        <p className="relative z-10 text-xl md:text-2xl text-foreground font-semibold leading-relaxed drop-shadow-sm">
                            In crowded classrooms and batch coaching, questions go unasked and confusion goes unnoticed.
                            We built a system where every session is designed around one child’s understanding.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                >
                    <NarrativeButton className="text-lg px-12 py-5" onClick={handleBookSession}>
                        Book Free Session
                    </NarrativeButton>
                    <p className="mt-4 text-[10px] uppercase tracking-widest font-black text-gray-400">
                        Limited availability for personalized attention
                    </p>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2, duration: 1.5 }}
                    className="mt-16 text-sm font-medium text-gray-400 italic"
                >
                    “When children feel understood, they start to understand.”
                </motion.p>
            </WavyBackground>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 2 }}
                onClick={handleScroll}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity z-20"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Scroll to explore our approach</span>
                <div className="w-px h-12 bg-gradient-to-b from-gray-200 to-transparent" />
            </motion.div>
        </section>
    );
}
