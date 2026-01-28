'use client';

import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface AttentionFrameworkPanelProps {
    sessionId: string;
    studentId: string;
    tutorId: string;
    socket: Socket | null;
}

const LOOPS = [
    { id: 'CHECK_IN', label: 'Personal Check-in', icon: '👋', color: 'bg-blue-50' },
    { id: 'EXPLANATION', label: 'Individual Explanation', icon: '📖', color: 'bg-indigo-50' },
    { id: 'RESPONSE', label: 'Individual Response', icon: '💬', color: 'bg-emerald-50' },
    { id: 'CORRECTION', label: 'Individual Correction', icon: '🎯', color: 'bg-amber-50' },
    { id: 'PRAISE', label: 'Individual Praise', icon: '⭐', color: 'bg-pink-50' },
];

export default function AttentionFrameworkPanel({ sessionId, studentId, tutorId, socket }: AttentionFrameworkPanelProps) {
    const [summary, setSummary] = useState<any>(null);

    useEffect(() => {
        if (!socket) return;

        console.log('[AttentionPanel] Socket connected, subbing to events');

        socket.on('session.attentionSummary.updated', (newSummary) => {
            console.log('[AttentionPanel] Summary updated:', newSummary);
            setSummary(newSummary);
        });

        // Optionally fetch initial summary if needed via API
        // For now, it will update as events happen.

        return () => {
            socket.off('session.attentionSummary.updated');
        };
    }, [socket]);

    const logEvent = (type: string) => {
        if (!socket) {
            console.warn('[AttentionPanel] Cannot log event: Socket disconnected');
            return;
        }

        console.log('[AttentionPanel] Emitting event:', type);
        socket.emit('session.attentionEvent.create', {
            sessionId,
            studentId,
            tutorId,
            type,
            metadata: {
                timestamp: new Date(),
                source: 'tutor_panel'
            }
        });
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white text-sm shadow-lg shadow-purple-500/30">
                        ⚡
                    </div>
                    Attention Loops
                </h2>
                <div className="px-3 py-1 bg-purple-100 rounded-full">
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-tighter">Layer 1 active</span>
                </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {LOOPS.map((loop) => (
                    <div
                        key={loop.id}
                        className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${loop.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                                {loop.icon}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{loop.label}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className={`w-2 h-2 rounded-full ${summary?.[loop.id.toLowerCase()] > 0 ? 'bg-green-500' : 'bg-gray-200'}`} />
                                    <p className="text-[10px] font-medium text-gray-400">
                                        Count: <span className="text-gray-900">{summary?.[loop.id.toLowerCase()] || 0}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => logEvent(loop.id)}
                            className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-purple-600 hover:text-white transition-all transform active:scale-90"
                            title={`Log ${loop.label}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {summary?.loopsComplete && (
                <div className="mt-6 p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg shadow-green-500/20 flex items-center gap-4 animate-in slide-in-from-bottom-2">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                        🏆
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Framework Complete</p>
                        <p className="text-[10px] text-white/80">Excellent student engagement!</p>
                    </div>
                </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Personalization Intensity</span>
                        <p className="text-xs font-medium text-gray-500">Manual attention events metric</p>
                    </div>
                    <span className="text-2xl font-black text-purple-600 tracking-tighter">{summary?.personalizationScore || 0}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner p-0.5">
                    <div
                        className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 h-full rounded-full transition-all duration-1000 shadow-lg shadow-purple-500/20"
                        style={{ width: `${summary?.personalizationScore || 0}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
