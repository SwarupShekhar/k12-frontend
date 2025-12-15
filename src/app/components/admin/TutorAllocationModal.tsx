'use client';
import React, { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import useCatalog from '@/app/Hooks/useCatalog';

interface TutorAllocationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TutorAllocationModal({ isOpen, onClose }: TutorAllocationModalProps) {
    const { subjects, loading: loadingSubjects } = useCatalog();
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [tutors, setTutors] = useState<any[]>([]);

    // Selection state
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTutor, setSelectedTutor] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Load required data
            Promise.all([
                api.get('/admin/students').catch(() => ({ data: [{ id: '1', first_name: 'Alice', last_name: 'Doe' }] })), // Mock
                api.get('/admin/tutors').catch(() => ({ data: [{ id: 't1', first_name: 'John', last_name: 'Tutor', subjects: ['math', 'physics'] }] }))
            ]).then(([studentsRes, tutorsRes]) => {
                setStudents(studentsRes.data);
                setTutors(tutorsRes.data);
            });
        }
    }, [isOpen]);

    // Filter tutors based on selected subject
    const availableTutors = selectedSubject
        ? tutors.filter(t => t.subjects?.includes(selectedSubject))
        : [];

    const handleAllocate = async () => {
        if (!selectedStudent || !selectedSubject || !selectedTutor) return;
        setLoading(true);
        try {
            await api.post('/admin/allocations', {
                studentId: selectedStudent,
                subjectId: selectedSubject,
                tutorId: selectedTutor
            });
            alert('Tutor assigned successfully!');
            onClose();
        } catch (e) {
            console.error(e);
            alert('Failed to assign tutor (Mock endpoint might be missing)');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-white/10 p-6 flex flex-col gap-6">

                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Assign Tutor</h2>
                    <p className="text-sm text-gray-500">Match a student with a tutor for a specific subject.</p>
                </div>

                <div className="space-y-4">
                    {/* Student Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student</label>
                        <select
                            value={selectedStudent}
                            onChange={e => setSelectedStudent(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20"
                        >
                            <option value="">Select Student</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subject Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={e => { setSelectedSubject(e.target.value); setSelectedTutor(''); }}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20"
                        >
                            <option value="">Select Subject</option>
                            {subjects?.map((s: any) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tutor Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available Tutor</label>
                        <select
                            value={selectedTutor}
                            onChange={e => setSelectedTutor(e.target.value)}
                            disabled={!selectedSubject}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 disabled:opacity-50"
                        >
                            <option value="">{selectedSubject ? 'Select Tutor' : 'Select Subject First'}</option>
                            {availableTutors.map(t => (
                                <option key={t.id} value={t.id}>{t.first_name} {t.last_name} (Matches {selectedSubject})</option>
                            ))}
                        </select>
                        {selectedSubject && availableTutors.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">No tutors found for this subject.</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400">Cancel</button>
                    <button
                        onClick={handleAllocate}
                        disabled={loading || !selectedStudent || !selectedTutor}
                        className="px-6 py-2 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:brightness-110 disabled:opacity-50"
                    >
                        {loading ? 'Assigning...' : 'Assign Tutor'}
                    </button>
                </div>

            </div>
        </div>
    );
}
