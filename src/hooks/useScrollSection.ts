"use client";

import { useScroll, useTransform, MotionValue } from "framer-motion";
import { RefObject } from "react";

interface ScrollSectionOptions {
    /** Reference to the scrollable container */
    containerRef?: RefObject<HTMLElement>;
    /** Scroll offset configuration */
    offset?: [string, string];
}

interface ScrollSectionReturn {
    scrollYProgress: MotionValue<number>;
    /** Create opacity transform for a section */
    createOpacity: (range: [number, number, number, number]) => MotionValue<number>;
    /** Create Y transform for a section */
    createY: (range: [number, number], offset?: number) => MotionValue<number>;
    /** Check if scroll is within a range */
    isInRange: (start: number, end: number) => MotionValue<number>;
}

export function useScrollSection(
    options: ScrollSectionOptions = {}
): ScrollSectionReturn {
    const { containerRef, offset = ["start start", "end end"] } = options;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: offset as any,
    });

    const createOpacity = (range: [number, number, number, number]) => {
        return useTransform(scrollYProgress, range, [0, 1, 1, 0]);
    };

    const createY = (range: [number, number], yOffset: number = 50) => {
        return useTransform(scrollYProgress, range, [yOffset, -yOffset]);
    };

    const isInRange = (start: number, end: number) => {
        return useTransform(scrollYProgress, [start, start, end, end], [0, 1, 1, 0]);
    };

    return {
        scrollYProgress,
        createOpacity,
        createY,
        isInRange,
    };
}

/** Get current scroll progress as a number (for non-reactive use) */
export function getScrollProgress(): number {
    if (typeof window === "undefined") return 0;
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    return Math.min(Math.max(scrollY / maxScroll, 0), 1);
}
