"use client";

import { motion, useTransform } from "framer-motion";
import { useDots } from "../context/DotsContext";

export default function FloatingDots() {
  const {
    isMounted,
    springs,
    orbitAngle,
    color,
    rotateX,
    rotateY,
    opacity,
    baseSize,
  } = useDots();

  // All hooks must be called before any conditional returns
  // Calculate dot positions based on orbit
  // Dot 1: negative X offset (left)
  const dot1X = useTransform(
    [springs.centerX, springs.orbitRadius, orbitAngle],
    ([cx, radius, angle]: number[]) => {
      const rad = (angle * Math.PI) / 180;
      return cx - radius * Math.cos(rad);
    }
  );

  const dot1Y = useTransform(
    [springs.centerY, springs.orbitRadius, orbitAngle],
    ([cy, radius, angle]: number[]) => {
      const rad = (angle * Math.PI) / 180;
      return cy - radius * Math.sin(rad);
    }
  );

  // Dot 2: positive X offset (right)
  const dot2X = useTransform(
    [springs.centerX, springs.orbitRadius, orbitAngle],
    ([cx, radius, angle]: number[]) => {
      const rad = (angle * Math.PI) / 180;
      return cx + radius * Math.cos(rad);
    }
  );

  const dot2Y = useTransform(
    [springs.centerY, springs.orbitRadius, orbitAngle],
    ([cy, radius, angle]: number[]) => {
      const rad = (angle * Math.PI) / 180;
      return cy + radius * Math.sin(rad);
    }
  );

  // Compute size from baseSize and scale
  const size = useTransform(
    [baseSize, springs.scale],
    ([base, s]: number[]) => base * s
  );

  // Don't render until after hydration to avoid mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 1,
        perspective: "1000px",
      }}
    >
      {/* Dot 1 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: dot1X,
          y: dot1Y,
          translateX: "-50%",
          translateY: "-50%",
          width: size,
          height: size,
          backgroundColor: color,
          rotateX,
          rotateY,
          skewX: springs.skewX,
          skewY: springs.skewY,
          opacity,
          willChange: "transform, background-color",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Dot 2 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: dot2X,
          y: dot2Y,
          translateX: "-50%",
          translateY: "-50%",
          width: size,
          height: size,
          backgroundColor: color,
          rotateX,
          rotateY,
          skewX: springs.skewX,
          skewY: springs.skewY,
          opacity,
          willChange: "transform, background-color",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
}
