"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
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
    satelliteOrbitAngle,
    emergeOrbitAngle,
  } = useDots();

  // ============================================
  // MAIN DOTS POSITIONS
  // ============================================

  // Dot 1 position (left side of orbit)
  const dot1X = useTransform(
    [springs.centerX, springs.orbitRadius, orbitAngle, springs.mergeProgress],
    ([cx, radius, angle, merge]: number[]) => {
      const rad = (angle * Math.PI) / 180;
      const effectiveRadius = radius * (1 - merge);
      return cx - effectiveRadius * Math.cos(rad);
    }
  );

  const dot1Y = useTransform(
    [springs.centerY, springs.orbitRadius, orbitAngle, springs.mergeProgress],
    ([cy, radius, angle, merge]: number[]) => {
      const rad = (angle * Math.PI) / 180;
      const effectiveRadius = radius * (1 - merge);
      return cy - effectiveRadius * Math.sin(rad);
    }
  );

  // Dot 2 position (right side of orbit)
  const dot2X = useTransform(
    [springs.centerX, springs.orbitRadius, orbitAngle, springs.mergeProgress],
    ([cx, radius, angle, merge]: number[]) => {
      const rad = (angle * Math.PI) / 180;
      const effectiveRadius = radius * (1 - merge);
      return cx + effectiveRadius * Math.cos(rad);
    }
  );

  const dot2Y = useTransform(
    [springs.centerY, springs.orbitRadius, orbitAngle, springs.mergeProgress],
    ([cy, radius, angle, merge]: number[]) => {
      const rad = (angle * Math.PI) / 180;
      const effectiveRadius = radius * (1 - merge);
      return cy + effectiveRadius * Math.sin(rad);
    }
  );

  // ============================================
  // MAIN DOTS SIZES & OPACITY
  // ============================================

  const mainDotSize = useTransform(
    [baseSize, springs.scale, springs.mergeProgress],
    ([base, s, merge]: number[]) => {
      const mergeBoost = 1 + merge * 0.5;
      return base * s * mergeBoost;
    }
  );

  const dot2Opacity = useTransform(
    [opacity, springs.mergeProgress],
    ([op, merge]: number[]) => op * (1 - merge)
  );

  // ============================================
  // SATELLITE DOTS (4 per main dot, at 0°, 90°, 180°, 270°)
  // ============================================

  const satelliteSize = useTransform(
    [baseSize, springs.scale],
    ([base, s]: number[]) => base * s * 0.25
  );

  // Satellite opacity that fades with merge
  const sat2Opacity = useTransform(
    [springs.satelliteOpacity, springs.mergeProgress],
    ([satOp, merge]: number[]) => satOp * (1 - merge)
  );

  // Satellite 1-1 (Dot 1, angle 0°)
  const sat1_1_x = useTransform(
    [dot1X, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dx, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((0 + angle) * Math.PI) / 180;
      return dx + effectiveRadius * Math.cos(rad);
    }
  );
  const sat1_1_y = useTransform(
    [dot1Y, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dy, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((0 + angle) * Math.PI) / 180;
      return dy + effectiveRadius * Math.sin(rad);
    }
  );

  // Satellite 1-2 (Dot 1, angle 90°)
  const sat1_2_x = useTransform(
    [dot1X, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dx, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((90 + angle) * Math.PI) / 180;
      return dx + effectiveRadius * Math.cos(rad);
    }
  );
  const sat1_2_y = useTransform(
    [dot1Y, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dy, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((90 + angle) * Math.PI) / 180;
      return dy + effectiveRadius * Math.sin(rad);
    }
  );

  // Satellite 1-3 (Dot 1, angle 180°)
  const sat1_3_x = useTransform(
    [dot1X, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dx, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((180 + angle) * Math.PI) / 180;
      return dx + effectiveRadius * Math.cos(rad);
    }
  );
  const sat1_3_y = useTransform(
    [dot1Y, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dy, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((180 + angle) * Math.PI) / 180;
      return dy + effectiveRadius * Math.sin(rad);
    }
  );

  // Satellite 1-4 (Dot 1, angle 270°)
  const sat1_4_x = useTransform(
    [dot1X, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dx, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((270 + angle) * Math.PI) / 180;
      return dx + effectiveRadius * Math.cos(rad);
    }
  );
  const sat1_4_y = useTransform(
    [dot1Y, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dy, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((270 + angle) * Math.PI) / 180;
      return dy + effectiveRadius * Math.sin(rad);
    }
  );

  // Satellite 2-1 (Dot 2, angle 0°)
  const sat2_1_x = useTransform(
    [dot2X, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dx, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((0 + angle) * Math.PI) / 180;
      return dx + effectiveRadius * Math.cos(rad);
    }
  );
  const sat2_1_y = useTransform(
    [dot2Y, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dy, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((0 + angle) * Math.PI) / 180;
      return dy + effectiveRadius * Math.sin(rad);
    }
  );

  // Satellite 2-2 (Dot 2, angle 90°)
  const sat2_2_x = useTransform(
    [dot2X, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dx, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((90 + angle) * Math.PI) / 180;
      return dx + effectiveRadius * Math.cos(rad);
    }
  );
  const sat2_2_y = useTransform(
    [dot2Y, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dy, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((90 + angle) * Math.PI) / 180;
      return dy + effectiveRadius * Math.sin(rad);
    }
  );

  // Satellite 2-3 (Dot 2, angle 180°)
  const sat2_3_x = useTransform(
    [dot2X, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dx, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((180 + angle) * Math.PI) / 180;
      return dx + effectiveRadius * Math.cos(rad);
    }
  );
  const sat2_3_y = useTransform(
    [dot2Y, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dy, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((180 + angle) * Math.PI) / 180;
      return dy + effectiveRadius * Math.sin(rad);
    }
  );

  // Satellite 2-4 (Dot 2, angle 270°)
  const sat2_4_x = useTransform(
    [dot2X, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dx, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((270 + angle) * Math.PI) / 180;
      return dx + effectiveRadius * Math.cos(rad);
    }
  );
  const sat2_4_y = useTransform(
    [dot2Y, springs.satelliteOrbitRadius, satelliteOrbitAngle, springs.satelliteOpacity],
    ([dy, radius, angle, satOpacity]: number[]) => {
      const effectiveRadius = radius * satOpacity;
      const rad = ((270 + angle) * Math.PI) / 180;
      return dy + effectiveRadius * Math.sin(rad);
    }
  );

  // ============================================
  // EMERGED DOTS (2 dots that emerge in Maintain stage)
  // ============================================

  const emergedSize = useTransform(
    [baseSize, springs.scale],
    ([base, s]: number[]) => base * s * 0.3
  );

  const emergedOrbitRadius = useTransform(
    [baseSize, springs.scale, springs.emergeOpacity],
    ([base, s, emOpacity]: number[]) => base * s * 1.5 * emOpacity
  );

  // Emerged dot 1 (angle 0°)
  const emerged1_x = useTransform(
    [springs.centerX, emergedOrbitRadius, emergeOrbitAngle],
    ([cx, radius, angle]: number[]) => {
      const rad = ((0 + angle) * Math.PI) / 180;
      return cx + radius * Math.cos(rad);
    }
  );
  const emerged1_y = useTransform(
    [springs.centerY, emergedOrbitRadius, emergeOrbitAngle],
    ([cy, radius, angle]: number[]) => {
      const rad = ((0 + angle) * Math.PI) / 180;
      return cy + radius * Math.sin(rad);
    }
  );

  // Emerged dot 2 (angle 180°)
  const emerged2_x = useTransform(
    [springs.centerX, emergedOrbitRadius, emergeOrbitAngle],
    ([cx, radius, angle]: number[]) => {
      const rad = ((180 + angle) * Math.PI) / 180;
      return cx + radius * Math.cos(rad);
    }
  );
  const emerged2_y = useTransform(
    [springs.centerY, emergedOrbitRadius, emergeOrbitAngle],
    ([cy, radius, angle]: number[]) => {
      const rad = ((180 + angle) * Math.PI) / 180;
      return cy + radius * Math.sin(rad);
    }
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
      {/* Satellite dots for Dot 1 */}
      <SatelliteDot x={sat1_1_x} y={sat1_1_y} size={satelliteSize} color={color} opacity={springs.satelliteOpacity} rotateX={rotateX} rotateY={rotateY} />
      <SatelliteDot x={sat1_2_x} y={sat1_2_y} size={satelliteSize} color={color} opacity={springs.satelliteOpacity} rotateX={rotateX} rotateY={rotateY} />
      <SatelliteDot x={sat1_3_x} y={sat1_3_y} size={satelliteSize} color={color} opacity={springs.satelliteOpacity} rotateX={rotateX} rotateY={rotateY} />
      <SatelliteDot x={sat1_4_x} y={sat1_4_y} size={satelliteSize} color={color} opacity={springs.satelliteOpacity} rotateX={rotateX} rotateY={rotateY} />

      {/* Satellite dots for Dot 2 (fade with merge) */}
      <SatelliteDot x={sat2_1_x} y={sat2_1_y} size={satelliteSize} color={color} opacity={sat2Opacity} rotateX={rotateX} rotateY={rotateY} />
      <SatelliteDot x={sat2_2_x} y={sat2_2_y} size={satelliteSize} color={color} opacity={sat2Opacity} rotateX={rotateX} rotateY={rotateY} />
      <SatelliteDot x={sat2_3_x} y={sat2_3_y} size={satelliteSize} color={color} opacity={sat2Opacity} rotateX={rotateX} rotateY={rotateY} />
      <SatelliteDot x={sat2_4_x} y={sat2_4_y} size={satelliteSize} color={color} opacity={sat2Opacity} rotateX={rotateX} rotateY={rotateY} />

      {/* Emerged dots (Maintain stage) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: emerged1_x,
          y: emerged1_y,
          translateX: "-50%",
          translateY: "-50%",
          width: emergedSize,
          height: emergedSize,
          backgroundColor: color,
          rotateX,
          rotateY,
          opacity: springs.emergeOpacity,
          willChange: "transform, background-color",
          backfaceVisibility: "hidden",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          x: emerged2_x,
          y: emerged2_y,
          translateX: "-50%",
          translateY: "-50%",
          width: emergedSize,
          height: emergedSize,
          backgroundColor: color,
          rotateX,
          rotateY,
          opacity: springs.emergeOpacity,
          willChange: "transform, background-color",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Main Dot 1 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: dot1X,
          y: dot1Y,
          translateX: "-50%",
          translateY: "-50%",
          width: mainDotSize,
          height: mainDotSize,
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

      {/* Main Dot 2 (fades out when merging) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: dot2X,
          y: dot2Y,
          translateX: "-50%",
          translateY: "-50%",
          width: mainDotSize,
          height: mainDotSize,
          backgroundColor: color,
          rotateX,
          rotateY,
          skewX: springs.skewX,
          skewY: springs.skewY,
          opacity: dot2Opacity,
          willChange: "transform, background-color",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
}

// Satellite dot component
interface SatelliteDotProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  size: MotionValue<number>;
  color: MotionValue<string>;
  opacity: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
}

function SatelliteDot({
  x,
  y,
  size,
  color,
  opacity,
  rotateX,
  rotateY,
}: SatelliteDotProps) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        width: size,
        height: size,
        backgroundColor: color,
        rotateX,
        rotateY,
        opacity,
        willChange: "transform, background-color",
        backfaceVisibility: "hidden",
      }}
    />
  );
}
