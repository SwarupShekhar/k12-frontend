'use client';

import React from 'react';

export type SessionPhase = 'WARM_CONNECT' | 'DIAGNOSE' | 'MICRO_TEACH' | 'ACTIVE_RESPONSE' | 'REINFORCE' | 'REFLECT';

interface SessionFlowBarProps {
    currentPhase: SessionPhase;
    onPhaseChange: (phase: SessionPhase) => void;
}

const PHASES: { id: SessionPhase; label: string; icon: string }[] = [
    { id: 'WARM_CONNECT', label: 'Warm Connect', icon: '🤝' },
    { id: 'DIAGNOSE', label: 'Diagnose', icon: '🔍' },
    { id: 'MICRO_TEACH', label: 'Teach', icon: '💡' },
    { id: 'ACTIVE_RESPONSE', label: 'Practice', icon: '📝' },
    { id: 'REINFORCE', label: 'Reinforce', icon: '⭐' },
    { id: 'REFLECT', label: 'Reflect', icon: '🧠' },
];

export default function SessionFlowBar({ currentPhase, onPhaseChange }: SessionFlowBarProps) {
    const currentIndex = PHASES.findIndex(p => p.id === currentPhase);

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-1">
            {PHASES.map((phase, index) => {
                const isActive = phase.id === currentPhase;
                const isCompleted = index < currentIndex;
                const isUpcoming = index > currentIndex;

                return (
                    <React.Fragment key={phase.id}>
                        <button
                            onClick={() => onPhaseChange(phase.id)}
                            className={`
                                relative flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-500
                                ${isActive ? 'bg-purple-600 shadow-lg shadow-purple-500/30 scale-105 z-10' : 'hover:bg-gray-100'}
                            `}
                        >
                            <span className={`text-lg ${isActive ? 'scale-110' : 'opacity-70'} transition-transform`}>
                                {phase.icon}
                            </span>
                            <span className={`
                                text-[10px] font-black uppercase tracking-tighter whitespace-nowrap
                                ${isActive ? 'text-white' : isCompleted ? 'text-purple-600' : 'text-gray-400'}
                            `}>
                                {phase.label}
                            </span>

                            {isActive && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                            )}
                        </button>

                        {index < PHASES.length - 1 && (
                            <div className="flex-1 h-px max-w-[20px] bg-gray-100" />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
