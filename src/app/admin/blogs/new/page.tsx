'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedClient from '@/app/components/ProtectedClient';
import ReactMarkdown from 'react-markdown';
import { useAuthContext } from '@/app/context/AuthContext';
import { blogsApi } from '@/app/lib/blogs';

export default function NewBlogPage() {
    const router = useRouter();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);

    // Determine Role
    const isAdmin = user?.role === 'admin';
    const isTutor = user?.role === 'tutor';

    const [form, setForm] = useState({
        title: '',
        category: 'Study Tips', // Default
        imageUrl: '',
        excerpt: '',
        content: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await blogsApi.create({
                title: form.title,
                category: form.category,
                imageUrl: form.imageUrl,
                excerpt: form.excerpt,
                content: form.content,
                // Backend handles Status (Admin -> PUBLISHED, Tutor -> PENDING) 
                // and Author (from JWT)
            });

            // Success handling
            if (isAdmin) {
                alert('Blog published successfully!');
                router.push('/blogs');
            } else {
                alert('Submitted to Admin for approval!');
                router.push('/tutor/dashboard');
            }

        } catch (error: any) {
            console.error('Failed to create blog:', error);
            alert(error.response?.data?.message || 'Failed to submit blog post');
        } finally {
            setLoading(false);
        }
    };

    // Preview Tab State
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

    return (
        <ProtectedClient roles={['admin', 'tutor']}>
            <div className="min-h-screen bg-[var(--color-background)] py-12 px-6">
                <div className="max-w-5xl mx-auto">

                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                            {isAdmin ? 'Write New Blog Post' : 'Submit Article for Review'}
                        </h1>
                        <button
                            onClick={() => router.back()}
                            className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                                    placeholder="e.g. 5 Tips for Acing Algebra"
                                />
                            </div>

                            {/* Category & Image */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none appearance-none"
                                    >
                                        <option>Study Tips</option>
                                        <option>Math</option>
                                        <option>Science</option>
                                        <option>English</option>
                                        <option>College Prep</option>
                                        <option>News</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        required
                                        value={form.imageUrl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Short Excerpt</label>
                                <textarea
                                    name="excerpt"
                                    required
                                    rows={3}
                                    value={form.excerpt}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                                    placeholder="Brief summary displayed on the card..."
                                />
                            </div>

                            {/* Content Editor */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Content (Markdown supported)</label>
                                    <div className="flex bg-[var(--color-surface)] rounded-lg p-1 border border-[var(--color-border)]">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('write')}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'write' ? 'bg-[var(--color-primary)] text-white shadow' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                                        >
                                            Write
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('preview')}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-[var(--color-primary)] text-white shadow' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>

                                {activeTab === 'write' ? (
                                    <textarea
                                        name="content"
                                        required
                                        rows={15}
                                        value={form.content}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none font-mono text-sm"
                                        placeholder="# Hello World..."
                                    />
                                ) : (
                                    <div className="w-full h-[380px] overflow-y-auto px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown>{form.content || '*Nothing to preview*'}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isAdmin
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-500/25'
                                            : 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/25'
                                        } ${loading ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {loading ? (
                                        <span>Saving...</span>
                                    ) : (
                                        <>
                                            <span>{isAdmin ? 'Publish Post 🚀' : 'Submit for Approval 📤'}</span>
                                        </>
                                    )}
                                </button>
                                {isTutor && (
                                    <p className="text-center text-xs text-[var(--color-text-secondary)] mt-3">
                                        Your post will be reviewed by an admin before going live.
                                    </p>
                                )}
                            </div>

                        </form>

                        {/* PREVIEW CARD */}
                        <div className="hidden lg:block space-y-4">
                            <p className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Live Preview</p>

                            <div className="bg-glass rounded-[2rem] border border-white/20 shadow-xl overflow-hidden pointer-events-none opacity-90 scale-90 origin-top">
                                <div className="h-48 bg-gray-200 relative">
                                    {form.imageUrl && (
                                        <img src={form.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                    )}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-bold">
                                        {form.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex gap-2 text-xs text-gray-400 mb-2">
                                        <span>{new Date().toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{user?.first_name} {user?.last_name}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                                        {form.title || 'Your Title Here'}
                                    </h2>
                                    <p className="text-[var(--color-text-secondary)] text-sm line-clamp-3">
                                        {form.excerpt || 'Your short summary will appear here...'}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ProtectedClient>
    );
}
