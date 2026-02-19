"use client";

// this is a client component
import { useEffect } from "react";
import Link from "next/link";
import { renderCanvas } from "@/components/ui/canvas"
import { Shapes, ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
    useEffect(() => {
        renderCanvas();
    }, []);

    return (
        <section id="home" className="relative h-screen w-full overflow-hidden">
            <div className="animation-delay-8 animate-fadeIn mt-20 flex flex-col items-center justify-center px-4 text-center md:mt-20 z-10 relative">
                <div className="z-10 mb-6 mt-10 sm:justify-center md:mb-4 md:mt-20">
                    <div className="relative flex items-center whitespace-nowrap rounded-full border bg-popover px-3 py-1 text-xs leading-6 text-primary/60">
                        <Shapes className="h-5 p-1" /> Introducing Dicons.
                        <Link
                            href="/products/dicons"
                            rel="noreferrer"
                            className="hover:text-primary ml-1 flex items-center font-semibold"
                        >
                            <div className="absolute inset-0 flex" aria-hidden="true" />
                            Explore{" "}
                            <span aria-hidden="true">
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="mb-10 mt-4 md:mt-6">
                    <div className="px-2">
                        <div className="border-border relative mx-auto h-full max-w-7xl border p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-20 bg-background/50 backdrop-blur-sm rounded-xl">
                            <h1 className="flex select-none flex-col px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-8xl text-foreground">
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
                                Your complete platform for the Design.
                            </h1>
                            <div className="flex items-center justify-center gap-1 mt-4">
                                <span className="relative flex h-3 w-3 items-center justify-center">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                </span>
                                <p className="text-xs text-green-500 font-medium">Available Now</p>
                            </div>
                        </div>
                    </div>

                    <h1 className="mt-8 text-2xl md:text-4xl font-bold text-foreground">
                        Welcome to my creative playground! I&#39;m{" "}
                        <span className="text-primary font-bold">Ali </span>
                    </h1>

                    <p className="md:text-lg mx-auto mb-16 mt-4 max-w-2xl px-6 text-sm text-muted-foreground sm:px-6 md:max-w-4xl md:px-20">
                        I craft enchanting visuals for brands, and conjure design resources
                        to empower others.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href={"/dashboard"}>
                            <Button variant="default" size="lg">
                                Start Project
                            </Button>
                        </Link>
                        <Link href={"https://cal.com/aliimam/designali"} target="_blank">
                            <Button variant="outline" size="lg">
                                Book a call
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <canvas
                className="bg-background pointer-events-none absolute inset-0 mx-auto w-full h-full"
                id="canvas"
            ></canvas>
        </section>
    );
};
