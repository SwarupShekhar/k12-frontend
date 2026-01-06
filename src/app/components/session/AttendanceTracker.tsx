'use client';

import React, { useState } from 'react';

interface AttendanceTrackerProps {
    sessionId: string;
    students: { id: string; name: string }[];
    onSave: (attendance: any) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function AttendanceTracker({ sessionId, students, onSave, isOpen, onClose }: AttendanceTrackerProps) {
    // Default all to 'absent' until marked
    const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

    const handleToggle = (studentId: string, status: 'present' | 'absent' | 'late') => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = () => {
        // Validation: Ensure all are marked? Or assume absent if not marked?
        // For now, simple pass-through
        onSave(attendance);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-20 right-4 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden text-black animate-slide-in-right">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold">📝 Attendance</h3>
                <button onClick={onClose} className="text-white/80 hover:text-white text-xl">×</button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
                {students.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No students in roster.</p>
                ) : (
                    <div className="space-y-3">
                        {students.map(student => (
                            <div key={student.id} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="font-medium text-gray-800">{student.name}</span>
                                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                                    {(['present', 'late', 'absent'] as const).map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleToggle(student.id, status)}
                                            className={`flex-1 py-1 rounded-md text-xs font-bold capitalize transition-all ${attendance[student.id] === status
                                                    ? status === 'present' ? 'bg-green-100 text-green-700'
                                                        : status === 'late' ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                    : 'text-gray-400 hover:bg-gray-50'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button
                    onClick={handleSave}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-colors"
                >
                    Save Records
                </button>
            </div>
        </div>
    );
}
