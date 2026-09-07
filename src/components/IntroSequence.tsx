"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Canvas Particle Disintegration Engine                              */
/* ------------------------------------------------------------------ */

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  life: number;
}

/**
 * Captures a DOM element as pixel data, then explodes it into gently
 * falling canvas particles. Designed for a cinematic, atmospheric feel
 * rather than a rigid digital glitch.
 */
function disintegrateElement(
  sourceEl: HTMLElement,
  canvas: HTMLCanvasElement,
  onComplete: () => void
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rect = sourceEl.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  /* Size canvas to viewport */
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.scale(dpr, dpr);

  /*
   * Sample pixels from the text element using an offscreen canvas.
   * We render the text manually instead of using html2canvas to avoid
   * an extra dependency and ensure consistent rendering.
   */
  const offscreen = document.createElement("canvas");
  const offCtx = offscreen.getContext("2d");
  if (!offCtx) return;

  const textWidth = rect.width;
  const textHeight = rect.height;
  offscreen.width = textWidth * dpr;
  offscreen.height = textHeight * dpr;
  offCtx.scale(dpr, dpr);

  /* Get computed styles from the source element */
  const computed = getComputedStyle(sourceEl);
  offCtx.font = computed.font;
  offCtx.fillStyle = "#E2E2D5"; /* Soft Ivory */
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillText(
    sourceEl.textContent || "Welcome",
    textWidth / 2,
    textHeight / 2
  );

  /* Read pixel data */
  const imageData = offCtx.getImageData(
    0,
    0,
    offscreen.width,
    offscreen.height
  );
  const pixels = imageData.data;

  /* Generate particles from non-transparent pixels */
  const particles: Particle[] = [];
  const samplingGap = 2; /* sample every N pixels for density control */

  for (let py = 0; py < offscreen.height; py += samplingGap) {
    for (let px = 0; px < offscreen.width; px += samplingGap) {
      const i = (py * offscreen.width + px) * 4;
      const a = pixels[i + 3];
      if (a < 30) continue; /* skip transparent pixels */

      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      /* Map offscreen coords to viewport coords */
      const worldX = rect.left + px / dpr;
      const worldY = rect.top + py / dpr;

      particles.push({
        x: worldX,
        y: worldY,
        originX: worldX,
        originY: worldY,
        /* Gentle lateral drift + slight upward burst before gravity */
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.8) * 1.8,
        size: Math.random() * 2.2 + 0.6,
        alpha: a / 255,
        decay: 0.004 + Math.random() * 0.006,
        color: `rgba(${r},${g},${b}`,
        life: 1.0,
      });
    }
  }

  /* Hide the original text immediately */
  sourceEl.style.visibility = "hidden";

  /* Animation loop */
  let animationId: number;
  const gravity = 0.035; /* very gentle downward pull */
  const drag = 0.995;

  function animate() {
    ctx!.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    let alive = 0;

    for (const p of particles) {
      if (p.life <= 0) continue;
      alive++;

      /* Physics */
      p.vy += gravity;
      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      /* Draw */
      const currentAlpha = p.alpha * Math.max(p.life, 0);
      ctx!.fillStyle = `${p.color},${currentAlpha})`;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fill();
    }

    if (alive > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationId);
      onComplete();
    }
  }

  animationId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationId);
}

/* ------------------------------------------------------------------ */
/*  IntroSequence Component                                            */
/* ------------------------------------------------------------------ */

export default function IntroSequence({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isDisintegrating, setIsDisintegrating] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  const fullText = "Welcome";

  /* Step 1: Typing animation — 1 second total */
  useEffect(() => {
    const letterDelay = 1000 / fullText.length;
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;
      setTypedText(fullText.slice(0, currentIndex));
      if (currentIndex >= fullText.length) {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, letterDelay);

    return () => clearInterval(interval);
  }, []);

  /* Step 2: Trigger disintegration at 1.5s */
  useEffect(() => {
    if (!isTypingDone) return;

    const timer = setTimeout(() => {
      if (textRef.current && canvasRef.current) {
        setIsDisintegrating(true);
        cleanupRef.current = disintegrateElement(
          textRef.current,
          canvasRef.current,
          onComplete
        ) as (() => void) | undefined;
      }
    }, 500); /* 500ms pause after typing completes (total: ~1.5s) */

    return () => {
      clearTimeout(timer);
      cleanupRef.current?.();
    };
  }, [isTypingDone, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Particle canvas — full-screen, sits above the text */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10"
      />

      {/* Welcome text */}
      <span
        ref={textRef}
        className="font-spotcookie relative z-0 select-none text-7xl text-foreground sm:text-8xl md:text-9xl"
        style={{
          visibility: isDisintegrating ? "hidden" : "visible",
          letterSpacing: "0.04em",
        }}
      >
        {typedText}
        {/* Blinking cursor during typing */}
        {!isTypingDone && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="ml-0.5 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-highlight"
          />
        )}
      </span>
    </motion.div>
  );
}
