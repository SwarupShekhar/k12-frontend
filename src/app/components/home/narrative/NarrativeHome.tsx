'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import ShiftSection from './ShiftSection';
import PlaybookDashboard from './PlaybookDashboard';
import TrustSection from './TrustSection';
import ResultsSection from './ResultsSection';
import ReviewCarousel from './ReviewCarousel';
import FinalCTASection from './FinalCTASection';

export default function NarrativeHome() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary transition-colors duration-500">
            <HeroSection />
            <ProblemSection />
            <ShiftSection />
            <PlaybookDashboard />
            <TrustSection />
            <ResultsSection />
            <ReviewCarousel />
            <FinalCTASection />

            {/* Shared Layout Background Elements for "Presence" */}
            <motion.div
                layoutId="presence-glow"
                className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-indigo-500/5"
            />
        </main>
    );
}
