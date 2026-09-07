"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Project {
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  images: string[];
  liveUrl?: string;
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
    techStack: [
      "React",
      "TypeScript",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "Gemini API",
    ],
    images: [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    ],
    liveUrl: "https://ai-resume-analyzer-full-stack.vercel.app/",
  },
  {
    title: "Veritas AI",
    subtitle: "Anti-Hallucination & AI Output Verification API",
    description:
      "A model-agnostic REST API designed to verify LLM outputs across domains. It utilizes a layered pipeline of contradiction checks and NLI-based faithfulness scoring to return structured, atomic trust-scores.",
    techStack: [
      "Python",
      "FastAPI",
      "sentence-transformers",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    images: [
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
      "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
    ],
  },
  {
    title: "Customer Churn Prediction System",
    subtitle: "Real-time ML Inference & Analytics",
    description:
      "An end-to-end XGBoost machine learning pipeline predicting customer churn with 88% recall. Deployed as a containerized REST API with Redis caching, featuring a Streamlit analytics dashboard that utilizes SHAP waterfall explanations for stakeholder visibility.",
    techStack: ["Python", "FastAPI", "Streamlit", "XGBoost", "Docker"],
    images: [
      "/screenshots/churn/analytics.png",
      "/screenshots/churn/churn_predict.png",
      "/screenshots/churn/explore.png",
      "/screenshots/churn/noChurn_predict.png",
      "/screenshots/churn/segment.png",
    ],
    liveUrl: "https://churn-frontend-1s4b.onrender.com/",
  },
  {
    title: "Terminal-Style Portfolio",
    subtitle: "Command-Driven Developer Interface",
    description:
      "Developed an interactive, terminal-style personal portfolio featuring a command-driven virtual filesystem to navigate projects and skills. Built with a modular data-driven architecture, reusable UI components, Framer Motion animations, and production-ready SEO.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Vercel",
    ],
    images: [
      "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
      "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
    ],
    liveUrl: "https://portfolio-parth-khare.vercel.app/",
  },
];

/* ------------------------------------------------------------------ */
/*  Hook: detect mobile for tap vs hover logic                         */
/* ------------------------------------------------------------------ */

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

/* ------------------------------------------------------------------ */
/*  Tech Badge                                                         */
/* ------------------------------------------------------------------ */

function TechBadge({ name }: { name: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs font-medium text-foreground/70 backdrop-blur-sm transition-all duration-200 hover:border-highlight/40 hover:text-foreground">
      {name}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Swipeable Image Carousel                                           */
/* ------------------------------------------------------------------ */

/** Returns true when the string is a CSS gradient rather than an image URL */
function isGradient(src: string) {
  return src.startsWith("linear-gradient") || src.startsWith("radial-gradient");
}

const SWIPE_THRESHOLD = 50;

function ImageCarousel({
  images,
  isMobile,
}: {
  images: string[];
  isMobile: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const paginate = useCallback(
    (direction: number) => {
      setCurrentIndex((prev) => {
        const next = prev + direction;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -SWIPE_THRESHOLD) {
        paginate(1);
      } else if (info.offset.x > SWIPE_THRESHOLD) {
        paginate(-1);
      }
    },
    [paginate]
  );

  return (
    <div className="relative mt-3 overflow-hidden rounded-xl border border-white/5" ref={constraintsRef}>
      {/* Carousel track */}
      <div className="relative aspect-[16/9] w-full">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentIndex}
            className="absolute inset-0 cursor-grab rounded-xl active:cursor-grabbing overflow-hidden"
            style={
              isGradient(images[currentIndex])
                ? { background: images[currentIndex] }
                : undefined
            }
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {isGradient(images[currentIndex]) ? (
              /* Placeholder label for gradient slides */
              <div className="flex h-full items-center justify-center">
                <span className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 font-mono text-sm font-medium text-white/80 backdrop-blur-sm">
                  Screenshot {currentIndex + 1} / {images.length}
                </span>
              </div>
            ) : (
              /* Real screenshot */
              <img
                src={images[currentIndex]}
                alt={`Screenshot ${currentIndex + 1} of ${images.length}`}
                className="h-full w-full object-cover pointer-events-none select-none"
                draggable={false}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Desktop chevron overlays */}
        {!isMobile && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="mt-2.5 flex justify-center gap-1.5 pb-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-5 bg-highlight"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project Card — bento-style with expand/collapse                    */
/* ------------------------------------------------------------------ */

function ProjectCard({
  project,
  isExpanded,
  onExpand,
  onCollapse,
  isMobile,
}: {
  project: Project;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  isMobile: boolean;
}) {
  const handleClick = useCallback(() => {
    if (!isMobile) return;
    if (isExpanded) onCollapse();
    else onExpand();
  }, [isMobile, isExpanded, onExpand, onCollapse]);

  return (
    <motion.div
      layout
      onClick={handleClick}
      onMouseEnter={isMobile ? undefined : onExpand}
      onMouseLeave={isMobile ? undefined : onCollapse}
      className={`
        group relative cursor-pointer select-none overflow-hidden rounded-2xl
        border border-white/10 bg-white/5 backdrop-blur-xl
        transition-all duration-300
        hover:border-highlight/30 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-accent/10
        ${isMobile ? "w-full" : ""}
      `}
      style={{ perspective: 800 }}
      transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
    >
      {/* Decorative dots */}
      <div className="absolute right-4 top-4 z-10 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/40" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        {/* Cover image placeholder (collapsed state) */}
        {!isExpanded && (
          isGradient(project.images[0]) ? (
            <div
              className="mb-4 aspect-[16/9] w-full rounded-xl opacity-40"
              style={{ background: project.images[0] }}
            />
          ) : (
            <img
              src={project.images[0]}
              alt={project.title}
              className="mb-4 aspect-[16/9] w-full rounded-xl object-cover opacity-60"
              draggable={false}
            />
          )
        )}

        {/* Default state — always visible */}
        <motion.div layout="position">
          <h3 className="text-xl font-bold text-foreground md:text-lg">
            {project.title}
          </h3>
          <p className="mt-0.5 font-mono text-xs font-semibold uppercase tracking-wide text-highlight">
            {project.subtitle}
          </p>
        </motion.div>

        {/* Expanded state — carousel, description, tech, button */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {/* Swipeable gallery */}
              <ImageCarousel images={project.images} isMobile={isMobile} />

              <p className="mt-3 text-sm leading-relaxed text-muted">
                {project.description}
              </p>

              {/* Tech badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <TechBadge key={tech} name={tech} />
                ))}
              </div>

              {/* Live Demo button */}
              {project.liveUrl && (
                <div className="mt-5">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/20 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-highlight hover:bg-accent/30 hover:shadow-lg hover:shadow-accent/20 active:scale-95"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapsed spacer — keeps a minimum card height when not expanded */}
      {!isExpanded && (
        <div className={`${isMobile ? "pt-4" : "pt-6"}`} />
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project Grid Section                                               */
/* ------------------------------------------------------------------ */

export default function ProjectGrid() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const handleExpand = useCallback((index: number) => {
    setExpandedIndex(index);
  }, []);

  const handleCollapse = useCallback(() => {
    setExpandedIndex(null);
  }, []);

  return (
    <section
      id="projects"
      className="relative h-screen w-full snap-start overflow-y-auto pt-20 pb-12"
    >
      {/* Section heading */}
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm font-medium uppercase tracking-widest text-accent-light">
            Portfolio
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted">
            A selection of things I&rsquo;ve shipped &mdash; from product-led
            growth tools to developer infrastructure.
          </p>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <div className="mx-auto mt-12 max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <ProjectCard
                project={project}
                isExpanded={expandedIndex === i}
                onExpand={() => handleExpand(i)}
                onCollapse={handleCollapse}
                isMobile={isMobile}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
