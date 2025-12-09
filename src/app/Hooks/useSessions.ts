import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

const fetchSessions = async () => {
    const { data } = await api.get('/sessions');
    return data;
};

export const useSessions = () => {
    return useQuery({
        queryKey: ['sessions'],
        queryFn: fetchSessions,
    });
};
