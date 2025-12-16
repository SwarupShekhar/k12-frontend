'use client';

import React, { useState } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import StudentListModal from '@/app/components/admin/StudentListModal';
import TutorAllocationModal from '@/app/components/admin/TutorAllocationModal';
import TutorListModal from '@/app/components/admin/TutorListModal';
import { useAuthContext } from '@/app/context/AuthContext';
import Link from 'next/link';
import api from '@/app/lib/api';
import BookingsTableSection from '@/app/components/admin/BookingsTableSection';

export default function AdminDashboardPage() {
    const { user } = useAuthContext();
    const [stats, setStats] = React.useState({ students: 0, parents: 0, tutors: 0, upcomingSessions: 0 });
    const [loading, setLoading] = React.useState(true);

    // Modal states
    const [showStudents, setShowStudents] = useState(false);
    const [showAllocation, setShowAllocation] = useState(false);
    const [showTutors, setShowTutors] = useState(false);

    React.useEffect(() => {
        // Fetch stats
        (async () => {
            try {
                // Endpoint to be implemented by backend
                const res = await api.get('/admin/stats');
                setStats(res.data || { students: 0, parents: 0, tutors: 0, upcomingSessions: 0 });
            } catch (e) {
                console.warn('Failed to fetch admin stats', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <ProtectedClient roles={['admin']}>
            <div className="min-h-screen p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
                <section className="bg-glass rounded-[2rem] p-8 md:p-10 border border-white/20 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-[var(--color-text-secondary)] text-lg mb-6">
                            Welcome back, {user?.first_name || 'Admin'}. Here is your operation center.
                        </p>
                    </div>
                </section>

                {/* ANALYTICS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Clickable Students Card */}
                    <div
                        onClick={() => setShowStudents(true)}
                        className="bg-glass rounded-2xl p-6 border border-white/20 shadow-sm flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform group"
                    >
                        <div className="p-3 bg-blue-100 rounded-lg text-2xl group-hover:bg-blue-200 transition-colors">👨‍🎓</div>
                        <div>
                            <p className="text-sm font-bold text-[var(--color-text-secondary)] uppercase">Total Students</p>
                            <p className="text-2xl font-bold text-[var(--color-primary)]">{loading ? '...' : stats.students}</p>
                            <span className="text-xs text-blue-500 underline opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
                        </div>
                    </div>

                    <div className="bg-glass rounded-2xl p-6 border border-white/20 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg text-2xl">👨‍👩‍👧</div>
                        <div>
                            <p className="text-sm font-bold text-[var(--color-text-secondary)] uppercase">Total Parents</p>
                            <p className="text-2xl font-bold text-[var(--color-primary)]">{loading ? '...' : stats.parents}</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setShowTutors(true)}
                        className="bg-glass rounded-2xl p-6 border border-white/20 shadow-sm flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform group"
                    >
                        <div className="p-3 bg-orange-100 rounded-lg text-2xl group-hover:bg-orange-200 transition-colors">🎓</div>
                        <div>
                            <p className="text-sm font-bold text-[var(--color-text-secondary)] uppercase">Total Tutors</p>
                            <p className="text-2xl font-bold text-[var(--color-primary)]">{loading ? '...' : stats.tutors}</p>
                            <span className="text-xs text-orange-500 underline opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
                        </div>
                    </div>

                    <div className="bg-glass rounded-2xl p-6 border border-white/20 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg text-2xl">🗓️</div>
                        <div>
                            <p className="text-sm font-bold text-[var(--color-text-secondary)] uppercase">Upcoming Sessions</p>
                            <p className="text-2xl font-bold text-[var(--color-primary)]">{loading ? '...' : stats.upcomingSessions}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tutor Management Card */}
                    <div className="bg-glass rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Tutor Management</h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                            Onboard new tutors and manage existing accounts.
                        </p>
                        <button
                            onClick={() => setShowAllocation(true)}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-center rounded-lg transition-colors shadow-lg mb-3"
                        >
                            ⚡ Allocate Tutor to Student
                        </button>
                        <Link href="/admin/tutors/new" className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-center rounded-lg transition-colors shadow-lg mb-3">
                            + Add New Tutor
                        </Link>
                        <Link href="/admin/blogs/new" className="block w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-center rounded-lg transition-colors shadow-lg">
                            + Write New Blog
                        </Link>
                    </div>

                    {/* Quick Actions / Future Expansion */}
                    <div className="bg-glass rounded-2xl p-6 border border-white/20 shadow-sm opacity-60">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">System Health</h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">Backups: <span className="text-green-600 font-bold">Active</span></p>
                        <p className="text-sm text-[var(--color-text-secondary)]">Monitoring: <span className="text-green-600 font-bold">Online</span></p>
                    </div>
                </div>

                {/* BOOKINGS TABLE SECTION */}
                <div className="mt-8">
                    <BookingsTableSection />
                </div>
            </div>

            {/* MODALS */}
            <StudentListModal isOpen={showStudents} onClose={() => setShowStudents(false)} />
            <TutorAllocationModal isOpen={showAllocation} onClose={() => setShowAllocation(false)} />
            <TutorListModal isOpen={showTutors} onClose={() => setShowTutors(false)} />
        </ProtectedClient >
    );
}
