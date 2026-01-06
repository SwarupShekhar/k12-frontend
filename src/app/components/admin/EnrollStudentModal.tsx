'use client';

import React, { useState, useEffect } from 'react';
import api from '@/app/lib/api';

interface EnrollStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    programId: string;
    onEnrolled: () => void;
}

// Mock Global Student Pool
const MOCK_ALL_STUDENTS = [
    { id: 's_new1', name: 'New Student A' },
    { id: 's_new2', name: 'New Student B' },
    { id: 's_new3', name: 'New Student C' },
];

export default function EnrollStudentModal({ isOpen, onClose, programId, onEnrolled }: EnrollStudentModalProps) {
    const [selectedStudent, setSelectedStudent] = useState('');
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    if (!isOpen) return null;

    const handleEnroll = async () => {
        if (!selectedStudent) return;
        setLoading(true);
        try {
            console.log(`Enrolling student ${selectedStudent} into program ${programId}`);
            // In real app:
            // await api.post(`/admin/programs/${programId}/enroll-student`, { studentId: selectedStudent });
            await new Promise(r => setTimeout(r, 1000));
            onEnrolled();
            onClose();
        } catch (e) {
            console.error(e);
            alert('Failed to enroll student');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = MOCK_ALL_STUDENTS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Enroll Student</h3>
                    <p className="text-sm text-gray-500">Add a student to this program.</p>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full mb-2 px-3 py-2 border rounded-lg text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
                            {filteredStudents.map(student => (
                                <div
                                    key={student.id}
                                    onClick={() => setSelectedStudent(student.id)}
                                    className={`p-3 text-sm cursor-pointer transition-colors ${selectedStudent === student.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    {student.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEnroll}
                        disabled={!selectedStudent || loading}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Enrolling...' : 'Confirm Enrollment'}
                    </button>
                </div>
            </div>
        </div>
    );
}
