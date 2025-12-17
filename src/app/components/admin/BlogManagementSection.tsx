'use client';
import React, { useEffect, useState } from 'react';
import { blogsApi, BlogPost } from '@/app/lib/blogs';
import { format } from 'date-fns';
import Link from 'next/link';

export default function BlogManagementSection() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await blogsApi.getAdminAll(page, 10);
            setBlogs(res.data);
            setTotal(res.total);
        } catch (error) {
            console.error('Failed to fetch blogs', error);
        } finally {
            setLoading(false);
        }
    };

    // Safe formatting helper to prevent crashes
    const safeFormatDate = (dateString: string | undefined | null) => {
        if (!dateString) return '—';
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return 'Invalid Date';
            return format(d, 'MMM d, yyyy');
        } catch {
            return 'Invalid Date';
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [page]);

    const handleStatusUpdate = async (id: string, status: 'PUBLISHED' | 'REJECTED') => {
        if (!confirm(`Are you sure you want to mark this post as ${status}?`)) return;

        try {
            setProcessingId(id);
            await blogsApi.updateStatus(id, status);
            // Optimistic update or refresh
            setBlogs(prev => prev.map(b => b.id === id ? { ...b, status } : b));
            alert(`Blog ${status.toLowerCase()} successfully!`);
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <section className="bg-glass rounded-[2rem] p-8 border border-white/20 shadow-lg mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    Blog Management (Approvals)
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={fetchBlogs}
                        className="p-2 rounded-full hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
                        title="Refresh"
                    >
                        ↻
                    </button>
                    <Link
                        href="/admin/blogs/new"
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all"
                    >
                        + Write New
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm uppercase">
                            <th className="py-3 px-4">Title</th>
                            <th className="py-3 px-4">Author</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto" /></td>
                                </tr>
                            ))
                        ) : blogs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-[var(--color-text-secondary)]">
                                    No blogs found.
                                </td>
                            </tr>
                        ) : (
                            blogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-[var(--color-surface)]/50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-[var(--color-text-primary)]">
                                        <Link href={`/blogs/${blog.id}`} target="_blank" className="hover:underline">
                                            {blog.title}
                                        </Link>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-[var(--color-text-secondary)]">
                                        {blog.author?.first_name} {blog.author?.last_name}
                                    </td>
                                    <td className="py-4 px-4 text-sm">
                                        <span className="px-2 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)]">
                                            {blog.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-[var(--color-text-secondary)]">
                                        {safeFormatDate(blog.createdAt)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${blog.status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            blog.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {blog.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        {blog.status === 'PENDING' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(blog.id, 'PUBLISHED')}
                                                    disabled={!!processingId}
                                                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(blog.id, 'REJECTED')}
                                                    disabled={!!processingId}
                                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {blog.status === 'PUBLISHED' && (
                                            <button
                                                onClick={() => handleStatusUpdate(blog.id, 'REJECTED')}
                                                disabled={!!processingId}
                                                className="text-red-500 hover:text-red-600 text-xs font-bold underline"
                                            >
                                                Unpublish
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-end gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 rounded-lg border border-[var(--color-border)] disabled:opacity-50 text-sm"
                >
                    Previous
                </button>
                <div className="px-3 py-1 bg-[var(--color-surface)] rounded-lg text-sm">{page}</div>
                <button
                    disabled={blogs.length < 10} // Simple check, ideally check total
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 rounded-lg border border-[var(--color-border)] disabled:opacity-50 text-sm"
                >
                    Next
                </button>
            </div>
        </section>
    );
}
