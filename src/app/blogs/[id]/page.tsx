'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MOCK_BLOGS } from '@/app/lib/mockBlogs';
import ReactMarkdown from 'react-markdown';

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params in Next.js 15+
    const unwrappedParams = use(params);
    const blog = MOCK_BLOGS.find(b => b.id === unwrappedParams.id);

    if (!blog) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-24 pb-20 px-6 relative">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-8 transition-colors group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Blogs
                </Link>

                {/* Hero */}
                <div className="relative w-full h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-10">
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 md:p-12">
                        <div className="inline-block px-3 py-1 bg-[var(--color-primary)] rounded-full text-xs font-bold text-white uppercase tracking-wider mb-4">
                            {blog.category}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                            {blog.title}
                        </h1>
                        <div className="flex items-center gap-6 text-white/80">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-xs font-bold">
                                    {blog.author.charAt(0)}
                                </div>
                                <span className="font-medium">{blog.author}</span>
                            </div>
                            <span>{blog.date}</span>
                            <span>{blog.readTime}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <article className="prose prose-lg dark:prose-invert max-w-none bg-glass p-8 md:p-12 rounded-[2rem] border border-white/20 shadow-lg">
                    <ReactMarkdown>{blog.content}</ReactMarkdown>
                </article>

            </div>

            {/* Decoration */}
            <div className="fixed top-40 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        </main>
    );
}
