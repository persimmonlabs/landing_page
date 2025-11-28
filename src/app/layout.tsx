import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
    title: "Persimmon Labs",
    description: "Intelligence. Cultivated.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans bg-void text-offwhite antialiased`}>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
