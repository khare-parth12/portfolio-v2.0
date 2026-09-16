"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiFastapi,
  SiFlask,
  SiStreamlit,
  SiScikitlearn,
  SiPytorch,
  SiPostgresql,
  SiRedis,
  SiMongodb,
  SiDocker,
  SiGit,
  SiJsonwebtokens,
  SiHtml5,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import { Globe, Webhook } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Skill data — each entry maps to an official logo                   */
/* ------------------------------------------------------------------ */

interface SkillEntry {
  name: string;
  /** react-icons IconType OR a lucide-react component */
  icon: IconType | React.FC<React.SVGProps<SVGSVGElement> & { size?: number }>;
  /** Brand colour for the icon */
  color: string;
  category: string;
}

const SKILLS: SkillEntry[] = [
  // Languages
  { name: "Python", icon: SiPython, color: "#3776AB", category: "Languages" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", category: "Languages" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", category: "Languages" },
  { name: "SQL", icon: SiPostgresql, color: "#4169E1", category: "Languages" },
  { name: "HTML/CSS", icon: SiHtml5, color: "#E34F26", category: "Languages" },

  // Frameworks & Libraries
  { name: "React", icon: SiReact, color: "#61DAFB", category: "Frameworks" },
  { name: "Next.js", icon: SiNextdotjs, color: "#F8FAFC", category: "Frameworks" },
  { name: "FastAPI", icon: SiFastapi, color: "#009688", category: "Frameworks" },
  { name: "Flask", icon: SiFlask, color: "#F8FAFC", category: "Frameworks" },
  { name: "Streamlit", icon: SiStreamlit, color: "#FF4B4B", category: "Frameworks" },
  { name: "Scikit-learn", icon: SiScikitlearn, color: "#F7931E", category: "Frameworks" },
  { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C", category: "Frameworks" },

  // Databases & DevOps
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1", category: "DevOps" },
  { name: "Redis", icon: SiRedis, color: "#DC382D", category: "DevOps" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", category: "DevOps" },
  { name: "Docker", icon: SiDocker, color: "#2496ED", category: "DevOps" },
  { name: "AWS", icon: FaAws, color: "#FF9900", category: "DevOps" },
  { name: "Git", icon: SiGit, color: "#F05032", category: "DevOps" },

  // Architecture & APIs
  { name: "REST APIs", icon: Globe as unknown as IconType, color: "#38BDF8", category: "Architecture" },
  { name: "JWT/RBAC", icon: SiJsonwebtokens, color: "#F8FAFC", category: "Architecture" },
  { name: "Webhooks", icon: Webhook as unknown as IconType, color: "#A78BFA", category: "Architecture" },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const coinEntrance = {
  hidden: { opacity: 0, scale: 0.6, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.45,
      ease: "easeOut" as const,
    },
  }),
};

/* ------------------------------------------------------------------ */
/*  Skills Component                                                   */
/* ------------------------------------------------------------------ */

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="skills"
      className="relative flex h-screen w-full flex-col justify-center pt-24"
    >
      {/* Subtle top-rule decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-highlight/20 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="font-mono text-sm font-medium uppercase tracking-widest text-accent-light">
            What I Work With
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Technical Stack
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted">
            Drag the coins around — the languages, frameworks, and tools I use
            to bring ideas to life.
          </p>
        </motion.div>

        {/* The Glass Box */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-panel-border bg-panel-bg p-8 backdrop-blur-xl sm:p-10 md:p-12"
          style={{ minHeight: "360px" }}
        >
          {/* Inner ambient glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

          {/* Skill Coins — flex-wrap for clean initial layout */}
          <div className="relative flex flex-wrap items-start justify-center">
            {SKILLS.map(({ name, icon: Icon, color }, i) => (
              <motion.div
                key={name}
                custom={i}
                variants={coinEntrance}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                drag
                dragConstraints={containerRef}
                dragElastic={0.2}
                dragTransition={{
                  bounceStiffness: 400,
                  bounceDamping: 15,
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: `0 0 24px ${color}30`,
                }}
                whileTap={{ scale: 0.92 }}
                whileDrag={{ scale: 1.15, zIndex: 50 }}
                className="m-1.5 sm:m-2 inline-flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 cursor-grab flex-col items-center justify-center gap-1.5 sm:gap-2
                           rounded-full border border-panel-border bg-background/50
                           shadow-lg backdrop-blur-md
                           transition-colors duration-200
                           active:cursor-grabbing"
              >
                <Icon size={24} color={color} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 shrink-0" />
                <span className="text-[10px] sm:text-xs font-mono text-muted text-center leading-tight px-1">
                  {name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
