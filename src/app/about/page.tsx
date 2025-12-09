'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/app/context/AuthContext';

export default function AboutPage() {
    const { user } = useAuthContext();
    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            {/* Hero */}
            <section className="py-24 px-6 relative overflow-hidden">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-secondary)] opacity-5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-8">
                        Why we built this K-12 tutoring platform
                    </h1>
                    <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed">
                        We started this platform to give every child access to thoughtful, one-to-one support that fits their pace, their goals and their personality.
                    </p>
                </div>
            </section>

            {/* Founders Message */}
            <section className="py-20 px-6 bg-[var(--color-surface)]">
                <div className="max-w-3xl mx-auto prose prose-lg prose-blue dark:prose-invert">
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-8">A note from our team</h2>
                    <p className="text-[var(--color-text-secondary)]">
                        We saw too many students struggling in crowded classrooms, feeling like they were falling behind just because they needed a little extra time or a different explanation. We knew that with the right support, these same students could thrive.
                    </p>
                    <p className="text-[var(--color-text-secondary)]">
                        We wanted to build a platform that uses data to track progress but relies on real human connection to build confidence. We believe that confidence is just as important as marks, and our tutors are mentors first.
                    </p>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)] text-center mb-16">
                        How we approach learning
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Growth Mindset", text: "We encourage students to see mistakes as part of the learning process and focus on progress over perfection." },
                            { title: "Personalized Pacing", text: "We adapt to the student’s pace so that foundations are solid before moving ahead." },
                            { title: "Concept > Memory", text: "We focus on understanding ideas clearly so exam questions feel familiar, not frightening." },
                            { title: "Continuous Feedback", text: "Parents and students receive regular updates, so everyone knows what is working and what we will work on next." }
                        ].map((item, i) => (
                            <div key={i} className="bg-glass p-8 rounded-3xl border border-white/20">
                                <h3 className="font-bold text-[var(--color-text-primary)] mb-4 text-lg">{item.title}</h3>
                                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="py-20 px-6 bg-[var(--color-surface)]">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-16">The impact we aim for</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)] mb-2">95%</div>
                            <p className="text-[var(--color-text-secondary)] font-medium">Increase in confidence scores</p>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-[var(--color-secondary)] mb-2">72%</div>
                            <p className="text-[var(--color-text-secondary)] font-medium">Average grade improvement</p>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] opacity-80 mb-2">150k+</div>
                            <p className="text-[var(--color-text-secondary)] font-medium">Tutoring minutes delivered</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <p className="text-xl text-[var(--color-text-primary)] mb-8 font-medium">
                        If this philosophy matches what you want for your child, we would be happy to support your family.
                    </p>
                    <Link
                        href={user ? 'https://calendly.com/swarupshekhar-vaidikedu/30min' : '/signup?intent=assessment'}
                        className="inline-block px-8 py-4 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg"
                        {...(user ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                        Book a free assessment call
                    </Link>
                </div>
            </section>
        </main>
    );
}
