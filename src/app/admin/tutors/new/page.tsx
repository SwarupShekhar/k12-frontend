'use client';

import React, { useState } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import api from '@/app/lib/api';
import { useRouter } from 'next/navigation';

export default function NewTutorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        subjects: '' // Comma separated for now, or handled by backend assumption
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // NOTE: Reverting to /auth/signup per user request (Backend says it is implemented)
            const res = await api.post('/auth/signup', {
                ...formData,
                role: 'tutor'
            });
            alert('Tutor created successfully!');
            router.push('/admin/dashboard'); // Assuming exists, or back to home
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to create tutor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedClient roles={['admin']}>
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="max-w-md w-full bg-glass p-8 rounded-2xl border border-white/20 shadow-xl">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Create New Tutor</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">First Name</label>
                                <input required name="first_name" onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Last Name</label>
                                <input required name="last_name" onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)]" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Email</label>
                            <input required type="email" name="email" onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)]" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Password</label>
                            <input required type="password" name="password" onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)]" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Subjects (Comma separated)</label>
                            <input name="subjects" placeholder="Math, Physics" onChange={handleChange} className="w-full px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)]" />
                        </div>

                        <button disabled={loading} type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                            {loading ? 'Creating...' : 'Create Tutor Reference'}
                        </button>
                    </form>
                </div>
            </div>
        </ProtectedClient>
    );
}
