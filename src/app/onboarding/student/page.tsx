// src/app/onboarding/student/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import useCatalog from '@/app/Hooks/useCatalog';
import api from '@/app/lib/api';
import ProtectedClient from '@/app/components/ProtectedClient';
import { useState } from 'react';

type FormValues = {
    first_name: string;
    last_name: string;
    grade: string;
    school: string;
    curriculum_preference: string;
};

export default function StudentOnboardingPage() {
    const router = useRouter();
    const { curricula } = useCatalog();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<FormValues>({
        defaultValues: {
            first_name: '',
            last_name: '',
            grade: '',
            school: '',
            curriculum_preference: '',
        },
    });

    async function onSubmit(values: FormValues) {
        setSubmitError(null);
        try {
            // Backend: we assume POST /students uses parent from JWT.
            // It may ignore first/last name for now (they’re in users),
            // but we send them in case the backend uses them.
            await api.post('/students', {
                first_name: values.first_name,
                last_name: values.last_name,
                grade: values.grade,
                school: values.school,
                curriculum_preference:
                    values.curriculum_preference || null,
            });

            // After creating the student, go back to booking wizard
            router.push('/bookings/new');
        } catch (err: any) {
            console.error('Student create error', err);
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to create student';
            setSubmitError(msg);
        }
    }

    return (
        <ProtectedClient roles={['parent']}>
            <div className="min-h-screen bg-[#F8F9FA] py-10">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-3xl font-semibold text-[#1C3A5A] mb-2">
                        Add your child
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Tell us a bit about your child so we can personalise their
                        tutoring experience.
                    </p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white/90 rounded-2xl shadow-lg px-8 py-7 space-y-6"
                    >
                        {submitError && (
                            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                                {submitError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First name
                                </label>
                                <input
                                    type="text"
                                    {...register('first_name', { required: true })}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                />
                                {errors.first_name && (
                                    <p className="text-xs text-red-500 mt-1">
                                        First name is required.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last name
                                </label>
                                <input
                                    type="text"
                                    {...register('last_name')}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Grade
                                </label>
                                <select
                                    {...register('grade', { required: true })}
                                    className="w-full rounded-lg border px-3 py-2 text-sm bg-white"
                                >
                                    <option value="">Select grade</option>
                                    {Array.from({ length: 12 }).map((_, idx) => {
                                        const g = (idx + 1).toString();
                                        return (
                                            <option key={g} value={g}>
                                                Grade {g}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.grade && (
                                    <p className="text-xs text-red-500 mt-1">
                                        Grade is required.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    School
                                </label>
                                <input
                                    type="text"
                                    {...register('school', { required: true })}
                                    className="w-full rounded-lg border px-3 py-2 text-sm"
                                />
                                {errors.school && (
                                    <p className="text-xs text-red-500 mt-1">
                                        School is required.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Curriculum preference
                            </label>
                            <select
                                {...register('curriculum_preference')}
                                className="w-full rounded-lg border px-3 py-2 text-sm bg-white"
                            >
                                <option value="">No preference yet</option>
                                {curricula?.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                We’ll use this to match the right content and tutors.
                            </p>
                        </div>

                        <div className="flex justify-between pt-2">
                            <button
                                type="button"
                                onClick={() => router.push('/bookings/new')}
                                className="px-4 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50"
                            >
                                Back to booking
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2 rounded-lg bg-[#1C3A5A] text-white text-sm font-medium disabled:opacity-60"
                            >
                                {isSubmitting ? 'Saving…' : 'Save student'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedClient>
    );
}