'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCatalog from '@/app/Hooks/useCatalog';
import api from '@/app/lib/api';
import { useAuthContext } from '@/app/context/AuthContext';
import { addHours, format } from 'date-fns';

type Step = 0 | 1 | 2 | 3 | 4 | 5; // Added 5 steps total: Program -> Student -> Staff -> Details -> Schedule -> Review

type StudentOption = {
    id: string;
    name: string;
    programId?: string; // Relation for filtering
};

interface BookingWizardProps {
    students: StudentOption[]; // These might be all students or filtered by parent
    isStudentsLoading?: boolean;
}

// MOCK TUTORS for Selection (Would ideally be fetched from /programs/:id/staffing)
const MOCK_TUTORS = [
    { id: 't1', name: 'Dr. Sarah Cohen', programId: '1' },
    { id: 't2', name: 'James Wilson', programId: '1' },
    { id: 't3', name: 'Emily Blunt', programId: '2' },
];

export default function BookingWizard({ students, isStudentsLoading = false }: BookingWizardProps) {
    const router = useRouter();
    const { user } = useAuthContext();
    const isStudent = user?.role === 'student';

    const { subjects, curricula, packages, loading: loadingCatalog } = useCatalog();

    const [step, setStep] = useState<Step>(0); // Start at Program Selection

    // STATE
    const [programs, setPrograms] = useState<any[]>([]); // Programs list
    const [programId, setProgramId] = useState<string | null>(null);
    const [studentId, setStudentId] = useState<string | null>(null);
    const [tutorId, setTutorId] = useState<string | null>(null);

    // Fetch Programs on Mount
    useEffect(() => {
        // Decide endpoint based on role? Or just generic list
        // Assuming GET /admin/programs returns list of programs visible to context
        api.get('/admin/programs')
            .then(res => setPrograms(res.data))
            .catch(err => console.error('Failed to fetch programs for booking', err));
    }, []);

    // Derived/Filtered Lists
    const availableStudents = students.filter(s => !programId || s.programId === programId || true); // Allow all for demo if prop missing

    // In real app, we would fetch tutors for the specific program
    // useEffect(() => { if(programId) api.get(`/programs/${programId}/tutors`).then(...) }, [programId])
    const availableTutors = MOCK_TUTORS.filter(t => !programId || t.programId === programId);

    const [subjectIds, setSubjectIds] = useState<string[]>([]);
    const [curriculumId, setCurriculumId] = useState<string | null>(null);
    const [packageId, setPackageId] = useState<string | null>(null);

    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [note, setNote] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);

    const toggleSubject = (id: string) => {
        setSubjectIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    // Auto-fill dates when entering Schedule step (Step 4 now)
    useEffect(() => {
        if (step === 4 && !start && !end) {
            const now = new Date();
            const nextHour = addHours(now, 1);
            nextHour.setMinutes(0, 0, 0);
            const toLocalISO = (d: Date) => {
                const offset = d.getTimezoneOffset() * 60000;
                return new Date(d.getTime() - offset).toISOString().slice(0, 16);
            }
            setStart(toLocalISO(nextHour));
            setEnd(toLocalISO(addHours(nextHour, 1)));
        }
    }, [step, start, end]);

    // Validation
    useEffect(() => {
        if (start && end) {
            const s = new Date(start);
            const e = new Date(end);
            if (s < new Date()) setDateError("Booking cannot be in the past.");
            else if (e <= s) setDateError("End time must be after start time.");
            else setDateError(null);
        }
    }, [start, end]);

    async function submitBooking() {
        if (!programId) return setError('Please select a program.');
        if (!studentId) return setError('Please select a student.');
        if (!tutorId) return setError('Please select a tutor.');
        if (!start || !end) return setError('Please select time.');
        if (dateError) return setError(dateError);

        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                program_id: programId,
                student_id: studentId,
                tutor_id: tutorId,
                subject_ids: subjectIds,
                curriculum_id: curriculumId,
                package_id: packageId, // Optional if defined by program
                start_time: new Date(start).toISOString(), // Updated key to match likely backend
                end_time: new Date(end).toISOString(),
                note,
            };

            console.log('Submitting Program Booking:', payload);

            // Real API call
            await api.post('/bookings', payload);

            alert('Session booked successfully within Program!');
            router.push('/admin/dashboard');

        } catch (err: any) {
            console.error(err);
            setError('Failed to create booking.');
        } finally {
            setSubmitting(false);
        }
    }

    const canProceed = () => {
        if (step === 0) return !!programId;
        if (step === 1) return !!studentId;
        if (step === 2) return !!tutorId; // Staffing required
        if (step === 3) return !!curriculumId; // Subjects/Curr
        if (step === 4) return !!start && !!end && !dateError;
        return true;
    };

    const stepsLabels = ['Program', 'Student', 'Tutor', 'Details', 'Schedule', 'Review'];

    return (
        <div className="bg-glass rounded-2xl p-8 mb-8 mt-4">
            <h1 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)]">New Program Session</h1>

            {/* Step Indicators */}
            <div className="mb-8 flex flex-wrap gap-2 text-xs sm:text-sm font-medium">
                {stepsLabels.map((label, idx) => (
                    <div key={idx} className={`px-4 py-2 rounded-full transition-colors ${step === idx ? "bg-blue-600 text-white shadow-md" :
                        step > idx ? "bg-green-600 text-white" :
                            "bg-gray-200 text-gray-500"
                        }`}>
                        {idx + 1}. {label}
                    </div>
                ))}
            </div>

            {/* CONTENT */}
            <div className="min-h-[300px]">
                {/* STEP 0: PROGRAM */}
                {step === 0 && (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium text-[var(--color-text-primary)]">Select Program Context</label>
                        <div className="grid gap-3">
                            {programs.length === 0 && <p className="text-gray-500">Loading programs...</p>}
                            {programs.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => setProgramId(p.id)}
                                    className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${programId === p.id
                                        ? 'border-blue-500 bg-blue-50ring-2 ring-blue-500'
                                        : 'border-white/20 bg-white/40 hover:bg-white/60'
                                        }`}
                                >
                                    <span className="font-bold">{p.name}</span>
                                    {programId === p.id && <span className="text-blue-600 font-bold">✓ Selected</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 1: STUDENT */}
                {step === 1 && (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium text-[var(--color-text-primary)]">Select Enrolled Student</label>
                        <div className="grid gap-3">
                            {availableStudents.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => setStudentId(s.id)}
                                    className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${studentId === s.id
                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                                        : 'border-white/20 bg-white/40 hover:bg-white/60'
                                        }`}
                                >
                                    <span className="font-medium">{s.name}</span>
                                    {studentId === s.id && <span className="text-blue-600">✓</span>}
                                </div>
                            ))}
                        </div>
                        {availableStudents.length === 0 && <p className="text-red-500">No students enrolled in this program.</p>}
                    </div>
                )}

                {/* STEP 2: TUTOR */}
                {step === 2 && (
                    <div className="space-y-4">
                        <label className="block text-lg font-medium text-[var(--color-text-primary)]">Assign Tutor</label>
                        <div className="grid gap-3">
                            {availableTutors.map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => setTutorId(t.id)}
                                    className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${tutorId === t.id
                                        ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500'
                                        : 'border-white/20 bg-white/40 hover:bg-white/60'
                                        }`}
                                >
                                    <span className="font-medium">{t.name}</span>
                                    {tutorId === t.id && <span className="text-orange-600">✓</span>}
                                </div>
                            ))}
                        </div>
                        {availableTutors.length === 0 && <p className="text-red-500">No tutors staffed in this program.</p>}
                    </div>
                )}

                {/* STEP 3: DETAILS (Subjects/Curriculum) */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Curriculum</label>
                            <select
                                value={curriculumId || ''}
                                onChange={e => setCurriculumId(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-300"
                            >
                                <option value="">Select Curriculum</option>
                                {curricula?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Subjects</label>
                            <div className="flex flex-wrap gap-2">
                                {subjects?.map((s: any) => (
                                    <button
                                        key={s.id}
                                        onClick={() => toggleSubject(s.id)}
                                        className={`px-3 py-2 rounded-lg text-sm border ${subjectIds.includes(s.id)
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white border-gray-300'
                                            }`}
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: SCHEDULE */}
                {step === 4 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Start Time</label>
                                <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">End Time</label>
                                <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300" />
                            </div>
                        </div>
                        {dateError && <p className="text-red-500">{dateError}</p>}
                    </div>
                )}

                {/* STEP 5: REVIEW */}
                {step === 5 && (
                    <div className="space-y-4 bg-white/50 p-6 rounded-xl border border-white/20">
                        <h3 className="font-bold text-lg">Confirm Session</h3>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <dt className="text-gray-500">Program</dt>
                            <dd className="font-medium text-right">{programs.find(p => p.id === programId)?.name}</dd>

                            <dt className="text-gray-500">Student</dt>
                            <dd className="font-medium text-right">{students.find(s => s.id === studentId)?.name}</dd>

                            <dt className="text-gray-500">Tutor</dt>
                            <dd className="font-medium text-right">{MOCK_TUTORS.find(t => t.id === tutorId)?.name}</dd>

                            <dt className="text-gray-500">Time</dt>
                            <dd className="font-medium text-right">{start ? format(new Date(start), 'MMM d, h:mm a') : ''} - {end ? format(new Date(end), 'h:mm a') : ''}</dd>
                        </dl>
                    </div>
                )}
            </div>

            {/* NAV BLOCKS */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                    disabled={step === 0}
                    onClick={() => setStep(s => Math.max(0, s - 1) as Step)}
                    className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-600 disabled:opacity-50"
                >
                    Back
                </button>
                {step < 5 ? (
                    <button
                        disabled={!canProceed()}
                        onClick={() => setStep(s => Math.min(5, s + 1) as Step)}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        disabled={submitting}
                        onClick={submitBooking}
                        className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-bold disabled:opacity-50"
                    >
                        {submitting ? 'Booking...' : 'Confirm Session'}
                    </button>
                )}
            </div>
        </div>
    );
}