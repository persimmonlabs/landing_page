"use client";

import Scene from "@/components/Scene";
import Overlay from "@/components/Overlay";
import Continuum from "@/components/Continuum";
import { useLanguage } from "@/components/LanguageContext";

export default function Home() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <main className="relative w-full min-h-screen bg-void overflow-x-hidden">

            {/* 3D Scene Background */}
            <Scene />

            {/* Visual Effects */}
            <Overlay />

            {/* Brand Logo */}
            <div className="fixed top-8 left-8 z-50 text-offwhite font-mono text-sm tracking-widest pointer-events-none select-none">
                PERSIMMON LABS.
            </div>

            {/* Language Switcher */}
            <button
                onClick={toggleLanguage}
                className="fixed top-8 right-8 z-50 text-offwhite font-mono text-sm tracking-widest hover:text-persimmon transition-colors"
            >
                {language === "EN" ? "EN / PT" : "PT / EN"}
            </button>

            {/* Scrollable Content */}
            <Continuum />

        </main>
    );
}
