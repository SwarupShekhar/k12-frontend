'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import { useTutorDashboard } from '@/app/Hooks/useTutorDashboard';

export default function TutorDashboardPage() {
  const { user } = useAuthContext();
  const { todaySessions, upcomingBookings, availableJobs, stats, loading } = useTutorDashboard();

  return (
    <ProtectedClient roles={['tutor']}>
      <div className="min-h-screen p-6 md:p-8 space-y-8 max-w-7xl mx-auto">

        {/* AVAILABLE JOBS ALERT */}
        {availableJobs.length > 0 && (() => {
          // Filter to only show FUTURE sessions (not expired)
          const now = new Date();
          const futureJobs = availableJobs.filter((job: any) => {
            const startTime = job.requested_start || job.start_time;
            if (!startTime) return true; // If no time, still show it
            return new Date(startTime) > now;
          });

          if (futureJobs.length === 0) return null;

          return (
            <section className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2rem] p-6 border border-orange-300 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  🚨 {futureJobs.length} New Session{futureJobs.length > 1 ? 's' : ''} Available!
                </h2>
                <span className="text-sm text-orange-100">First come, first served</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {futureJobs.slice(0, 6).map((job: any) => (
                  <div key={job.id} className="bg-white/90 rounded-xl p-4 shadow-md">
                    <h3 className="font-bold text-gray-800 mb-1">{job.subject_name || job.subject?.name || 'Subject TBD'}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {job.requested_start ? new Date(job.requested_start).toLocaleString() : 'Time TBD'}
                    </p>
                    <Link
                      href={`/tutor/claim-session/${job.id}`}
                      className="block w-full py-2 bg-green-500 hover:bg-green-600 text-white font-bold text-center rounded-lg transition-colors text-sm"
                    >
                      Accept Job →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

        {/* HERO SECTION */}
        <section className="bg-glass rounded-[2rem] p-8 md:p-10 border border-white/20 shadow-lg relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-secondary)] opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
              Welcome, {user?.first_name || 'Tutor'}
            </h1>
            <p className="text-[var(--color-text-secondary)] text-lg mb-8">
              Here are your teaching sessions for today
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3 shadow-sm">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Today's Sessions</p>
                  <p className="text-xl font-bold text-[var(--color-primary)]">
                    {loading ? '...' : stats.todayCount}
                  </p>
                </div>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3 shadow-sm">
                <span className="text-2xl">🗓️</span>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">This Week</p>
                  <p className="text-xl font-bold text-[var(--color-secondary)]">
                    {loading ? '...' : stats.weekCount}
                  </p>
                </div>
              </div>
              {stats.availableCount > 0 && (
                <div className="px-6 py-3 rounded-2xl bg-orange-100 border border-orange-300 flex items-center gap-3 shadow-sm">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">Available</p>
                    <p className="text-xl font-bold text-orange-600">
                      {stats.availableCount}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* TODAY'S SESSIONS */}
          <section className="bg-glass rounded-[2rem] p-6 border border-white/20 shadow-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <span>🎓</span> Today's Classes
            </h2>

            <div className="flex-1 space-y-4">
              {loading ? (
                <p className="text-[var(--color-text-secondary)]">Loading sessions...</p>
              ) : todaySessions.length > 0 ? (
                todaySessions.map((session: any) => (
                  <div key={session.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-[var(--color-primary)]">
                        {session.start_time ? new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time TBD'}
                      </span>
                      {(session.id) && (
                        <Link href={`/session/${session.id}`} className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full hover:opacity-90 transition-opacity">
                          Start Class
                        </Link>
                      )}
                    </div>
                    <h3 className="font-bold text-[var(--color-text-primary)]">
                      {session.subject_name || 'Tutoring Session'}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                      Student: {session.child_name || 'Unknown'}
                    </p>

                    {session.whiteboard_link && (
                      <a href={session.whiteboard_link} target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-medium text-[var(--color-secondary)] hover:underline">
                        Open Whiteboard →
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] border-dashed">
                  <p className="text-[var(--color-text-secondary)]">You have no sessions scheduled for today.</p>
                </div>
              )}
            </div>
          </section>

          {/* UPCOMING BOOKINGS TO SCHEDULE */}
          <section className="bg-glass rounded-[2rem] p-6 border border-white/20 shadow-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <span>📝</span> Confirmed & Upcoming
            </h2>

            <div className="flex-1 space-y-4">
              {loading ? (
                <p className="text-[var(--color-text-secondary)]">Loading bookings...</p>
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking: any) => (
                  <div key={booking.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-[var(--color-text-primary)]">
                        {booking.subject || 'Subject'}
                      </h3>
                      <Link href={`/tutor/bookings/${booking.id}/create-session`} className="text-xs font-bold text-[var(--color-primary)] bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
                        Create Session →
                      </Link>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Student: {booking.student_name || 'Student'}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] opacity-80 mt-1">
                      Requested: {booking.requested_time || booking.date ? new Date(booking.requested_time || booking.date).toLocaleDateString() : 'Date TBD'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border)] border-dashed">
                  <p className="text-[var(--color-text-secondary)]">No upcoming bookings to show.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </ProtectedClient>
  );
}
