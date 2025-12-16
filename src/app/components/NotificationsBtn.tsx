'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '@/app/lib/api';
import { useAuthContext } from '@/app/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    created_at: string;
    resource_id?: string; // e.g. booking_id
}

export default function NotificationsBtn() {
    const { user } = useAuthContext();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Poll for notifications
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            // Don't show loading spinner on background polls
            try {
                const res = await api.get('/notifications');
                // Assume backend returns array of notifications
                // If backend returns { data: [...] }, adjust accordingly
                const data = Array.isArray(res.data) ? res.data : (res.data.data || []);

                // Sort by date desc
                data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.read).length);
            } catch (error) {
                console.warn('[Notifications] Failed to poll', error);
            }
        };

        // Initial fetch
        fetchNotifications();

        // Poll every 30s
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await api.patch(`/notifications/${id}/read`);
        } catch (e) {
            console.error('Failed to mark notification as read', e);
        }
    };

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        try {
            await api.post('/notifications/mark-all-read');
        } catch (e) { console.error(e); }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-[var(--color-surface)] transition-all text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
                {/* Bell Icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>

                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-[#1a1b26] rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)]/50">
                        <h3 className="font-bold text-[var(--color-text-primary)]">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-[var(--color-primary)] hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-[var(--color-text-secondary)]">
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--color-border)]">
                                {notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={`p-4 hover:bg-[var(--color-surface)] transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                        onClick={() => markAsRead(n.id)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-[var(--color-primary)]' : 'bg-transparent'}`} />
                                            <div className="flex-1 space-y-1">
                                                <p className={`text-sm ${!n.read ? 'font-semibold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                                                    {n.message}
                                                </p>
                                                <p className="text-xs text-[var(--color-text-secondary)]">
                                                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
