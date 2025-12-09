'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    QUIZ_BANK,
    GradeBand,
    SubjectKey,
    LEARNING_QUESTIONS,
    LEARNING_RESULTS,
    LearningCode,
} from './quizContent';
import InteractiveCard from './InteractiveCard';

export default function InteractiveZone() {
    return (
        <section className="w-full py-16 px-6Async">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                        Learning Should Not Be Boring. Start the Fun.
                    </h2>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        Explore learning in a way that feels interactive, personal, and exciting from the very first click.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <QuickQuizCard />
                    <LearningSuperpowerCard />
                </div>
            </div>
        </section>
    );
}

function QuickQuizCard() {
    const router = useRouter();
    const [started, setStarted] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [grade, setGrade] = useState<GradeBand>('K-5');
    const [subject, setSubject] = useState<SubjectKey>('Math');

    // Quiz State
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({}); // question index -> option index

    const questions = QUIZ_BANK[grade][subject];
    const currentQ = questions[currentQIndex];

    const handleStart = () => {
        setCurrentQIndex(0);
        setAnswers({});
        setCompleted(false);
        setStarted(true);
    };

    const handleAnswer = (optionIdx: number) => {
        setAnswers((prev) => ({ ...prev, [currentQIndex]: optionIdx }));
    };

    const handleNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            setCompleted(true);
        }
    };

    const handlePrev = () => {
        if (currentQIndex > 0) {
            setCurrentQIndex(currentQIndex - 1);
        }
    };

    // Result Calculation
    const calculateScore = () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctIndex) score++;
        });
        return score;
    };

    if (completed) {
        const score = calculateScore();
        const isGoodScore = score >= 2;

        return (
            <InteractiveCard variant="orange">
                <div className="h-full flex flex-col animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[600px] no-scrollbar">
                    <div className="text-center mb-6">
                        <div className="inline-flex w-16 h-16 bg-blue-100 rounded-full items-center justify-center text-3xl mb-4">
                            {isGoodScore ? '🎉' : '💪'}
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                            You got {score} out of {questions.length} correct
                        </h3>
                        <p className="text-[var(--color-text-secondary)]">
                            {isGoodScore ? 'Great job! You show real promise.' : 'Good effort! Learning takes practice.'}
                        </p>
                    </div>

                    <div className="space-y-6 mb-8 flex-1">
                        {questions.map((q, idx) => {
                            const isCorrect = answers[idx] === q.correctIndex;
                            const userAns = q.options[answers[idx]];
                            return (
                                <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                                    <p className="font-medium text-[var(--color-text-primary)] text-sm mb-2">
                                        {idx + 1}. {q.question}
                                    </p>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {isCorrect ? 'Correct' : 'Incorrect'}
                                        </span>
                                        {!isCorrect && <span className="text-xs text-[var(--color-text-secondary)]">You chose: {userAns}</span>}
                                    </div>
                                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                                        {q.explanation}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => router.push(`/signup?intent=quiz&score=${score}`)}
                        className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-all shadow-lg"
                    >
                        {score <= 1 ? 'I want to get better. Show me how tutoring can help' : 'Great job. Meet your ideal tutor'}
                    </button>

                    <button
                        onClick={() => { setStarted(false); setCompleted(false); }}
                        className="mt-4 w-full text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                    >
                        Try again with a different subject
                    </button>
                </div>
            </InteractiveCard>
        );
    }

    if (started) {
        const isAnswered = answers[currentQIndex] !== undefined;
        const isLast = currentQIndex === questions.length - 1;

        return (
            <InteractiveCard variant="orange">
                <div className="h-full flex flex-col">
                    <div className="mb-6 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase text-[var(--color-primary)] tracking-wider">
                            Question {currentQIndex + 1} of {questions.length}
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)] font-medium">
                            {grade} • {subject}
                        </span>
                    </div>

                    <div className="flex-1">
                        <h4 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] mb-8 leading-snug">
                            {currentQ.question}
                        </h4>

                        <div className="space-y-3">
                            {currentQ.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between group ${answers[currentQIndex] === idx
                                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
                                        : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-blue-50/30'
                                        }`}
                                >
                                    <span className="font-medium">{opt}</span>
                                    {answers[currentQIndex] === idx && <span>✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        {currentQIndex > 0 && (
                            <button
                                onClick={handlePrev}
                                className="px-6 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold hover:bg-[var(--color-surface)] transition-all"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!isAnswered}
                            className="flex-1 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg shadow-blue-500/10"
                        >
                            {isLast ? 'See my result' : 'Next'}
                        </button>
                    </div>
                </div>
            </InteractiveCard>
        );
    }

    return (
        <InteractiveCard variant="orange">
            <div className="h-full flex flex-col">
                <div className="mb-4 w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                    ⚡️
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Try a 60-second challenge</h3>
                <p className="text-[var(--color-text-secondary)] mb-8 flex-1">
                    Pick your grade and subject to attempt a short quiz designed to test thinking, not memorization.
                </p>

                <div className="space-y-6 mb-8">
                    <div>
                        <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-3">Grade Level</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['K-5', '6-8', '9-12'] as GradeBand[]).map(g => (
                                <button
                                    key={g}
                                    onClick={() => setGrade(g)}
                                    className={`py-2 text-sm rounded-lg border transition-all ${grade === g
                                        ? 'bg-[var(--color-secondary)] text-slate-900 border-[var(--color-secondary)] font-bold shadow-sm'
                                        : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-gray-300'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase mb-3">Subject</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['Math', 'Science'] as SubjectKey[]).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSubject(s)}
                                    className={`py-2 text-sm rounded-lg border transition-all ${subject === s
                                        ? 'bg-[var(--color-secondary)] text-slate-900 border-[var(--color-secondary)] font-bold shadow-sm'
                                        : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-gray-300'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
                >
                    Start quiz
                </button>
            </div>
        </InteractiveCard>
    );
}

function LearningSuperpowerCard() {
    const router = useRouter();
    const [started, setStarted] = useState(false);
    const [step, setStep] = useState(0);
    const [scores, setScores] = useState<Record<LearningCode, number>>({ V: 0, A: 0, K: 0 });
    const [completed, setCompleted] = useState(false);

    // Helper to determine winner
    const getResult = () => {
        // Tie breaker priority: V, A, K
        const { V, A, K } = scores;
        if (V >= A && V >= K) return LEARNING_RESULTS['V'];
        if (A > V && A >= K) return LEARNING_RESULTS['A'];
        return LEARNING_RESULTS['K'];
    };

    const handleAnswer = (code: LearningCode) => {
        const newScores = { ...scores, [code]: scores[code] + 1 };
        setScores(newScores);

        if (step < LEARNING_QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            setCompleted(true);
        }
    };

    if (completed) {
        const result = getResult();

        return (
            <InteractiveCard variant="purple">
                <div className="h-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-300 overflow-y-auto max-h-[600px] no-scrollbar">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mb-4">
                        🧠
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-text-secondary)] mb-1 uppercase tracking-wide">
                        {result.title.replace('Your learning superpower: ', '')}
                    </h3>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-primary)] mb-4">
                        {result.subtitle}
                    </h2>

                    <p className="text-[var(--color-text-primary)] mb-6 leading-relaxed">
                        {result.description}
                    </p>

                    <div className="w-full bg-[var(--color-surface)]/50 rounded-xl p-6 text-left mb-8 border border-[var(--color-border)]">
                        <h4 className="font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                            Your study hacks:
                        </h4>
                        <ul className="space-y-2">
                            {result.suggestions.map((s, i) => (
                                <li key={i} className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                                    <span className="text-[var(--color-primary)]">•</span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={() => router.push('/signup?intent=learning-style')}
                        className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-all shadow-lg"
                    >
                        Meet your ideal tutor
                    </button>

                    <p className="mt-6 text-xs text-[var(--color-text-secondary)] opacity-80 max-w-sm mx-auto">
                        We use your child's learning profile along with their grade and goals to match them with a tutor from our in-house team.
                    </p>
                </div>
            </InteractiveCard>
        );
    }

    if (started) {
        const currentQ = LEARNING_QUESTIONS[step];
        return (
            <InteractiveCard variant="purple">
                <div className="h-full flex flex-col min-h-[500px]">
                    <div className="mb-4 flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase text-purple-600 tracking-wider">
                            Question {step + 1} of {LEARNING_QUESTIONS.length}
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-[var(--color-text-primary)]">
                            {currentQ.question}
                        </h3>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-3">
                        {currentQ.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(opt.code)}
                                className="w-full text-left p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-purple-400 hover:bg-purple-50/50 transition-all flex justify-between group"
                            >
                                <span className="text-sm font-medium text-[var(--color-text-primary)]">{opt.label}</span>
                                <span className="opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity">→</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center gap-1.5">
                        {LEARNING_QUESTIONS.map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-purple-500' : (i < step ? 'w-2 bg-purple-200' : 'w-2 bg-gray-200')}`} />
                        ))}
                    </div>
                </div>
            </InteractiveCard>
        );
    }

    return (
        <InteractiveCard variant="purple">
            <div className="h-full flex flex-col">
                <div className="mb-4 w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
                    🔍
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Discover your learning superpower</h3>
                <p className="text-[var(--color-text-secondary)] mb-8">
                    Answer a few quick questions and discover how you learn best.
                </p>

                {/* Intro features */}
                <div className="flex-1 space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm">👁️</div>
                        <span className="text-sm text-[var(--color-text-secondary)]">Visual Explorer</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">👂</div>
                        <span className="text-sm text-[var(--color-text-secondary)]">Sound Focused</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-sm">🧱</div>
                        <span className="text-sm text-[var(--color-text-secondary)]">Hands-On Builder</span>
                    </div>
                </div>

                <button
                    onClick={() => setStarted(true)}
                    className="w-full py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                    Start discovery
                </button>
            </div>
        </InteractiveCard>
    );
}
