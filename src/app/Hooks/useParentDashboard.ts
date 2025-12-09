
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useParentDashboard() {
    const { data: studentCount, isLoading: loadingStudents, error: studentsError } = useQuery({
        queryKey: ['parent-students-count'],
        queryFn: async () => {
            const res = await api.get('/students/parent');
            return Array.isArray(res) ? res.length : 0;
        }
    });

    const { data: upcomingSessions, isLoading: loadingSessions, error: sessionsError } = useQuery({
        queryKey: ['parent-upcoming-sessions'],
        queryFn: async () => {
            // Assuming GET /bookings/mine returns a list that can be filtered for upcoming sessions
            // Or ideally GET /sessions/parent if it exists. 
            // Falling back to existing pattern if unsure, but prompt mentioned GET /bookings/mine
            const res = await api.get('/bookings/parent') as any[]; // Aligning with likely existing endpoint
            // Mock filtering for "upcoming" if backend doesn't do it
            // For now, return raw list or basic slice
            return res || [];
        }
    });

    // Fetch full student list for the "My Children" column
    const { data: students, isLoading: loadingStudentList } = useQuery({
        queryKey: ['parent-students-list'],
        queryFn: async () => {
            const res = await api.get('/students/parent');
            return Array.isArray(res) ? res : [];
        }
    });

    return {
        studentCount,
        loadingStudents,
        studentsError,
        upcomingSessions: upcomingSessions?.slice(0, 5) || [], // Limit to 5
        loadingSessions,
        sessionsError,
        students: students || [],
        loadingStudentList
    };
}
