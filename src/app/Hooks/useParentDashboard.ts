
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthContext } from '../context/AuthContext';

export function useParentDashboard() {
    const { user } = useAuthContext();
    const userId = user?.id;

    const { data: upcomingSessions, isLoading: loadingSessions, error: sessionsError } = useQuery({
        queryKey: ['parent-upcoming-sessions', userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await api.get('/bookings/parent');
            const data = Array.isArray(res.data) ? res.data : [];
            return data;
        },
        enabled: !!userId
    });

    // Fetch full student list for the "My Children" column
    const { data: students, isLoading: loadingStudentList, error: studentsError } = useQuery({
        queryKey: ['parent-students-list', userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await api.get('/students/parent');
            const data = Array.isArray(res.data) ? res.data : [];
            return data;
        },
        enabled: !!userId
    });

    return {
        studentCount: students?.length || 0,
        loadingStudents: loadingStudentList,
        studentsError,
        upcomingSessions: upcomingSessions?.slice(0, 5) || [], // Limit to 5
        loadingSessions,
        sessionsError,
        students: students || [],
        loadingStudentList
    };
}
