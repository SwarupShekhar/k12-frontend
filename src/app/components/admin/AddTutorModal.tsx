'use client';

import React, { useState } from 'react';

interface AddTutorModalProps {
    isOpen: boolean;
    onClose: () => void;
    programId: string;
    onAdded: () => void;
}

// Mock Global Tutor Pool
const MOCK_ALL_TUTORS = [
    { id: 't_new1', name: 'New Tutor X', subjects: ['Math', 'Science'] },
    { id: 't_new2', name: 'New Tutor Y', subjects: ['English'] },
];

export default function AddTutorModal({ isOpen, onClose, programId, onAdded }: AddTutorModalProps) {
    const [selectedTutor, setSelectedTutor] = useState('');
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    if (!isOpen) return null;

    const handleAdd = async () => {
        if (!selectedTutor) return;
        setLoading(true);
        try {
            console.log(`Adding tutor ${selectedTutor} to program ${programId}`);
            // await api.post(`/admin/programs/${programId}/add-tutor`, { tutorId: selectedTutor });
            await new Promise(r => setTimeout(r, 1000));
            onAdded();
            onClose();
        } catch (e) {
            alert('Failed to add tutor');
        } finally {
            setLoading(false);
        }
    };

    const filteredTutors = MOCK_ALL_TUTORS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Add Tutor to Program</h3>
                    <p className="text-sm text-gray-500">Staff this program with a qualified tutor.</p>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Tutor</label>
                        <input
                            type="text"
                            placeholder="Search tutors..."
                            className="w-full mb-2 px-3 py-2 border rounded-lg text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
                            {filteredTutors.map(tutor => (
                                <div
                                    key={tutor.id}
                                    onClick={() => setSelectedTutor(tutor.id)}
                                    className={`p-3 text-sm cursor-pointer transition-colors ${selectedTutor === tutor.id ? 'bg-orange-50 text-orange-700 font-semibold' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex justify-between">
                                        <span>{tutor.name}</span>
                                        <span className="text-xs text-gray-500">{tutor.subjects.join(', ')}</span>
                                    </div>
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
                        onClick={handleAdd}
                        disabled={!selectedTutor || loading}
                        className="px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Adding...' : 'Confirm Staffing'}
                    </button>
                </div>
            </div>
        </div>
    );
}
