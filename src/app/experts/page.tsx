'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/app/context/AuthContext';

export default function ExpertsPage() {
    const { user } = useAuthContext();
    const vettingSteps = [
        { title: "Academic screening", text: "We verify strong academic background and subject mastery for every tutor." },
        { title: "Background checks", text: "National criminal background checks are completed before any tutor works with students." },
        { title: "Live video interview", text: "We assess communication style, empathy and ability to simplify complex concepts." },
        { title: "Mock tutoring session", text: "Tutors conduct a supervised mock lesson so we can evaluate real teaching performance." },
        { title: "Ongoing training", text: "Tutors receive regular coaching, training and performance feedback based on student outcomes." }
    ];

    const featuredTutors = [
        {
            name: "Ananya Sharma",
            subject: "Mathematics",
            experience: "7 years teaching",
            fact: "Runs a weekend math puzzle club"
        },
        {
            name: "Rahul Mehta",
            subject: "Physics",
            experience: "5 years tutoring",
            fact: "Turns everyday objects into experiments"
        },
        {
            name: "Sarah Jenkins",
            subject: "English Literature",
            experience: "10 years exp.",
            fact: "Published a children's book"
        }
    ];

    return (
        <main className="min-h-screen bg-[var(--color-background)]">
            {/* Hero */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-6">
                        In-House Expert Team
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
                        Only the best tutors work with your child
                    </h1>
                    <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        Our tutors are experienced educators, subject specialists and mentors who are carefully selected to support K-12 learners.
                    </p>
                </div>
            </section>

            {/* Vetting Process */}
            <section className="py-20 px-6 bg-[var(--color-surface)]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)] text-center mb-16">
                        How we select every tutor
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {vettingSteps.map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center mb-4 shadow-lg shrink-0">
                                    {i + 1}
                                </div>
                                <h3 className="font-bold text-[var(--color-text-primary)] mb-2">{step.title}</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Tutors (Static) */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)] text-center mb-16">
                        A snapshot of our teaching team
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredTutors.map((tutor, i) => (
                            <div key={i} className="bg-glass p-8 rounded-3xl border border-white/20">
                                <div className="w-20 h-20 rounded-full bg-gray-200 mb-6 mx-auto overflow-hidden">
                                    {/* Placeholder avatar */}
                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)] text-center mb-1">{tutor.name}</h3>
                                <p className="text-[var(--color-primary)] font-medium text-center text-sm mb-4">{tutor.subject}</p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                                        <span className="w-6 text-center">🎓</span>
                                        {tutor.experience}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                                        <span className="w-6 text-center">💡</span>
                                        {tutor.fact}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-3xl mx-auto bg-[var(--color-surface)] p-12 rounded-[2.5rem] border border-[var(--color-border)] shadow-xl">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                        Ready to find your match?
                    </h2>
                    <p className="text-[var(--color-text-secondary)] mb-8">
                        We match your child with a tutor from our in-house team based on grade, subject, schedule and learning style.
                    </p>
                    <Link
                        href={user ? 'https://calendly.com/swarupshekhar-vaidikedu/30min' : '/signup?intent=assessment'}
                        className="inline-block px-8 py-4 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
                        {...(user ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                        Book Free Demo Session
                    </Link>
                </div>
            </section>
        </main>
    );
}
