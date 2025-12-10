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
                    <div className="bg-glass rounded-3xl p-8 shadow-xl border border-white/40 h-full flex flex-col justify-between">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Track what matters</h3>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Parents get access to session notes, performance indicators, and clear learning progress over time.
                            </p>
                        </div>

                        {/* Chart Container */}
                        <div className="flex-1 flex items-end justify-between gap-3 px-2 pb-2 relative z-10 min-h-[220px]">

                            {/* Background Reference Lines */}
                            <div className="absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between pointer-events-none opacity-10">
                                <div className="border-t border-dashed border-slate-400 w-full h-0"></div>
                                <div className="border-t border-dashed border-slate-400 w-full h-0"></div>
                                <div className="border-t border-dashed border-slate-400 w-full h-0"></div>
                                <div className="border-t border-dashed border-slate-400 w-full h-0"></div>
                            </div>

                            {/* Bars */}
                            {[35, 45, 52, 65, 78, 92].map((height, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group/bar w-full relative z-20">
                                    <div className="relative w-full max-w-[40px] flex items-end h-[180px]">
                                        <div
                                            style={{ height: `${height}%` }}
                                            className={`w-full rounded-t-lg transition-all duration-1000 ease-out relative group-hover/bar:brightness-110 shadow-sm ${i === 5 ? 'bg-gradient-to-t from-[var(--color-primary)] to-blue-400' :
                                                    i >= 4 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-primary)]/40'
                                                }`}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                {height}%
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-[var(--color-text-secondary)] font-medium">M{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
