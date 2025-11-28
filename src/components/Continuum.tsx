"use client";

import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ManifestoSection from "@/components/sections/ManifestoSection";
import OriginsSection from "@/components/sections/OriginsSection";
import WorksSection from "@/components/sections/WorksSection";
import EmailSection from "@/components/sections/EmailSection";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * Continuum - Main scroll orchestrator
 *
 * Scroll Structure (~800vh):
 * - Manifesto: 0-35% (existing 4-part reveal + transition)
 * - Origins: 35-55% (founder introduction)
 * - Works: 55-85% (project showcase)
 * - Email: 85-100% (final CTA)
 */
export default function Continuum() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // ===== MANIFESTO SECTION (0-35%) =====
    // Section 1: 0-10%
    const manifestoOpacity1 = useTransform(scrollYProgress, [0, 0.05, 0.08, 0.12], [1, 1, 1, 0]);
    const manifestoY1 = useTransform(scrollYProgress, [0, 0.12], [0, -50]);

    // Section 2: 8-18%
    const manifestoOpacity2 = useTransform(scrollYProgress, [0.08, 0.12, 0.16, 0.20], [0, 1, 1, 0]);
    const manifestoY2 = useTransform(scrollYProgress, [0.08, 0.20], [50, -50]);

    // Section 3: 16-26%
    const manifestoOpacity3 = useTransform(scrollYProgress, [0.16, 0.20, 0.24, 0.28], [0, 1, 1, 0]);
    const manifestoY3 = useTransform(scrollYProgress, [0.16, 0.28], [50, -50]);

    // Section 4 (Transition): 24-35%
    const manifestoOpacity4 = useTransform(scrollYProgress, [0.24, 0.28, 0.32, 0.36], [0, 1, 1, 0]);
    const manifestoY4 = useTransform(scrollYProgress, [0.24, 0.36], [50, -50]);

    // ===== ORIGINS SECTION (35-55%) =====
    const originsOpacity = useTransform(scrollYProgress, [0.34, 0.40, 0.50, 0.56], [0, 1, 1, 0]);
    const originsY = useTransform(scrollYProgress, [0.34, 0.56], [50, -50]);

    // ===== WORKS SECTION (55-85%) =====
    const worksOpacity = useTransform(scrollYProgress, [0.54, 0.60, 0.78, 0.84], [0, 1, 1, 0]);
    const worksY = useTransform(scrollYProgress, [0.54, 0.84], [50, -50]);

    // ===== EMAIL SECTION (85-100%) =====
    const emailOpacity = useTransform(scrollYProgress, [0.84, 0.90, 1], [0, 1, 1]);
    const emailY = useTransform(scrollYProgress, [0.84, 1], [50, 0]);

    // ===== SECTION LABELS =====
    const labelManifesto = useTransform(scrollYProgress, [0, 0.05, 0.30, 0.35], [0, 1, 1, 0]);
    const labelOrigins = useTransform(scrollYProgress, [0.34, 0.40, 0.50, 0.56], [0, 1, 1, 0]);
    const labelWorks = useTransform(scrollYProgress, [0.54, 0.60, 0.78, 0.84], [0, 1, 1, 0]);
    const labelEmail = useTransform(scrollYProgress, [0.84, 0.90, 1], [0, 1, 1]);

    return (
        <div ref={containerRef} className="relative h-[800vh]">
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
                {/* Manifesto */}
                <ManifestoSection
                    opacities={[manifestoOpacity1, manifestoOpacity2, manifestoOpacity3, manifestoOpacity4]}
                    ys={[manifestoY1, manifestoY2, manifestoY3, manifestoY4]}
                />

                {/* Origins */}
                <OriginsSection opacity={originsOpacity} y={originsY} />

                {/* Works */}
                <WorksSection opacity={worksOpacity} y={worksY} />

                {/* Email */}
                <EmailSection opacity={emailOpacity} y={emailY} />
            </div>

            {/* Section Labels - Bottom Left */}
            <SectionLabel label="Manifesto" opacity={labelManifesto} />
            <SectionLabel label="Origins" opacity={labelOrigins} />
            <SectionLabel label="Works" opacity={labelWorks} />
            <SectionLabel label="Connect" opacity={labelEmail} />
        </div>
    );
}
