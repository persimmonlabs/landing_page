"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { ArrowRight, Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function EmailForm() {
    const { t, language } = useLanguage();

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        try {
            const res = await fetch("https://sheetdb.io/api/v1/68y4g18n5i0uo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    data: {
                        email,
                        locale: language,
                        timestamp: new Date().toISOString()
                    }
                }),
            });

            if (!res.ok) throw new Error("Failed");

            setStatus("success");
            setEmail("");
        } catch (error) {
            console.error(error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 text-persimmon font-mono"
            >
                <CheckCircle className="w-5 h-5" />
                <span>{t("success")}</span>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md relative group">
            <div className="relative flex items-center border-b border-offwhite/20 focus-within:border-persimmon transition-colors duration-300">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    disabled={status === "loading"}
                    className="w-full bg-transparent py-4 text-offwhite font-mono placeholder:text-offwhite/30 focus:outline-none disabled:opacity-50"
                    required
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="ml-4 text-offwhite/50 hover:text-persimmon transition-colors disabled:opacity-50"
                >
                    {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <ArrowRight className="w-5 h-5" />
                    )}
                </button>
            </div>
            {status === "error" && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-0 text-red-500 text-xs font-mono flex items-center"
                >
                    <XCircle className="w-3 h-3 mr-1" />
                    {t("error")}
                </motion.p>
            )}
        </form>
    );
}
