'use client';

import React, { useEffect, useState, use } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { blogsApi, BlogPost } from '@/app/lib/blogs';

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const data = await blogsApi.getOne(id);
                setBlog(data);
            } catch (err) {
                console.error(err);
                setError('Blog post not found.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] space-y-4">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Post not found</h1>
                <Link href="/blogs" className="text-[var(--color-primary)] hover:underline">
                    ← Back to Blogs
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--color-background)] pb-20">
            {/* HERO IMAGE */}
            <div className="relative h-[60vh] w-full">
                <div className="absolute inset-0 bg-gray-900/50 z-10" />
                <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/1200x600?text=No+Image')}
                />

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full z-20 pb-12 pt-32 bg-gradient-to-t from-[var(--color-background)] to-transparent">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="flex gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-wider">
                                {blog.category}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                            {blog.title}
                        </h1>
                        <div className="flex items-center gap-4 text-white/90">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm">
                                {blog.author?.first_name?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <p className="font-bold">{blog.author?.first_name} {blog.author?.last_name}</p>
                                <p className="text-sm opacity-80">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <article className="max-w-3xl mx-auto px-6 mt-12">
                <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:text-[var(--color-text-primary)] prose-p:text-[var(--color-text-secondary)] prose-a:text-[var(--color-primary)] transition-colors">
                    <ReactMarkdown>{blog.content}</ReactMarkdown>
                </div>

                {/* Back Button */}
                <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
                    <Link href="/blogs" className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors">
                        <span>←</span> Back to all articles
                    </Link>
                </div>
            </article>
        </main>
    );
}
