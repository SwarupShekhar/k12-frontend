import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

export interface Booking {
    id: string;
    start_time?: string;
    end_time?: string;
    requested_start?: string;
    requested_end?: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
    subject_id?: string;
    subject?: { name: string };
    tutor?: { first_name: string; last_name: string };
    meeting_link?: string;
}

export default function useStudentDashboard() {
    const { data: bookings = [], isLoading, error } = useQuery({
        queryKey: ['student-bookings'],
        queryFn: async () => {
            const res = await api.get('/bookings/student');
            const rawBookings = res.data || [];

            // Normalize data structure
            return rawBookings.map((b: any) => ({
                ...b,
                start_time: b.start_time || b.requested_start, // Fallback for pending sessions
                end_time: b.end_time || b.requested_end,
                subject: {
                    ...b.subject,
                    name: b.subject?.title || b.subject?.name || 'Tutoring Session' // Handle title vs name mismatch
                }
            }));
        },
    });

    // Helper: Sort by start time
    const sortedBookings = [...bookings].sort((a: any, b: any) => {
        const startA = new Date(a.start_time || a.requested_start || 0).getTime();
        const startB = new Date(b.start_time || b.requested_start || 0).getTime();
        return startA - startB;
    });

    const now = new Date();

    // DEBUG: Log details of each booking to see why they are filtered
    console.log('StudentDashboard: Current Time', now.toISOString());
    console.log('StudentDashboard: Raw Bookings', bookings.map((b: any) => ({
        id: b.id,
        start: b.start_time,
        reqStart: b.requested_start,
        end: b.end_time,
        status: b.status,
    })));

    // Upcoming: start_time > now, status != cancelled
    const upcomingSessions = sortedBookings.filter((b: any) => {
        // Fallback: Use start_time if end_time is missing?
        const startStr = b.start_time || b.requested_start;
        const endStr = b.end_time || b.requested_end;

        const debugId = `[${b.id.substring(0, 4)}...]:`;

        if (!startStr) {
            console.log(debugId, 'Discarded: No start time');
            return false;
        }

        // If end time is missing, assume 1 hour duration
        const endTime = endStr ? new Date(endStr) : new Date(new Date(startStr).getTime() + 60 * 60 * 1000);

        const isFuture = endTime > now;
        const isValidStatus = b.status !== 'cancelled' && b.status !== 'declined';

        if (!isFuture) console.log(debugId, 'Discarded: In past', endTime.toISOString(), '<', now.toISOString());
        if (!isValidStatus) console.log(debugId, 'Discarded: Status', b.status);

        return isFuture && isValidStatus;
    });
    console.log('StudentDashboard: Upcoming Filtered', upcomingSessions);

    // Past: end_time < now
    const pastSessions = sortedBookings.filter((b: any) =>
        new Date(b.end_time) <= now || b.status === 'completed'
    ).reverse(); // Most recent past first

    return {
        bookings,
        upcomingSessions,
        pastSessions,
        loading: isLoading,
        error
    };
}
