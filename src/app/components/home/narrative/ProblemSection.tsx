'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeUpSection from './FadeUpSection';

const PROBLEMS = [
    {
        title: "The Silent Struggle",
        description: "“They say they understand… but they don’t.” Many students learn to mimic understanding to keep up with the class.",
        icon: "😶"
    },
    {
        title: "Overlooked Gaps",
        description: "“They’re afraid to ask.” In a group, the fear of looking slow prevents the most important questions from being asked.",
        icon: "❓"
    },
    {
        title: "Correction Delay",
        description: "“Mistakes go uncorrected.” Homework feedback that arrives days later is too late to fix cognitive misconceptions.",
        icon: "🎯"
    },
    {
        title: "Presence Decay",
        description: "“Confidence slowly drops.” Without personalized wins, students begin to define themselves as 'bad at math' or 'slow'.",
        icon: "📉"
    }
];

export default function ProblemSection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const clarity = useTransform(scrollYProgress, [0.2, 0.5], [0.85, 1]);

    return (
        <section id="problem-section" ref={sectionRef} className="py-32 bg-background relative overflow-hidden">
            <motion.div
                style={{
                    filter: useTransform(clarity, (v) => `contrast(${v}) brightness(${v}) saturate(${v})`)
                }}
                className="container mx-auto px-6 text-foreground"
            >
                <FadeUpSection className="text-center mb-24">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">The Context</span>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter max-w-2xl mx-auto">
                        Standard classrooms are efficient for logistics, but inefficient for learning.
                    </h2>
                </FadeUpSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {PROBLEMS.map((problem, i) => (
                        <FadeUpSection key={i} delay={i * 0.15} className="group p-8 rounded-3xl bg-surface border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500">
                            <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center text-3xl mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                {problem.icon}
                            </div>
                            <h3 className="text-xl font-black text-foreground mb-4 tracking-tight">{problem.title}</h3>
                            <p className="text-sm text-text-secondary font-medium leading-relaxed italic">
                                {problem.description}
                            </p>
                        </FadeUpSection>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
