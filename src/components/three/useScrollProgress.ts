"use client";

import { useState, useEffect } from "react";

interface ScrollProgressReturn {
    progress: number;
    section: "manifesto" | "origins" | "works" | "email";
}

const SECTIONS = {
    manifesto: [0, 0.35],
    origins: [0.35, 0.55],
    works: [0.55, 0.85],
    email: [0.85, 1],
} as const;

export function useScrollProgress(): ScrollProgressReturn {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const newProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
            setProgress(newProgress);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const section = getSection(progress);

    return { progress, section };
}

function getSection(progress: number): ScrollProgressReturn["section"] {
    if (progress < SECTIONS.manifesto[1]) return "manifesto";
    if (progress < SECTIONS.origins[1]) return "origins";
    if (progress < SECTIONS.works[1]) return "works";
    return "email";
}

/** Get sphere color based on scroll progress */
export function getSphereColor(progress: number): { color: string; emissive: string } {
    const section = getSection(progress);

    const colors = {
        manifesto: { color: "#EC5800", emissive: "#2a0a00" },
        origins: { color: "#FF6B1A", emissive: "#3a1200" },
        works: { color: "#D94E00", emissive: "#1a0800" },
        email: { color: "#EC5800", emissive: "#2a0a00" },
    };

    return colors[section];
}

/** Get section-local progress (0-1 within section) */
export function getSectionProgress(
    globalProgress: number,
    section: keyof typeof SECTIONS
): number {
    const [start, end] = SECTIONS[section];
    if (globalProgress < start) return 0;
    if (globalProgress > end) return 1;
    return (globalProgress - start) / (end - start);
}

/** Check if a section is visible */
export function isSectionVisible(
    globalProgress: number,
    section: keyof typeof SECTIONS,
    buffer: number = 0.05
): boolean {
    const [start, end] = SECTIONS[section];
    return globalProgress >= start - buffer && globalProgress <= end + buffer;
}
