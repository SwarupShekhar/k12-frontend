'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import ProtectedClient from '@/app/components/ProtectedClient';
import api from '@/app/lib/api';

export default function ClaimSessionPage() {
    // Unwrapping params: https://nextjs.org/docs/messages/sync-dynamic-apis
    const params = useParams();
    const id = params?.id as string;
    const { user } = useAuthContext();

    const router = useRouter();
    const [loading, setLoading] = useState(false); // Only load when claiming or fetching info
    const [error, setError] = useState<string | null>(null);
    const [bookingDetails, setBookingDetails] = useState<any>(null);

    // Optional: Fetch booking details to show what they are claiming
    // This requires a GET /bookings/:id endpoint accessible to tutors
    useEffect(() => {
        if (!id) return;
        api.get(`/bookings/${id}`)
            .then(res => setBookingDetails(res.data))
            .catch(() => {
                // Ignore fetch error, maybe just access rights. 
                // We will rely on the user manually clicking 'Claim' anyway.
            });
    }, [id]);

    const handleClaim = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            await api.post(`/bookings/${id}/claim`);
            // Success!
            alert('Session claimed successfully! You are now the tutor.');
            router.push('/tutor/dashboard');
        } catch (err: any) {
            console.error(err);
            if (err?.response?.status === 409) {
                setError('Too late! This session has already been taken by another tutor.');
            } else {
                setError(err?.response?.data?.message || 'Failed to claim session.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedClient roles={['tutor']}>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-glass border border-white/20 rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <div className="mb-6 text-4xl">⚡️</div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                        New Session Opportunity
                    </h1>

                    {bookingDetails ? (
                        <div className="my-6 p-4 bg-white/50 rounded-xl border border-white/20 text-left space-y-2">
                            <p className="text-sm text-[var(--color-text-secondary)] uppercase font-bold">Subject</p>
                            <p className="text-lg font-bold text-[var(--color-text-primary)]">{bookingDetails.subject_name || 'TBD'}</p>

                            <p className="text-sm text-[var(--color-text-secondary)] uppercase font-bold mt-2">Time</p>
                            <p className="text-[var(--color-text-primary)]">
                                {bookingDetails.start_time ? new Date(bookingDetails.start_time).toLocaleString() : 'TBD'}
                            </p>
                        </div>
                    ) : (
                        <p className="text-[var(--color-text-secondary)] mb-8">
                            A student is looking for a tutor. Click below to accept this job.
                        </p>
                    )}

                    {error && (
                        <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleClaim}
                        disabled={loading || !!error || user?.email_verified === false} // Disable if already failed or unverified
                        className="w-full py-3 px-4 bg-[var(--color-primary)] hover:brightness-110 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title={user?.email_verified === false ? "Please verify your email first" : ""}
                    >
                        {loading ? 'Claiming...' : (user?.email_verified === false ? 'Verify Email to Accept' : 'Accept Session')}
                    </button>

                    <button
                        onClick={() => router.push('/tutor/dashboard')}
                        className="mt-4 text-sm text-[var(--color-text-secondary)] hover:underline"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </ProtectedClient>
    );
}
