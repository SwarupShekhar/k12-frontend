"use client";
import { cn } from "@/app/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { useTheme } from "next-themes";

export const WavyBackground = ({
    children,
    className,
    containerClassName,
    colors,
    waveWidth,
    backgroundFill,
    blur = 10,
    speed = "fast",
    waveOpacity = 0.5,
    ...props
}: {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    colors?: string[];
    waveWidth?: number;
    backgroundFill?: string;
    blur?: number;
    speed?: "slow" | "fast";
    waveOpacity?: number;
    [key: string]: any;
}) => {
    const { resolvedTheme } = useTheme();
    const themeRef = useRef(resolvedTheme);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationIdRef = useRef<number | null>(null);

    useEffect(() => {
        themeRef.current = resolvedTheme;
    }, [resolvedTheme]);

    const noise = createNoise3D();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Refs for closure variables
    const varsRef = useRef({
        w: 0,
        h: 0,
        nt: 0,
        i: 0,
        x: 0,
        ctx: null as any
    });

    const getSpeed = () => {
        switch (speed) {
            case "slow": return 0.001;
            case "fast": return 0.002;
            default: return 0.001;
        }
    };

    const darkWaveColors = colors ?? [
        "#38bdf8",
        "#818cf8",
        "#c084fc",
        "#e879f9",
        "#22d3ee",
    ];

    const lightWaveColors = [
        "#0284c7", // Sky 600
        "#4f46e5", // Indigo 600
        "#9333ea", // Purple 600
        "#d946ef", // Fuchsia 500
        "#0891b2", // Cyan 600
    ];

    const drawWave = (n: number) => {
        const v = varsRef.current;
        v.nt += getSpeed();
        const isDark = themeRef.current === 'dark';
        const currentColors = isDark ? darkWaveColors : lightWaveColors;

        for (v.i = 0; v.i < n; v.i++) {
            v.ctx.beginPath();
            v.ctx.lineWidth = waveWidth || 50;
            v.ctx.strokeStyle = currentColors[v.i % currentColors.length];
            for (v.x = 0; v.x < v.w; v.x += 5) {
                var y = noise(v.x / 800, 0.3 * v.i, v.nt) * 100;
                v.ctx.lineTo(v.x, y + v.h * 0.5);
            }
            v.ctx.stroke();
            v.ctx.closePath();
        }
    };

    const render = () => {
        const v = varsRef.current;
        if (!v.ctx) return;

        const isDark = themeRef.current === 'dark';
        const bgColor = backgroundFill || (isDark ? "#0D1117" : "#F5F8FF");

        v.ctx.fillStyle = bgColor;
        v.ctx.globalAlpha = waveOpacity || 0.5;
        v.ctx.fillRect(0, 0, v.w, v.h);
        drawWave(5);

        animationIdRef.current = requestAnimationFrame(render);
    };

    const init = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const v = varsRef.current;
        v.ctx = ctx;
        if (ctx) {
            v.w = ctx.canvas.width = window.innerWidth;
            v.h = ctx.canvas.height = window.innerHeight;
        }
        v.nt = 0;

        if (ctx) ctx.filter = `blur(${blur}px)`;

        window.onresize = function () {
            if (ctx) {
                v.w = ctx.canvas.width = window.innerWidth;
                v.h = ctx.canvas.height = window.innerHeight;
                ctx.filter = `blur(${blur}px)`;
            }
        };
    };

    useEffect(() => {
        init();

        let observer: IntersectionObserver;
        if (containerRef.current) {
            observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    if (animationIdRef.current === null) {
                        render();
                    }
                } else {
                    if (animationIdRef.current !== null) {
                        cancelAnimationFrame(animationIdRef.current);
                        animationIdRef.current = null;
                    }
                }
            }, { rootMargin: "200px" }); // Pre-load well before viewport
            observer.observe(containerRef.current);
        }

        return () => {
            if (animationIdRef.current !== null) {
                cancelAnimationFrame(animationIdRef.current);
            }
            if (observer) observer.disconnect();
            window.onresize = null;
        };
    }, []);

    const [isSafari, setIsSafari] = useState(false);
    useEffect(() => {
        setIsSafari(
            typeof window !== "undefined" &&
            navigator.userAgent.includes("Safari") &&
            !navigator.userAgent.includes("Chrome")
        );
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "h-screen flex flex-col items-center justify-center transition-colors duration-500",
                containerClassName
            )}
        >
            <canvas
                className="absolute inset-0 z-0"
                ref={canvasRef}
                id="canvas"
                style={{
                    ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
                }}
            ></canvas>
            <div className={cn("relative z-10", className)} {...props}>
                {children}
            </div>
        </div>
    );
};
