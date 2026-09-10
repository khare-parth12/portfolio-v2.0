"use client";

import { useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import Navbar from "@/components/Navbar";
import BackgroundMesh from "@/components/BackgroundMesh";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import ProjectGrid from "@/components/ProjectGrid";
import Contact from "@/components/Contact";
import IntroSequence from "@/components/IntroSequence";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Global drag → mesh rotation                                      */
  /* ---------------------------------------------------------------- */

  /** Cumulative horizontal drag delta consumed by the mesh each frame */
  const dragDelta = useRef<number>(0);

  const bind = useDrag(
    ({ movement: [mx], event, memo = 0 }) => {
      /* Guardrail: ignore drags inside the project dossier gallery */
      const target = event?.target as HTMLElement | null;
      if (target?.closest?.("[data-dossier-gallery]")) return memo;

      /* Write incremental delta so the mesh can consume it per-frame */
      const increment = mx - memo;
      dragDelta.current += increment;

      return mx; // memo for next call — tracks last consumed position
    },
    { pointer: { touch: true }, filterTaps: true }
  );

  return (
    <>
      {/* z-[-10]: Global 3D Canvas — always visible */}
      <BackgroundMesh dragDelta={dragDelta} />

      {/* Main application UI — hidden during intro, fades in on completion */}
      <div
        {...bind()}
        style={{ touchAction: "pan-y" }}
        className={`transition-opacity duration-1000 ease-in-out ${
          introComplete
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* z-40: Navbar */}
        <Navbar />

        {/* z-10: Main content sections (floating glass UI) */}
        <main className="relative z-10 h-screen scroll-smooth overflow-y-scroll snap-y snap-mandatory">
          <Hero />
          <Skills />
          <ProjectGrid />
          <Contact />
        </main>
      </div>

      {/* z-50: IntroSequence overlay — unmounts after animation */}
      <AnimatePresence>
        {!introComplete && (
          <IntroSequence onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>
    </>
  );
}

