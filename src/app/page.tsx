"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import BackgroundMesh from "@/components/BackgroundMesh";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import ProjectGrid from "@/components/ProjectGrid";
import Contact from "@/components/Contact";
import IntroSequence from "@/components/IntroSequence";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
      <BackgroundMesh />
      <Navbar />

      <main className="h-screen scroll-smooth overflow-y-scroll snap-y snap-mandatory">
        <Hero />
        <Skills />
        <ProjectGrid />
        <Contact />
      </main>

      {/* Full-screen intro overlay — unmounts after animation */}
      <AnimatePresence>
        {!introComplete && (
          <IntroSequence onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>
    </>
  );
}
