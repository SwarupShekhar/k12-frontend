import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';
import api from '@/app/lib/api';
import ChatLoader from './ChatLoader';

type Message = {
    id: string;
    text: string;
    sender: 'me' | 'them';
    timestamp: Date;
    senderName: string;
};

interface SessionChatProps {
    sessionId?: string; // Explicit session ID from booking data
}

export default function SessionChat({ sessionId: propSessionId }: SessionChatProps) {
    const { user } = useAuthContext();
    const params = useParams();

    // Use prop if provided, otherwise fallback to params (which might be booking Id)
    // NOTE: For correct chat, this MUST be the real Session UUID, not booking UUID
    const sessionId = propSessionId || (params?.id as string);

    useEffect(() => {
        console.log('[SessionChat] Mounted with Session ID:', sessionId);
    }, [sessionId]);

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Sound Effect
    const notificationSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        notificationSound.current = new Audio('/sounds/notification.mp3');
    }, []);

    const playNotification = () => {
        if (notificationSound.current) {
            notificationSound.current.play().catch(e => console.log('Audio play failed', e));
        }
    };

    // Socket State
    const [socket, setSocket] = useState<Socket | null>(null);

    // Initialize Socket
    useEffect(() => {
        if (!user || !sessionId) return;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://k-12-backend.onrender.com';

        const bookingId = params?.id as string;
        console.log('[Chat] Connecting to socket. Session:', sessionId, 'Booking:', bookingId);

        const newSocket = io(API_URL, {
            query: {
                sessionId,
                userId: user.sub || user.id
            },
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('[Chat] Connected to socket! ID:', newSocket.id);
            // Try multiple formats to ensure we hit the backend's expected signature
            newSocket.emit('joinSession', { sessionId });
            newSocket.emit('joinSession', sessionId);
            newSocket.emit('join_room', sessionId);
            console.log('[Chat] Emitted joinSession for:', sessionId);

        });

        newSocket.on('connect_error', (err) => {
            console.error('[Chat] Socket connection error:', err);
        });


        // Gateway emits: client.broadcast.to(...).emit('receiveMessage', ...)
        // And emitNewMessage uses: .emit('newMessage', ...)
        const handleNewMessage = (payload: any) => {
            console.log('[Chat] Message received:', payload);

            const senderId = payload.senderId || payload.user_id || payload.from_id;
            const isMe = String(senderId) === String(user.sub || user.id);

            if (!isMe) {
                const msg: Message = {
                    id: payload.id || Date.now().toString() + Math.random(),
                    text: payload.text || payload.message,
                    sender: 'them',
                    timestamp: new Date(payload.timestamp || payload.created_at || Date.now()),
                    senderName: payload.senderName || payload.from || 'Anonymous'
                };
                setMessages(prev => {
                    if (prev.some(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });

                playNotification();
            }
        };

        newSocket.on('receiveMessage', handleNewMessage); // From handleSendMessage broadcast
        newSocket.on('newMessage', handleNewMessage);     // From emitNewMessage

        return () => {
            console.log('[Chat] Disconnecting socket');
            newSocket.disconnect();
        };
    }, [user, sessionId]);


    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setHasInteracted(true);
        }
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim()) return;

        const text = newMessage.trim();
        const msg: Message = {
            id: Date.now().toString(),
            text: text,
            sender: 'me',
            timestamp: new Date(),
            senderName: user?.first_name || 'Me'
        };

        // Optimistic UI update
        setMessages(prev => [...prev, msg]);
        setNewMessage('');

        try {
            // Ensure sessionId is clean
            const safeSessionId = sessionId?.trim();
            if (!safeSessionId) throw new Error("Missing Session ID");

            const payload = {
                sessionId: safeSessionId,
                text,
                senderName: user?.first_name || 'User',
                senderId: user?.sub || user?.id,
            };

            console.log('[Chat] Emitting sendMessage via Socket:', payload);

            // Use Socket to send (triggers DB save + broadcast on backend)
            if (socket && socket.connected) {
                socket.emit('sendMessage', payload, (response: any) => {
                    // Ack callback if backend supports it (it returns {success: true})
                    console.log('[Chat] Socket Ack:', response);
                });
            } else {
                // Fallback to API if socket died (though broadcast might fail)
                console.warn('[Chat] Socket not connected, falling back to API');
                await api.post(`/sessions/${safeSessionId}/messages`, {
                    ...payload,
                    userId: payload.senderId // API likely needs userId field
                });
            }
        } catch (error: any) {
            console.error('[Chat] Failed to send message:', error.response?.data || error.message || error);
            // Optionally alert the user too
            alert(`Failed to send: ${error.response?.data?.message || 'Unknown error'}`);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setHasInteracted(true);
    };

    return (
        <>
            {/* FLOATING TRIGGER */}
            <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none`}>

                {/* Chat Popup */}
                {isOpen && (
                    <div className="pointer-events-auto w-[350px] md:w-[400px] h-[500px] max-h-[70vh] flex flex-col rounded-2xl overflow-hidden bg-glass border border-white/20 shadow-2xl origin-bottom-right transition-all animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[var(--color-primary)]/90 to-purple-600/90 text-white flex justify-between items-center backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                        💬
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-transparent rounded-full ${socket?.connected ? 'bg-green-400' : 'bg-red-500'}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Live Chat</h3>
                                    <span className="text-xs text-white/80 flex items-center gap-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${socket?.connected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`} />
                                        {socket?.connected ? 'Online' : 'Connecting...'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/30 dark:bg-black/20">
                            {messages.length === 0 && (
                                <div className="text-center text-[var(--color-text-secondary)] mt-10 text-sm">
                                    <p>No messages yet.</p>
                                    <p>Say hello! 👋</p>
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                                >
                                    <span className="text-[10px] text-[var(--color-text-secondary)] mb-1 px-1">
                                        {msg.sender === 'them' && msg.senderName}
                                    </span>
                                    <div className={`
                                        max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm break-words
                                        ${msg.sender === 'me'
                                            ? 'bg-[var(--color-primary)] text-white rounded-tr-sm'
                                            : 'bg-white dark:bg-gray-800 text-[var(--color-text-primary)] border border-white/10 rounded-tl-sm'}
                                    `}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-[var(--color-text-secondary)] mt-1 px-1">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={socket?.connected ? "Type your message..." : "Connecting..."}
                                    disabled={!socket?.connected}
                                    className="flex-1 px-4 py-2 rounded-xl bg-white/50 dark:bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || !socket?.connected}
                                    className="p-2 rounded-xl bg-[var(--color-primary)] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ANIMATED LOADER TRIGGER */}
                <div
                    onClick={toggleChat}
                    className="pointer-events-auto cursor-pointer hover:scale-105 transition-transform"
                    title={isOpen ? "Close Chat" : "Open Chat"}
                >
                    <ChatLoader />
                </div>
            </div>
        </>
    );
}
