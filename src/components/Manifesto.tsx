"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "./LanguageContext";
import EmailForm from "./EmailForm";

export default function Manifesto() {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Opacity transforms for each section
    // Section 1: 0-20%
    const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

    // Section 2: 25-45%
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.2, 0.55], [50, -50]);

    // Section 3: 50-70%
    const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.75, 0.85], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.5, 0.85], [50, -50]);

    // Section 4: 75-100%
    const opacity4 = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1]);
    const y4 = useTransform(scrollYProgress, [0.8, 1], [50, 0]);

    return (
        <div ref={containerRef} className="relative h-[500vh]">
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">

                {/* Section 1 */}
                <motion.div style={{ opacity: opacity1, y: y1 } as any} className="absolute text-center max-w-2xl px-6">
                    <h2 className="text-3xl md:text-5xl font-sans font-light tracking-tight text-offwhite">
                        {t("knowledge")}
                    </h2>
                </motion.div>

                {/* Section 2 */}
                <motion.div style={{ opacity: opacity2, y: y2 } as any} className="absolute text-center max-w-2xl px-6">
                    <h2 className="text-3xl md:text-5xl font-sans font-light tracking-tight text-offwhite">
                        {t("build")}
                    </h2>
                </motion.div>

                {/* Section 3 */}
                <motion.div style={{ opacity: opacity3, y: y3 } as any} className="absolute text-center max-w-2xl px-6">
                    <h2 className="text-3xl md:text-5xl font-sans font-light tracking-tight text-offwhite">
                        {t("simple")}
                    </h2>
                </motion.div>

                {/* Section 4 (Final) */}
                <motion.div style={{ opacity: opacity4, y: y4 } as any} className="absolute text-center max-w-3xl px-6 pointer-events-auto">
                    <h1 className="text-6xl md:text-8xl font-sans font-bold tracking-tighter text-white mb-4">
                        {t("finalTitle")}
                    </h1>
                    <p className="text-xl md:text-2xl font-mono text-offwhite/80 mb-12 tracking-widest">
                        {t("finalSub")}
                    </p>

                    <div className="flex justify-center">
                        <EmailForm />
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
