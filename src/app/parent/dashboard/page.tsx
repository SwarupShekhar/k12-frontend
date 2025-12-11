'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useAuthContext } from '@/app/context/AuthContext';
import { useParentDashboard } from '@/app/Hooks/useParentDashboard';

export default function ParentDashboardPage() {
  const { user } = useAuthContext();
  const {
    studentCount,
    loadingStudents,
    upcomingSessions,
    loadingSessions,
    students,
    loadingStudentList
  } = useParentDashboard();

  return (
    <ProtectedClient roles={['parent']}>
      <div className="min-h-screen p-6 md:p-8 space-y-8 max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <section className="bg-glass rounded-[2rem] p-8 md:p-10 border border-white/20 shadow-lg relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2">
              Welcome back, {user?.first_name || 'Parent'}
            </h1>
            <p className="text-[var(--color-text-secondary)] text-lg mb-8">
              Here is what is coming up for your child or children
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3 shadow-sm">
                <span className="text-2xl">🎓</span>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Active Students</p>
                  <p className="text-xl font-bold text-[var(--color-primary)]">
                    {loadingStudents ? '...' : studentCount}
                  </p>
                </div>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3 shadow-sm">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Upcoming Sessions</p>
                  <p className="text-xl font-bold text-[var(--color-primary)]">
                    {loadingSessions ? '...' : upcomingSessions.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* MY CHILDREN COLUMN */}
          <div className="bg-glass rounded-[2rem] p-6 border border-white/20 shadow-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <span>👶</span> My Children
            </h2>

            <div className="flex-1 space-y-4">
              {loadingStudentList ? (
                <p className="text-[var(--color-text-secondary)]">Loading students...</p>
              ) : students.length > 0 ? (
                students.map((student: any) => (
                  <div key={student.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex justify-between items-center group hover:border-[var(--color-primary)]/30 transition-colors">
                    <div>
                      <h3 className="font-bold text-[var(--color-text-primary)]">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Grade {student.grade}
                      </p>
                    </div>
                    {/* Placeholder for analysis/focus tag if data available later */}
                    <div className="hidden sm:block text-xs font-medium px-2 py-1 rounded-md bg-blue-50 text-blue-600">
                      Student
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[var(--color-text-primary)] font-bold mb-1">No children added yet</p>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">Add your child to start personalised tutoring sessions</p>
                  <Link href="/onboarding/student" className="text-sm text-[var(--color-primary)] font-bold underline decoration-2 underline-offset-4 hover:opacity-80">
                    Add your first child
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
              <Link
                href="/onboarding/student"
                className="flex items-center justify-center w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-all shadow-md"
              >
                + Add another child
              </Link>
            </div>
          </div>

          {/* UPCOMING SESSIONS COLUMN */}
          <div className="bg-glass rounded-[2rem] p-6 border border-white/20 shadow-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <span>🗓️</span> Upcoming Sessions
            </h2>

            <div className="flex-1 space-y-4">
              {loadingSessions ? (
                <p className="text-[var(--color-text-secondary)]">Loading sessions...</p>
              ) : upcomingSessions.length > 0 ? (
                upcomingSessions.map((session: any) => (
                  <div key={session.id} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700 uppercase tracking-wide">
                        {session.status || 'Scheduled'}
                      </span>
                      {session.meet_link && (
                        <a href={session.meet_link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[var(--color-primary)] hover:underline">
                          Join Session →
                        </a>
                      )}
                    </div>
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-1">
                      {session.subject_name || 'Tutoring Session'}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                      with {session.child_name || 'Child'}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] opacity-80">
                      {session.start_time ? new Date(session.start_time).toLocaleString() : 'Date TBD'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[var(--color-text-primary)] font-bold mb-1">You haven&apos;t booked any sessions yet.</p>
                  <Link href="/bookings/new" className="inline-block mt-4 px-6 py-2 rounded-full border border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all">
                    Book your first session
                  </Link>
                </div>
              )}
            </div>
          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="bg-glass rounded-[2rem] p-8 border border-white/20 shadow-sm">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">
            ⚡ Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/bookings/new" className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:scale-[1.02] transition-all group">
              <span className="block text-2xl mb-2">➕</span>
              <span className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">Book a new session</span>
            </Link>
            <Link href="/onboarding/student" className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:scale-[1.02] transition-all group">
              <span className="block text-2xl mb-2">👶</span>
              <span className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">Add Student</span>
            </Link>
            <button disabled className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] opacity-60 cursor-not-allowed text-left">
              <span className="block text-2xl mb-2">📊</span>
              <span className="font-bold text-[var(--color-text-primary)]">View progress reports <span className="text-xs font-normal opacity-70 block">(Coming Soon)</span></span>
            </button>
          </div>
        </section>

      </div>
    </ProtectedClient>
  );
}