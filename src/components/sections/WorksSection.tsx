"use client";

import { motion, MotionValue } from "framer-motion";
import { works, Work } from "@/data/works";

interface WorksSectionProps {
    opacity: MotionValue<number>;
    y: MotionValue<number>;
}

function WorkItem({ work }: { work: Work }) {
    return (
        <div className="text-center">
            {/* Project Name */}
            <h3 className="text-2xl md:text-3xl font-sans font-medium text-white mb-2">
                {work.name}
            </h3>

            {/* Tagline */}
            <p className="text-sm font-mono text-offwhite/60 tracking-widest">
                {work.tagline}
            </p>
        </div>
    );
}

export default function WorksSection({ opacity, y }: WorksSectionProps) {
    // For now, display the first work (Imensiah)
    // The logo orbits in 3D space, text appears here
    const currentWork = works[0];

    return (
        <motion.div
            style={{ opacity, y } as any}
            className="absolute text-center max-w-2xl px-6"
        >
            {currentWork && <WorkItem work={currentWork} />}
        </motion.div>
    );
}
