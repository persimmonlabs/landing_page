"use client";

import { ReactNode } from "react";

interface ExternalLinkProps {
    href: string;
    className?: string;
    showArrow?: boolean;
    children: ReactNode;
}

export default function ExternalLink({
    href,
    className = "",
    showArrow = true,
    children,
}: ExternalLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                font-mono text-sm tracking-widest
                text-offwhite/60 hover:text-persimmon
                transition-colors duration-300
                inline-flex items-center gap-2
                ${className}
            `}
        >
            {children}
            {showArrow && (
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                </span>
            )}
        </a>
    );
}
