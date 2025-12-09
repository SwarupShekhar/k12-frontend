// src/app/components/BookingsList.tsx
'use client';
import React from 'react';

type Booking = {
    id: string;
    student_id?: string;
    package_id?: string;
    subject_id?: string;
    curriculum_id?: string;
    requested_start?: string;
    requested_end?: string;
    status?: string;
    assigned_tutor_id?: string;
    created_at?: string;
};

export default function BookingsList({ bookings }: { bookings: Booking[] }) {
    if (!bookings || bookings.length === 0)
        return <div>No bookings yet. Create one from "New booking".</div>;

    return (
        <div className="space-y-3">
            {bookings.map((b) => (
                <div key={b.id} className="p-3 rounded-lg border hover:shadow-md flex justify-between items-start">
                    <div>
                        <div className="text-sm text-gray-500">
                            {new Date(b.requested_start || b.created_at || '').toLocaleString()}
                        </div>
                        <div className="font-medium">{b.subject_id ?? 'Subject'}</div>
                        <div className="text-sm text-gray-600">Status: <span className="font-semibold">{b.status}</span></div>
                    </div>

                    <div className="flex gap-2">
                        <a
                            href={`/bookings/${b.id}`}
                            className="px-3 py-1 rounded bg-[#1C3A5A] text-white text-sm"
                        >
                            View
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}