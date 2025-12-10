
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthContext } from '../context/AuthContext';

export function useParentDashboard() {
    const { user } = useAuthContext();
    const userId = user?.id;

    const { data: studentCount, isLoading: loadingStudents, error: studentsError } = useQuery({
        queryKey: ['parent-students-count', userId],
        queryFn: async () => {
            if (!userId) return 0;
            const res = await api.get('/students/parent');
            const data = Array.isArray(res.data) ? res.data : [];
            // Filter by parent_id if available to handle backend leakage
            return data.filter((s: any) => s.parentId === userId || s.parent_id === userId).length;
        },
        enabled: !!userId
    });

    const { data: upcomingSessions, isLoading: loadingSessions, error: sessionsError } = useQuery({
        queryKey: ['parent-upcoming-sessions', userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await api.get('/bookings/parent');
            const data = Array.isArray(res.data) ? res.data : [];
            // Filter by parent_id if available
            return data.filter((b: any) => b.parentId === userId || b.parent_id === userId || b.student?.parentId === userId);
        },
        enabled: !!userId
    });

    // Fetch full student list for the "My Children" column
    const { data: students, isLoading: loadingStudentList } = useQuery({
        queryKey: ['parent-students-list', userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await api.get('/students/parent');
            const data = Array.isArray(res.data) ? res.data : [];
            return data.filter((s: any) => s.parentId === userId || s.parent_id === userId);
        },
        enabled: !!userId
    });

    return {
        studentCount: studentCount || 0,
        loadingStudents,
        studentsError,
        upcomingSessions: upcomingSessions?.slice(0, 5) || [], // Limit to 5
        loadingSessions,
        sessionsError,
        students: students || [],
        loadingStudentList
    };
}
