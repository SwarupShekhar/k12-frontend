'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { useAuthContext } from '@/app/context/AuthContext';

type Region = 'US' | 'UK';
type Subject = 'Math' | 'Science' | 'English';

export default function SubjectsPage() {
    const { user } = useAuthContext();
    const [region, setRegion] = useState<Region>('US');
    const [activeSubject, setActiveSubject] = useState<Subject>('Math');

    const content = {
        US: {
            Math: [
                { stage: 'Elementary School (K-5)', desc: 'Counting, Place Value (up to 100,000), Basic Operations (+, -, x, ÷), Simple Fractions, Decimals, Perimeter, and Volume of basic shapes.' },
                { stage: 'Middle School (Grades 6-8)', desc: 'Pre-Algebra, Ratios and Proportional Relationships, Integer Operations, Equations and Inequalities, Geometry (Area, Volume), and Statistics/Probability.' },
                { stage: 'High School (Grades 9-12)', desc: 'Algebra I/II, Geometry, Trigonometry, Pre-Calculus, and Calculus (including AP/IB prep).' },
            ],
            Science: [
                { stage: 'Elementary School (K-5)', desc: 'Overview of science and engineering practices, basic concepts on Plant/Animal Relationships, Weather, Forces, and the Solar System.' },
                { stage: 'Middle School (Grades 6-8)', desc: 'General Science, Life Science (Cells, Organism Growth, Ecology), Earth & Space Science (Weather, Earth’s History), and Physical Science (Motion, Forces, Energy).' },
                { stage: 'High School (Grades 9-12)', desc: 'Biology (Genetics, Evolution), Chemistry (Atomic Structure, Reactions, Stoichiometry), Physics (Motion, Energy, Electromagnetism), and AP/IB courses.' },
            ],
            English: [
                { stage: 'Elementary School (K-5)', desc: 'Phonics and Word Study, Basic Grammar and Punctuation, Reading Fluency, Narrative/Informational Writing, and Vocabulary acquisition.' },
                { stage: 'Middle School (Grades 6-8)', desc: 'Reading Comprehension of more complex texts, Introduction to Literary Analysis, Argumentative and Analytical Writing, and advanced Grammar/Syntax.' },
                { stage: 'High School (Grades 9-12)', desc: 'Literary Analysis (fiction, non-fiction, poetry), Argument/Thesis Development, Critical Reading, and Test Prep (SAT/ACT Reading/Writing).' },
            ]
        },
        UK: {
            Math: [
                { stage: 'KS1-2 (Years 1-6)', desc: 'Mental fluency with whole numbers (up to 10,000), Times Tables (2, 3, 4, 5, 10), Addition/Subtraction within 1000, Fractions/Decimals/Percentages, Ratio, and Measurement.' },
                { stage: 'KS3 (Years 7-9)', desc: 'Formal introduction to Algebra (simplifying, solving equations), Geometry (angles, transformations), advanced Fractions/Decimals, and Compound Measure.' },
                { stage: 'KS4 (GCSE/IGCSE)', desc: 'Quadratic Equations, Sequences and Series, Functions, Advanced Trigonometry, Differential Calculus (Grade 12 example), Analytical Geometry, and Probability.' },
            ],
            Science: [
                { stage: 'KS1-2 (Years 1-6)', desc: 'Biology (Plants, Animals/Human Body Parts), Chemistry (Everyday Materials, States of Matter), Physics (Forces, Magnets, Light, Electricity), and Earth/Space (Seasonal Changes).' },
                { stage: 'KS3 (Years 7-9)', desc: 'Transition to Biology, Chemistry, and Physics as separate subjects, focusing on fundamental concepts in each field.' },
                { stage: 'KS4 (GCSE/IGCSE)', desc: 'Detailed study of Biological Systems (Circulatory System, Genetics), Chemical Reactions (Acids/Bases, Kinetics), and Forces and Motion (Newton’s Laws, Waves).' },
            ],
            English: [
                { stage: 'KS1-2 (Years 1-6)', desc: 'Word Reading (Phonics, Decoding), Comprehension (Discussing texts, making inferences), Writing (Spelling, Handwriting, composing sentences/short narratives).' },
                { stage: 'KS3 (Years 7-9)', desc: 'Deeper analysis of Literature (different genres/eras), developing structured Argumentative and Explanatory writing, and refining technical accuracy (grammar, punctuation).' },
                { stage: 'KS4 (GCSE/IGCSE)', desc: 'Preparation for formal examinations in English Language (non-fiction reading, transactional writing) and English Literature (set texts, essay writing).' },
            ]
        }
    };

    return (
        <main className="min-h-screen bg-[var(--color-background)] py-24 px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6">
                        Curriculum & Programs
                    </h1>
                    <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
                        We offer specialized tutoring aligned with both US Common Core and UK National Curriculum standards.
                    </p>
                </div>

                {/* Region Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-[var(--color-surface)] p-1 rounded-full border border-[var(--color-border)] shadow-sm inline-flex">
                        {(['US', 'UK'] as Region[]).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRegion(r)}
                                className={`px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 ${region === r
                                        ? 'bg-[var(--color-primary)] text-white shadow-md'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
                                    }`}
                            >
                                {r === 'US' ? '🇺🇸 US Curriculum' : '🇬🇧 UK Curriculum'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-glass rounded-[2.5rem] p-8 md:p-12 border border-white/20 shadow-xl transition-all duration-500">
                    {/* Subject Tabs */}
                    <div className="flex flex-wrap gap-4 mb-12 border-b border-[var(--color-border)] pb-6 justify-center md:justify-start">
                        {(['Math', 'Science', 'English'] as Subject[]).map((subj) => (
                            <button
                                key={subj}
                                onClick={() => setActiveSubject(subj)}
                                className={`px-6 py-2 rounded-xl font-bold text-lg transition-all ${activeSubject === subj
                                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]'
                                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                                    }`}
                            >
                                {subj === 'Math' && '📐 '}
                                {subj === 'Science' && '🔬 '}
                                {subj === 'English' && '✍️ '}
                                {subj}
                            </button>
                        ))}
                    </div>

                    {/* Stage Content */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 key={activeSubject + region}">
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
                                {activeSubject} <span className="text-[var(--color-primary)]">({region})</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {content[region][activeSubject].map((item, idx) => (
                                <div key={idx} className="bg-[var(--color-surface)]/50 p-6 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-colors">
                                    <h3 className="text-lg font-bold text-[var(--color-primary)] mb-4 uppercase tracking-wider text-sm">
                                        {item.stage}
                                    </h3>
                                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-20 text-center">
                    <Link
                        href={user ? (user.role === 'student' ? '/student/dashboard' : '/parent/dashboard') : '/signup'}
                        className="inline-block px-8 py-4 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
                    >
                        Get started with {region} Curriculum
                    </Link>
                </div>
            </div>
        </main>
    );
}
