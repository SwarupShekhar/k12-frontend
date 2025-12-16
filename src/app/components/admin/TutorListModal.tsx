'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/lib/api';

interface Tutor {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    subjects?: string[] | string; // Handle both array or string format
}

interface TutorListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TutorListModal({ isOpen, onClose }: TutorListModalProps) {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            api.get('/admin/tutors')
                .then(res => {
                    const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
                    setTutors(data);
                })
                .catch(() => {
                    // Fallback / Mock data
                    setTutors([
                        { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@tutor.com', subjects: ['Math', 'Physics'] },
                        { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@tutor.com', subjects: 'English, History' },
                        { id: '3', first_name: 'Robert', last_name: 'Taylor', email: 'robert@tutor.com', subjects: ['Chemistry'] },
                    ]);
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const formatSubjects = (subjects?: string[] | string) => {
        if (Array.isArray(subjects)) return subjects.join(', ');
        return subjects || 'N/A';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border border-white/10">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Tutors</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-0">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading tutors...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">First Name</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Last Name</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Subjects</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {tutors.map(tutor => (
                                    <tr key={tutor.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-gray-800 dark:text-gray-200">{tutor.first_name}</td>
                                        <td className="p-4 text-gray-800 dark:text-gray-200">{tutor.last_name}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{tutor.email || 'N/A'}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                                            {formatSubjects(tutor.subjects)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
