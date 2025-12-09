import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

// Define a type for Booking if possible, or use any/interface
// Since I don't have the Booking type, I'll assume it returns an array.
// Ideally I'd import a type but I don't see one yet.

const fetchBookings = async () => {
    const { data } = await api.get('/bookings');
    return data;
};

export const useBookings = () => {
    return useQuery({
        queryKey: ['bookings'],
        queryFn: fetchBookings,
    });
};