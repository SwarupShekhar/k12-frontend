'use client';

import React from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import useStudentDashboard, { Booking } from '@/app/Hooks/useStudentDashboard';

export default function StudentDashboardPage() {
  const { user } = useAuthContext();
  const { upcomingSessions, pastSessions, loading } = useStudentDashboard();

  const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;
  const otherUpcoming = upcomingSessions.length > 1 ? upcomingSessions.slice(1) : [];

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedClient roles={['student']}>
      <div className="min-h-screen p-6 md:p-8 space-y-8 max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <section className="bg-glass rounded-[2rem] p-8 md:p-10 border border-white/20 shadow-lg relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-secondary)] opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
              Hi, {user?.first_name || 'Student'}! 👋
            </h1>
            <p className="text-[var(--color-text-secondary)] text-lg mb-6">
              Ready to learn something new today?
            </p>

            {/* NEXT SESSION CARD */}
            {loading ? (
              <div className="animate-pulse h-32 bg-white/50 rounded-2xl w-full max-w-md"></div>
            ) : nextSession ? (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-blue-600 text-white shadow-xl max-w-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">
                    Your Next Class
                  </div>
                  <h2 className="text-2xl font-bold mb-1">
                    {nextSession.subject?.name || 'Tutoring Session'}
                  </h2>
                  <p className="text-blue-100 mb-4 text-sm">
                    {formatDate(nextSession.start_time)}
                  </p>

                  <div className="flex gap-3">
                    {nextSession.meeting_link ? (
                      <a
                        href={nextSession.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-sm"
                      >
                        Join Class
                      </a>
                    ) : (
                      <button disabled className="px-6 py-2 bg-white/20 text-white font-bold rounded-full opacity-80 cursor-not-allowed">
                        Link coming soon
                      </button>
                    )}
                  </div>
                </div>
                {/* Decoration */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] max-w-md text-[var(--color-text-secondary)]">
                <p>No upcoming sessions scheduled.</p>
                <p className="text-sm mt-1">Ask your parent to book a class for you!</p>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* UPCOMING LIST */}
          <section className="bg-glass rounded-[2rem] p-6 border border-white/20 shadow-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <span>🗓️</span> Upcoming Schedule
            </h2>

            <div className="space-y-4 flex-1">
              {loading ? (
                <p className="text-[var(--color-text-secondary)]">Loading...</p>
              ) : otherUpcoming.length > 0 ? (
                otherUpcoming.map((session: any) => (
                  <div key={session.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-[var(--color-text-primary)]">
                        {session.subject?.name || 'Session'}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {formatDate(session.start_time)}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                      Upcoming
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)] italic">
                  {nextSession ? "No other upcoming sessions." : "Your schedule is clear."}
                </p>
              )}
            </div>
          </section>

          {/* PAST SESSIONS */}
          <section className="bg-glass rounded-[2rem] p-6 border border-white/20 shadow-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <span>✅</span> Completed Classes
            </h2>

            <div className="space-y-4 flex-1">
              {loading ? (
                <p className="text-[var(--color-text-secondary)]">Loading...</p>
              ) : pastSessions.length > 0 ? (
                pastSessions.map((session: any) => (
                  <div key={session.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] opacity-70 hover:opacity-100 transition-opacity">
                    <div>
                      <h3 className="font-bold text-[var(--color-text-primary)]">
                        {session.subject?.name || 'Session'}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {formatDate(session.start_time)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)] italic">
                  No past sessions yet.
                </p>
              )}
            </div>
          </section>

        </div>

      </div>
    </ProtectedClient>
  );
}
