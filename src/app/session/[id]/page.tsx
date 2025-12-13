'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';

interface SessionProps {
    params: Promise<{ id: string }>;
}

export default function SessionPage({ params }: SessionProps) {
    const { id: sessionId } = React.use(params);
    const { user } = useAuthContext();
    const jitsiRef = useRef<HTMLDivElement | null>(null);
    const jitsiApiRef = useRef<any>(null);
    const [hasJoined, setHasJoined] = useState(false); // New state for Join Overlay
    const [meetReady, setMeetReady] = useState(false);
    const [jitsiLoading, setJitsiLoading] = useState(true);
    const router = useRouter();

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
        (async () => {
            const Y = await import('yjs');
            const { WebsocketProvider } = await import('y-websocket');
            const ydoc = new Y.Doc();
            const provider = new WebsocketProvider('ws://localhost:1234', `k12-session-${sessionId}`, ydoc);

            // Clean slate for whiteboard
            // const ymap = ydoc.getMap('excalidraw-state');

            provider.on('status', (event: any) => {
                console.log('[Collab] WS Status:', event.status);
            });
            return () => {
                provider.disconnect();
                ydoc.destroy();
            };
        })();
    }, [excalidrawAPI, sessionId]);

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
        const displayName = user?.first_name
            ? `${user.first_name} ${user.last_name || ''}`.trim()
            : 'Guest';

        const options = {
            roomName: `K12Session${sessionId.replace(/-/g, '').slice(0, 16)}`,
            width: '100%',
            height: '100%',
            parentNode: jitsiRef.current,
            userInfo: {
                displayName: displayName,
                email: user?.email,
            },
            configOverwrite: {
                prejoinPageEnabled: false,       // SKIP LOBBY
                startWithAudioMuted: false,      // User already clicked "Join", so we can start UNMUTED
                startWithVideoMuted: false,      // User already clicked "Join", so we can start UNMUTED
                disableDeepLinking: true,
                enableWelcomePage: false,
                enableClosePage: false,
                disableInviteFunctions: true,
                hideConferenceSubject: true,
                hideConferenceTimer: false,
                subject: 'Tutoring Session',
                enableLobbyChat: false,
                hideLobbyButton: true,
                requireDisplayName: false,
            },
            interfaceConfigOverwrite: {
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                SHOW_BRAND_WATERMARK: false,
                BRAND_WATERMARK_LINK: '',
                SHOW_POWERED_BY: false,
                HIDE_INVITE_MORE_HEADER: true,
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'desktop', 'fullscreen',
                    'raisehand', 'tileview', 'hangup', 'chat'
                ],
                VIDEO_QUALITY_LABEL_DISABLED: true,
            },
        };

        // @ts-ignore
        const apiObj = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = apiObj;

        apiObj.addEventListener('videoConferenceJoined', (ev: any) => {
            console.log('[Jitsi] Joined conference:', ev);
            setJitsiLoading(false);
        });

        apiObj.addEventListener('readyToClose', () => {
            router.push('/students/dashboard');
        });

        return () => {
            try { apiObj.dispose(); } catch (e) { }
        };
    }, [hasJoined, meetReady, sessionId, user, router]);

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
                        Ready for Class?
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mb-8">
                        Your tutor is ready. Click below to join the video session and whiteboard.
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
        <div className="min-h-screen bg-[var(--color-background)] p-4 md:p-6 transition-all duration-500">
            <div className="max-w-[1800px] mx-auto h-[calc(100vh-100px)] flex flex-col">

                {/* HEADER */}
                <div className="bg-glass rounded-2xl p-4 mb-4 border border-white/20 shadow-sm flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse relative z-10" />
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                                Live Tutoring Session
                            </h1>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                Session ID: {sessionId.slice(0, 8)}...
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/students/dashboard')}
                        className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 hover:bg-red-100 transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        End Session
                    </button>
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">

                    {/* LEFT: VIDEO */}
                    <div className="w-[450px] flex-shrink-0 flex flex-col gap-4">
                        <div className="flex-1 rounded-2xl overflow-hidden relative bg-black shadow-xl border border-gray-800 ring-1 ring-white/10">
                            {/* Removed blocking overlay so user can see Jitsi errors/prompts */}
                            <div ref={jitsiRef} className="w-full h-full" />
                        </div>

                        {/* Tip Card */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex gap-3">
                            <span className="text-2xl">💡</span>
                            <div className="text-sm text-[var(--color-text-secondary)]">
                                <p className="font-bold text-[var(--color-text-primary)] mb-1">Collaborative Whiteboard</p>
                                Use the canvas on the right to verify math problems, draw diagrams, or take notes together!
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: WHITEBOARD */}
                    <div className="flex-1 rounded-2xl overflow-hidden bg-white shadow-xl border border-[var(--color-border)] relative group">
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
                </div>
            </div>
        </div>
    );
}