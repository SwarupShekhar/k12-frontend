'use client';

import React, { useState } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCatalog from '@/app/Hooks/useCatalog';
import { Program } from '@/app/types/program';

type Step = 'ACADEMIC' | 'OPERATIONAL' | 'FINANCIAL' | 'STAFFING' | 'DELIVERY' | 'REPORTING' | 'REVIEW';

const STEPS: Step[] = ['ACADEMIC', 'OPERATIONAL', 'FINANCIAL', 'STAFFING', 'DELIVERY', 'REPORTING', 'REVIEW'];

export default function NewProgramPage() {
    const router = useRouter();
    const { subjects, curricula, packages, loading: catalogLoading } = useCatalog();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);

    // Initial Form State
    const [formData, setFormData] = useState<Partial<Program>>({
        name: '',
        status: 'draft',
        academic: { curriculumId: '', subjectIds: [], learningGoal: '' },
        operational: { startDate: '', endDate: '', sessionsPerWeek: 1, sessionLengthMinutes: 60 },
        financial: { packageId: '', billingType: 'subscription', credits: 0 },
        staffing: { maxStudentsPerTutor: 5, minimumTutorRating: 4.0 },
        delivery: { recordingRequired: true, whiteboardEnabled: true, parentAccess: true },
        reporting: { trackAttendance: true, weeklyReports: true },
    });

    const updateSection = (section: keyof Program, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev] as any,
                [field]: value
            }
        }));
    };

    const toggleSubject = (id: string) => {
        setFormData(prev => {
            const current = prev.academic?.subjectIds || [];
            const updated = current.includes(id) ? current.filter(s => s !== id) : [...current, id];
            return {
                ...prev,
                academic: { ...prev.academic!, subjectIds: updated }
            };
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        console.log('Submitting Program JSON:', JSON.stringify(formData, null, 2));

        // Simulate API POST
        await new Promise(resolve => setTimeout(resolve, 1500));

        router.push('/admin/programs');
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const stepName = STEPS[currentStep];

    return (
        <ProtectedClient roles={['admin']}>
            <div className="min-h-screen p-6 md:p-8 max-w-4xl mx-auto space-y-6">
                {/* BREADCRUMB */}
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Link href="/admin/dashboard" className="hover:underline">Admin</Link>
                    <span>/</span>
                    <Link href="/admin/programs" className="hover:underline">Programs</Link>
                    <span>/</span>
                    <span className="text-[var(--color-text-primary)] font-semibold">New</span>
                </div>

                <div className="bg-glass rounded-[2rem] border border-white/20 shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                    {/* SIDEBAR STEPS */}
                    <div className="w-full md:w-64 bg-black/5 p-6 border-r border-white/10">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Create Program</h2>
                        <div className="space-y-2">
                            {STEPS.map((step, index) => (
                                <div
                                    key={step}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${index === currentStep
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : index < currentStep
                                                ? 'text-green-600 bg-green-50/50'
                                                : 'text-[var(--color-text-secondary)] opacity-60'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === currentStep ? 'bg-white text-blue-600' : 'bg-black/10'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <span className="text-sm font-semibold capitalize">{step.toLowerCase()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FORM CONTENT */}
                    <div className="flex-1 p-8 md:p-10 flex flex-col">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 capitalize">{stepName.toLowerCase()} Configuration</h3>

                            {/* --- STEP 1: ACADEMIC --- */}
                            {stepName === 'ACADEMIC' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Program Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g. Grade 6 Math Squad"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Curriculum</label>
                                            <select
                                                value={formData.academic?.curriculumId}
                                                onChange={(e) => updateSection('academic', 'curriculumId', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="">Select Curriculum</option>
                                                {!catalogLoading && curricula?.map((c: any) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Learning Goal</label>
                                            <input
                                                type="text"
                                                value={formData.academic?.learningGoal}
                                                onChange={(e) => updateSection('academic', 'learningGoal', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="e.g. Master Algebra I basics"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Subjects</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-white/30 p-4 rounded-xl border border-white/20 max-h-48 overflow-y-auto">
                                            {!catalogLoading ? subjects?.map((s: any) => {
                                                const isSelected = formData.academic?.subjectIds.includes(s.id);
                                                return (
                                                    <div
                                                        key={s.id}
                                                        onClick={() => toggleSubject(s.id)}
                                                        className={`cursor-pointer px-3 py-2 rounded-lg text-sm border transition-all flex items-center justify-between ${isSelected ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white/40 border-transparent hover:bg-white/60'
                                                            }`}
                                                    >
                                                        <span>{s.name}</span>
                                                        {isSelected && <span>✓</span>}
                                                    </div>
                                                );
                                            }) : <p className="p-2 opacity-50">Loading...</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- STEP 2: OPERATIONAL --- */}
                            {stepName === 'OPERATIONAL' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.operational?.startDate}
                                                onChange={(e) => updateSection('operational', 'startDate', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">End Date</label>
                                            <input
                                                type="date"
                                                value={formData.operational?.endDate}
                                                onChange={(e) => updateSection('operational', 'endDate', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Sessions Per Week</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.operational?.sessionsPerWeek}
                                                onChange={(e) => updateSection('operational', 'sessionsPerWeek', parseInt(e.target.value))}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Session Length (Minutes)</label>
                                            <select
                                                value={formData.operational?.sessionLengthMinutes}
                                                onChange={(e) => updateSection('operational', 'sessionLengthMinutes', parseInt(e.target.value))}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="30">30 min</option>
                                                <option value="45">45 min</option>
                                                <option value="60">60 min</option>
                                                <option value="90">90 min</option>
                                                <option value="120">120 min</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- STEP 3: FINANCIAL --- */}
                            {stepName === 'FINANCIAL' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Package</label>
                                        <select
                                            value={formData.financial?.packageId}
                                            onChange={(e) => updateSection('financial', 'packageId', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="">Select Package</option>
                                            {!catalogLoading && packages?.map((p: any) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} {p.price_cents > 0 ? `(${(p.price_cents / 100).toFixed(2)})` : '(Free)'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Billing Type</label>
                                            <select
                                                value={formData.financial?.billingType}
                                                onChange={(e) => updateSection('financial', 'billingType', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="subscription">Subscription</option>
                                                <option value="prepaid">Prepaid Package</option>
                                                <option value="postpaid">Postpaid / Invoice</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Included Credits</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.financial?.credits}
                                                onChange={(e) => updateSection('financial', 'credits', parseInt(e.target.value))}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- STEP 4: STAFFING --- */}
                            {stepName === 'STAFFING' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Max Students Per Tutor</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.staffing?.maxStudentsPerTutor}
                                                onChange={(e) => updateSection('staffing', 'maxStudentsPerTutor', parseInt(e.target.value))}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Minimum Tutor Rating</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="5"
                                                step="0.1"
                                                value={formData.staffing?.minimumTutorRating}
                                                onChange={(e) => updateSection('staffing', 'minimumTutorRating', parseFloat(e.target.value))}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- STEP 5: DELIVERY --- */}
                            {stepName === 'DELIVERY' && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        {[
                                            { key: 'recordingRequired', label: 'Session Recording Required' },
                                            { key: 'whiteboardEnabled', label: 'Enable Interactive Whiteboard' },
                                            { key: 'parentAccess', label: 'Allow Parent Observation Access' }
                                        ].map((toggle) => (
                                            <div key={toggle.key} className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-white/20">
                                                <span className="font-medium text-[var(--color-text-primary)]">{toggle.label}</span>
                                                <button
                                                    onClick={() => updateSection('delivery', toggle.key, !(formData.delivery as any)[toggle.key])}
                                                    className={`w-12 h-6 rounded-full transition-colors relative ${(formData.delivery as any)[toggle.key] ? 'bg-blue-600' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${(formData.delivery as any)[toggle.key] ? 'left-7' : 'left-1'
                                                        }`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- STEP 6: REPORTING --- */}
                            {stepName === 'REPORTING' && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        {[
                                            { key: 'trackAttendance', label: 'Track Student Attendance' },
                                            { key: 'weeklyReports', label: 'Generate Weekly Progress Reports' }
                                        ].map((toggle) => (
                                            <div key={toggle.key} className="flex items-center justify-between p-4 bg-white/40 rounded-xl border border-white/20">
                                                <span className="font-medium text-[var(--color-text-primary)]">{toggle.label}</span>
                                                <button
                                                    onClick={() => updateSection('reporting', toggle.key, !(formData.reporting as any)[toggle.key])}
                                                    className={`w-12 h-6 rounded-full transition-colors relative ${(formData.reporting as any)[toggle.key] ? 'bg-green-600' : 'bg-gray-300'
                                                        }`}
                                                >
                                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${(formData.reporting as any)[toggle.key] ? 'left-7' : 'left-1'
                                                        }`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- REVIEW --- */}
                            {stepName === 'REVIEW' && (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm mb-4">
                                        <p>Please review configuration before creating the program.</p>
                                    </div>
                                    <pre className="bg-black/80 text-green-400 p-4 rounded-xl text-xs overflow-auto max-h-96">
                                        {JSON.stringify(formData, null, 2)}
                                    </pre>
                                </div>
                            )}

                        </div>

                        {/* FOOTER NAV */}
                        <div className="pt-6 border-t border-white/10 flex justify-end gap-3 mt-6">
                            {currentStep > 0 && (
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-2.5 rounded-xl border border-[var(--color-border)] hover:bg-white/10 transition-colors"
                                >
                                    Back
                                </button>
                            )}

                            {currentStep < STEPS.length - 1 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold shadow-lg hover:bg-blue-700 transition-colors"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-bold shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Creating...' : 'Launch Program'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedClient>
    );
}
