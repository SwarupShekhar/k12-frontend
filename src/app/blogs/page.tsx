'use client';

import React from 'react';
import Link from 'next/link';
import { MOCK_BLOGS } from '@/app/lib/mockBlogs';
import Image from 'next/image';

export default function BlogsPage() {
    return (
        <main className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <section className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        Our Latest Insights
                    </h1>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        Discover tips, educational trends, and stories from our expert community.
                    </p>
                </section>

                {/* Featured / Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_BLOGS.map((blog) => (
                        <Link
                            href={`/blogs/${blog.id}`}
                            key={blog.id}
                            className="group relative bg-glass rounded-[2rem] overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Image Wrapper */}
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider">
                                    {blog.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] mb-3">
                                    <span>{blog.date}</span>
                                    <span>•</span>
                                    <span>{blog.readTime}</span>
                                </div>

                                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                                    {blog.title}
                                </h3>

                                <p className="text-[var(--color-text-secondary)] line-clamp-3 mb-6 flex-1">
                                    {blog.excerpt}
                                </p>

                                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                        {blog.author.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                        {blog.author}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>

            {/* Decoration */}
            <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />
        </main>
    );
}
