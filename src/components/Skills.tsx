"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

interface SkillCategory {
  title: string;
  skills: string[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["Python", "TypeScript", "JavaScript", "SQL", "HTML/CSS"],
  },
  {
    title: "Frameworks & Libraries",
    skills: ["React", "Next.js", "FastAPI", "Flask", "Streamlit", "Scikit-learn"],
  },
  {
    title: "Databases & DevOps",
    skills: ["PostgreSQL", "Redis", "MongoDB", "Docker", "AWS", "Git"],
  },
  {
    title: "Architecture & APIs",
    skills: ["REST APIs", "JWT/RBAC", "Razorpay Webhooks (HMAC)"],
  },
];

/** Flatten all skills into a single array with category labels for color coding */
const ALL_SKILLS = SKILL_CATEGORIES.flatMap((cat) =>
  cat.skills.map((skill) => ({ skill, category: cat.title }))
);

/** Map category to a subtle accent border color */
function categoryBorder(category: string): string {
  switch (category) {
    case "Languages":
      return "border-accent/40";
    case "Frameworks & Libraries":
      return "border-[#1E3A5F]/60";
    case "Databases & DevOps":
      return "border-muted/30";
    case "Architecture & APIs":
      return "border-accent/25";
    default:
      return "border-panel-border";
  }
}

const pillEntrance = {
  hidden: { opacity: 0, scale: 0.7, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.035,
      duration: 0.4,
      ease: "easeOut" as const,
    },
  }),
};

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="skills"
      className="relative flex h-screen w-full snap-start flex-col justify-center pt-24"
    >
      {/* Subtle top-rule decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-highlight/20 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-6">
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
            Drag the pills around — the languages, frameworks, and tools I use
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
          style={{ minHeight: "320px" }}
        >
          {/* Inner ambient glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

          {/* Pills – flex-wrap for clean initial layout */}
          <div className="relative flex flex-wrap items-start justify-center gap-x-3 gap-y-3">
            {ALL_SKILLS.map(({ skill, category }, i) => (
              <motion.div
                key={skill}
                custom={i}
                variants={pillEntrance}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                drag
                dragConstraints={containerRef}
                dragElastic={0.2}
                dragTransition={{
                  bounceStiffness: 400,
                  bounceDamping: 10,
                }}
                whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(156,141,113,0.25)" }}
                whileTap={{ scale: 0.95 }}
                whileDrag={{ scale: 1.12, zIndex: 50 }}
                className={`
                  inline-block cursor-grab select-none rounded-full border
                  bg-panel-bg px-4 py-2 font-mono text-sm text-muted
                  shadow-sm backdrop-blur-sm
                  transition-colors duration-200
                  active:cursor-grabbing
                  ${categoryBorder(category)}
                `}
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
