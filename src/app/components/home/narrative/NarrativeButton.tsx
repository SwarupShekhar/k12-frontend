'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    children: React.ReactNode;
}

export default function NarrativeButton({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
    const baseStyles = "px-8 py-4 rounded-full font-bold text-sm tracking-tight transition-all active:scale-95 disabled:opacity-50";

    const variants = {
        primary: "bg-foreground text-background hover:opacity-90 shadow-xl shadow-black/5",
        secondary: "bg-primary text-white hover:opacity-90 shadow-xl shadow-primary/20",
        outline: "bg-transparent border-2 border-border text-foreground hover:border-foreground"
    };

    return (
        <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props as any}
        >
            {children}
        </motion.button>
    );
}
