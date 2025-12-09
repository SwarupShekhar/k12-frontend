'use client';

import React from 'react';

export default function SuccessMetrics() {
    return (
        <section className="w-full py-20 px-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text & Key Stats */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                            The proof is in the progress
                        </h2>
                        <p className="text-lg text-[var(--color-text-secondary)] mb-12">
                            Our tutoring programs are built around measurable improvement, not just attendance.
                        </p>

                        <div className="space-y-10">
                            <div className="flex gap-6 items-start">
                                <div className="text-4xl md:text-5xl font-extrabold text-[var(--color-primary)]">
                                    95%
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-[var(--color-text-primary)]">Confidence Boost</p>
                                    <p className="text-[var(--color-text-secondary)]">of students report higher academic confidence</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="text-4xl md:text-5xl font-extrabold text-[var(--color-secondary)]">
                                    72%
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-[var(--color-text-primary)]">Grade Improvement</p>
                                    <p className="text-[var(--color-text-secondary)]">average grade improvement within three months</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start">
                                <div className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] opacity-80">
                                    150k+
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-[var(--color-text-primary)]">Minutes Taught</p>
                                    <p className="text-[var(--color-text-secondary)]">minutes of one-on-one tutoring delivered</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Progress Visualization */}
                    <div className="bg-glass rounded-3xl p-8 shadow-xl border border-white/40">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Track what matters</h3>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Parents get access to session notes, performance indicators, and clear learning progress over time.
                            </p>
                        </div>

                        {/* Mock Chart */}
                        <div className="w-full h-64 flex items-end justify-between gap-2 border-b border-[var(--color-border)] pb-4 px-2">
                            {[40, 55, 62, 75, 82, 91].map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group w-full">
                                    <div
                                        className="w-full bg-gradient-to-t from-[var(--color-primary)] to-blue-300 rounded-t-lg transition-all duration-1000 group-hover:opacity-90"
                                        style={{ height: `${h}%` }}
                                    />
                                    <span className="text-xs text-[var(--color-text-secondary)]">M{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
