"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ExternalLink, CodeXml } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Project {
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const PROJECTS: Project[] = [
  {
    title: "HireLens AI",
    subtitle: "AI Resume Screening SaaS Tool",
    description:
      "A multi-tenant AI SaaS platform utilizing a Product-Led Growth model to automate candidate screening. It leverages the Gemini API and PDF parsing for structured insights, supported by a FastAPI backend handling Razorpay HMAC webhooks, real-time user credit replenishment, and enterprise tier activations.",
    techStack: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Docker", "Gemini API"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Veritas AI",
    subtitle: "Anti-Hallucination & AI Output Verification API",
    description:
      "A model-agnostic REST API designed to verify LLM outputs across domains. It utilizes a layered pipeline of contradiction checks and NLI-based faithfulness scoring to return structured, atomic trust-scores.",
    techStack: ["Python", "FastAPI", "sentence-transformers", "PostgreSQL", "Redis", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Customer Churn Prediction System",
    subtitle: "Real-time ML Inference & Analytics",
    description:
      "An end-to-end XGBoost machine learning pipeline predicting customer churn with 88% recall. Deployed as a containerized REST API with Redis caching, featuring a Streamlit analytics dashboard that utilizes SHAP waterfall explanations for stakeholder visibility.",
    techStack: ["Python", "FastAPI", "Streamlit", "XGBoost", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

/* ------------------------------------------------------------------ */
/*  Tech Badge                                                         */
/* ------------------------------------------------------------------ */

function TechBadge({ name }: { name: string }) {
  return (
    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-indigo-100 transition-colors hover:bg-indigo-100">
      {name}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Project Card with 3-D perspective tilt                             */
/* ------------------------------------------------------------------ */

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 25 };
  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [6, -6]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-6, 6]),
    springConfig
  );

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative min-w-[320px] max-w-sm shrink-0 cursor-default select-none md:min-w-[360px]"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-shadow duration-300 group-hover:shadow-xl">
        {/* Placeholder image area */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-xl bg-indigo-200/60 backdrop-blur-sm" />
          </div>
          {/* Decorative dots */}
          <div className="absolute right-4 top-4 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {project.title}
            </h3>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {project.subtitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {project.description}
            </p>
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                <CodeXml size={14} />
                Source
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project Slider Section                                             */
/* ------------------------------------------------------------------ */

export default function ProjectSlider() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="projects" className="relative py-28">
      {/* Section heading */}
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">
            Portfolio
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-500">
            A selection of things I&rsquo;ve shipped — from product-led growth
            tools to developer infrastructure.
          </p>
        </motion.div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={containerRef}
        className="mt-12 flex gap-6 overflow-x-auto px-6 pb-4 scrollbar-hide md:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
        style={{ scrollbarWidth: "none" }}
      >
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
