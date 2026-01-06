'use client';

import React, { useState, useEffect } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Program } from '@/app/types/program';
import { format } from 'date-fns';
import EnrollStudentModal from '@/app/components/admin/EnrollStudentModal';
import AddTutorModal from '@/app/components/admin/AddTutorModal';
import api from '@/app/lib/api';

const TABS = ['OVERVIEW', 'STUDENTS', 'STAFFING', 'ACADEMICS', 'OPERATIONS', 'COMPLIANCE', 'FINANCE', 'DELIVERY', 'REPORTS'];

export default function ProgramDetailPage() {
    const params = useParams();
    const router = useRouter();
    const programId = params.programId as string;
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true); // Added loading state
    const [activeTab, setActiveTab] = useState('OVERVIEW');

    // Modals
    const [showEnroll, setShowEnroll] = useState(false);
    const [showStaff, setShowStaff] = useState(false);

    const fetchProgram = () => {
        setLoading(true);
        api.get(`/admin/programs/${programId}`)
            .then(res => setProgram(res.data))
            .catch(err => {
                console.error('Failed to fetch program details', err);
                // toast.error('Failed to load program');
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        if (programId) {
            fetchProgram();
        }
    }, [programId]);

    const refreshData = () => {
        fetchProgram();
    };

    if (loading) {
        return (
            <ProtectedClient roles={['admin']}>
                <div className="min-h-screen flex items-center justify-center text-[var(--color-text-secondary)]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
                    Loading Program...
                </div>
            </ProtectedClient>
        )
    }

    if (!program) {
        return (
            <ProtectedClient roles={['admin']}>
                <div className="min-h-screen flex flex-col items-center justify-center text-[var(--color-text-secondary)] gap-4">
                    <p>Program not found.</p>
                    <Link href="/admin/programs" className="text-blue-600 hover:underline">Back to Programs</Link>
                </div>
            </ProtectedClient>
        )
    }

    return (
        <ProtectedClient roles={['admin']}>
            <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto space-y-6">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-glass p-6 rounded-2xl border border-white/20 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-1">
                            <Link href="/admin/programs" className="hover:underline">Programs</Link>
                            <span>/</span>
                            <span className="font-mono text-xs opacity-50">{program.id}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                            {program.name}
                            <span className={`text-sm px-3 py-1 rounded-full font-bold uppercase tracking-wider ${program.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {program.status}
                            </span>
                        </h1>
                    </div>
                    <button className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        Edit Configuration
                    </button>
                </div>

                {/* TABS */}
                <div className="flex overflow-x-auto gap-1 border-b border-white/10 pb-1 example-scrollbar">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === tab
                                ? 'border-blue-500 text-blue-500 bg-blue-50/50'
                                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                                } rounded-t-lg`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* TAB CONTENT */}
                <div className="bg-glass rounded-2xl p-8 border border-white/20 shadow-sm min-h-[400px]">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'OVERVIEW' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Operational Dashboard</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {/* Enrollment Stats */}
                                    <div className="p-4 bg-white/50 rounded-xl border border-white/30 hover:border-blue-200 transition-colors">
                                        <div className="text-xs uppercase text-[var(--color-text-secondary)] font-bold">Students Enrolled</div>
                                        <div className="text-3xl font-bold text-blue-600">{program.studentCount || 0}</div>
                                    </div>
                                    <div className="p-4 bg-white/50 rounded-xl border border-white/30 hover:border-orange-200 transition-colors">
                                        <div className="text-xs uppercase text-[var(--color-text-secondary)] font-bold">Tutors Assigned</div>
                                        <div className="text-3xl font-bold text-orange-600">{program.tutorCount || 0}</div>
                                    </div>
                                    <div className="p-4 bg-white/50 rounded-xl border border-white/30">
                                        <div className="text-xs uppercase text-[var(--color-text-secondary)] font-bold">Duration</div>
                                        <div className="text-lg font-bold text-[var(--color-text-primary)]">
                                            {program.operational?.startDate && program.operational?.endDate ?
                                                `${Math.floor((new Date(program.operational.endDate).getTime() - new Date(program.operational.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))} Weeks`
                                                : 'N/A'
                                            }
                                        </div>
                                    </div>

                                    {/* Activity Stats */}
                                    <div className="p-4 bg-white/50 rounded-xl border border-white/30">
                                        <div className="text-xs uppercase text-[var(--color-text-secondary)] font-bold">Sessions Delivered</div>
                                        <div className="text-3xl font-bold text-green-600">{program.sessionsDelivered || 0}</div>
                                    </div>
                                    <div className="p-4 bg-white/50 rounded-xl border border-white/30">
                                        <div className="text-xs uppercase text-[var(--color-text-secondary)] font-bold">Upcoming</div>
                                        <div className="text-3xl font-bold text-purple-600">{program.upcomingSessions || 0}</div>
                                    </div>
                                    <div className="p-4 bg-white/50 rounded-xl border border-white/30">
                                        <div className="text-xs uppercase text-[var(--color-text-secondary)] font-bold">Hours Delivered</div>
                                        <div className="text-3xl font-bold text-[var(--color-text-primary)]">{(program.hoursUsed || 0).toFixed(1)}h</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-4 text-[var(--color-text-primary)]">Quick Actions</h3>
                                <div className="space-y-2">
                                    <button className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors flex justify-between items-center group">
                                        <span>View Student Roster</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                    <button className="w-full text-left p-3 rounded-lg bg-orange-50 text-orange-700 font-semibold hover:bg-orange-100 transition-colors flex justify-between items-center group">
                                        <span>Manage Tutors</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                    <button className="w-full text-left p-3 rounded-lg bg-gray-50 text-gray-700 font-semibold hover:bg-gray-100 transition-colors flex justify-between items-center group">
                                        <span>View Schedule</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STUDENTS TAB */}
                    {activeTab === 'STUDENTS' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Enrolled Students</h3>
                                <button
                                    onClick={() => setShowEnroll(true)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors"
                                >
                                    + Enroll Student
                                </button>
                            </div>

                            <div className="bg-white/40 rounded-xl border border-white/20 overflow-hidden">
                                {program.students && program.students.length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead className="bg-white/20 border-b border-white/10 text-xs uppercase text-[var(--color-text-secondary)]">
                                            <tr>
                                                <th className="p-4">Student Name</th>
                                                <th className="p-4">Enrolled Date</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {program.students.map(student => (
                                                <tr key={student.id} className="border-b border-white/5 hover:bg-white/10">
                                                    <td className="p-4 font-medium text-[var(--color-text-primary)]">{student.name}</td>
                                                    <td className="p-4 text-sm text-[var(--color-text-secondary)]">{student.enrolledAt ? format(new Date(student.enrolledAt), 'MMM d, yyyy') : 'N/A'}</td>
                                                    <td className="p-4 text-right">
                                                        <button className="text-red-500 text-sm hover:underline">Remove</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-[var(--color-text-secondary)]">
                                        No students enrolled yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STAFFING TAB */}
                    {activeTab === 'STAFFING' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Assigned Tutors</h3>
                                <button
                                    onClick={() => setShowStaff(true)}
                                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-md transition-colors"
                                >
                                    + Add Tutor
                                </button>
                            </div>

                            <div className="bg-white/40 rounded-xl border border-white/20 overflow-hidden">
                                {program.tutors && program.tutors.length > 0 ? (
                                    <table className="w-full text-left">
                                        <thead className="bg-white/20 border-b border-white/10 text-xs uppercase text-[var(--color-text-secondary)]">
                                            <tr>
                                                <th className="p-4">Tutor Name</th>
                                                <th className="p-4">Subjects</th>
                                                <th className="p-4 text-center">Rating</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {program.tutors.map(tutor => (
                                                <tr key={tutor.id} className="border-b border-white/5 hover:bg-white/10">
                                                    <td className="p-4 font-medium text-[var(--color-text-primary)]">{tutor.name}</td>
                                                    <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                                                        <div className="flex flex-wrap gap-1">
                                                            {tutor.subjects.map(s => (
                                                                <span key={s} className="px-2 py-0.5 bg-white/30 rounded text-xs">{s}</span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center text-[var(--color-text-primary)]">⭐ {tutor.rating}</td>
                                                    <td className="p-4 text-right">
                                                        <button className="text-red-500 text-sm hover:underline">Remove</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-[var(--color-text-secondary)]">
                                        No tutors assigned yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* COMPLIANCE TAB (MOCKED FOR NOW AS PLACEHOLDER) */}
                    {activeTab === 'COMPLIANCE' && (
                        <div className="space-y-8">
                            {/* ... Compliance UI using hypothetical program.compliance ... */}
                            {/* For demo, we might need to assume the API returns this, or show a 'Coming Soon' if backend isn't ready */}
                            <div className="p-8 text-center bg-white/30 rounded-2xl border border-dashed border-white/40">
                                <div className="text-4xl mb-4">🛡️</div>
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Compliance Dashboard</h3>
                                <p className="text-[var(--color-text-secondary)] mb-6">Trust scores, recording status, and attendance flags will appear here.</p>
                                <button className="px-4 py-2 bg-white rounded shadow-sm font-semibold text-sm">Download Compliance Report (Mock)</button>
                            </div>
                        </div>
                    )}

                    {/* GENERIC JSON LIST RENDERER FOR OTHER TABS */}
                    {!['OVERVIEW', 'STUDENTS', 'STAFFING', 'COMPLIANCE'].includes(activeTab) && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] capitalize">{activeTab.toLowerCase()} Details</h3>

                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(
                                    activeTab === 'ACADEMIC' ? program.academic :
                                        activeTab === 'OPERATIONS' ? program.operational :
                                            activeTab === 'FINANCE' ? program.financial :
                                                activeTab === 'DELIVERY' ? program.delivery :
                                                    activeTab === 'REPORTS' ? program.reporting : {}
                                ).map(([key, value]) => (
                                    <div key={key} className="p-4 bg-white/30 rounded-xl border border-white/10">
                                        <dt className="text-xs uppercase text-[var(--color-text-secondary)] font-bold mb-1 tracking-wider">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </dt>
                                        <dd className="text-lg font-medium text-[var(--color-text-primary)]">
                                            {typeof value === 'boolean'
                                                ? (value ? <span className="text-green-600">Enabled</span> : <span className="text-gray-400">Disabled</span>)
                                                : Array.isArray(value) ? value.join(', ') || 'None'
                                                    : String(value)
                                            }
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                </div>

                {/* MODALS */}
                <EnrollStudentModal
                    isOpen={showEnroll}
                    onClose={() => setShowEnroll(false)}
                    programId={programId}
                    onEnrolled={refreshData}
                />
                <AddTutorModal
                    isOpen={showStaff}
                    onClose={() => setShowStaff(false)}
                    programId={programId}
                    onAdded={refreshData}
                />
            </div>
        </ProtectedClient>
    );
}
