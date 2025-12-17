
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useTutorDashboard() {
    // Fetch tutor's assigned bookings
    const { data: bookings, isLoading: loadingBookings, error: bookingsError } = useQuery({
        queryKey: ['tutor-bookings'],
        queryFn: async () => {
            const res = await api.get('/tutor/bookings');
            console.log('[useTutorDashboard] Raw bookings response:', res.data);
            return Array.isArray(res.data) ? res.data : [];
        }
    });

    // Fetch AVAILABLE (unclaimed) bookings matching tutor's subjects
    const { data: availableJobs, isLoading: loadingAvailable } = useQuery({
        queryKey: ['tutor-available-jobs'],
        queryFn: async () => {
            try {
                const res = await api.get('/bookings/available');
                return Array.isArray(res.data) ? res.data : [];
            } catch (e) {
                // Endpoint may not exist yet, gracefully return empty
                console.warn('Available jobs endpoint not ready', e);
                return [];
            }
        },
        refetchInterval: 30000, // Poll every 30 seconds for new jobs
    });

    // Helper function to extract date from booking
    const getBookingDate = (booking: any): Date | null => {
        // Prioritize actual scheduled times. Avoid created_at as it doesn't represent the session time.
        const dateValue = booking.start_time || booking.requested_start || booking.date;
        if (!dateValue) return null;

        try {
            return new Date(dateValue);
        } catch {
            return null;
        }
    };

    const now = new Date();
    // Normalize "today" to verify calendar date match
    const todayString = now.toDateString();

    console.log('[useTutorDashboard] Today:', todayString);
    console.log('[useTutorDashboard] All bookings:', bookings);

    const todaySessions = bookings?.filter((b: any) => {
        const bookingDate = getBookingDate(b);
        if (!bookingDate) {
            return false;
        }

        // STRICT CHECK: Matches today's calendar date
        const isSameCalendarDay = bookingDate.toDateString() === todayString;

        // STRICT FILTER: Session must not have ended
        const endStr = b.end_time || b.requested_end;
        // If end time is missing, assume 1 hour duration from start
        const sessionEnd = endStr
            ? new Date(endStr)
            : new Date(bookingDate.getTime() + 60 * 60 * 1000);

        // Use a small buffer (e.g. 5 mins) to allow wrapping up? Or strict now? User asked for strict expiry.
        // If sessionEnd < now, it's expired.
        const hasNotEnded = sessionEnd > now;

        console.log('[useTutorDashboard] Booking:', {
            id: b.id,
            date: bookingDate.toDateString(),
            isSameCalendarDay,
            hasNotEnded,
            subject: b.subject_name
        });

        return isSameCalendarDay && hasNotEnded;
    }) || [];

    const upcomingBookings = bookings?.filter((b: any) => {
        const bookingDate = getBookingDate(b);
        if (!bookingDate) return false;

        // Upcoming = Future dates (tomorrow onwards)
        // logic: bookingDate > end of today?
        // Simpler: bookingDate is in the future AND NOT today
        const isFuture = bookingDate > now;
        const isNotToday = bookingDate.toDateString() !== todayString;

        return isFuture && isNotToday;
    }) || [];

    console.log('[useTutorDashboard] Filtered results:', {
        todayCount: todaySessions.length,
        upcomingCount: upcomingBookings.length,
        totalCount: bookings?.length || 0
    });

    return {
        todaySessions,
        upcomingBookings,
        availableJobs: availableJobs || [],
        stats: {
            todayCount: todaySessions.length,
            weekCount: bookings?.length || 0,
            availableCount: availableJobs?.length || 0
        },
        loading: loadingBookings || loadingAvailable,
        error: bookingsError
    };
}

