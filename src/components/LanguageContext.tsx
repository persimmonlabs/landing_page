"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "EN" | "PT";

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
    EN: {
        knowledge: "Knowledge is a living thing.",
        build: "We build technology that enhances human wisdom.",
        simple: "Simple. Intuitive. Essential.",
        transition: "Behind every system,\na creator.",
        finalTitle: "PERSIMMON",
        finalSub: "INTELLIGENCE. CULTIVATED.",
        subscribe: "Subscribe",
        emailPlaceholder: "Enter your email",
        join: "Join the void",
        success: "Welcome to the fold.",
        error: "Something went wrong.",
    },
    PT: {
        knowledge: "O conhecimento é vivo.",
        build: "Construímos a tecnologia que amplia a sabedoria humana.",
        simple: "Simples. Intuitivo. Essencial.",
        transition: "Por trás de cada sistema,\num criador.",
        finalTitle: "PERSIMMON",
        finalSub: "INTELIGÊNCIA. CULTIVADA.",
        subscribe: "Inscrever-se",
        emailPlaceholder: "Digite seu email",
        join: "Junte-se ao vazio",
        success: "Bem-vindo ao rebanho.",
        error: "Algo deu errado.",
    },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>("EN");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "EN" ? "PT" : "EN"));
    };

    const t = (key: string) => {
        // @ts-ignore
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
