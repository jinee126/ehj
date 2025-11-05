"use client";
import React from "react";

export default function SectionCard({
                                        title,
                                        children,
                                        right,
                                    }: {
    title: string;
    children: React.ReactNode;
    right?: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border p-4 shadow-sm bg-white">
            <header className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{title}</h2>
                {right}
            </header>
            {children}
        </section>
    );
}
