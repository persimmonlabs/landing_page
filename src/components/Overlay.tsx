"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Overlay() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", updateMousePosition);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    return (
        <>
            {/* Grain Overlay */}
            <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.07] mix-blend-overlay">
                <svg className="w-full h-full">
                    <filter id="noiseFilter">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.8"
                            numOctaves="3"
                            stitchTiles="stitch"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>

            {/* Cursor Spotlight */}
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(236, 88, 0, 0.15), transparent 40%)`,
                }}
            />
        </>
    );
}
