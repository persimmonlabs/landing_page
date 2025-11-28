"use client";

import { ElementType, ReactNode } from "react";

interface GlowTextProps {
    as?: ElementType;
    glow?: boolean;
    className?: string;
    children: ReactNode;
}

export default function GlowText({
    as: Component = "span",
    glow = false,
    className = "",
    children,
}: GlowTextProps) {
    const glowStyles = glow
        ? "drop-shadow-[0_0_20px_rgba(236,88,0,0.5)] hover:drop-shadow-[0_0_30px_rgba(236,88,0,0.7)]"
        : "hover:drop-shadow-[0_0_20px_rgba(236,88,0,0.3)]";

    return (
        <Component
            className={`transition-all duration-300 ${glowStyles} ${className}`}
        >
            {children}
        </Component>
    );
}
