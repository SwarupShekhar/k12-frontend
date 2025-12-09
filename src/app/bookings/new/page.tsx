// src/app/bookings/new/page.tsx
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/app/lib/api';
import ProtectedClient from '@/app/components/ProtectedClient';
import BookingWizard from '@/app/components/bookings/BookingWizard';

interface StudentSummary {
    id: string;
    name: string;
}

export default function NewBookingPage() {
    const {
        data: students = [],
        isError,
        error,
        isLoading,
    } = useQuery<StudentSummary[]>({
        queryKey: ['students', 'parent'],
        queryFn: async () => {
            try {
                // this is the backend route we built earlier
                const res = await api.get('/students/parent');
                return res.data.map((s: any) => ({
                    id: s.id,
                    name: s.name || (s.school ? `${s.school} — Grade ${s.grade}` : s.id),
                }));
            } catch (err: any) {
                // If backend hasn't implemented /students/parent yet or returns 404,
                // treat it as "no students yet" instead of a hard error.
                if (err?.response?.status === 404) {
                    return [];
                }
                throw err;
            }
        },
        staleTime: 30_000,
    });

    // Only show the big red banner if it's a *real* error, not just 404
    const hardError =
        isError && (error as any)?.response?.status !== 404;

    return (
        <ProtectedClient roles={['parent']}>
            <div className="max-w-5xl mx-auto px-6 py-10">
                {hardError && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        Could not load students. Please refresh the page.
                    </div>
                )}

                <BookingWizard students={students} isStudentsLoading={isLoading} />
            </div>
        </ProtectedClient>
    );
}