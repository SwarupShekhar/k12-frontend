import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';

type Message = {
    id: string;
    text: string;
    sender: 'me' | 'them';
    timestamp: Date;
    senderName: string;
};

export default function SessionChat() {
    const { user } = useAuthContext();
    const params = useParams();
    const sessionId = params?.id as string;

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Socket State
    const [socket, setSocket] = useState<Socket | null>(null);

    // Initialize Socket
    useEffect(() => {
        if (!user || !sessionId) return;

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://k-12-backend.onrender.com';

        // Use namespace if specified in backend docs, otherwise root
        // Note: Guided backend implementation uses namespace: 'encounters'
        const socketPath = API_URL.endsWith('/') ? API_URL + 'encounters' : API_URL + '/encounters';

        console.log('[Chat] Connecting to socket at:', socketPath, 'Session:', sessionId);

        const newSocket = io(socketPath, {
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
            newSocket.emit('joinSession', { sessionId });
        });

        newSocket.on('connect_error', (err) => {
            console.error('[Chat] Socket connection error:', err);
        });

        // Backend guide suggests 'newMessage', while current code uses 'receiveMessage'
        // Listening to both to ensure compatibility
        const handleNewMessage = (payload: any) => {
            console.log('[Chat] Message received:', payload);

            const senderId = payload.senderId || payload.user_id || payload.from_id;
            const isMe = senderId === (user.sub || user.id);

            if (!isMe) {
                const msg: Message = {
                    id: payload.id || Date.now().toString() + Math.random(),
                    text: payload.text || payload.message,
                    sender: 'them',
                    timestamp: new Date(payload.timestamp || payload.created_at || Date.now()),
                    senderName: payload.senderName || payload.from || 'Anonymous'
                };
                setMessages(prev => [...prev, msg]);
            }
        };

        newSocket.on('newMessage', handleNewMessage);
        newSocket.on('receiveMessage', handleNewMessage);

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

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !socket) return;

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

        // Emit to server
        socket.emit('sendMessage', {
            sessionId,
            text,
            senderName: user?.first_name || 'User',
            senderId: user?.sub || user?.id
        });
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

                {/* Trigger Button - Always visible, stops bouncing after interaction */}
                <button
                    onClick={toggleChat}
                    className={`
                        pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 
                        shadow-2xl shadow-blue-500/30 text-white flex items-center justify-center 
                        hover:scale-110 active:scale-95 transition-all duration-300
                        ${!hasInteracted && !isOpen ? 'animate-bounce' : ''}
                        ${socket?.connected ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-transparent' : ''}
                    `}
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    ) : (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    )}
                </button>
            </div>
        </>
    );
}
