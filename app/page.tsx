"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useDots } from "./context/DotsContext";
import AboutSection from "./components/AboutSection";
import ProcessSection from "./components/ProcessSection";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const svgRef = useRef<SVGSVGElement>(null);
  const dots = useDots();

  // Store initial positions and dimensions for calculations
  const [initialCenter, setInitialCenter] = useState({ x: 0, y: 0 });
  const [initialRadius, setInitialRadius] = useState(50);
  const [textWidth, setTextWidth] = useState(400);
  const [viewportSize, setViewportSize] = useState({
    width: 1000,
    height: 800,
  });

  // Active process stage index (0-4, or -1 if not in process section)
  const activeStageIndex = useMotionValue(-1);

  // Initialize dot positions based on SVG eye positions
  useEffect(() => {
    const updatePositions = () => {
      if (svgRef.current) {
        const svg = svgRef.current;
        const eye1 = svg.querySelector("#eye1") as SVGCircleElement;
        const eye2 = svg.querySelector("#eye2") as SVGCircleElement;
        const svgRect = svg.getBoundingClientRect();

        if (eye1 && eye2) {
          const eye1Rect = eye1.getBoundingClientRect();
          const eye2Rect = eye2.getBoundingClientRect();

          // Calculate center between the two eyes
          const centerX =
            (eye1Rect.left + eye1Rect.right + eye2Rect.left + eye2Rect.right) /
            4;
          const centerY =
            (eye1Rect.top + eye1Rect.bottom + eye2Rect.top + eye2Rect.bottom) /
            4;

          // Calculate initial orbit radius (half the distance between eyes)
          const radius = Math.abs(eye2Rect.left - eye1Rect.left) / 2;

          // Store values for animation calculations
          setInitialCenter({ x: centerX, y: centerY });
          setInitialRadius(radius);
          setTextWidth(svgRect.width);
          setViewportSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });

          // Set initial values immediately (no spring animation)
          dots.setCenterImmediate(centerX, centerY);
          dots.setOrbitImmediate(radius, 0);
          dots.setBaseSizeImmediate(eye1Rect.width);
          dots.setScaleImmediate(1);

          // Fade in dots after positioning
          setTimeout(() => {
            dots.setOpacity(1);
          }, 50);
        }
      }
    };

    // Small delay to ensure SVG is rendered
    const timer = setTimeout(updatePositions, 100);
    window.addEventListener("resize", updatePositions);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePositions);
    };
  }, [dots]);

  // ============================================
  // SCROLL MAPPING (total ~800vh)
  // ============================================
  // Hero section: 0.00 - 0.15 (logo animation)
  // Transition:   0.15 - 0.25 (dots grow, move)
  // About:        0.25 - 0.35 (about visible)
  // To Process:   0.35 - 0.40 (dots shrink, reposition)
  // Process:      0.40 - 0.90 (5 stages, each ~0.10)
  //   Concept:    0.40 - 0.50
  //   Design:     0.50 - 0.60
  //   Build:      0.60 - 0.70
  //   Host:       0.70 - 0.80
  //   Maintain:   0.80 - 0.90
  // Footer:       0.90 - 1.00
  // ============================================

  // Text opacity - fades out early
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.18], [1, 0]);

  // Horizontal offset relative to text width
  const rightOffset = textWidth * 0.05;

  // Position for About section (huge dots in background)
  const aboutCenterX = viewportSize.width * 0.35;
  const aboutCenterY = viewportSize.height * 0.55;
  const aboutOrbitRadius = viewportSize.width * 0.45;

  // Position for Process section (smaller dots on the right side)
  const processCenterX = viewportSize.width * 0.7;
  const processCenterY = viewportSize.height * 0.5;
  const processOrbitRadius = viewportSize.width * 0.08;
  const processScale = 3;

  // ============================================
  // HERO → ABOUT TRANSITIONS
  // ============================================

  // Center X: eyes → about position → process position
  const centerXProgress = useTransform(
    scrollYProgress,
    [0, 0.05, 0.1, 0.15, 0.25, 0.38, 0.42],
    [
      initialCenter.x,
      initialCenter.x + rightOffset,
      initialCenter.x,
      initialCenter.x,
      aboutCenterX,
      aboutCenterX,
      processCenterX,
    ]
  );

  // Center Y: eyes → about → process
  const centerYProgress = useTransform(
    scrollYProgress,
    [0, 0.15, 0.25, 0.38, 0.42],
    [initialCenter.y, initialCenter.y, aboutCenterY, aboutCenterY, processCenterY]
  );

  // Scale: normal → huge → process size
  const scrollScale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.22, 0.30, 0.38, 0.42],
    [1, 1, 15, 40, 40, processScale]
  );

  // Orbit radius: initial → about spread → process tight
  const scrollOrbitRadius = useTransform(
    scrollYProgress,
    [0, 0.15, 0.22, 0.30, 0.38, 0.42],
    [
      initialRadius,
      initialRadius,
      initialRadius * 3,
      aboutOrbitRadius,
      aboutOrbitRadius,
      processOrbitRadius,
    ]
  );

  // Orbit angle: rotate during hero, settle for about, continuous for process
  const scrollOrbitAngle = useTransform(
    scrollYProgress,
    [0, 0.15, 0.30, 0.42, 0.50, 0.90],
    [0, 0, 305, 305, 305 + 360, 305 + 360 * 3]
  );

  // Color transition
  const scrollColor = useTransform(
    scrollYProgress,
    [0, 0.18, 0.30, 0.42, 0.55],
    ["#171717", "#171717", "#3b82f6", "#3b82f6", "#60a5fa"]
  );

  // ============================================
  // SECTION VISIBILITY
  // ============================================

  // About section opacity
  const aboutOpacity = useTransform(scrollYProgress, [0.25, 0.30, 0.36, 0.40], [0, 1, 1, 0]);
  const aboutY = useTransform(scrollYProgress, [0.25, 0.30], [40, 0]);

  // Process section opacity
  const processOpacity = useTransform(scrollYProgress, [0.40, 0.44], [0, 1]);

  // ============================================
  // PROCESS STAGE EFFECTS
  // ============================================

  // Fragment effect (DESIGN stage: 0.50-0.60)
  const fragmentSpread = useTransform(
    scrollYProgress,
    [0.50, 0.52, 0.56, 0.58],
    [0, 1, 1, 0]
  );

  const fragmentOpacity = useTransform(
    scrollYProgress,
    [0.50, 0.51, 0.57, 0.58],
    [0, 1, 1, 0]
  );

  // Extra dots (BUILD stage: 0.60-0.70)
  const extraDotsOpacity = useTransform(
    scrollYProgress,
    [0.60, 0.62, 0.66, 0.68],
    [0, 1, 1, 0]
  );

  // Build stage scale boost
  const buildScaleBoost = useTransform(
    scrollYProgress,
    [0.60, 0.64, 0.68, 0.70],
    [1, 1.5, 1.5, 1]
  );

  // Host stage - shoot outward (0.70-0.80)
  const hostOrbitMultiplier = useTransform(
    scrollYProgress,
    [0.70, 0.72, 0.76, 0.78],
    [1, 0.3, 0.3, 3]
  );

  // Maintain stage - pulse (0.80-0.90)
  const pulseIntensity = useTransform(
    scrollYProgress,
    [0.80, 0.82, 0.88, 0.90],
    [0, 1, 1, 0]
  );

  // ============================================
  // UPDATE DOT CONTEXT
  // ============================================

  useMotionValueEvent(centerXProgress, "change", (latest) => {
    dots.centerX.set(latest);
  });

  useMotionValueEvent(centerYProgress, "change", (latest) => {
    dots.centerY.set(latest);
  });

  // Combined scale with build boost
  useMotionValueEvent(scrollScale, "change", (latest) => {
    const boost = buildScaleBoost.get();
    dots.scale.set(latest * boost);
  });

  useMotionValueEvent(buildScaleBoost, "change", (boost) => {
    const base = scrollScale.get();
    dots.scale.set(base * boost);
  });

  // Combined orbit radius with host multiplier
  useMotionValueEvent(scrollOrbitRadius, "change", (latest) => {
    const mult = hostOrbitMultiplier.get();
    dots.orbitRadius.set(latest * mult);
  });

  useMotionValueEvent(hostOrbitMultiplier, "change", (mult) => {
    const base = scrollOrbitRadius.get();
    dots.orbitRadius.set(base * mult);
  });

  useMotionValueEvent(scrollOrbitAngle, "change", (latest) => {
    dots.orbitAngle.set(latest);
  });

  useMotionValueEvent(scrollColor, "change", (latest) => {
    dots.setColor(latest);
  });

  // Process effects
  useMotionValueEvent(fragmentSpread, "change", (latest) => {
    dots.setFragmentSpread(latest);
  });

  useMotionValueEvent(fragmentOpacity, "change", (latest) => {
    dots.setFragmentOpacity(latest);
  });

  useMotionValueEvent(extraDotsOpacity, "change", (latest) => {
    dots.setExtraDotsOpacity(latest);
  });

  useMotionValueEvent(pulseIntensity, "change", (latest) => {
    dots.setPulseIntensity(latest);
  });

  // Update active stage index
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (progress < 0.40) {
      activeStageIndex.set(-1);
    } else if (progress < 0.50) {
      activeStageIndex.set(0); // Concept
    } else if (progress < 0.60) {
      activeStageIndex.set(1); // Design
    } else if (progress < 0.70) {
      activeStageIndex.set(2); // Build
    } else if (progress < 0.80) {
      activeStageIndex.set(3); // Host
    } else if (progress < 0.90) {
      activeStageIndex.set(4); // Maintain
    } else {
      activeStageIndex.set(-1);
    }
  });

  return (
    <main className="relative bg-[#f5f5f0]">
      {/* Hero section - sticky container for logo animation */}
      <div className="h-[200vh]">
        <div className="sticky top-0 z-10 flex min-h-screen items-center justify-center">
          <motion.svg
            ref={svgRef}
            viewBox="0 0 400 100"
            className="w-[80vw] max-w-300"
            style={{ opacity: textOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Text "itsees" */}
            <text
              x="50%"
              y="75"
              textAnchor="middle"
              className="fill-neutral-900"
              style={{
                fontSize: "80px",
                fontWeight: 700,
                fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              }}
            >
              itsees
            </text>

            {/* Eye position markers (invisible, for positioning reference) */}
            <circle
              id="eye1"
              cx="195"
              cy="60"
              r="6"
              className="fill-transparent"
            />
            <circle
              id="eye2"
              cx="244"
              cy="32"
              r="6"
              className="fill-transparent"
            />
          </motion.svg>
        </div>
      </div>

      {/* About section */}
      <AboutSection opacity={aboutOpacity} y={aboutY} />

      {/* Transition space */}
      <div className="h-[50vh]" />

      {/* Process section */}
      <ProcessSection opacity={processOpacity} activeStageIndex={activeStageIndex} />

      {/* Footer space */}
      <div className="h-screen" />
    </main>
  );
}
