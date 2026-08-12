"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { Mesh } from "three";

/* ------------------------------------------------------------------ */
/*  3-D Background — slow-rotating wireframe icosahedron              */
/* ------------------------------------------------------------------ */

function FloatingMesh() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.12;
  });

  return (
    <mesh ref={meshRef} scale={2.4}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#c7d2fe" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

function BackgroundCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <FloatingMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}

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
      {/* Decorative ring */}
      <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-indigo-400 via-purple-300 to-pink-300 opacity-60 blur-lg" />

      {/* Image container */}
      <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-xl">
        {/* Placeholder avatar gradient */}
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 via-slate-100 to-purple-100">
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
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <BackgroundCanvas />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        {/* Text Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-2 text-center md:order-1 md:text-left"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-500">
            Full-Stack Developer
          </p>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
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
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500 md:text-lg">
            I build performant, user-centric web applications with{" "}
            <span className="font-medium text-slate-700">React</span>,{" "}
            <span className="font-medium text-slate-700">TypeScript</span>, and{" "}
            <span className="font-medium text-slate-700">Python</span>. Currently
            focused on shipping{" "}
            <span className="font-medium text-indigo-600">
              B2B micro-SaaS products
            </span>{" "}
            that solve real problems.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-95"
            >
              View Projects
              <ArrowDown size={14} strokeWidth={2.5} />
            </a>
            <a
              href="#experience"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 active:scale-95"
            >
              Experience
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
          <ArrowDown size={20} className="text-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
