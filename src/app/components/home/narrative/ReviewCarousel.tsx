'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeUpSection from './FadeUpSection';

const REVIEWS = [
    {
        name: "Sarah M.",
        role: "Parent",
        curriculum: "CCSS (US)",
        text: "Finally, a tutor who doesn't just read from the slides. The focus on CCSS math hurdles has changed my son's attitude towards school.",
        initials: "SM"
    },
    {
        name: "James L.",
        role: "Year 11 Student",
        curriculum: "GCSE (UK)",
        text: "I was struggling with GCSE Biology content density. The 'Attention Loops' helped me break down complex topics into things I actually remember.",
        initials: "JL"
    },
    {
        name: "Elena R.",
        role: "Parent",
        curriculum: "NGSS (Science)",
        text: "The way they approach NGSS science through curiosity-led sessions is remarkable. My daughter is now asking more questions than ever.",
        initials: "ER"
    },
    {
        name: "Arjun K.",
        role: "Grade 12 Student",
        curriculum: "IB Diploma",
        text: "IB Chemistry was overwhelming. Having someone who truly sees when I'm confused before I even say it is a game-changer.",
        initials: "AK"
    },
    {
        name: "David W.",
        role: "Parent",
        curriculum: "Australian Curriculum",
        text: "The measurable growth in confidence is what impressed us most. Our daughter no longer feels 'left behind' in her NAPLAN prep.",
        initials: "DW"
    },
    {
        name: "Maya S.",
        role: "Grade 10 Student",
        curriculum: "CBSE (Math)",
        text: "The sessions feel like a conversation, not a lecture. I actually look forward to solving problems now.",
        initials: "MS"
    }
];

export default function ReviewCarousel() {
    const scrollContainerRef = useRef(null);
    const { scrollXProgress } = useScroll({ container: scrollContainerRef });

    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6">
                <FadeUpSection className="mb-20 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Social Proof</span>
                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
                        Global parents, local results.
                    </h2>
                </FadeUpSection>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory px-4 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {REVIEWS.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            viewport={{ once: true }}
                            className="flex-shrink-0 w-[320px] md:w-[400px] snap-center"
                        >
                            <div className="h-full bg-surface p-8 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                            {review.initials}
                                        </div>
                                        <div>
                                            <p className="font-black text-foreground tracking-tight">{review.name}</p>
                                            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{review.role} • {review.curriculum}</p>
                                        </div>
                                    </div>
                                    <p className="text-text-secondary font-medium leading-relaxed italic">
                                        “{review.text}”
                                    </p>
                                </div>
                                <div className="mt-8 pt-6 border-t border-border/30 flex items-center gap-2">
                                    {[...Array(5)].map((_, j) => (
                                        <svg key={j} className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Progress Bar for Carousel */}
                <div className="max-w-xs mx-auto h-1 bg-border/20 rounded-full mt-8 overflow-hidden">
                    <motion.div
                        style={{ scaleX: scrollXProgress }}
                        className="h-full bg-primary origin-left"
                    />
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none -z-10" />
        </section>
    );
}
