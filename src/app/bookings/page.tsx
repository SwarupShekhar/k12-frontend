'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedClient from '@/app/components/ProtectedClient';
import BookingsList from '@/app/components/BookingsList';
import { useBookings } from '@/app/Hooks/useBookings';

export default function BookingsPage() {
    const { data: bookings, isLoading, error } = useBookings();

    return (
        <ProtectedClient roles={['parent']}>
            <div className="min-h-screen bg-[var(--color-background)] py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <Link href="/parent/dashboard" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-2 inline-block">
                                ← Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                                All Bookings
                            </h1>
                        </div>
                        <Link
                            href="/bookings/new"
                            className="px-6 py-3 rounded-full bg-[var(--color-primary)] text-white font-bold shadow-lg hover:opacity-90 transition-all"
                        >
                            + New Booking
                        </Link>
                    </div>

                    <div className="bg-glass rounded-[2rem] p-8 border border-white/20 shadow-sm">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <p className="text-[var(--color-text-secondary)]">Loading your bookings...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 text-red-500">
                                <p>Failed to load bookings. Please try again later.</p>
                            </div>
                        ) : (
                            <BookingsList bookings={bookings ?? []} />
                        )}
                    </div>
                </div>
            </div>
        </ProtectedClient>
    );
}
