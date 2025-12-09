'use client';

import React from 'react';

export default function TutorVetting() {
    const steps = [
        {
            title: "Academic screening",
            desc: "Tutors must demonstrate subject mastery through credentials, certifications, or strong academic records."
        },
        {
            title: "Background verification",
            desc: "All tutors complete a verified criminal background check before onboarding."
        },
        {
            title: "Live video interview",
            desc: "Our education team evaluates communication skills, teaching style, and student engagement."
        },
        {
            title: "Mock teaching session",
            desc: "Tutors run a supervised practice session to assess clarity, pacing, and adaptability."
        },
        {
            title: "Ongoing training",
            desc: "Monthly training and feedback keep tutoring quality high over time."
        }
    ];

    return (
        <section className="w-full py-20 px-6 bg-[var(--color-surface)]" id="vetting">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                        Only the best enter our classroom
                    </h2>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        Every tutor passes a rigorous selection and training process before teaching a single student.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            {/* Number / Icon */}
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-[var(--color-primary)] font-bold text-xl flex items-center justify-center mb-6 border border-blue-100 group-hover:scale-110 transition-transform shadow-sm">
                                {idx + 1}
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">
                                {step.title}
                            </h3>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
