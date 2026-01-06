'use client';

import React, { useEffect, useState } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import { School } from '@/app/types/school';
import { Program } from '@/app/types/program';
import Link from 'next/link';
import api from '@/app/lib/api';

export default function SchoolDashboardPage() {
    const [school, setSchool] = useState<School | null>(null);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real scenario, we might need to get the school ID from the user's profile
                // or have an endpoint like /schools/me
                // For now, assuming the user object has a schoolId or we fetch "my school"
                // Let's assume GET /schools/me returns the logged-in user's school

                const schoolRes = await api.get('/schools/me');
                setSchool(schoolRes.data);

                if (schoolRes.data?.id) {
                    const programsRes = await api.get(`/schools/${schoolRes.data.id}/programs`);
                    setPrograms(programsRes.data);
                }
            } catch (err) {
                console.error('Failed to fetch school dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-[var(--color-text-secondary)] text-center">Loading School OS...</div>;

    // Fallback if no school is found (e.g. user is not assigned to a school)
    if (!school) return (
        <ProtectedClient roles={['admin', 'school_admin']}>
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">No School Assigned</h1>
                <p>Please contact your administrator to link your account to a school.</p>
            </div>
        </ProtectedClient>
    );

    const complianceColor = (school.complianceScore || 0) > 90 ? 'text-green-600' : (school.complianceScore || 0) > 70 ? 'text-yellow-600' : 'text-red-600';
    const complianceBg = (school.complianceScore || 0) > 90 ? 'bg-green-100' : (school.complianceScore || 0) > 70 ? 'bg-yellow-100' : 'bg-red-100';

    return (
        <ProtectedClient roles={['admin', 'school_admin']}>
            <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-glass rounded-[2rem] p-8 border border-white/20 shadow-lg">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">{school.name}</h1>
                        <p className="text-[var(--color-text-secondary)]">District Managed Operations</p>
                    </div>
                    <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 ${complianceBg}`}>
                        <div className="text-sm uppercase font-bold text-gray-600 tracking-wider">Compliance Score</div>
                        <div className={`text-4xl font-bold ${complianceColor}`}>{school.complianceScore}%</div>
                    </div>
                </div>

                {/* KPI GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white/40 p-6 rounded-2xl border border-white/20">
                        <div className="text-sm font-bold text-[var(--color-text-secondary)] uppercase">Active Programs</div>
                        <div className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">{programs.length}</div>
                    </div>
                    <div className="bg-white/40 p-6 rounded-2xl border border-white/20">
                        <div className="text-sm font-bold text-[var(--color-text-secondary)] uppercase">Total Students</div>
                        <div className="text-3xl font-bold text-blue-600 mt-1">
                            {programs.reduce((acc, p) => acc + (p.studentCount || 0), 0)}
                        </div>
                    </div>
                    <div className="bg-white/40 p-6 rounded-2xl border border-white/20">
                        <div className="text-sm font-bold text-[var(--color-text-secondary)] uppercase">Sessions Delivered</div>
                        <div className="text-3xl font-bold text-purple-600 mt-1">
                            {programs.reduce((acc, p) => acc + (p.sessionsDelivered || 0), 0)}
                        </div>
                    </div>
                    <div className="bg-white/40 p-6 rounded-2xl border border-white/20">
                        <div className="text-sm font-bold text-[var(--color-text-secondary)] uppercase">Hours of Learning</div>
                        <div className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">
                            {programs.reduce((acc, p) => acc + (p.hoursUsed || 0), 0).toFixed(1)}h
                        </div>
                    </div>
                </div>

                {/* PROGRAMS LIST */}
                <div className="bg-glass rounded-2xl border border-white/20 shadow-md overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Your Programs</h2>
                        <button className="text-sm text-blue-600 font-bold hover:underline">Download Report</button>
                    </div>
                    {programs.length === 0 ? (
                        <div className="p-8 text-center text-[var(--color-text-secondary)]">No programs active at this school.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-black/5 text-xs uppercase text-[var(--color-text-secondary)]">
                                    <th className="p-6">Program Name</th>
                                    <th className="p-6">Students</th>
                                    <th className="p-6">Progress</th>
                                    <th className="p-6">Attendance</th>
                                    <th className="p-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map(prog => (
                                    <tr key={prog.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="p-6 font-bold text-[var(--color-text-primary)]">{prog.name}</td>
                                        <td className="p-6 text-[var(--color-text-primary)]">{prog.studentCount || 0}</td>
                                        <td className="p-6">
                                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                {/* Calculate progress if data available, else 0 */}
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${(prog.sessionsDelivered && prog.upcomingSessions) ? Math.round((prog.sessionsDelivered / (prog.sessionsDelivered + prog.upcomingSessions)) * 100) : 0}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                                                {prog.sessionsDelivered || 0} sessions done
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {/* Mocking attendance status for list view as it's not on Program type yet directly */}
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">98% Present</span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className={`px-3 py-1 text-white text-xs font-bold rounded-full uppercase ${prog.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}>
                                                {prog.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* COMPLIANCE FOOTER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-white/30 rounded-2xl p-6 border border-white/20">
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Compliance Alerts</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-700">All tutors have valid background checks.</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-700">100% of sessions recorded successfully.</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/30 rounded-2xl p-6 border border-white/20">
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-4">District Resources</h3>
                        <div className="flex flex-wrap gap-3">
                            <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-semibold hover:bg-gray-50">Parent Consent Forms</button>
                            <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-semibold hover:bg-gray-50">Impact Report Q3</button>
                            <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-semibold hover:bg-gray-50">Tutor Credentials</button>
                        </div>
                    </div>
                </div>

            </div>
        </ProtectedClient>
    );
}
