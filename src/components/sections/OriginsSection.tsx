"use client";

import { motion, MotionValue } from "framer-motion";
import ExternalLink from "@/components/ui/ExternalLink";
import { founder } from "@/data/works";

interface OriginsSectionProps {
    opacity: MotionValue<number>;
    y: MotionValue<number>;
}

export default function OriginsSection({ opacity, y }: OriginsSectionProps) {
    return (
        <motion.div
            style={{ opacity, y } as any}
            className="absolute text-center max-w-2xl px-6"
        >
            {/* Quote */}
            <p className="text-2xl md:text-4xl font-sans font-light tracking-tight text-offwhite whitespace-pre-line mb-8">
                {founder.quote}
            </p>

            {/* Name */}
            <h3 className="text-lg md:text-xl font-sans font-medium text-white mb-1">
                {founder.name}
            </h3>

            {/* Title */}
            <p className="text-sm font-mono text-offwhite/60 tracking-widest mb-6">
                {founder.title}
            </p>

            {/* Website Link */}
            <ExternalLink href={founder.website}>
                renatodap.me
            </ExternalLink>
        </motion.div>
    );
}
