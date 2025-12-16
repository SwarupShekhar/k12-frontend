'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { blogsApi, BlogPost } from '@/app/lib/blogs';

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const res = await blogsApi.getAll(1, 100, category);
                setBlogs(res.data);
                setError('');
            } catch (err) {
                console.error(err);
                setError('Failed to load blogs.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [category]);

    const categories = ['All', 'Math', 'Science', 'Study Tips', 'College Prep'];

    return (
        <div className="min-h-screen bg-[var(--color-background)] pt-24 px-6 pb-20">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Latest Insights
                    </h1>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                        Tips, tricks, and educational resources from our expert tutors.
                    </p>
                </div>

                {/* Filter */}
                <div className="flex justify-center gap-2 flex-wrap">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat
                                    ? 'bg-[var(--color-primary)] text-white shadow-lg'
                                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">{error}</div>
                ) : blogs.length === 0 ? (
                    <div className="text-center text-[var(--color-text-secondary)] py-10">
                        No blogs found for this category.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog, idx) => (
                            <Link href={`/blogs/${blog.id}`} key={blog.id}>
                                <motion.article
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group h-full bg-glass rounded-[2rem] border border-white/10 overflow-hidden hover:border-[var(--color-primary)]/50 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col"
                                >
                                    {/* Image */}
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                                        <img
                                            src={blog.imageUrl}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Blog')}
                                        />
                                        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                                            {blog.category}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3 text-xs text-[var(--color-text-secondary)]">
                                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{blog.author?.first_name} {blog.author?.last_name}</span>
                                        </div>

                                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                                            {blog.title}
                                        </h2>

                                        <p className="text-[var(--color-text-secondary)] text-sm line-clamp-3 mb-4 flex-1">
                                            {blog.excerpt}
                                        </p>

                                        <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm">
                                            Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                </motion.article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
