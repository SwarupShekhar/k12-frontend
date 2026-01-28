'use client';

import React from 'react';

interface StudentSnapshotProps {
    studentName: string;
    interests: string[];
    recentProgress: string;
    struggleAreas: string[];
}

export default function StudentSnapshotCard({ studentName, interests, recentProgress, struggleAreas }: StudentSnapshotProps) {
    return (
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border border-white/10 group">
            {/* Background elements */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center font-black text-2xl border border-white/20 shadow-inner">
                        {studentName.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-black text-xl tracking-tight">{studentName}</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Active Learner</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <section>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black mb-2 text-white/40">Student Interests</p>
                        <div className="flex flex-wrap gap-2">
                            {interests.map(i => (
                                <span key={i} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/5 transition-colors cursor-default">
                                    {i}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black mb-2 text-white/40">Recent Focus</p>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-xs leading-relaxed font-medium opacity-90">{recentProgress}</p>
                        </div>
                    </section>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-400/10 rounded-xl border border-amber-400/20">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-amber-400 tracking-widest">Previous Struggle</p>
                            <p className="text-sm font-bold text-amber-100">{struggleAreas[0] || 'No specific blocks'}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                    <p className="text-xs font-black flex items-center gap-3 text-indigo-100 italic">
                        <span className="text-lg opacity-100 not-italic scale-125">💬</span>
                        "Start with a personal check-in"
                    </p>
                    <div className="text-[10px] font-black bg-white/10 px-2 py-1 rounded text-white/40">LOOP 1</div>
                </div>
            </div>
        </div>
    );
}
