'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import SessionChat from '@/app/components/SessionChat';
import api from '@/app/lib/api';
import DailyIframe from '@daily-co/daily-react';

interface BookingDetails {
    id: string;
    start_time: string;
    subject: { name: string; icon?: string };
    tutor: { first_name: string; last_name: string };
    student: { first_name: string; last_name: string };
}

interface SessionProps {
    params: Promise<{ id: string }>;
}

export default function SessionPage({ params }: SessionProps) {
    const { id: sessionId } = React.use(params);
    const { user, loading: authLoading } = useAuthContext();
    const router = useRouter();

    // Protect the route - redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            console.log('[Session] No user found, redirecting to login');
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Daily.co State
    const [hasJoined, setHasJoined] = useState(false);
    const [dailyRoomUrl, setDailyRoomUrl] = useState<string | null>(null);
    const [dailyToken, setDailyToken] = useState<string | null>(null);
    const [videoLoading, setVideoLoading] = useState(false);
    const [booking, setBooking] = useState<BookingDetails | null>(null);

    // Video Card State
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isExpanded, setIsExpanded] = useState(false);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const startPos = useRef({ x: 0, y: 0 });

    // Draggable handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        startPos.current = { ...position };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPosition({
            x: startPos.current.x + dx,
            y: startPos.current.y + dy
        });
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Fetch Booking Details
    useEffect(() => {
        if (sessionId) {
            api.get(`/bookings/${sessionId}`)
                .then(res => {
                    console.log('[Session] Booking details loaded:', res.data);
                    setBooking(res.data);
                })
                .catch(err => {
                    console.error(\"Failed to load session details\", err);
                    console.error(\"Error details:\", err.response?.data);
                });
        }
    }, [sessionId]);

    // Excalidraw State
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const [ExcalidrawComp, setExcalidrawComp] = useState<any>(null);

    useEffect(() => {
        import('@excalidraw/excalidraw').then((mod) => setExcalidrawComp(() => mod.Excalidraw));
    }, []);

    // Yjs Collaboration Logic
    useEffect(() => {
        if (!excalidrawAPI) return;

        const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
        if (!WS_URL) {
            console.warn('[Collab] No WS_URL defined. Running in offline/local-only mode.');
            return;
        }

        let yDoc: any;
        let yProvider: any;

        import('yjs').then((Y) => {
            return import('y-websocket').then((YWebsocket) => {
                yDoc = new Y.Doc();
                yProvider = new YWebsocket.WebsocketProvider(WS_URL, `session-${sessionId}`, yDoc);

                const yElements = yDoc.getArray('elements');
                const yAppState = yDoc.getMap('appState');

                yProvider.on('sync', (isSynced: boolean) => {
                    if (isSynced) {
                        console.log('[Collab] Synced with server');
                        const remoteElements = yElements.toArray();
                        if (remoteElements.length > 0) {
                            excalidrawAPI.updateScene({ elements: remoteElements });
                        }
                    }
                });

                excalidrawAPI.onChange((elements: any[], appState: any) => {
                    yDoc.transact(() => {
                        yElements.delete(0, yElements.length);
                        yElements.push(elements);
                        Object.keys(appState).forEach((key) => {
                            yAppState.set(key, appState[key]);
                        });
                    });
                });

                return () => {
                    yProvider?.destroy();
                    yDoc?.destroy();
                };
            });
        }).catch(err => {
            console.error('[Collab] Failed to load Yjs:', err);
        });

        return () => {
            yProvider?.destroy();
            yDoc?.destroy();
        };
    }, [excalidrawAPI, sessionId]);

    // Fetch Daily.co Room & Token when user joins
    useEffect(() => {
        if (hasJoined && sessionId) {
            setVideoLoading(true);
            const token = localStorage.getItem('K12_TOKEN');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://k-12-backend.onrender.com';

            console.log('[Daily] Fetching room and token...');

            api.get(`/sessions/${sessionId}/daily-token`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    console.log('[Daily] Token received:', res.data);
                    setDailyRoomUrl(res.data.roomUrl);
                    setDailyToken(res.data.token);
                    setVideoLoading(false);
                })
                .catch(err => {
                    console.error('[Daily] Failed to get token:', err);
                    alert('Failed to join video session. Please try again.');
                    setVideoLoading(false);
                });
        }
    }, [hasJoined, sessionId]);

    if (authLoading) {
        return (
            <div className=\"min-h-screen flex items-center justify-center bg-[var(--color-background)]\">
                < div className =\"text-center\">
                    < div className =\"w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4\"></div>
                        < p className =\"text-[var(--color-text-secondary)]\">Loading session...</p>
                </div >
            </div >
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className=\"relative w-screen h-screen overflow-hidden bg-[var(--color-background)]\">
    {/* JOIN OVERLAY */ }
    {
        !hasJoined && (
            <div className=\"absolute inset-0 z-50 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md flex items-center justify-center\">
                < div className =\"text-center max-w-md px-6\">
                    < div className =\"mb-8\">
                        < div className =\"w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20\">
                            < span className =\"text-4xl\">🎓</span>
                            </div >
            <h1 className=\"text-3xl font-bold text-white mb-2\">
        { booking?.subject?.name || 'Tutoring Session' }
                            </h1 >
            <p className=\"text-white/70\">
                                Ready to start your session ?
                            </p >
                        </div >

            <button
                onClick={() => setHasJoined(true)}
                className=\"w-full py-4 px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-2xl shadow-2xl shadow-green-500/25 transition-all transform hover:scale-105 active:scale-95\"
                    >
                            🚀 Join Session
                        </button >

            <p className=\"text-white/50 text-sm mt-4\">
                            Session ID: { sessionId.slice(0, 8) }...
                        </p >
                    </div >
                </div >
            )
    }

    {/* 1. BASE LAYER: EXCALIDRAW WHITEBOARD */ }
    <div className=\"absolute inset-0 z-0\">
    {
        ExcalidrawComp ? (
            <ExcalidrawComp
                excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                initialData={{
                    appState: {
                        viewBackgroundColor: '#ffffff',
                        currentItemFontFamily: 1,
                        currentItemStrokeColor: '#1e1e1e',
                        currentItemBackgroundColor: 'transparent',
                        currentItemFillStyle: 'solid',
                        currentItemStrokeWidth: 2,
                        currentItemRoughness: 0,
                        currentItemOpacity: 100,
                        gridSize: null,
                        zenModeEnabled: false,
                        theme: 'light'
                    },
                    scrollToContent: true
                }}
                UIOptions={{
                    canvasActions: {
                        loadScene: false,
                        saveToActiveFile: false,
                        export: { saveFileToDisk: true },
                        saveAsImage: true,
                        toggleTheme: false
                    }
                }}
            />
        ) : (
            <div className=\"flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)] bg-gray-50\">
                < div className =\"w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4\" />
                    < p className =\"font-medium\">Loading Canvas...</p>
                    </div >
                )
    }
            </div >

        {/* DAILY.CO VIDEO OVERLAY */ }
    {
        hasJoined && dailyRoomUrl && dailyToken && (
            <div
                className=\"fixed z-50 bg-black rounded-2xl border-2 border-purple-500/50 shadow-2xl overflow-hidden\"
        style = {{
            left: `${position.x}px`,
                top: `${position.y}px`,
                    width: isExpanded ? '80vw' : '400px',
                        height: isExpanded ? '80vh' : '300px',
                            transition: 'width 0.3s, height 0.3s'
        }
    }
                >
        {/* Drag Handle */ }
        < div
    onMouseDown = { handleMouseDown }
    className =\"absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 cursor-move flex items-center justify-between px-4 z-10\"
        >
        <span className=\"text-white text-sm font-bold\">📹 Live Session</span>
            < div className =\"flex gap-2\">
                < button
    onClick = {() => setIsExpanded(!isExpanded)
}
className =\"text-white hover:bg-white/20 rounded px-3 py-1 text-sm transition-colors\"
title = {
    isExpanded?\"Minimize\" : \"Expand\"}
                            >
        { isExpanded? '🗕': '🗖' }
                            </button>
                        </div >
                    </div >

    {/* Daily.co Iframe */ }
    < DailyIframe
url = { dailyRoomUrl }
token = { dailyToken }
showLeaveButton = { true}
showFullscreenButton = { true}
iframeStyle = {{
    width: '100%',
        height: '100%',
            border: 'none'
}}
                    />
                </div >
            )}

{/* Loading Overlay for Video */ }
{
    hasJoined && videoLoading && (
        <div className=\"fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center\">
            < div className =\"text-white text-center\">
                < div className =\"animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4\"></div>
                    < p className =\"font-bold text-lg\">Connecting to video session...</p>
                    </div >
                </div >
            )
}

{/* 2. OVERLAY LAYER: FLOATING HEADER */ }
<div className=\"absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none\">
{/* Header Card */ }
<div className=\"bg-glass/90 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg pointer-events-auto flex items-center gap-4 max-w-sm\">
    < div className =\"relative\">
        < div className =\"w-3 h-3 rounded-full bg-green-500 animate-pulse relative z-10\" />
            < div className =\"absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75\" />
                    </div >
                    <div>
                        <h1 className=\"text-sm font-bold text-[var(--color-text-primary)]\">
                            {booking?.subject?.name || 'Session'}
                        </h1>
                        <p className=\"text-xs text-[var(--color-text-secondary)]\">
ID: { sessionId.slice(0, 8) }...
                        </p >
                    </div >
                </div >

    {/* End Session Button */ }
    < button
onClick = {() => {
    if (user?.role === 'tutor') router.push('/tutor/dashboard');
    else if (user?.role === 'parent') router.push('/parent/dashboard');
    else router.push('/students/dashboard');
}}
className =\"bg-red-500/90 hover:bg-red-600 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold shadow-lg pointer-events-auto transition-all\"
    >
                    🚪 End Session
                </button >
            </div >

    {/* 3. OVERLAY LAYER: CHAT SIDEBAR */ }
    < div className =\"absolute right-4 top-20 bottom-4 z-10 w-80 pointer-events-auto\">
        < SessionChat sessionId = { sessionId } currentUser = { user } />
            </div >
        </div >
    );
}