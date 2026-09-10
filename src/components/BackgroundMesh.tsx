"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Mesh } from "three";
import ShaderBackground from "@/components/ShaderBackground";

/* ------------------------------------------------------------------ */
/*  Scroll-Reactive Mesh + Cinematic Camera Controller                 */
/*  + Horizontal Drag Rotation                                         */
/* ------------------------------------------------------------------ */

/**
 * Reads scroll position from the DOM <main> container each frame.
 * Drives mesh rotation velocity and camera flight path without
 * re-renders — all state lives in refs mutated inside useFrame.
 *
 * Accepts an optional dragDelta ref: cumulative horizontal drag px
 * written by the parent useDrag handler. The mesh consumes the delta
 * each frame, converting it to smooth rotation.y via MathUtils.damp.
 */
function MeshController({
  dragDelta,
}: {
  dragDelta?: React.RefObject<number>;
}) {
  const meshRef = useRef<Mesh>(null);
  const { camera } = useThree();

  /* Scroll state — mutated every frame, never triggers React updates */
  const scroll = useRef({
    offset: 0,
    prevOffset: 0,
    dampedVelocity: 0,
    el: null as HTMLElement | null,
  });

  /** Accumulated drag rotation target (radians) */
  const dragRotation = useRef({
    target: 0,
    current: 0,
    prevApplied: 0,
  });

  /* Grab the snap-scroll container once the DOM is ready */
  useEffect(() => {
    scroll.current.el = document.querySelector("main");
  }, []);

  useFrame((_state, delta) => {
    const s = scroll.current;
    const mesh = meshRef.current;
    if (!mesh) return;

    /* ------------------------------------------------------------ */
    /*  1. Scroll offset & velocity                                  */
    /* ------------------------------------------------------------ */
    if (s.el) {
      const maxScroll = s.el.scrollHeight - s.el.clientHeight;
      const newOffset = maxScroll > 0 ? s.el.scrollTop / maxScroll : 0;

      /* Raw velocity = change in offset per second, clamped for mobile */
      const rawVelocity = Math.max(
        -8,
        Math.min(8, (newOffset - s.prevOffset) / Math.max(delta, 0.0001))
      );

      s.prevOffset = newOffset;
      s.offset = newOffset;

      /* Smooth velocity so it spikes on flick, then decays */
      s.dampedVelocity = MathUtils.damp(
        s.dampedVelocity,
        rawVelocity,
        4, /* lambda — higher = snappier decay */
        delta
      );
    }

    const offset = s.offset;
    const vel = s.dampedVelocity;

    /* ------------------------------------------------------------ */
    /*  2. Consume horizontal drag delta → smooth rotation.y         */
    /* ------------------------------------------------------------ */
    if (dragDelta?.current !== undefined && dragDelta.current !== 0) {
      /* Convert px → radians: ~200px = 1 radian feels natural */
      dragRotation.current.target += dragDelta.current * 0.005;
      /* Reset after consuming */
      dragDelta.current = 0;
    }

    /* Smooth damp toward the drag target (lambda 4 → snappy deceleration) */
    dragRotation.current.current = MathUtils.damp(
      dragRotation.current.current,
      dragRotation.current.target,
      4,
      delta
    );

    /* Only apply the frame-to-frame change (not the absolute value) */
    const dragDeltaThisFrame =
      dragRotation.current.current - dragRotation.current.prevApplied;
    dragRotation.current.prevApplied = dragRotation.current.current;

    /* ------------------------------------------------------------ */
    /*  3. Mesh rotation: atmospheric baseline + velocity spike       */
    /*     + drag rotation                                            */
    /* ------------------------------------------------------------ */
    const baseSpeed = 0.08;
    const velocityBoost = Math.min(Math.abs(vel) * 2.5, 3);

    mesh.rotation.x += delta * (baseSpeed + velocityBoost);
    mesh.rotation.y += delta * (baseSpeed * 1.5 + velocityBoost * 0.8);

    /* Layer drag rotation delta on top of the accumulating baseline spin */
    mesh.rotation.y += dragDeltaThisFrame;

    /* ------------------------------------------------------------ */
    /*  4. Cinematic camera choreography mapped to scroll offset      */
    /* ------------------------------------------------------------ */
    let targetX = 0;
    let targetY = 0;
    let targetZ = 5;

    if (offset < 0.25) {
      /* ---- Hero (0.0 – 0.25): Default resting frame ---- */
      targetX = 0;
      targetY = 0;
      targetZ = 5;
    } else if (offset < 0.5) {
      /* ---- Skills (0.25 – 0.50): Fly INTO the mesh ---- */
      const t = (offset - 0.25) / 0.25;
      targetZ = MathUtils.lerp(5, 3.2, t);
      targetY = MathUtils.lerp(0, 0.4, t);
    } else if (offset < 0.75) {
      /* ---- Projects (0.50 – 0.75): Pan sideways ---- */
      const t = (offset - 0.5) / 0.25;
      targetZ = MathUtils.lerp(3.2, 4, t);
      targetX = MathUtils.lerp(0, 1.8, t);
      targetY = MathUtils.lerp(0.4, 0, t);
    } else {
      /* ---- Contact (0.75 – 1.0): Pull back + gentle tilt ---- */
      const t = (offset - 0.75) / 0.25;
      targetZ = MathUtils.lerp(4, 5.5, t);
      targetX = MathUtils.lerp(1.8, 0.5, t);
      targetY = MathUtils.lerp(0, -0.5, t);
    }

    /* Buttery smooth transitions with damp (lambda 3 ≈ 300ms ease) */
    camera.position.x = MathUtils.damp(camera.position.x, targetX, 3, delta);
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 3, delta);
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 3, delta);
    camera.lookAt(0, 0, 0);
  });

  return (
    <mesh ref={meshRef} scale={2.4}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.18} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Global fixed canvas — rendered behind all content                  */
/* ------------------------------------------------------------------ */

export default function BackgroundMesh({
  dragDelta,
}: {
  dragDelta?: React.RefObject<number>;
}) {
  return (
    <>
      {/* z-[-20]: Deepest layer — fluid shader gradient */}
      <ShaderBackground />

      {/* z-[-10]: Wireframe mesh canvas — sits above the shader gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 h-screen w-full">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <MeshController dragDelta={dragDelta} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

