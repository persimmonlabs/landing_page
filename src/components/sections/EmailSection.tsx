"use client";

import { motion, MotionValue } from "framer-motion";
import EmailForm from "@/components/EmailForm";
import { useLanguage } from "@/components/LanguageContext";

interface EmailSectionProps {
    opacity: MotionValue<number>;
    y: MotionValue<number>;
}

export default function EmailSection({ opacity, y }: EmailSectionProps) {
    const { t } = useLanguage();

    return (
        <motion.div
            style={{ opacity, y } as any}
            className="absolute text-center max-w-3xl px-6 pointer-events-auto"
        >
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
    );
}
