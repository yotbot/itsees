"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useDots } from "../context/DotsContext";

// Fragment offset angles for each main dot (creates burst pattern)
const FRAGMENT_ANGLES = [0, 90, 180, 270]; // 4 fragments per dot

// Extra dots for multiplication effect (offset from center)
const EXTRA_DOT_OFFSETS = [
  { angle: 45, distance: 0.3 },
  { angle: 225, distance: 0.3 },
];

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
    pulseIntensity,
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

  // Compute size from baseSize and scale, with pulse effect
  const size = useTransform(
    [baseSize, springs.scale, pulseIntensity],
    ([base, s, pulse]: number[]) => {
      // Pulse adds subtle breathing effect (±5% when intensity is 1)
      const pulseMultiplier = 1 + pulse * 0.05 * Math.sin(Date.now() / 500);
      return base * s * pulseMultiplier;
    }
  );

  // Fragment size (smaller than main dots)
  const fragmentSize = useTransform(
    [baseSize, springs.scale],
    ([base, s]: number[]) => base * s * 0.3
  );

  // Fragment positions for dot 1
  const fragment1Positions = FRAGMENT_ANGLES.map((angle) => {
    const x = useTransform(
      [dot1X, springs.fragmentSpread, springs.scale, baseSize],
      ([dx, spread, s, base]: number[]) => {
        const rad = (angle * Math.PI) / 180;
        const distance = spread * base * s * 1.5;
        return dx + distance * Math.cos(rad);
      }
    );
    const y = useTransform(
      [dot1Y, springs.fragmentSpread, springs.scale, baseSize],
      ([dy, spread, s, base]: number[]) => {
        const rad = (angle * Math.PI) / 180;
        const distance = spread * base * s * 1.5;
        return dy + distance * Math.sin(rad);
      }
    );
    return { x, y };
  });

  // Fragment positions for dot 2
  const fragment2Positions = FRAGMENT_ANGLES.map((angle) => {
    const x = useTransform(
      [dot2X, springs.fragmentSpread, springs.scale, baseSize],
      ([dx, spread, s, base]: number[]) => {
        const rad = (angle * Math.PI) / 180;
        const distance = spread * base * s * 1.5;
        return dx + distance * Math.cos(rad);
      }
    );
    const y = useTransform(
      [dot2Y, springs.fragmentSpread, springs.scale, baseSize],
      ([dy, spread, s, base]: number[]) => {
        const rad = (angle * Math.PI) / 180;
        const distance = spread * base * s * 1.5;
        return dy + distance * Math.sin(rad);
      }
    );
    return { x, y };
  });

  // Extra dot positions (for multiplication effect)
  const extraDotPositions = EXTRA_DOT_OFFSETS.map((offset) => {
    const x = useTransform(
      [springs.centerX, springs.orbitRadius],
      ([cx, radius]: number[]) => {
        const rad = (offset.angle * Math.PI) / 180;
        return cx + radius * offset.distance * Math.cos(rad);
      }
    );
    const y = useTransform(
      [springs.centerY, springs.orbitRadius],
      ([cy, radius]: number[]) => {
        const rad = (offset.angle * Math.PI) / 180;
        return cy + radius * offset.distance * Math.sin(rad);
      }
    );
    return { x, y };
  });

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
      {/* Fragment dots for Dot 1 */}
      {fragment1Positions.map((pos, i) => (
        <FragmentDot
          key={`frag1-${i}`}
          x={pos.x}
          y={pos.y}
          size={fragmentSize}
          color={color}
          opacity={springs.fragmentOpacity}
          rotateX={rotateX}
          rotateY={rotateY}
        />
      ))}

      {/* Fragment dots for Dot 2 */}
      {fragment2Positions.map((pos, i) => (
        <FragmentDot
          key={`frag2-${i}`}
          x={pos.x}
          y={pos.y}
          size={fragmentSize}
          color={color}
          opacity={springs.fragmentOpacity}
          rotateX={rotateX}
          rotateY={rotateY}
        />
      ))}

      {/* Extra dots for multiplication effect */}
      {extraDotPositions.map((pos, i) => (
        <motion.div
          key={`extra-${i}`}
          className="absolute rounded-full"
          style={{
            x: pos.x,
            y: pos.y,
            translateX: "-50%",
            translateY: "-50%",
            width: size,
            height: size,
            backgroundColor: color,
            rotateX,
            rotateY,
            opacity: springs.extraDotsOpacity,
            willChange: "transform, background-color",
            backfaceVisibility: "hidden",
          }}
        />
      ))}

      {/* Main Dot 1 */}
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

      {/* Main Dot 2 */}
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

// Fragment dot component for cleaner rendering
interface FragmentDotProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  size: MotionValue<number>;
  color: MotionValue<string>;
  opacity: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
}

function FragmentDot({
  x,
  y,
  size,
  color,
  opacity,
  rotateX,
  rotateY,
}: FragmentDotProps) {
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
