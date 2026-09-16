"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Certificate data                                                    */
/* ------------------------------------------------------------------ */

interface Certificate {
  title: string;
  image: string;
}

const CERTIFICATES: Certificate[] = [
  {
    title: "Kaggle Intro to Pragramming",
    image: "/certificates/intro-to-programming.png",
  },
  {
    title: "Oracle Cloud Infrastructure",
    image: "/certificates/oracle-cloud-infrastructure.png",
  },
  {
    title: "AWS Solution Architect Training",
    image: "/certificates/aws-solution-architect.png",
  },
  {
    title: "Cloud Computing — NPTEL",
    image: "/certificates/cloud-computing-nptel.png",
  },
  {
    title: "Intensive AI Agents",
    image: "/certificates/intensive-ai-agents.png",
  },
  {
    title: "Anthropic Claude 101",
    image: "/certificates/anthropic-claude-101.png",
  },
  {
    title: "Generative AI Engineering Mastermind",
    image: "/certificates/generative-ai-engineering.jpg",
  },
  {
    title: "MATLAB Simulink OnRamp",
    image: "/certificates/simulink-onramp.png",
  },
  {
    title: "MATLAB",
    image: "/certificates/matlab.png",
  },
  {
    title: "Marketing Analysis — NPTEL",
    image: "/certificates/marketing-analysis-nptel.png",
  },
];

/* ------------------------------------------------------------------ */
/*  Hook: build glare radial-gradient from mouse MotionValues           */
/* ------------------------------------------------------------------ */

function useGlareGradient(
  glareX: MotionValue<number>,
  glareY: MotionValue<number>
) {
  return useTransform(
    [glareX, glareY] as MotionValue<number>[],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0.10) 40%, transparent 70%)`
  );
}

/* ------------------------------------------------------------------ */
/*  Holographic Plaque card                                             */
/* ------------------------------------------------------------------ */

const springConfig = { stiffness: 260, damping: 22 };

function HoloPlaque({
  cert,
  index,
}: {
  cert: Certificate;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  /* Normalised mouse position (−0.5 … 0.5) */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  /* 3-D tilt driven by mouse */
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [10, -10]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
    springConfig
  );

  /* Foil-glare: map mouse to a % position for the radial highlight */
  const glareX = useTransform(mouseX, [-0.5, 0.5], [20, 80]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [20, 80]);
  const glareBackground = useGlareGradient(glareX, glareY);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className="w-[85vw] flex-shrink-0 snap-center md:w-[600px]"
    >
      <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-panel-border bg-panel-bg p-2 backdrop-blur-xl transition-colors duration-300 hover:border-accent/30">
        {/* Certificate image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/5">
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            sizes="(max-width: 768px) 85vw, 600px"
            className="object-contain"
          />

          {/* Holographic foil-glare overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glareBackground }}
          />
        </div>

        {/* Title */}
        <p className="mt-3 px-1 pb-1 text-center font-serif text-sm font-semibold leading-snug text-foreground sm:text-base">
          {cert.title}
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Certificates Section                                                */
/* ------------------------------------------------------------------ */

export default function Certificates() {
  return (
    <section
      id="certificates"
      className="relative flex h-screen w-full flex-col justify-center pt-24"
    >
      {/* Subtle top-rule */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-highlight/20 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 md:px-12 lg:px-24">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="font-mono text-sm font-medium uppercase tracking-widest text-accent-light">
            Credentials
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Certifications
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted">
            Industry certifications and course completions — hover to inspect,
            swipe to browse.
          </p>
        </motion.div>

        {/* Horizontal carousel track */}
        <div
          data-dossier-gallery="true"
          className="mt-10 flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar"
        >
          {CERTIFICATES.map((cert, i) => (
            <HoloPlaque key={cert.title} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
