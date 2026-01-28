'use client';

import React from 'react';
import { SessionPhase } from './SessionFlowBar';

interface PhaseGuidancePanelProps {
    phase: SessionPhase;
    suggestions: string[];
}

const GUIDANCE: Record<SessionPhase, { title: string; prompt: string; tips: string[]; color: string }> = {
    WARM_CONNECT: {
        title: 'Warm Connect',
        prompt: 'Build a relationship before moving to content.',
        tips: ['Review student interests', 'Ask about their week', 'Perform a personal check-in'],
        color: 'from-blue-600 to-indigo-600'
    },
    DIAGNOSE: {
        title: 'Diagnose Gap',
        prompt: 'Identify exactly where the student is stuck.',
        tips: ['Review last session mistakes', 'Ask "What was the hardest part of the homework?"', 'Check foundational skills'],
        color: 'from-indigo-600 to-purple-600'
    },
    MICRO_TEACH: {
        title: 'Micro Teach',
        prompt: 'Explain the concept simply and visually.',
        tips: ['Use the whiteboard', 'Break it into 3 tiny steps', 'Keep instruction under 5 mins'],
        color: 'from-purple-600 to-fuchsia-600'
    },
    ACTIVE_RESPONSE: {
        title: 'Active Practice',
        prompt: 'The student should be doing the work now.',
        tips: ['Stay quiet while they think', 'Prompt: "How did you get there?"', 'Guide them to the first step'],
        color: 'from-fuchsia-600 to-pink-600'
    },
    REINFORCE: {
        title: 'Reinforce',
        prompt: 'Solidify the learning with targeted feedback.',
        tips: ['Praise the specific effort, not "smartness"', 'Address corrections immediately', 'Mark a "Praise Given" event'],
        color: 'from-pink-600 to-rose-600'
    },
    REFLECT: {
        title: 'Reflection',
        prompt: 'Ensure the knowledge is retained.',
        tips: ['Ask student to summarize', 'Ask: "What would you tell a friend about this?"', 'Set goal for next time'],
        color: 'from-rose-600 to-orange-600'
    }
};

export default function PhaseGuidancePanel({ phase }: PhaseGuidancePanelProps) {
    const config = GUIDANCE[phase];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 overflow-hidden relative group">
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.color}`} />

            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{config.title}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">{config.prompt}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-lg`}>
                    ✨
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tutor Playbook Guidance</p>
                <ul className="space-y-3">
                    {config.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 group/item">
                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${config.color} group-hover/item:scale-150 transition-transform`} />
                            <span className="text-xs font-bold text-gray-700 leading-relaxed">{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-300 uppercase">Phase Action Required</span>
                <button className="text-[10px] font-black text-purple-600 hover:text-purple-700 uppercase tracking-widest flex items-center gap-1 group">
                    Learn more
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}
