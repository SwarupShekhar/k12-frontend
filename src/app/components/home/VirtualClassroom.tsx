'use client';

import React from 'react';

export default function VirtualClassroom() {
    const features = [
        {
            title: "Real-time whiteboard learning",
            desc: "Tutors and students solve problems together using a shared digital whiteboard that updates instantly.",
            icon: "✏️"
        },
        {
            title: "Session playback and review",
            desc: "Every session is recorded and available for later review so students can revisit difficult topics.",
            icon: "▶️"
        },
        {
            title: "Organized learning materials",
            desc: "Homework, practice sheets, and notes stay neatly organized by subject and session.",
            icon: "📂"
        }
    ];

    return (
        <section className="w-full py-24 px-6 bg-[var(--color-background)]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                        A state-of-the-art learning environment
                    </h2>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        Everything students and tutors need for focused and effective online learning.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="bg-glass p-8 rounded-3xl border border-white/20 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-3xl mb-6">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">{f.title}</h3>
                            <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
