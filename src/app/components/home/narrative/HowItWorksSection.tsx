'use client';

import React from 'react';
import FadeUpSection from './FadeUpSection';

const STEPS = [
    {
        phase: "Warm Connect",
        title: "Establishing the Bond",
        description: "Every session starts with a personal check-in. We review the child's interests and emotional state before touching a single textbook.",
        icon: "🫂"
    },
    {
        phase: "Diagnose",
        title: "Foundational Gap Check",
        description: "Instead of following a rigid script, the tutor identifies the specific cognitive block that held them back in the last session.",
        icon: "🔍"
    },
    {
        phase: "Micro Teach",
        title: "Targeted Instruction",
        description: "Short, 5-minute bursts of clear instruction using visual mental models, designed for the child's specific CEFR or grade level.",
        icon: "💡"
    },
    {
        phase: "Active Response",
        title: "Student Externalization",
        description: "The 'Golden Rule' of our platform: The student must explain the concept back in their own words to build neural pathways.",
        icon: "🎙️"
    },
    {
        phase: "Reinforce",
        title: "Evidence-Led Praise",
        description: "We don't praise 'smartness'. We praise the specific effort and strategy used to solve the problem, building durable confidence.",
        icon: "⭐"
    },
    {
        phase: "Reflect",
        title: "The Summary Loop",
        description: "The session ends with the student summarizing what they learned, ensuring information moves from short-term to long-term memory.",
        icon: "🧠"
    }
];

export default function HowItWorksSection() {
    return (
        <section className="py-32 bg-white">
            <div className="container mx-auto px-6 max-w-5xl">
                <FadeUpSection className="text-center mb-24">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600 mb-4 block">The Experience</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                        Inside a structured session
                    </h2>
                    <p className="text-gray-500 font-medium mt-4">The Tutor Playbook OS ensures every minute is engineered for impact.</p>
                </FadeUpSection>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-100 hidden md:block" />

                    <div className="space-y-24">
                        {STEPS.map((step, i) => (
                            <div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                {/* Content */}
                                <div className="md:w-1/2">
                                    <FadeUpSection delay={0.1} className={`${i % 2 === 1 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className="inline-flex px-3 py-1 bg-purple-50 rounded-full mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-600">{step.phase}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{step.title}</h3>
                                        <p className="text-gray-500 font-medium leading-relaxed italic">
                                            {step.description}
                                        </p>
                                    </FadeUpSection>
                                </div>

                                {/* Center Icon */}
                                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-xl flex items-center justify-center text-2xl">
                                    {step.icon}
                                </div>

                                {/* Placeholder for balance */}
                                <div className="md:w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
