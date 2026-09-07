"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Profile Image with 3-D tilt on hover                              */
/* ------------------------------------------------------------------ */

function TiltImage() {
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
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 600,
      }}
      className="relative mx-auto h-56 w-56 md:h-72 md:w-72"
    >
      {/* Decorative ring — moody twilight glow */}
      <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-accent via-accent-light to-highlight opacity-30 blur-xl" />

      {/* Image container — glassmorphic border */}
      <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-2xl shadow-accent/20 backdrop-blur-xl">
        {/* Placeholder avatar gradient */}
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 via-background to-highlight/20">
          <span className="select-none text-5xl md:text-6xl">👨‍💻</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */

export default function Hero() {
  return (
    <section
      id="about"
      className="relative flex h-screen w-full snap-start flex-col justify-center overflow-hidden pt-20"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        {/* Text Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-2 text-center md:order-1 md:text-left"
        >
          <p className="mb-3 font-mono text-sm font-medium uppercase tracking-widest text-accent-light">
            AI Engineer & Full-Stack Developer
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
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
            <span className="mt-1 block text-2xl font-semibold text-highlight sm:text-3xl lg:text-4xl">
              AI Engineer & Full-Stack Developer
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted md:text-lg">
            I specialize in building{" "}
            <span className="font-medium text-foreground">
              production-ready LLM-integrated systems
            </span>{" "}
            and{" "}
            <span className="font-medium text-highlight">
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
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/20 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-highlight hover:bg-accent/30 hover:shadow-lg hover:shadow-accent/20 active:scale-95"
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
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground/80 backdrop-blur-sm transition-all duration-300 hover:border-highlight/50 hover:bg-white/10 active:scale-95"
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
          <TiltImage />
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
