import api from './api';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    category: string;
    status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
    author: {
        first_name: string;
        last_name: string;
    };
    createdAt: string;
}

export const blogsApi = {
    // Get all published blogs (Public)
    getAll: async (page = 1, limit = 9, category?: string) => {
        const params: any = { page, limit };
        if (category && category !== 'All') params.category = category;

        const res = await api.get('/blogs', { params });
        // Handle potential pagination structure { data: [], meta: {} } or just []
        return {
            data: Array.isArray(res.data) ? res.data : (res.data.data || []),
            total: res.data.total || 0,
        };
    },

    // Get single blog by ID or Slug (Public)
    getOne: async (idOrSlug: string) => {
        const res = await api.get(`/blogs/${idOrSlug}`);
        return res.data;
    },

    // Create new blog (Protected: Admin/Tutor)
    create: async (data: Partial<BlogPost>) => {
        const res = await api.post('/admin/blogs', data);
        return res.data;
    },

    // Admin: Get all blogs (including pending)
    getAdminAll: async (page = 1, limit = 10) => {
        const res = await api.get('/admin/blogs', { params: { page, limit } });
        return {
            data: Array.isArray(res.data) ? res.data : (res.data.data || []),
            total: res.data.total || 0
        };
    },

    // Admin: Approve/Reject
    updateStatus: async (id: string, status: 'PUBLISHED' | 'REJECTED') => {
        const res = await api.patch(`/admin/blogs/${id}/status`, { status });
        return res.data;
    }
};
