'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import { format } from 'date-fns';

interface Booking {
    id: string;
    student: { first_name: string; last_name: string };
    tutor?: { first_name: string; last_name: string };
    subject: { name: string };
    start_time: string;
    status: string;
}

// Safe formatting helper
const safeFormatDate = (dateString: string | undefined | null) => {
    if (!dateString) return '—';
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return 'Invalid Date';
        return format(d, 'PP p');
    } catch {
        return 'Invalid Date';
    }
};

export default function BookingsTableSection() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Fetch from new endpoint
                const res = await api.get(`/admin/bookings?page=${page}&limit=10`);
                // Handle different response structures gracefully
                const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setBookings(data);
            } catch (error) {
                console.error('Failed to fetch admin bookings', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [page]);

    return (
        <section className="bg-glass rounded-[2rem] p-8 border border-white/20 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    All Bookings & Allocations
                </h2>
                <button
                    onClick={() => window.location.reload()}
                    className="p-2 rounded-full hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
                    title="Refresh"
                >
                    ↻
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm uppercase">
                            <th className="py-3 px-4">Student</th>
                            <th className="py-3 px-4">Subject</th>
                            <th className="py-3 px-4">Tutor</th>
                            <th className="py-3 px-4">Schedule</th>
                            <th className="py-3 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" /></td>
                                </tr>
                            ))
                        ) : bookings.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-[var(--color-text-secondary)]">
                                    No bookings found.
                                </td>
                            </tr>
                        ) : (
                            bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-[var(--color-surface)]/50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-[var(--color-text-primary)]">
                                        {b.student?.first_name} {b.student?.last_name}
                                    </td>
                                    <td className="py-4 px-4 text-[var(--color-text-primary)]">
                                        {b.subject?.name}
                                    </td>
                                    <td className="py-4 px-4">
                                        {b.tutor ? (
                                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold">
                                                {b.tutor.first_name} {b.tutor.last_name}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-bold">
                                                Pending Allocation
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-[var(--color-text-secondary)]">
                                        {safeFormatDate(b.start_time)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`text-xs font-bold uppercase ${b.status === 'confirmed' ? 'text-green-500' :
                                            b.status === 'completed' ? 'text-blue-500' :
                                                b.status === 'cancelled' ? 'text-red-500' :
                                                    'text-gray-500'
                                            }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 rounded-lg border border-[var(--color-border)] disabled:opacity-50 text-sm"
                >
                    Previous
                </button>
                <div className="px-3 py-1 bg-[var(--color-surface)] rounded-lg text-sm">{page}</div>
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 rounded-lg border border-[var(--color-border)] disabled:opacity-50 text-sm"
                >
                    Next
                </button>
            </div>
        </section>
    );
}
