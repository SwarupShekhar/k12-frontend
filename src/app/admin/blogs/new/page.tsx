'use client';

import React, { useState } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import Link from 'next/link';
import { useAuthContext } from '@/app/context/AuthContext';

export default function NewBlogPage() {
    const { user } = useAuthContext();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        imageUrl: '',
        excerpt: '',
        content: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // MOCK SUBMISSION
        console.log('Publishing blog:', formData);
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (user?.role === 'admin') {
            alert('Blog published successfully! (Mock)');
        } else {
            alert('Submitted to Admin for approval! (Mock)');
        }

        setLoading(false);
        // Ideally redirect to /blogs or dashboard
        // router.push('/blogs');
    };

    return (
        <ProtectedClient roles={['admin', 'tutor']}>
            <div className="min-h-screen pt-24 pb-20 px-6">
                <div className="max-w-4xl mx-auto">

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Write New Post</h1>
                            <p className="text-[var(--color-text-secondary)]">Share your knowledge with the community.</p>
                        </div>
                        <Link href="/blogs" className="text-sm border border-[var(--color-border)] px-4 py-2 rounded-full hover:bg-[var(--color-surface)]">
                            Cancel
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-glass p-8 rounded-[2rem] border border-white/20 shadow-xl">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-[var(--color-text-secondary)]/50"
                                placeholder="Enter an engaging title..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2">Category</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all"
                                >
                                    <option value="">Select Category</option>
                                    <option value="EdTech">EdTech</option>
                                    <option value="Study Tips">Study Tips</option>
                                    <option value="Test Prep">Test Prep</option>
                                    <option value="Subject Mastery">Subject Mastery</option>
                                </select>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2">Cover Image URL</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-[var(--color-text-secondary)]/50"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2">Short Excerpt</label>
                            <textarea
                                required
                                rows={2}
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-[var(--color-text-secondary)]/50"
                                placeholder="A brief summary for the preview card..."
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2">Content (Markdown Supported)</label>
                            <textarea
                                required
                                rows={12}
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all font-mono text-sm placeholder:text-[var(--color-text-secondary)]/50"
                                placeholder="# Heading&#10;&#10;Write your article here..."
                            />
                            <p className="text-xs text-[var(--color-text-secondary)] mt-2 text-right">
                                Supports Markdown formatting
                            </p>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-3 rounded-xl text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100 ${user?.role === 'admin'
                                        ? 'bg-gradient-to-r from-[var(--color-primary)] to-purple-600'
                                        : 'bg-gradient-to-r from-orange-500 to-red-500'
                                    }`}
                            >
                                {loading
                                    ? 'Processing...'
                                    : (user?.role === 'admin' ? 'Publish Post' : 'Submit for Approval')
                                }
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </ProtectedClient>
    );
}
