'use client';

import React, { useEffect, useState } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import Link from 'next/link';
import api from '@/app/lib/api';
import { Program } from '@/app/types/program';
import { format } from 'date-fns';

export default function ProgramsPage() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/programs')
            .then(res => setPrograms(res.data))
            .catch(err => {
                console.error('Failed to fetch programs', err);
                // Fallback to empty if fails, prevents crash
                setPrograms([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <ProtectedClient roles={['admin']}>
            <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                {/* HEADER */}
                <div className="flex justify-between items-center bg-glass rounded-[2rem] p-8 border border-white/20 shadow-lg">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Programs</h1>
                        <p className="text-[var(--color-text-secondary)]">Managed Tutoring Operating System</p>
                    </div>
                    <Link
                        href="/admin/programs/new"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg flex items-center gap-2"
                    >
                        <span>+ Create Program</span>
                    </Link>
                </div>

                {/* FILTERS TOOLBAR (Placeholder) */}
                <div className="flex gap-4 p-4 bg-glass rounded-xl border border-white/20">
                    <input type="text" placeholder="Search programs..." className="bg-white/50 border border-transparent focus:border-blue-500 rounded-lg px-4 py-2 text-sm w-64" />
                    <select className="bg-white/50 border border-transparent focus:border-blue-500 rounded-lg px-4 py-2 text-sm text-[var(--color-text-secondary)]">
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Draft</option>
                        <option>Archived</option>
                    </select>
                </div>

                {/* PROGRAMS GRID */}
                {loading ? (
                    <div className="text-center py-20 text-[var(--color-text-secondary)]">Loading Programs...</div>
                ) : programs.length === 0 ? (
                    <div className="text-center py-20 bg-glass rounded-2xl border border-white/20">
                        <p className="text-[var(--color-text-secondary)] mb-4">No programs found.</p>
                        <Link href="/admin/programs/new" className="text-blue-600 font-bold hover:underline">Create your first program</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program) => (
                            <Link
                                key={program.id}
                                href={`/admin/programs/${program.id}`}
                                className="bg-glass rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${program.status === 'active' ? 'bg-green-100 text-green-700' :
                                            program.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {program.status}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-[var(--color-text-secondary)]">
                                                {program.operational?.startDate ? format(new Date(program.operational.startDate), 'MMM d, yyyy') : 'N/A'}
                                            </div>
                                            <div className="text-[10px] text-[var(--color-text-secondary)]">Start Date</div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-blue-600 transition-colors">
                                        {program.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mb-4">
                                        <div className="flex items-center gap-1">
                                            <span>👥</span>
                                            <span>{program.studentCount || 0} Students</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>🎓</span>
                                            <span>{program.tutorCount || 0} Tutors</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-[var(--color-text-secondary)] font-semibold">
                                        <span>Progress</span>
                                        <span>{(program.sessionsDelivered && program.upcomingSessions) ? Math.round((program.sessionsDelivered / (program.sessionsDelivered + program.upcomingSessions)) * 100) : 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-full rounded-full"
                                            style={{ width: `${(program.sessionsDelivered && program.upcomingSessions) ? Math.round((program.sessionsDelivered / (program.sessionsDelivered + program.upcomingSessions)) * 100) : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Add New Placeholder Card */}
                        <Link
                            href="/admin/programs/new"
                            className="bg-white/20 border-2 border-dashed border-white/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/30 transition-all group cursor-pointer min-h-[250px]"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">+</div>
                            <span className="font-bold text-[var(--color-text-secondary)] group-hover:text-blue-600">Create Program</span>
                        </Link>
                    </div>
                )}
            </div>
        </ProtectedClient>
    );
}
