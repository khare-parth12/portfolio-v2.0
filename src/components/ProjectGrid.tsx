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
/*  Hook: detect mobile                                                */
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
/*  Utility                                                            */
/* ------------------------------------------------------------------ */

function isGradient(src: string) {
  return src.startsWith("linear-gradient") || src.startsWith("radial-gradient");
}

/* ------------------------------------------------------------------ */
/*  Swipeable Image Carousel (drag="x")                                */
/* ------------------------------------------------------------------ */

const SWIPE_THRESHOLD = 50;

function ImageCarousel({
  images,
  isMobile,
}: {
  images: string[];
  isMobile: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
      else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
    },
    [paginate]
  );

  return (
    <div className="relative overflow-hidden rounded-xl border border-panel-border">
      {/* Track */}
      <div className="relative aspect-[16/9] w-full">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentIndex}
            className="absolute inset-0 cursor-grab overflow-hidden rounded-xl active:cursor-grabbing"
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
              <div className="flex h-full items-center justify-center">
                <span className="rounded-lg border border-panel-border bg-panel-bg px-4 py-2 font-mono text-sm font-medium text-muted backdrop-blur-sm">
                  Screenshot {currentIndex + 1} / {images.length}
                </span>
              </div>
            ) : (
              <img
                src={images[currentIndex]}
                alt={`Screenshot ${currentIndex + 1} of ${images.length}`}
                className="pointer-events-none h-full w-full select-none object-cover"
                draggable={false}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Desktop chevrons */}
        {!isMobile && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-panel-border bg-panel-bg text-muted backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-panel-bg/80"
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
              className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-panel-border bg-panel-bg text-muted backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-panel-bg/80"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
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
                  ? "w-5 bg-accent"
                  : "w-1.5 bg-panel-border hover:bg-muted/40"
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
/*  Dossier Panel — collapsed bar / expanded split-pane                */
/* ------------------------------------------------------------------ */

function DossierPanel({
  project,
  index,
  isExpanded,
  onToggle,
  isMobile,
}: {
  project: Project;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isMobile: boolean;
}) {
  return (
    <motion.div
      layout
      onClick={onToggle}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        layout: { type: "spring", stiffness: 280, damping: 28 },
        opacity: { duration: 0.45, delay: index * 0.08 },
        y: { duration: 0.45, delay: index * 0.08 },
      }}
      className={`
        group relative cursor-pointer select-none overflow-hidden rounded-2xl
        border border-panel-border bg-panel-bg backdrop-blur-xl
        transition-colors duration-300
        hover:border-accent/30 hover:bg-panel-bg
        ${isExpanded ? "mb-6" : "mb-4"}
      `}
    >
      {/* ---- Collapsed bar (always visible) ---- */}
      <motion.div layout="position" className="relative z-10 px-6 py-5 sm:px-8">
        <div className="flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
              {project.title}
            </h3>
            <p className="mt-0.5 font-mono text-xs font-semibold uppercase tracking-wide text-muted">
              {project.subtitle}
            </p>
          </div>

          {/* Expand / collapse indicator */}
          <motion.span
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className="flex-shrink-0 text-lg text-muted"
          >
            +
          </motion.span>
        </div>
      </motion.div>

      {/* ---- Expanded dossier ---- */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Divider */}
            <div className="mx-6 h-px bg-panel-border sm:mx-8" />

            {/* Split-pane container */}
            <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-2">
              {/* Left pane — visuals */}
              <div
                data-dossier-gallery
                onClick={(e) => e.stopPropagation()}
                className="cursor-default"
              >
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
                  Gallery
                </p>
                <ImageCarousel images={project.images} isMobile={isMobile} />
              </div>

              {/* Right pane — technical document */}
              <div>
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
                  Dossier
                </p>

                <p className="text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                {/* Tech stack pills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-panel-border bg-panel-bg px-3 py-1 font-mono text-xs font-medium text-muted backdrop-blur-sm transition-colors duration-200 hover:bg-panel-bg/80 hover:text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Live Demo button */}
                {project.liveUrl && (
                  <div className="mt-6">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-all duration-300 hover:shadow-lg hover:shadow-accent/40 active:scale-95"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project Grid Section (Cinematic Dossier)                           */
/* ------------------------------------------------------------------ */

export default function ProjectGrid() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(
    (index: number) => {
      setExpandedIndex((prev) => (prev === index ? null : index));
    },
    []
  );

  return (
    <section
      id="projects"
      className="relative flex h-screen w-full snap-start flex-col pt-24"
    >
      {/* Section heading */}
      <div className="mx-auto w-full max-w-5xl px-6">
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

      {/* Scrollable dossier list */}
      <div
        ref={scrollRef}
        className="mt-10 flex-1 overflow-y-auto pb-12"
      >
        <div className="mx-auto max-w-5xl px-6">
          {PROJECTS.map((project, i) => (
            <DossierPanel
              key={project.title}
              project={project}
              index={i}
              isExpanded={expandedIndex === i}
              onToggle={() => handleToggle(i)}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
