"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, ReactNode } from "react";

interface FadeSectionProps {
    /** Scroll range: [fadeInStart, peakStart, peakEnd, fadeOutEnd] as 0-1 values */
    scrollRange: [number, number, number, number];
    /** Y offset distance in pixels */
    yOffset?: number;
    /** Enable pointer events when visible */
    interactive?: boolean;
    /** Additional CSS classes */
    className?: string;
    children: ReactNode;
}

interface UseFadeSectionReturn {
    opacity: MotionValue<number>;
    y: MotionValue<number>;
}

export function useFadeSection(
    scrollYProgress: MotionValue<number>,
    scrollRange: [number, number, number, number],
    yOffset: number = 50
): UseFadeSectionReturn {
    const [fadeIn, peakStart, peakEnd, fadeOut] = scrollRange;

    const opacity = useTransform(
        scrollYProgress,
        [fadeIn, peakStart, peakEnd, fadeOut],
        [0, 1, 1, 0]
    );

    const y = useTransform(
        scrollYProgress,
        [fadeIn, fadeOut],
        [yOffset, -yOffset]
    );

    return { opacity, y };
}

export default function FadeSection({
    scrollRange,
    yOffset = 50,
    interactive = false,
    className = "",
    children,
}: FadeSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const { opacity, y } = useFadeSection(scrollYProgress, scrollRange, yOffset);

    return (
        <motion.div
            ref={containerRef}
            style={{ opacity, y } as any}
            className={`absolute text-center max-w-2xl px-6 ${interactive ? "pointer-events-auto" : ""} ${className}`}
        >
            {children}
        </motion.div>
    );
}
