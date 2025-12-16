'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import SessionChat from '@/app/components/SessionChat';
import api from '@/app/lib/api';

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

    const jitsiRef = useRef<HTMLDivElement | null>(null);
    const jitsiApiRef = useRef<any>(null);
    const [hasJoined, setHasJoined] = useState(false); // New state for Join Overlay
    const [meetReady, setMeetReady] = useState(false);
    const [jitsiLoading, setJitsiLoading] = useState(true);
    // const [isWhiteboardMode, setIsWhiteboardMode] = useState(false); // Removed
    const [booking, setBooking] = useState<BookingDetails | null>(null);

    // Fetch Booking Details
    useEffect(() => {
        if (sessionId) {
            api.get(`/bookings/${sessionId}`)
                .then(res => {
                    console.log('[Session] Booking details loaded:', res.data);
                    setBooking(res.data);
                })
                .catch(err => {
                    console.error("Failed to load session details", err);
                    console.error("Error details:", err.response?.data);
                    // Continue anyway - Jitsi will still work
                });
        }
    }, [sessionId]);

    // Excalidraw API & Collab
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
    const [ExcalidrawComp, setExcalidrawComp] = useState<any>(null);

    useEffect(() => {
        import('@excalidraw/excalidraw').then((mod) => setExcalidrawComp(() => mod.Excalidraw));

        // lazy load Jitsi script
        const checkJitsi = () => {
            // @ts-ignore
            if (typeof window !== 'undefined' && window.JitsiMeetExternalAPI) {
                setMeetReady(true);
            } else {
                const s = document.createElement('script');
                s.src = 'https://meet.jit.si/external_api.js';
                s.onload = () => setMeetReady(true);
                document.head.appendChild(s);
            }
        };
        checkJitsi();
    }, []);

    // Yjs Collaboration Logic
    useEffect(() => {
        if (!excalidrawAPI || !sessionId) return;

        let cleanup: (() => void) | undefined;

        (async () => {
            try {
                const Y = await import('yjs');
                const { WebsocketProvider } = await import('y-websocket');
                const ydoc = new Y.Doc();

                // Use environment variable or fallback to localhost
                const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:1234';
                // Remove spaces from room name
                const roomName = `k12-session-${sessionId}`;

                console.log('[Collab] Connecting to:', wsUrl, 'Room:', roomName);
                const provider = new WebsocketProvider(wsUrl, roomName, ydoc);

                provider.on('status', (event: any) => {
                    console.log('[Collab] WS Status:', event.status);
                });

                provider.on('connection-error', (error: any) => {
                    console.warn('[Collab] Connection error (whiteboard will work locally):', error);
                });

                cleanup = () => {
                    provider.disconnect();
                    ydoc.destroy();
                };
            } catch (error) {
                console.warn('[Collab] Failed to initialize (whiteboard will work locally):', error);
            }
        })();

        return () => {
            if (cleanup) cleanup();
        };
    }, [excalidrawAPI, sessionId]);

    // Use refs for stable access inside effect without triggering re-runs
    const userRef = useRef(user);
    const bookingRef = useRef(booking);

    // Update refs when data changes
    useEffect(() => {
        userRef.current = user;
        bookingRef.current = booking;
    }, [user, booking]);

    // Initialize Jitsi ONLY after user clicks "Join"
    useEffect(() => {
        // Only init if user has joined and libs are ready
        // @ts-ignore
        if (!hasJoined || !meetReady || !jitsiRef.current || !window.JitsiMeetExternalAPI) return;

        // Cleanup previous instance if any
        if (jitsiApiRef.current) {
            try { jitsiApiRef.current.dispose(); } catch (e) { }
        }

        const domain = 'meet.jit.si';
        const currentUser = userRef.current;
        const currentBooking = bookingRef.current;

        const displayName = currentUser?.first_name
            ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim()
            : 'Guest';

        const isTutor = currentUser?.role === 'tutor'; // Determine role

        const options = {
            // Append config to roomName as a robust fallback (Magic Hash)
            roomName: `K12Session${sessionId.replace(/-/g, '').slice(0, 16)}`,
            width: '100%',
            height: '100%',
            parentNode: jitsiRef.current,
            userInfo: {
                displayName: displayName,
                email: currentUser?.email,
                role: isTutor ? 'moderator' : 'participant'
            },
            configOverwrite: {
                prejoinPageEnabled: false,
                startWithAudioMuted: false,
                startWithVideoMuted: false
            },
            interfaceConfigOverwrite: {
                // Minimal interface config
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'desktop', 'fullscreen',
                    'raisehand', 'tileview', 'hangup', 'chat'
                ],
            },
        };



        // Fetch JWT Token First
        api.get(`/session/${sessionId}/token`)
            .then(res => {
                const jwt = res.data.token;

                // @ts-ignore
                const apiObj = new window.JitsiMeetExternalAPI(domain, {
                    ...options,
                    jwt: jwt
                });
                jitsiApiRef.current = apiObj;

                apiObj.addEventListener('videoConferenceJoined', (ev: any) => {
                    console.log('[Jitsi] Joined conference:', ev);
                    setJitsiLoading(false);
                });

                apiObj.addEventListener('videoConferenceLeft', () => {
                    console.log('[Jitsi] Conference left');
                });
            })
            .catch(err => {
                console.error('[Jitsi] Failed to get token:', err);
                alert('Failed to join secure session. Please try again.');
            });

        return () => {
            // Remove listeners to prevent memory leaks and unwanted triggers during unmount
            try {
                if (jitsiApiRef.current) {
                    jitsiApiRef.current.dispose();
                    jitsiApiRef.current = null;
                }
            } catch (e) { }
        };

    }, [hasJoined, meetReady, sessionId]);

    // Show loading while auth is initializing
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="text-[var(--color-text-primary)]">Loading...</div>
            </div>
        );
    }

    // Render JOIN OVERLAY if not joined
    if (!hasJoined) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
                <div className="bg-glass p-8 rounded-[2rem] border border-white/20 shadow-2xl max-w-md w-full text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🎓</span>
                    </div>

                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                        {booking?.subject?.name || 'Tutoring Session'}
                    </h1>
                    {booking?.start_time && (
                        <p className="text-[var(--color-primary)] font-bold mb-4">
                            {new Date(booking.start_time).toLocaleString()}
                        </p>
                    )}
                    <p className="text-[var(--color-text-secondary)] mb-8">
                        {user?.role === 'student'
                            ? "Waiting for your tutor to start the class."
                            : "Ready to start teaching?"}
                    </p>

                    <button
                        onClick={() => setHasJoined(true)}
                        className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-lg shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <span>Join Session Now</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="mt-4 text-sm text-[var(--color-text-secondary)] hover:underline"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen overflow-hidden bg-[var(--color-background)] relative">

            {/* 1. BACKGROUND LAYER: WHITEBOARD */}
            <div className="absolute inset-0 z-0">
                {ExcalidrawComp ? (
                    <ExcalidrawComp
                        theme="light"
                        excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                        initialData={{
                            elements: [],
                            appState: {
                                viewBackgroundColor: '#ffffff',
                                currentItemFontFamily: 1,
                                showWelcomeScreen: false
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
                    <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)] bg-gray-50">
                        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="font-medium">Loading Canvas...</p>
                    </div>
                )}
            </div>

            {/* 2. OVERLAY LAYER: FLOATING HEADER */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                {/* Header Card */}
                <div className="bg-glass/90 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-lg pointer-events-auto flex items-center gap-4 max-w-sm">
                    <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse relative z-10" />
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-[var(--color-text-primary)]">
                            {booking?.subject?.name || 'Session'}
                        </h1>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                            ID: {sessionId.slice(0, 8)}...
                        </p>
                    </div>
                </div>

                {/* End Session Button */}
                <button
                    onClick={() => {
                        if (user?.role === 'tutor') router.push('/tutor/dashboard');
                        else if (user?.role === 'parent') router.push('/parent/dashboard');
                        else router.push('/students/dashboard');
                    }}
                    className="pointer-events-auto px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-bold shadow-lg hover:bg-red-600 hover:scale-105 transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    End
                </button>
            </div>

            {/* 3. OVERLAY LAYER: FLOATING VIDEO (JITSI) */}
            <div className="absolute bottom-6 left-6 z-20 w-[300px] h-[200px] md:w-[400px] md:h-[250px] transition-all hover:scale-[1.02]">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/20 ring-1 ring-black/10 relative group">

                    {/* Access to Jitsi Container */}
                    <div ref={jitsiRef} className="w-full h-full" />

                    {/* Hover Handle/Title */}
                    <div className="absolute top-0 left-0 w-full p-2 bg-gradient-to-b from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-white text-xs font-medium ml-1">Video Feed</span>
                    </div>
                </div>
            </div>

            {/* 4. OVERLAY LAYER: CHAT (Existing FAB) */}
            <SessionChat />
        </div>
    );
}