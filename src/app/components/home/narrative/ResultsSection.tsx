'use client';

import React from 'react';
import FadeUpSection from './FadeUpSection';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const controls = animate(0, value, {
            duration: 2,
            ease: "easeOut",
            onUpdate: (latest) => setDisplay(Math.round(latest))
        });
        return () => controls.stop();
    }, [value]);

    return (
        <span className="text-6xl md:text-8xl font-black tracking-tighter text-foreground">
            {display}{suffix}
        </span>
    );
}

export default function ResultsSection() {
    return (
        <section className="py-32 bg-background text-center relative overflow-hidden">
            {/* Background Architecture */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                {/* Floating Motion Nodes */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: 5 + i,
                            repeat: Infinity,
                            delay: i * 0.5
                        }}
                        className="absolute w-2 h-2 rounded-full bg-primary/20"
                        style={{
                            top: `${20 + (i * 15)}%`,
                            left: `${10 + (i * 18)}%`
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <FadeUpSection className="mb-20">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Proven Impact</span>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
                        Measurable growth through <br /> focused attention.
                    </h2>
                </FadeUpSection>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="p-12 bg-surface rounded-[3rem] border border-border/50 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
                    >
                        <Counter value={95} suffix="%" />
                        <p className="text-sm font-black uppercase tracking-widest text-text-secondary opacity-50 mt-4 italic">Higher Student Confidence</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="p-12 bg-surface rounded-[3rem] border border-border/50 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
                    >
                        <Counter value={72} suffix="%" />
                        <p className="text-sm font-black uppercase tracking-widest text-text-secondary opacity-50 mt-4 italic">Average Grade Improvement</p>
                    </motion.div>
                </div>

                <FadeUpSection delay={0.3} className="max-w-2xl mx-auto">
                    <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10 inline-block mb-12">
                        <p className="text-xl md:text-2xl text-foreground font-black italic tracking-tight">
                            “When children feel understood, they start to understand.”
                        </p>
                    </div>
                </FadeUpSection>

                <FadeUpSection delay={0.5}>
                    <p className="text-text-secondary font-bold uppercase tracking-widest text-[10px] opacity-40">
                        Because learning improves when attention improves.
                    </p>
                </FadeUpSection>
            </div>
        </section>
    );
}
