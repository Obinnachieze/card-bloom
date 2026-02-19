"use client";

// this is a client component
import { useEffect, useState } from "react";
import Link from "next/link";
import { renderCanvas } from "@/components/ui/canvas"
import { Shapes, ArrowRight, Plus, Sparkles } from "lucide-react";
import CreateCardDrawer from '@/components/CreateCardDrawer';

import { Button } from "@/components/ui/button";

export function Hero() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        renderCanvas();
    }, []);

    return (
        <section id="home" className="relative h-screen w-full overflow-hidden">
            <div className="animation-delay-8 animate-fadeIn mt-4 flex flex-col items-center justify-center px-4 text-center md:mt-4 z-10 relative">
                <div className="z-10 mb-4 mt-4 sm:justify-center md:mb-2 md:mt-4">
                    <div className="relative flex items-center whitespace-nowrap rounded-full border bg-popover px-3 py-1 text-xs leading-6 text-primary/60">
                        <Sparkles className="h-5 p-1 text-accent" />
                        <span className="font-semibold text-muted-foreground uppercase tracking-wide">CardCraft</span>
                    </div>
                </div>

                <div className="mb-4 mt-2 md:mt-2">
                    <div className="px-2">
                        <div className="border-border relative mx-auto h-full max-w-7xl border p-4 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-6 bg-background/50 backdrop-blur-sm rounded-xl">
                            <h1 className="flex select-none flex-col px-3 py-2 text-center text-5xl font-extrabold leading-none tracking-tight md:flex-col md:text-6xl lg:flex-row lg:text-7xl text-foreground">
                                <Plus
                                    strokeWidth={4}
                                    className="text-primary absolute -left-5 -top-5 h-10 w-10"
                                />
                                <Plus
                                    strokeWidth={4}
                                    className="text-primary absolute -bottom-5 -left-5 h-10 w-10"
                                />
                                <Plus
                                    strokeWidth={4}
                                    className="text-primary absolute -right-5 -top-5 h-10 w-10"
                                />
                                <Plus
                                    strokeWidth={4}
                                    className="text-primary absolute -bottom-5 -right-5 h-10 w-10"
                                />
                                Send joy,
                                <br className="hidden md:block" />
                                one card at a time.
                            </h1>
                        </div>
                    </div>

                    <p className="md:text-lg mx-auto mb-8 mt-4 max-w-2xl px-6 text-sm text-muted-foreground sm:px-6 md:max-w-4xl md:px-20">
                        Create beautiful digital cards for any occasion
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={() => setDrawerOpen(true)}
                            className="rounded-full px-8"
                            size="lg"
                        >
                            <Plus size={18} className="mr-2" />
                            Create a Card
                        </Button>
                    </div>
                </div>
            </div>
            <canvas
                className="bg-background pointer-events-none absolute inset-0 mx-auto w-full h-full"
                id="canvas"
            ></canvas>
            <CreateCardDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
        </section>
    );
};
