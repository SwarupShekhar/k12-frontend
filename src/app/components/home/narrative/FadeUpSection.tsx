'use client';

import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface FadeUpSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    stagger?: boolean;
}

export const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number]
        }
    }
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

export default function FadeUpSection({ children, className = '', delay = 0, stagger = false }: FadeUpSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={stagger ? staggerContainer : fadeUpVariants}
            transition={{ delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
