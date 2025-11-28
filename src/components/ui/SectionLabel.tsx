"use client";

import { motion, MotionValue } from "framer-motion";

interface SectionLabelProps {
    label: string;
    opacity: MotionValue<number>;
}

export default function SectionLabel({ label, opacity }: SectionLabelProps) {
    return (
        <motion.div
            style={{ opacity } as any}
            className="fixed bottom-8 left-8 z-50 pointer-events-none"
        >
            <span className="font-mono text-xs tracking-[0.3em] text-offwhite/40 uppercase">
                {label}
            </span>
        </motion.div>
    );
}
