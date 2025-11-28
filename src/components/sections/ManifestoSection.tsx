"use client";

import { motion, MotionValue } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";

interface ManifestoSectionProps {
    opacities: [MotionValue<number>, MotionValue<number>, MotionValue<number>, MotionValue<number>];
    ys: [MotionValue<number>, MotionValue<number>, MotionValue<number>, MotionValue<number>];
}

export default function ManifestoSection({ opacities, ys }: ManifestoSectionProps) {
    const { t } = useLanguage();
    const [opacity1, opacity2, opacity3, opacity4] = opacities;
    const [y1, y2, y3, y4] = ys;

    return (
        <>
            {/* Section 1 */}
            <motion.div
                style={{ opacity: opacity1, y: y1 } as any}
                className="absolute text-center max-w-2xl px-6"
            >
                <h2 className="text-3xl md:text-5xl font-sans font-light tracking-tight text-offwhite">
                    {t("knowledge")}
                </h2>
            </motion.div>

            {/* Section 2 */}
            <motion.div
                style={{ opacity: opacity2, y: y2 } as any}
                className="absolute text-center max-w-2xl px-6"
            >
                <h2 className="text-3xl md:text-5xl font-sans font-light tracking-tight text-offwhite">
                    {t("build")}
                </h2>
            </motion.div>

            {/* Section 3 */}
            <motion.div
                style={{ opacity: opacity3, y: y3 } as any}
                className="absolute text-center max-w-2xl px-6"
            >
                <h2 className="text-3xl md:text-5xl font-sans font-light tracking-tight text-offwhite">
                    {t("simple")}
                </h2>
            </motion.div>

            {/* Section 4 - Transition phrase */}
            <motion.div
                style={{ opacity: opacity4, y: y4 } as any}
                className="absolute text-center max-w-2xl px-6"
            >
                <h2 className="text-3xl md:text-5xl font-sans font-light tracking-tight text-offwhite">
                    {t("transition") || "Behind every system,\na creator."}
                </h2>
            </motion.div>
        </>
    );
}
