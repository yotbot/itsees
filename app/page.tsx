"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useRef, useEffect } from "react";
import { useDots } from "./context/DotsContext";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const svgRef = useRef<SVGSVGElement>(null);
  const dots = useDots();

  // Initialize dot positions based on SVG eye positions
  useEffect(() => {
    const updatePositions = () => {
      if (svgRef.current) {
        const svg = svgRef.current;
        const eye1 = svg.querySelector("#eye1") as SVGCircleElement;
        const eye2 = svg.querySelector("#eye2") as SVGCircleElement;

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
          const initialRadius = Math.abs(eye2Rect.left - eye1Rect.left) / 2;

          // Set initial values
          dots.setCenter(centerX, centerY);
          dots.setOrbit(initialRadius, 0);
          dots.setBaseSize(eye1Rect.width);
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

  // Scroll-linked animations using motion value events (no re-renders)
  const scrollScale = useTransform(scrollYProgress, [0, 0.5], [1, 3]);
  const scrollOrbitRadius = useTransform(
    scrollYProgress,
    [0, 0.1, 0.5],
    [1, 1, 3],
  ); // multiplier
  const scrollOrbitAngle = useTransform(scrollYProgress, [0.2, 1], [0, 720]);
  const scrollColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6],
    ["#171717", "#3b82f6", "#8b5cf6"],
  );

  // Update dots context based on scroll (performant - no React re-renders)
  useMotionValueEvent(scrollScale, "change", (latest) => {
    dots.scale.set(latest);
  });

  useMotionValueEvent(scrollOrbitRadius, "change", (latest) => {
    // Get initial radius from SVG and multiply
    if (svgRef.current) {
      const eye1 = svgRef.current.querySelector("#eye1") as SVGCircleElement;
      const eye2 = svgRef.current.querySelector("#eye2") as SVGCircleElement;
      if (eye1 && eye2) {
        const eye1Rect = eye1.getBoundingClientRect();
        const eye2Rect = eye2.getBoundingClientRect();
        const baseRadius = Math.abs(eye2Rect.left - eye1Rect.left) / 2;
        dots.orbitRadius.set(baseRadius * latest);
      }
    }
  });

  useMotionValueEvent(scrollOrbitAngle, "change", (latest) => {
    dots.orbitAngle.set(latest);
  });

  useMotionValueEvent(scrollColor, "change", (latest) => {
    dots.setColor(latest);
  });

  return (
    <main className="relative min-h-[300vh] bg-[#f5f5f0]">
      {/* Scrollable SVG text */}
      <div className="flex min-h-screen items-center justify-center">
        <motion.svg
          ref={svgRef}
          viewBox="0 0 400 100"
          className="w-[80vw] max-w-300"
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
    </main>
  );
}
