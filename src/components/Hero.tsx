"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  SSR-safe hover detection                                            */
/* ------------------------------------------------------------------ */

function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover)");
    setCanHover(mql.matches);
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return canHover;
}

/* ------------------------------------------------------------------ */
/*  Profile Image with 3-D tilt on hover                              */
/* ------------------------------------------------------------------ */

function TiltImage({ canHover }: { canHover: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={canHover ? handleMouse : undefined}
      onMouseLeave={canHover ? handleLeave : undefined}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 600,
      }}
      className="relative mx-auto h-48 w-48 sm:h-56 sm:w-56 md:h-72 md:w-72"
    >
      {/* Decorative ring — moody twilight glow */}
      <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-accent via-accent-light to-highlight opacity-30 blur-xl" />

      {/* Image container — glassmorphic border */}
      <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-2xl shadow-accent/20 backdrop-blur-xl">
        <Image
          src="/images/profile.jpg"
          alt="Parth Khare — AI Engineer & Full-Stack Developer"
          width={288}
          height={288}
          priority
          className="h-full w-full object-cover object-top"
        />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const canHover = useCanHover();

  return (
    <section
      id="about"
      className="relative flex h-screen w-full flex-col justify-center overflow-hidden pt-24"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 md:grid-cols-2 md:gap-16 md:px-12">
        {/* Text Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-2 text-center md:order-1 md:text-left"
        >
          <p className="mb-3 font-mono text-sm font-medium uppercase tracking-widest text-accent-light">
            AI Engineer & Backend Developer
          </p>

          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Hi, I&rsquo;m Parth{" "}
            <motion.span
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                delay: 0.8,
                repeat: Infinity,
                repeatDelay: 4,
              }}
              className="inline-block origin-[70%_70%]"
            >
              👋
            </motion.span>
            <span className="mt-1 block text-xl font-semibold text-accent sm:text-2xl md:text-3xl lg:text-4xl">
              AI Engineer & Backend Developer
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-lg">
            I specialize in building{" "}
            <span className="font-medium text-foreground">
              production-ready LLM-integrated systems
            </span>{" "}
            and{" "}
            <span className="font-medium text-accent">
              B2B micro-SaaS applications
            </span>
            . From deploying retrieval pipelines and secure backend architectures
            to managing real-time frontend state sync, I own the complete stack.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:shadow-lg hover:shadow-accent/40 active:scale-95"
            >
              View Projects
              <ArrowDown size={14} strokeWidth={2.5} />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-panel-border bg-panel-bg px-6 py-3 text-sm font-semibold text-foreground/80 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-panel-bg/80 active:scale-95"
            >
              Contact Me
            </a>
          </div>
        </motion.div>

        {/* Image Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="order-1 md:order-2"
        >
          <TiltImage canHover={canHover} />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={20} className="text-muted/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
