import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

export interface Booking {
    id: string;
    start_time: string;
    end_time: string;
    status: 'scheduled' | 'completed' | 'cancelled';
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
            return res.data || [];
        },
    });

    // Helper: Sort by start time
    const sortedBookings = [...bookings].sort((a: any, b: any) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    const now = new Date();

    // Upcoming: start_time > now, status != cancelled
    const upcomingSessions = sortedBookings.filter((b: any) =>
        new Date(b.end_time) > now && b.status !== 'cancelled'
    );

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
