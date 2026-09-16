"use client";

import { useState, useCallback, useRef, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useDrag } from "@use-gesture/react";
import Navbar from "@/components/Navbar";
import BackgroundMesh from "@/components/BackgroundMesh";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import ProjectGrid from "@/components/ProjectGrid";
import Contact from "@/components/Contact";
import Certificates from "@/components/Certificates";
import IntroSequence from "@/components/IntroSequence";

/* ------------------------------------------------------------------ */
/*  ScrollFadeSection                                                   */
/*  Wraps a full-height section and drives its opacity + Y translation  */
/*  from the scroll progress of the main scroll container.              */
/* ------------------------------------------------------------------ */

function useScrollFade(
  scrollYProgress: MotionValue<number>,
  index: number,
  total: number
) {
  /*
   * scrollYProgress goes from 0 → 1 across (total - 1) section transitions.
   * With N sections the centres sit at 0, 1/(N-1), 2/(N-1), …, 1.
   *
   * step         = 1/(total-1)            distance between adjacent centres
   * holdFraction = 0.6                    section is fully opaque for 60 % of a step
   * fadeFraction = 0.4                    cross-fade occupies the remaining 40 %
   *
   * Transition i→i+1:
   *   fadeOutStart = centre[i]  + step * holdFraction
   *   fadeOutEnd   = centre[i+1]
   *   fadeInStart  = fadeOutStart   (same point → overlapping cross-dissolve)
   *   fadeInEnd    = centre[i+1]
   *
   * This guarantees at every scroll position the combined opacity of the
   * outgoing and incoming sections is ≈ 1 — no empty void.
   */
  const step = 1 / (total - 1);
  const centre = index * step;
  const holdFraction = 0.6;
  const fadeFraction = 1 - holdFraction; // 0.4

  const isFirst = index === 0;
  const isLast = index === total - 1;

  let inputRange: number[];
  let opacityRange: number[];
  let yInput: number[];
  let yOutput: number[];

  if (isFirst) {
    // Hero — starts visible, cross-fades out
    const fadeOutStart = centre + step * holdFraction;
    const fadeOutEnd = centre + step;
    inputRange = [0, fadeOutStart, fadeOutEnd];
    opacityRange = [1, 1, 0];
    yInput = [0, fadeOutStart, fadeOutEnd];
    yOutput = [0, 0, -50];
  } else if (isLast) {
    // Contact — fades in, NEVER fades out
    const fadeInStart = centre - step * fadeFraction;
    inputRange = [fadeInStart, centre];
    opacityRange = [0, 1];
    yInput = [fadeInStart, centre];
    yOutput = [50, 0];
  } else {
    // Middle sections — fade in, hold, fade out
    const fadeInStart = centre - step * fadeFraction;
    const fadeOutStart = centre + step * holdFraction;
    const fadeOutEnd = centre + step;
    inputRange = [fadeInStart, centre, fadeOutStart, fadeOutEnd];
    opacityRange = [0, 1, 1, 0];
    yInput = [fadeInStart, centre, fadeOutStart, fadeOutEnd];
    yOutput = [50, 0, 0, -50];
  }

  const opacity = useTransform(scrollYProgress, inputRange, opacityRange);
  const y = useTransform(scrollYProgress, yInput, yOutput);
  const pointerEvents = useTransform(opacity, (v) =>
    v < 0.05 ? "none" : "auto"
  );

  return { opacity, y, pointerEvents };
}

function ScrollFadeSection({
  children,
  index,
  total,
  scrollYProgress,
}: {
  children: ReactNode;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const { opacity, y, pointerEvents } = useScrollFade(
    scrollYProgress,
    index,
    total
  );

  return (
    <motion.div
      className="relative h-screen w-full"
      style={{ opacity, y, pointerEvents }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Home                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const scrollContainerRef = useRef<HTMLElement>(null);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Scroll progress for the main container                            */
  /* ---------------------------------------------------------------- */

  const { scrollYProgress } = useScroll({ container: scrollContainerRef });

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

  const SECTION_COUNT = 5;

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
        <main
          ref={scrollContainerRef}
          className="relative z-10 h-screen scroll-smooth overflow-y-scroll overscroll-y-none"
        >
          <ScrollFadeSection index={0} total={SECTION_COUNT} scrollYProgress={scrollYProgress}>
            <Hero />
          </ScrollFadeSection>
          <ScrollFadeSection index={1} total={SECTION_COUNT} scrollYProgress={scrollYProgress}>
            <Skills />
          </ScrollFadeSection>
          <ScrollFadeSection index={2} total={SECTION_COUNT} scrollYProgress={scrollYProgress}>
            <ProjectGrid />
          </ScrollFadeSection>
          <ScrollFadeSection index={3} total={SECTION_COUNT} scrollYProgress={scrollYProgress}>
            <Certificates />
          </ScrollFadeSection>
          <ScrollFadeSection index={4} total={SECTION_COUNT} scrollYProgress={scrollYProgress}>
            <Contact />
          </ScrollFadeSection>
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
