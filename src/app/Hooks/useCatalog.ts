// src/app/hooks/useCatalog.ts
'use client';
import { useQueries } from '@tanstack/react-query';
import api from '@/app/lib/api';

export default function useCatalog() {
    const results = useQueries({
        queries: [
            {
                queryKey: ['subjects'],
                queryFn: async () => (await api.get('/subjects')).data,
                staleTime: 60_000,
            },
            {
                queryKey: ['curricula'],
                queryFn: async () => (await api.get('/curricula')).data,
                staleTime: 60_000,
            },
            {
                queryKey: ['packages'],
                queryFn: async () => (await api.get('/packages')).data,
                staleTime: 60_000,
            },
        ],
    });

    const [subjectsQ, curriculaQ, packagesQ] = results;
    return {
        subjects: subjectsQ?.data ?? [],
        curricula: curriculaQ?.data ?? [],
        packages: packagesQ?.data ?? [],
        loading: subjectsQ?.isLoading || curriculaQ?.isLoading || packagesQ?.isLoading,
        error: subjectsQ?.error || curriculaQ?.error || packagesQ?.error,
    };
}