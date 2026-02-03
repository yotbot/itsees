"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
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
  // SCROLL MAPPING
  // ============================================
  // Hero section: 0.00 - 0.12 (logo animation)
  // Transition:   0.12 - 0.20 (dots grow, move)
  // About:        0.20 - 0.30 (about visible)
  // To Process:   0.30 - 0.35 (dots shrink, reposition)
  // Process:      0.35 - 0.85 (5 stages, each ~0.10)
  //   Concept:    0.35 - 0.45 (smaller dots, faster orbit, closer)
  //   Design:     0.45 - 0.55 (satellites appear and orbit)
  //   Build:      0.55 - 0.65 (satellites absorbed, dots grow)
  //   Host:       0.65 - 0.75 (2 dots merge into 1)
  //   Maintain:   0.75 - 0.85 (2 small dots emerge and orbit)
  // Footer:       0.85 - 1.00
  // ============================================

  // Text opacity - fades out early
  const textOpacity = useTransform(scrollYProgress, [0.08, 0.14], [1, 0]);

  // Horizontal offset relative to text width
  const rightOffset = textWidth * 0.05;

  // Position for About section (huge dots in background)
  const aboutCenterX = viewportSize.width * 0.35;
  const aboutCenterY = viewportSize.height * 0.55;
  const aboutOrbitRadius = viewportSize.width * 0.45;

  // Position for Process section (smaller dots on the right side)
  const processCenterX = viewportSize.width * 0.7;
  const processCenterY = viewportSize.height * 0.5;

  // ============================================
  // HERO → ABOUT → PROCESS TRANSITIONS
  // ============================================

  // Center X: eyes → about position → process position
  const centerXProgress = useTransform(
    scrollYProgress,
    [0, 0.04, 0.08, 0.12, 0.20, 0.30, 0.35],
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
    [0, 0.12, 0.20, 0.30, 0.35],
    [initialCenter.y, initialCenter.y, aboutCenterY, aboutCenterY, processCenterY]
  );

  // Scale transitions through all stages
  // Concept: smaller (2), Design/Build: medium (3-4), Host/Maintain: larger (5)
  const scrollScale = useTransform(
    scrollYProgress,
    [0, 0.12, 0.18, 0.25, 0.30, 0.35, 0.45, 0.55, 0.65, 0.75],
    [1, 1, 15, 40, 40, 2, 2.5, 4, 5, 5]
  );

  // Orbit radius: process stages get progressively tighter until merge
  const processOrbitBase = viewportSize.width * 0.06;
  const scrollOrbitRadius = useTransform(
    scrollYProgress,
    [0, 0.12, 0.18, 0.25, 0.30, 0.35, 0.45, 0.55, 0.65, 0.75],
    [
      initialRadius,
      initialRadius,
      initialRadius * 3,
      aboutOrbitRadius,
      aboutOrbitRadius,
      processOrbitBase * 1.5, // Concept: wider orbit
      processOrbitBase * 0.8, // Concept end: closer together
      processOrbitBase * 0.8, // Design: same
      processOrbitBase * 0.6, // Build: tighter
      0, // Host: merged (radius = 0)
    ]
  );

  // Orbit angle: faster rotation during Concept stage
  const scrollOrbitAngle = useTransform(
    scrollYProgress,
    [0, 0.12, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85],
    [0, 0, 305, 305, 305 + 720, 305 + 720 + 180, 305 + 720 + 360, 305 + 720 + 360, 305 + 720 + 360]
  );

  // Color transition
  const scrollColor = useTransform(
    scrollYProgress,
    [0, 0.14, 0.25, 0.35, 0.50],
    ["#171717", "#171717", "#3b82f6", "#3b82f6", "#60a5fa"]
  );

  // ============================================
  // SECTION VISIBILITY
  // ============================================

  // About section opacity
  const aboutOpacity = useTransform(scrollYProgress, [0.20, 0.24, 0.28, 0.32], [0, 1, 1, 0]);
  const aboutY = useTransform(scrollYProgress, [0.20, 0.24], [40, 0]);

  // Process section opacity
  const processOpacity = useTransform(scrollYProgress, [0.33, 0.37], [0, 1]);

  // ============================================
  // PROCESS STAGE EFFECTS
  // ============================================

  // Satellite orbit radius (constant when visible)
  const satelliteOrbitRadius = useTransform(
    [scrollScale],
    ([s]: number[]) => s * 15 // Satellites orbit at 15px * scale from their parent
  );

  // Satellite opacity: appear in Design, fade in Build (absorbed)
  const satelliteOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.48, 0.55, 0.60, 0.65],
    [0, 1, 1, 0.3, 0]
  );

  // Satellite orbit angle (continuous rotation)
  const satelliteOrbitAngle = useTransform(
    scrollYProgress,
    [0.45, 0.55, 0.65],
    [0, 720, 1080]
  );

  // Merge progress: 0 = two dots, 1 = one merged dot (Host stage)
  const mergeProgress = useTransform(
    scrollYProgress,
    [0.65, 0.70, 0.75],
    [0, 0.5, 1]
  );

  // Emerge opacity: small dots emerge in Maintain stage
  const emergeOpacity = useTransform(
    scrollYProgress,
    [0.75, 0.78, 0.85],
    [0, 1, 1]
  );

  // Emerge orbit angle (gentle rotation)
  const emergeOrbitAngle = useTransform(
    scrollYProgress,
    [0.75, 0.85, 1.0],
    [0, 180, 360]
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

  useMotionValueEvent(scrollScale, "change", (latest) => {
    dots.scale.set(latest);
  });

  useMotionValueEvent(scrollOrbitRadius, "change", (latest) => {
    dots.orbitRadius.set(latest);
  });

  useMotionValueEvent(scrollOrbitAngle, "change", (latest) => {
    dots.orbitAngle.set(latest);
  });

  useMotionValueEvent(scrollColor, "change", (latest) => {
    dots.setColor(latest);
  });

  // Process stage effects
  useMotionValueEvent(satelliteOpacity, "change", (latest) => {
    dots.satelliteOpacity.set(latest);
  });

  useMotionValueEvent(satelliteOrbitRadius, "change", (latest) => {
    dots.satelliteOrbitRadius.set(latest);
  });

  useMotionValueEvent(satelliteOrbitAngle, "change", (latest) => {
    dots.satelliteOrbitAngle.set(latest);
  });

  useMotionValueEvent(mergeProgress, "change", (latest) => {
    dots.mergeProgress.set(latest);
  });

  useMotionValueEvent(emergeOpacity, "change", (latest) => {
    dots.emergeOpacity.set(latest);
  });

  useMotionValueEvent(emergeOrbitAngle, "change", (latest) => {
    dots.emergeOrbitAngle.set(latest);
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
      <ProcessSection opacity={processOpacity} />

      {/* Footer space */}
      <div className="h-screen" />
    </main>
  );
}
