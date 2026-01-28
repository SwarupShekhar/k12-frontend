'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import FadeUpSection from './FadeUpSection';

const STEPS = [
    {
        id: 'warm-connect',
        phase: "Warm Connect",
        scientific: "Arousal Optimization",
        metric: "92% Student Openness",
        title: "Establishing the Bond",
        description: "Every session starts with a personal check-in. We review the child's interests and emotional state before touching a single textbook.",
        mock: {
            title: "Live Session: Alice W.",
            status: "Connected",
            elements: ["Current Interest: Minecraft", "Mood: Excited", "Last Session: 'Great effort'"],
            telemetry: { students: 1, ping: '42ms', fps: '60' }
        }
    },
    {
        id: 'diagnose',
        phase: "Diagnose",
        scientific: "Cognitive Architecture",
        metric: "Adaptive Gap Detect",
        title: "Foundational Gap Check",
        description: "Instead of following a rigid script, the tutor identifies the specific cognitive block that held them back in the last session.",
        mock: {
            title: "Diagnostic Mode",
            status: "Analyzing",
            elements: ["Gap detected: Fractional division", "Ref: Session #04", "Blockage type: conceptual"],
            telemetry: { students: 1, ping: '38ms', fps: '60' }
        }
    },
    {
        id: 'teach',
        phase: "Teach",
        scientific: "Mental Modeling",
        metric: "5m Peak Focus Time",
        title: "Targeted Instruction",
        description: "Short, 5-minute bursts of clear instruction using visual mental models, designed for the child's specific level.",
        mock: {
            title: "Micro-Teach",
            status: "Instruction",
            elements: ["Whiteboard: Active", "Mental Model: Visual Fractions", "Concept: Part-Whole"],
            telemetry: { students: 1, ping: '45ms', fps: '60' }
        }
    },
    {
        id: 'response',
        phase: "Active Response",
        scientific: "Neural Externalization",
        metric: "High Agency Output",
        title: "Student Externalization",
        description: "The 'Golden Rule': The student must explain the concept back in their own words to build neural pathways.",
        mock: {
            title: "Student Active",
            status: "Speaking",
            elements: ["🎙️ Student explaining...", "Retention Score: 88%", "Keyword: Reciprocal"],
            telemetry: { students: 1, ping: '40ms', fps: '60' }
        }
    },
    {
        id: 'reinforce',
        phase: "Reinforce",
        scientific: "Strategy Attribution",
        metric: "Effort Validation",
        title: "Evidence-Led Praise",
        description: "We don't praise 'smartness'. We praise the specific effort and strategy used to solve the problem.",
        mock: {
            title: "Praise Loop",
            status: "Reinforcing",
            elements: ["⭐ Targeted Praise Given", "Strategy: Decomposition", "Growth Mindset: +12%"],
            telemetry: { students: 1, ping: '39ms', fps: '60' }
        }
    },
    {
        id: 'reflect',
        phase: "Reflect",
        scientific: "Synaptic Consolidation",
        metric: "Long-term Transfer",
        title: "The Summary Loop",
        description: "Ensures information moves from short-term to long-term memory through active recall.",
        mock: {
            title: "Reflection",
            status: "Completing",
            elements: ["Summary: 3 Key Points", "Next Goal: Ratios", "Artifact Saved"],
            telemetry: { students: 1, ping: '41ms', fps: '60' }
        }
    }
];

export default function PlaybookDashboard() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        return scrollYProgress.on("change", (latest) => {
            const index = Math.min(
                Math.floor(latest * STEPS.length),
                STEPS.length - 1
            );
            setActiveIndex(index);
        });
    }, [scrollYProgress]);

    const activeStep = STEPS[activeIndex];
    const yRange = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);

    return (
        <section ref={containerRef} className="relative bg-background h-[300vh]">
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
                {/* Background Decorative Neural Node Graphics */}
                <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                    <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] border border-primary/10 rounded-full animate-pulse" />
                    <div className="absolute top-[60%] left-[15%] w-[300px] h-[300px] border border-indigo-500/10 rounded-full animate-ping [animation-duration:10s]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 h-full flex flex-col">
                    <FadeUpSection className="text-center pt-8 pb-8 shrink-0 relative z-20 bg-background/80 backdrop-blur-md">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 block">Engineered Pedagogy</span>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter">
                            What happens inside a session
                        </h2>
                    </FadeUpSection>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 h-full items-center">
                        {/* Left Side: Focus Stack Architecture */}
                        <div className="lg:w-1/2 relative h-[600px] flex gap-8 items-start">
                            {/* 1. The Timeline Sidebar (Navigation) */}
                            <div className="flex flex-col h-full py-4 relative">
                                {/* Track Line */}
                                <div className="absolute left-3 top-4 bottom-4 w-px bg-border/30" />

                                {/* Progress Indicators */}
                                <div className="space-y-12 relative z-10">
                                    {STEPS.map((step, i) => (
                                        <div key={i} className="flex items-center gap-4 group cursor-pointer" onClick={() => {
                                            const targetScroll = i / (STEPS.length - 1);
                                            window.scrollTo({ top: window.scrollY + (targetScroll * window.innerHeight), behavior: 'smooth' });
                                        }}>
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-background ${activeIndex === i
                                                        ? 'border-primary scale-110 shadow-[0_0_15px_rgba(76,112,245,0.5)]'
                                                        : activeIndex > i
                                                            ? 'border-primary/50 bg-primary/10'
                                                            : 'border-border/50 opacity-50'
                                                    }`}
                                            >
                                                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${activeIndex === i ? 'bg-primary' : 'bg-transparent'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. The Active Content Stage */}
                            <div className="flex-1 relative h-full pt-2">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeIndex}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="space-y-8"
                                    >
                                        {/* Header Tags */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-sm font-black uppercase tracking-widest text-primary">
                                                0{activeIndex + 1} / {activeStep.phase}
                                            </span>
                                            <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-tight">{activeStep.scientific}</span>
                                            </div>
                                        </div>

                                        {/* Title & Description */}
                                        <div className="space-y-6">
                                            <h3 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-[1.1]">
                                                {activeStep.title}
                                            </h3>
                                            <p className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-xl">
                                                {activeStep.description}
                                            </p>
                                        </div>

                                        {/* Key Metrics / Features */}
                                        <div className="flex flex-col gap-4 pt-4 border-t border-border/40">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-surface rounded-lg border border-border/50 shadow-sm">
                                                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60">Target Outcome</p>
                                                    <p className="text-sm font-bold text-foreground">{activeStep.metric}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Side: Sticky Interactive Mockup (The "Engine") */}
                        <div className="hidden lg:block lg:w-1/2 h-[600px]">
                            <div className="h-full w-full bg-gray-950 rounded-[3.5rem] p-1 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5 relative transform transition-transform duration-700">
                                {/* Bezel Interior */}
                                <div className="h-full w-full bg-[#050505] rounded-[3.2rem] p-8 flex flex-col relative overflow-hidden">

                                    {/* Top OS Bar */}
                                    <div className="flex items-center justify-between mb-12 relative z-20">
                                        <div className="flex items-center gap-6">
                                            <div className="flex gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                                            </div>
                                            <div className="h-3 w-px bg-white/10" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">TUTOR OS LIVE</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-xl">
                                            <span className="text-[9px] font-bold text-white/50 tracking-widest">{activeStep.mock.telemetry.ping}</span>
                                            <div className="w-px h-2 bg-white/10" />
                                            <span className="text-[9px] font-bold text-white/50 tracking-widest">{activeStep.mock.telemetry.fps} FPS</span>
                                        </div>
                                    </div>

                                    {/* Content Grid */}
                                    <div className="flex-grow flex gap-8 relative z-10">
                                        {/* Sidebar Navigation (Mock) */}
                                        <div className="w-12 flex flex-col gap-6">
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${i === 0 ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                                    <div className="w-4 h-4 rounded-sm border-2 border-current opacity-50" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Main Workspace */}
                                        <div className="flex-grow">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={activeStep.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                                                    className="space-y-8 h-full flex flex-col"
                                                >
                                                    <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-sm">
                                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">{activeStep.mock.status}</p>
                                                        <h4 className="text-3xl font-black text-white tracking-tighter leading-tight">{activeStep.mock.title}</h4>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 flex-grow content-start">
                                                        {activeStep.mock.elements.map((el, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.2 + i * 0.1 }}
                                                                className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                                                    <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">{el}</span>
                                                                </div>
                                                                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                                            </motion.div>
                                                        ))}
                                                    </div>

                                                    {/* Bottom Telemetry Bar */}
                                                    <div className="mt-auto p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex -space-x-2">
                                                                <div className="w-6 h-6 rounded-full bg-primary/30 border-2 border-[#050505]" />
                                                                <div className="w-6 h-6 rounded-full bg-indigo-500/30 border-2 border-[#050505]" />
                                                            </div>
                                                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Active Stream</span>
                                                        </div>
                                                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                animate={{ x: [-80, 80] }}
                                                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                                                className="w-1/2 h-full bg-primary/50"
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Decorative HUD elements */}
                                    <div className="absolute bottom-12 right-12 pointer-events-none opacity-20">
                                        <div className="relative w-24 h-24">
                                            <svg className="w-full h-full text-primary" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 5" />
                                                <motion.circle
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 90"
                                                    style={{ transformOrigin: 'center' }}
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Grid Overlay */}
                                    <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
