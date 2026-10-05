"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  ShaderGradientCanvas,
  ShaderGradient,
} from "@shadergradient/react";
import { MathUtils } from "three";

/* ------------------------------------------------------------------ */
/*  Scroll-Reactive Shader Gradient Background                         */
/*                                                                     */
/*  Reads scroll velocity from the <main> snap container and maps it   */
/*  to the ShaderGradient's uSpeed prop via requestAnimationFrame      */
/*  damping. Resting state is a slow, ambient morph; fast scrolling    */
/*  spikes the fluid's churning speed.                                 */
/* ------------------------------------------------------------------ */

/** Baseline animation speed when idle */
const BASE_SPEED = 0.02;
/** Peak speed multiplier when scrolling hard */
const MAX_SPEED = 0.4;
/** Damping lambda — higher = snappier deceleration back to baseline */
const DECAY_LAMBDA = 3;

export default function ShaderBackground() {
  const [speed, setSpeed] = useState(BASE_SPEED);

  /* Scroll velocity tracking (all-ref, zero re-renders) */
  const scrollState = useRef({
    el: null as HTMLElement | null,
    prevScroll: 0,
    prevTime: 0,
    dampedVelocity: 0,
  });

  /* RAF loop ID for cleanup */
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    const s = scrollState.current;
    const now = performance.now() / 1000; // seconds
    const dt = Math.max(now - s.prevTime, 0.001);
    s.prevTime = now;

    if (s.el) {
      const maxScroll = s.el.scrollHeight - s.el.clientHeight;
      const currentScroll = s.el.scrollTop;
      const rawVelocity =
        maxScroll > 0
          ? Math.abs((currentScroll - s.prevScroll) / maxScroll / dt)
          : 0;
      s.prevScroll = currentScroll;

      /* Smooth velocity: spike on flick, decay to zero */
      s.dampedVelocity = MathUtils.damp(
        s.dampedVelocity,
        rawVelocity,
        DECAY_LAMBDA,
        dt
      );
    }

    /* Map velocity → uSpeed: baseline + velocity-driven boost */
    const boost = Math.min(s.dampedVelocity * 4, MAX_SPEED - BASE_SPEED);
    setSpeed(BASE_SPEED + boost);

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    /* Grab the scroll container after mount */
    scrollState.current.el = document.querySelector("main");
    scrollState.current.prevTime = performance.now() / 1000;

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 h-screen w-full">
      <ShaderGradientCanvas
        style={{ width: "100%", height: "100%" }}
        pixelDensity={1}
        fov={45}
        pointerEvents="none"
      >
        <ShaderGradient
          /* Liquid Silver & Ink palette */
          color1="#05050A"
          color2="#374151"
          color3="#E5E7EB"
          /* Heavy fluid deformation */
          type="waterPlane"
          wireframe={false}
          animate="on"
          /* Scroll-reactive speed */
          uSpeed={speed}
          /* Noise / displacement — boosted for visible ripples */
          uStrength={2.4}
          uDensity={1.6}
          uFrequency={4.0}
          uAmplitude={2.0}
          /* Film grain for cinematic texture */
          grain="on"
          grainBlending={0.12}
          /* Camera pulled close — fills the viewport */
          cDistance={3.5}
          cAzimuthAngle={180}
          cPolarAngle={80}
          /* Lighting — neutral white, no colored env map */
          lightType="3d"
          brightness={1.2}
          /* No reflection — prevents colored env highlights */
          reflection={0}
          /* Position & rotation (flatten to fill screen) */
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={0}
          rotationY={0}
          rotationZ={0}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
