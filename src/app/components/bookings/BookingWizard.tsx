// src/app/components/bookings/BookingWizard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCatalog from '@/app/Hooks/useCatalog';
import api from '@/app/lib/api';
import { useAuthContext } from '@/app/context/AuthContext';
import { differenceInMinutes, addHours, format } from 'date-fns';

type Step = 0 | 1 | 2 | 3 | 4;

type StudentOption = {
    id: string;
    name: string;
};

interface BookingWizardProps {
    students: StudentOption[];
    isStudentsLoading?: boolean;
}

export default function BookingWizard({ students, isStudentsLoading = false }: BookingWizardProps) {
    const router = useRouter();
    const { subjects, curricula, packages, loading: loadingCatalog } = useCatalog();

    const [step, setStep] = useState<Step>(0);

    const [studentId, setStudentId] = useState<string | null>(null);
    const [subjectIds, setSubjectIds] = useState<string[]>([]);
    const [curriculumId, setCurriculumId] = useState<string | null>(null);

    const toggleSubject = (id: string) => {
        setSubjectIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(s => s !== id);
            }
            if (prev.length >= 5) {
                return prev;
            }
            return [...prev, id];
        });
    };
    const [packageId, setPackageId] = useState<string | null>(null);

    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [note, setNote] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);

    // Pick sensible defaults once data is loaded
    useEffect(() => {
        if (!studentId && students && students.length > 0) {
            setStudentId(students[0].id);
        }
    }, [students, studentId]);

    useEffect(() => {
        if (!loadingCatalog) {
            // Default select none for subjects
            if (!curriculumId && curricula?.length) setCurriculumId(curricula[0].id);
            if (!packageId && packages?.length) setPackageId(packages[0].id);
        }
    }, [loadingCatalog, curricula, packages, curriculumId, packageId]);

    // Auto-fill dates when entering step 3 (Schedule)
    useEffect(() => {
        if (step === 3 && !start && !end) {
            // Default: Next full hour + 1 hour duration
            const now = new Date();
            const nextHour = addHours(now, 1);
            nextHour.setMinutes(0, 0, 0); // Reset minutes/seconds

            // Format for datetime-local: YYYY-MM-DDTHH:mm
            // Note: We need local time string.
            const toLocalISO = (d: Date) => {
                const offset = d.getTimezoneOffset() * 60000;
                return new Date(d.getTime() - offset).toISOString().slice(0, 16);
            }

            setStart(toLocalISO(nextHour));
            setEnd(toLocalISO(addHours(nextHour, 1)));
        }
    }, [step, start, end]);

    // Optimize Validation
    useEffect(() => {
        if (start && end) {
            const s = new Date(start);
            const e = new Date(end);
            const now = new Date();

            if (s < now) {
                setDateError("Booking cannot be in the past.");
            } else if (e <= s) {
                setDateError("End time must be after start time.");
            } else {
                setDateError(null);
            }
        }
    }, [start, end]);


    const { user } = useAuthContext();

    async function submitBooking() {
        if (!studentId || subjectIds.length === 0 || !curriculumId || !packageId || !start || !end) {
            setError('Please complete all required fields. Select at least one subject.');
            return;
        }

        if (dateError) {
            setError(dateError);
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                student_id: studentId,
                package_id: packageId,
                subject_ids: subjectIds,
                curriculum_id: curriculumId,
                // Convert from datetime-local (local time) -> ISO string (UTC)
                requested_start: new Date(start).toISOString(),
                requested_end: new Date(end).toISOString(),
                note,
            };

            const res = await api.post('/bookings/create', payload);
            const newBooking = res.data;

            // Redirect based on role
            if (user?.role === 'student') {
                router.push('/students/dashboard');
            } else {
                router.push('/parent/dashboard');
            }
        } catch (err: any) {
            console.error('Booking create error', err);
            setError(err?.response?.data?.message || 'Something went wrong while creating the booking.');
        } finally {
            setSubmitting(false);
        }
    }

    const isLoadingAny = isStudentsLoading || loadingCatalog;

    const canProceed = () => {
        if (step === 0) return !!studentId;
        if (step === 1) return subjectIds.length > 0 && !!curriculumId;
        if (step === 2) return !!packageId;
        if (step === 3) return !!start && !!end && !dateError;
        return true;
    }

    return (
        <div className="bg-glass rounded-2xl p-8 mb-8 mt-4 transition-all-fast">
            <h1 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">
                New booking
            </h1>

            {/* Step indicator */}
            <div className="mb-8 flex flex-wrap gap-2 text-xs sm:text-sm font-medium">
                {['Student', 'Subject & curriculum', 'Package', 'Schedule', 'Review'].map((label, idx) => {
                    const isActive = step === idx;
                    const isCompleted = step > idx;

                    let className = "px-4 py-2 rounded-full transition-colors ";
                    if (isActive) {
                        className += "bg-[var(--color-secondary)] text-slate-900 shadow-md";
                    } else if (isCompleted) {
                        className += "bg-[var(--color-primary)] text-white opacity-80";
                    } else {
                        className += "bg-[var(--color-border)] text-[var(--color-text-secondary)] opacity-60";
                    }

                    return (
                        <div key={idx} className={className}>
                            {idx + 1}. {label}
                        </div>
                    );
                })}
            </div>

            {isLoadingAny && (
                <div className="mb-4 text-sm text-[var(--color-text-secondary)] animate-pulse">
                    Loading options…
                </div>
            )}
            {/* Step 0: Student */}
            {step === 0 && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-700 font-medium">
                        Choose student
                    </p>

                    {/* Student List */}
                    {!isStudentsLoading && students.length > 0 && (
                        <div className="space-y-3">
                            {students.map((s) => (
                                <div
                                    key={s.id}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${studentId === s.id
                                        ? 'border-[var(--color-primary)] bg-blue-50/50 ring-1 ring-[var(--color-primary)]'
                                        : 'border-[var(--color-border)] bg-white hover:border-gray-300'
                                        }`}
                                    onClick={() => setStudentId(s.id)}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-[var(--color-text-primary)]">
                                            {s.name}
                                        </span>
                                        <span className="text-xs text-[var(--color-text-secondary)]">
                                            {/* We could show more details here if available */}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (!confirm('Are you sure you want to remove this student?')) return;
                                            try {
                                                await api.delete(`/students/${s.id}`);
                                                window.location.reload(); // Refresh to update list
                                            } catch (err) {
                                                alert('Failed to delete student');
                                            }
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove student"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!isStudentsLoading && students.length === 0 && (
                        <div className="my-10 p-8 text-center rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/50">
                            <div className="text-4xl mb-4">👶</div>
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">You don&apos;t have any students yet</h3>
                            <p className="text-[var(--color-text-secondary)] mb-6">
                                Add your child first, then come back here to book a session.
                            </p>
                            <button
                                type="button"
                                onClick={() => router.push('/onboarding/student?returnTo=booking')}
                                className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold shadow-lg hover:scale-105 transition-transform"
                            >
                                + Add a student
                            </button>
                        </div>
                    )}

                    {/* Add Student Button (Only if < 3 and > 0) */}
                    {!isStudentsLoading && students.length > 0 && students.length < 3 && (
                        <button
                            type="button"
                            onClick={() => router.push('/onboarding/student?returnTo=booking')}
                            className="inline-flex items-center px-4 py-2 mt-2 rounded-lg bg-[#F7C548] text-[#1C3A5A] text-sm font-medium shadow-sm hover:brightness-105"
                        >
                            + Add another student
                        </button>
                    )}

                    {/* Limit reached message */}
                    {!isStudentsLoading && students.length >= 3 && (
                        <p className="text-xs text-orange-600 mt-2">
                            Maximum of 3 students reached.
                        </p>
                    )}

                    {isStudentsLoading && (
                        <p className="text-sm text-gray-500">Loading students…</p>
                    )}
                </div>
            )}
            {/* Step 1: Subject & curriculum */}
            {step === 1 && (
                <div className="space-y-5">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                                Subjects (Select up to 5)
                            </label>
                            <span className="text-xs text-[var(--color-text-secondary)]">
                                {subjectIds.length}/5 selected
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                            {subjects?.map((s: any) => {
                                const isSelected = subjectIds.includes(s.id);
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => toggleSubject(s.id)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${isSelected
                                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
                                            : 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
                                            }`}
                                    >
                                        <span>{s.name}</span>
                                        {isSelected && <span>✓</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                            Curriculum
                        </label>
                        <select
                            value={curriculumId ?? ''}
                            onChange={(e) => setCurriculumId(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
                        >
                            {curricula?.map((c: any) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Step 2: Package */}
            {step === 2 && (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                        Package
                    </label>
                    <select
                        value={packageId ?? ''}
                        onChange={(e) => setPackageId(e.target.value)}
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
                    >
                        {packages?.map((p: any) => (
                            <option key={p.id} value={p.id}>
                                {p.name} — {(p.price_cents / 100).toFixed(2)} {p.currency ?? 'USD'}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Step 3: Schedule */}
            {step === 3 && (
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                            Start (your local time)
                        </label>
                        <input
                            type="datetime-local"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            // Min = now
                            min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
                        />
                        {/* Inline validation */}
                        {start && new Date(start) < new Date() && (
                            <p className="text-xs text-red-500 mt-1">Start time cannot be in the past.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                            End (your local time)
                        </label>
                        <input
                            type="datetime-local"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            min={start} // basic HTML validation
                            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
                        />
                        {dateError && (
                            <p className="text-xs text-red-500 mt-1">{dateError}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                            Note (optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-shadow"
                        />
                    </div>
                </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
                <div className="space-y-3 text-sm">
                    <h3 className="font-bold text-[var(--color-text-primary)] mb-3 text-lg">Review details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[var(--color-surface)]/50 p-4 rounded-xl border border-[var(--color-border)]">
                        {[
                            { label: 'Student', value: students.find((s) => s.id === studentId)?.name ?? '—' },
                            {
                                label: 'Subjects',
                                value: subjects
                                    ?.filter((s: any) => subjectIds.includes(s.id))
                                    .map((s: any) => s.name)
                                    .join(', ') ?? '—'
                            },
                            { label: 'Curriculum', value: curricula?.find((c: any) => c.id === curriculumId)?.name ?? '—' },
                            { label: 'Package', value: packages?.find((p: any) => p.id === packageId)?.name ?? '—' },
                            { label: 'Start', value: start ? format(new Date(start), 'PP pp') : '—' },
                            { label: 'End', value: end ? format(new Date(end), 'PP pp') : '—' },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wide font-semibold">{item.label}</div>
                                <div className="font-medium text-[var(--color-text-primary)]">{item.value}</div>
                            </div>
                        ))}

                        <div className="sm:col-span-2">
                            <div className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wide font-semibold">Note</div>
                            <div className="font-medium text-[var(--color-text-primary)]">{note || '—'}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer buttons + error */}
            <div className="mt-8 flex justify-between items-center gap-3">
                <button
                    type="button"
                    disabled={step === 0}
                    onClick={() => setStep((s) => (Math.max(0, s - 1) as Step))}
                    className="px-6 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-medium hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    Back
                </button>

                <div className="flex gap-3">
                    {step < 4 && (
                        <button
                            type="button"
                            disabled={!canProceed()}
                            onClick={() => setStep((s) => (Math.min(4, s + 1) as Step))}
                            className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    )}
                    {step === 4 && (
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={submitBooking}
                            className="px-6 py-2.5 rounded-xl bg-[var(--color-secondary)] text-slate-900 text-sm font-bold shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 disabled:opacity-60 transition-all"
                        >
                            {submitting ? 'Creating…' : 'Create booking'}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
}