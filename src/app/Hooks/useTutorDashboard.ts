
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useTutorDashboard() {
    const { data: bookings, isLoading: loadingBookings, error: bookingsError } = useQuery({
        queryKey: ['tutor-bookings'],
        queryFn: async () => {
            // Endpoint suggested in prompt
            const res = await api.get('/bookings/tutor');
            return Array.isArray(res) ? res : [];
        }
    });

    // Calculate stats and filtered lists locally for now
    const today = new Date().toDateString();

    const todaySessions = bookings?.filter((b: any) => {
        // Assuming booking has a date field, e.g., 'date' or 'start_time'
        const bookingDate = new Date(b.date || b.start_time).toDateString();
        return bookingDate === today;
    }) || [];

    const upcomingBookings = bookings?.filter((b: any) => {
        const bookingDate = new Date(b.date || b.start_time);
        return bookingDate > new Date() && b.status === 'confirmed';
    }) || [];


    return {
        todaySessions,
        upcomingBookings,
        stats: {
            todayCount: todaySessions.length,
            weekCount: bookings?.length || 0 // Simplified for now
        },
        loading: loadingBookings,
        error: bookingsError
    };
}
