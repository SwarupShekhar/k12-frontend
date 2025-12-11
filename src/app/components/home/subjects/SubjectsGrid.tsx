'use client';
import React from 'react';
import SubjectCard from './SubjectCard';
import subjectsData from '@/data/subjects.json';

export default function SubjectsGrid() {
    return (
        <section className="py-20 lg:py-28 relative overflow-hidden">
            {/* Minimal background decoration */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent -translate-y-1/2 opacity-50 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                        Explore Subjects
                    </h2>
                    <p className="text-[var(--color-text-secondary)]">
                        From catching up to getting ahead, we cover the entire K-12 curriculum with expert tutors.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subjectsData.map((subject, index) => (
                        <SubjectCard key={subject.id} subject={subject} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
