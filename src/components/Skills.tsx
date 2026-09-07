"use client";

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative flex h-screen w-full snap-start flex-col justify-center overflow-hidden pt-20"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-highlight/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
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
            The languages, frameworks, and tools I use to bring ideas to life.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2"
        >
          {SKILL_CATEGORIES.map((category) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-highlight/40 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-accent/10"
            >
              {/* Category Title */}
              <h3 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider text-highlight">
                {category.title}
              </h3>

              {/* Skill Pills */}
              <motion.div
                variants={containerVariants}
                className="flex flex-wrap gap-2.5"
              >
                {category.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={pillVariants}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-sm font-medium text-foreground/80 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-highlight/40 hover:bg-white/10 hover:text-foreground"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
