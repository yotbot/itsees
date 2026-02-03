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

  // Text opacity - fades out in phase 2
  const textOpacity = useTransform(scrollYProgress, [0.25, 0.35], [1, 0]);

  // Horizontal offset relative to text width (10% of text width)
  const rightOffset = textWidth * 0.05;

  // Final center position - offset to position dots asymmetrically
  // One dot will be lower-left (mostly visible), one upper-right (partly outside)
  const finalCenterX = viewportSize.width * 0.35;
  const finalCenterY = viewportSize.height * 0.55;

  // Final orbit radius - large enough to spread dots apart
  const finalOrbitRadius = viewportSize.width * 0.45;

  // Center X position: initial → shifted right → final position
  const centerXProgress = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.3, 0.4],
    [
      initialCenter.x,
      initialCenter.x + rightOffset,
      initialCenter.x,
      initialCenter.x,
      finalCenterX,
    ]
  );

  // Center Y position: stays same initially → moves to final position
  const centerYProgress = useTransform(
    scrollYProgress,
    [0, 0.25, 0.4],
    [initialCenter.y, initialCenter.y, finalCenterY]
  );

  // Scale: grows huge - dots will be ~60% of viewport width each
  const scrollScale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.7],
    [1, 1, 15, 40]
  );

  // Orbit radius: expands to final spread
  const scrollOrbitRadius = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.7],
    [initialRadius, initialRadius, initialRadius * 3, finalOrbitRadius]
  );

  // Orbit angle: rotate and end at 45° so dots are diagonal
  const scrollOrbitAngle = useTransform(
    scrollYProgress,
    [0, 0.25, 0.7],
    [0, 0, 305]
  );

  // Color transition
  const scrollColor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.6, 0.8],
    ["#171717", "#171717", "#3b82f6", "#60a5fa"]
  );

  // Section opacity - appears after dots settle
  const sectionOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const sectionY = useTransform(scrollYProgress, [0.6, 0.75], [40, 0]);

  // Update center X position
  useMotionValueEvent(centerXProgress, "change", (latest) => {
    dots.centerX.set(latest);
  });

  // Update center Y position
  useMotionValueEvent(centerYProgress, "change", (latest) => {
    dots.centerY.set(latest);
  });

  // Update scale
  useMotionValueEvent(scrollScale, "change", (latest) => {
    dots.scale.set(latest);
  });

  // Update orbit radius
  useMotionValueEvent(scrollOrbitRadius, "change", (latest) => {
    dots.orbitRadius.set(latest);
  });

  // Update orbit angle
  useMotionValueEvent(scrollOrbitAngle, "change", (latest) => {
    dots.orbitAngle.set(latest);
  });

  // Update color
  useMotionValueEvent(scrollColor, "change", (latest) => {
    dots.setColor(latest);
  });

  return (
    <main className="relative bg-[#f5f5f0]">
      {/* Hero section - sticky container for logo animation */}
      <div className="h-[350vh]">
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
      <AboutSection opacity={sectionOpacity} y={sectionY} />

      {/* Extra scroll space */}
      <div className="h-[50vh]" />
    </main>
  );
}
