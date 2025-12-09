// src/app/components/SessionsList.tsx
'use client';
import React from 'react';
import api from '@/app/lib/api';

type Session = {
    id: string;
    booking_id?: string;
    start_time?: string;
    end_time?: string;
    meet_link?: string;
    whiteboard_link?: string;
    status?: string;
};

export default function SessionsList({ sessions }: { sessions: Session[] }) {
    if (!sessions || sessions.length === 0)
        return <div>No upcoming sessions.</div>;

    async function downloadInvite(sessionId: string) {
        try {
            const resp = await api.get(`/sessions/${sessionId}/invite`, {
                responseType: 'blob',
            });
            const url = URL.createObjectURL(resp.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = `session_${sessionId}.ics`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Invite download failed', err);
            alert('Could not download invite.');
        }
    }

    return (
        <div className="space-y-3">
            {sessions.map((s) => (
                <div key={s.id} className="p-3 rounded-lg border hover:shadow-md flex justify-between items-start">
                    <div>
                        <div className="text-sm text-gray-500">
                            {new Date(s.start_time || '').toLocaleString()} — {new Date(s.end_time || '').toLocaleTimeString()}
                        </div>
                        <div className="font-medium">Session for booking {s.booking_id}</div>
                        <div className="text-sm text-gray-600">Status: <span className="font-semibold">{s.status}</span></div>
                    </div>

                    <div className="flex gap-2">
                        {s.meet_link && (
                            <a target="_blank" rel="noreferrer" href={s.meet_link} className="px-3 py-1 rounded border text-sm">
                                Join
                            </a>
                        )}
                        {s.whiteboard_link && (
                            <a target="_blank" rel="noreferrer" href={s.whiteboard_link} className="px-3 py-1 rounded border text-sm">
                                Whiteboard
                            </a>
                        )}
                        <button onClick={() => downloadInvite(s.id)} className="px-3 py-1 rounded bg-[#F7C548] text-sm">
                            Download ICS
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}