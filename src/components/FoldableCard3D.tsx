"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface FoldableCard3DProps {
    frontImage: string;
    innerLeftImage: string;
    innerRightImage: string;
    backImage: string;
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
    width?: number;
    height?: number;
}

export default function FoldableCard3D({
    frontImage,
    innerLeftImage,
    innerRightImage,
    backImage,
    isOpen,
    onToggle,
    className,
    width = 300,
    height = 420,
}: FoldableCard3DProps) {
    const handleToggle = () => {
        onToggle();
    };

    return (
        <div
            className={cn("flex items-center justify-center p-8", className)}
            style={{ perspective: "1500px" }}
        >
            <div
                className="relative transition-transform duration-1000 ease-in-out cursor-pointer"
                onClick={handleToggle}
                style={{
                    width: width,
                    height: height,
                    transformStyle: "preserve-3d",
                    transform: isOpen ? "translateX(50%)" : "translateX(0)",
                }}
            >
                {/* Right Page (Inside Right) - Acts as the base/back cover from the front view */}
                <div
                    className="absolute inset-0 bg-white shadow-xl rounded-r-[3px]"
                    style={{
                        backgroundImage: `url(${innerRightImage})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        zIndex: 0,
                        transform: "rotateY(0deg)", // Base doesn't rotate
                    }}
                >
                    {/* Binding Shadow */}
                    <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Left Page (Front Cover & Inside Left) - The moving part */}
                <div
                    className="absolute inset-0 transition-transform duration-1000 ease-in-out"
                    style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "left center",
                        transform: isOpen ? "rotateY(-180deg)" : "rotateY(0deg)",
                        zIndex: 10,
                    }}
                >
                    {/* Front Face (Cover) */}
                    <div
                        className="absolute inset-0 bg-white shadow-xl rounded-r-[3px] overflow-hidden backface-hidden"
                        style={{
                            backgroundImage: `url(${frontImage})`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backfaceVisibility: "hidden", // Crucial for 3D flip
                        }}
                    >
                        {/* Shine/Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-50 pointer-events-none" />
                    </div>

                    {/* Back Face (Inside Left) */}
                    <div
                        className="absolute inset-0 bg-white shadow-xl rounded-l-[3px] overflow-hidden"
                        style={{
                            backgroundImage: `url(${innerLeftImage})`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            transform: "rotateY(180deg)", // Already flipped so it faces correctly when open
                            backfaceVisibility: "hidden",
                        }}
                    >
                        {/* Inner Shadow */}
                        <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/50 animate-pulse pointer-events-none select-none">
                <Sparkles size={14} />
                <span className="text-xs font-medium uppercase tracking-widest">
                    {isOpen ? 'Click to close' : 'Click to open'}
                </span>
            </div>
        </div>
    );
}
