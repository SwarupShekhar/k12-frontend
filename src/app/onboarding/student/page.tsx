import React, { Suspense } from 'react';
import OnboardingStudentForm from './OnboardingStudentForm';

export default function StudentOnboardingPage() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] py-10 transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] mb-2">
                    Add your child
                </h1>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    Tell us a bit about your child so we can personalise their
                    tutoring experience.
                </p>

                <Suspense
                    fallback={
                        <div className="flex items-center justify-center p-8 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                        </div>
                    }
                >
                    <OnboardingStudentForm />
                </Suspense>
            </div>
        </div>
    );
}