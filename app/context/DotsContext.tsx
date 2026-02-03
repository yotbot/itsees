"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  useMotionValue,
  useSpring,
  type MotionValue,
  type SpringOptions,
} from "framer-motion";

// Spring config for position (snappy, responsive)
const defaultSpring: SpringOptions = {
  stiffness: 400,
  damping: 40,
  mass: 0.5,
};

// Spring config for scale/skew (slightly softer)
const snappySpring: SpringOptions = {
  stiffness: 500,
  damping: 50,
  mass: 0.3,
};

export interface DotsContextValue {
  // Hydration state
  isMounted: boolean;

  // Position (center point for orbit)
  centerX: MotionValue<number>;
  centerY: MotionValue<number>;

  // Main dots orbit (2 dots orbiting each other)
  orbitRadius: MotionValue<number>;
  orbitAngle: MotionValue<number>;

  // Scale (1 = base size, can go much larger)
  scale: MotionValue<number>;

  // Color (as motion value for interpolation)
  color: MotionValue<string>;

  // Transform effects
  skewX: MotionValue<number>;
  skewY: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;

  // Opacity
  opacity: MotionValue<number>;

  // Base size in pixels
  baseSize: MotionValue<number>;

  // === Process section effects ===

  // Satellite dots (small dots that orbit each main dot)
  satelliteOpacity: MotionValue<number>; // 0 = hidden, 1 = visible
  satelliteOrbitRadius: MotionValue<number>; // Distance from parent dot
  satelliteOrbitAngle: MotionValue<number>; // Rotation angle

  // Merge effect (Host stage: 2 dots → 1 dot)
  mergeProgress: MotionValue<number>; // 0 = separate, 1 = merged

  // Emerge effect (Maintain stage: small dots emerge from merged dot)
  emergeOpacity: MotionValue<number>; // 0 = hidden, 1 = visible
  emergeOrbitAngle: MotionValue<number>; // Rotation angle for emerged dots

  // Spring-wrapped values for smooth transitions
  springs: {
    centerX: MotionValue<number>;
    centerY: MotionValue<number>;
    orbitRadius: MotionValue<number>;
    scale: MotionValue<number>;
    skewX: MotionValue<number>;
    skewY: MotionValue<number>;
    satelliteOpacity: MotionValue<number>;
    satelliteOrbitRadius: MotionValue<number>;
    mergeProgress: MotionValue<number>;
    emergeOpacity: MotionValue<number>;
  };

  // Methods to update values (animated via springs)
  setCenter: (x: number, y: number) => void;
  setOrbit: (radius: number, angle: number) => void;
  setScale: (scale: number) => void;
  setColor: (color: string) => void;
  setSkew: (x: number, y: number) => void;
  setRotate3D: (x: number, y: number) => void;
  setOpacity: (opacity: number) => void;
  setBaseSize: (size: number) => void;

  // Immediate setters (no animation, instant jump)
  setCenterImmediate: (x: number, y: number) => void;
  setOrbitImmediate: (radius: number, angle: number) => void;
  setScaleImmediate: (scale: number) => void;
  setBaseSizeImmediate: (size: number) => void;
}

const DotsContext = createContext<DotsContextValue | null>(null);

export function DotsProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // Raw motion values - use consistent initial values for SSR
  const centerX = useMotionValue(0);
  const centerY = useMotionValue(0);
  const orbitRadius = useMotionValue(50);
  const orbitAngle = useMotionValue(0);
  const scale = useMotionValue(1);
  const color = useMotionValue("#171717");
  const skewX = useMotionValue(0);
  const skewY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const opacity = useMotionValue(0); // Start hidden, fade in after positioning
  const baseSize = useMotionValue(20);

  // Process section effects
  const satelliteOpacity = useMotionValue(0);
  const satelliteOrbitRadius = useMotionValue(30);
  const satelliteOrbitAngle = useMotionValue(0);
  const mergeProgress = useMotionValue(0);
  const emergeOpacity = useMotionValue(0);
  const emergeOrbitAngle = useMotionValue(0);

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Spring-wrapped values for smooth animated transitions
  const springCenterX = useSpring(centerX, defaultSpring);
  const springCenterY = useSpring(centerY, defaultSpring);
  const springOrbitRadius = useSpring(orbitRadius, defaultSpring);
  const springScale = useSpring(scale, snappySpring);
  const springSkewX = useSpring(skewX, snappySpring);
  const springSkewY = useSpring(skewY, snappySpring);
  const springSatelliteOpacity = useSpring(satelliteOpacity, snappySpring);
  const springSatelliteOrbitRadius = useSpring(satelliteOrbitRadius, snappySpring);
  const springMergeProgress = useSpring(mergeProgress, defaultSpring);
  const springEmergeOpacity = useSpring(emergeOpacity, snappySpring);

  // Setter methods for imperative updates
  const setCenter = (x: number, y: number) => {
    centerX.set(x);
    centerY.set(y);
  };

  const setOrbit = (radius: number, angle: number) => {
    orbitRadius.set(radius);
    orbitAngle.set(angle);
  };

  const setScale = (s: number) => {
    scale.set(s);
  };

  const setColor = (c: string) => {
    color.set(c);
  };

  const setSkew = (x: number, y: number) => {
    skewX.set(x);
    skewY.set(y);
  };

  const setRotate3D = (x: number, y: number) => {
    rotateX.set(x);
    rotateY.set(y);
  };

  const setOpacity = (o: number) => {
    opacity.set(o);
  };

  const setBaseSize = (s: number) => {
    baseSize.set(s);
  };

  // Immediate setters - use jump() to bypass spring animation
  const setCenterImmediate = (x: number, y: number) => {
    centerX.set(x);
    centerY.set(y);
    springCenterX.jump(x);
    springCenterY.jump(y);
  };

  const setOrbitImmediate = (radius: number, angle: number) => {
    orbitRadius.set(radius);
    orbitAngle.set(angle);
    springOrbitRadius.jump(radius);
  };

  const setScaleImmediate = (s: number) => {
    scale.set(s);
    springScale.jump(s);
  };

  const setBaseSizeImmediate = (s: number) => {
    baseSize.set(s);
  };

  const value: DotsContextValue = {
    isMounted,
    centerX,
    centerY,
    orbitRadius,
    orbitAngle,
    scale,
    color,
    skewX,
    skewY,
    rotateX,
    rotateY,
    opacity,
    baseSize,
    satelliteOpacity,
    satelliteOrbitRadius,
    satelliteOrbitAngle,
    mergeProgress,
    emergeOpacity,
    emergeOrbitAngle,
    springs: {
      centerX: springCenterX,
      centerY: springCenterY,
      orbitRadius: springOrbitRadius,
      scale: springScale,
      skewX: springSkewX,
      skewY: springSkewY,
      satelliteOpacity: springSatelliteOpacity,
      satelliteOrbitRadius: springSatelliteOrbitRadius,
      mergeProgress: springMergeProgress,
      emergeOpacity: springEmergeOpacity,
    },
    setCenter,
    setOrbit,
    setScale,
    setColor,
    setSkew,
    setRotate3D,
    setOpacity,
    setBaseSize,
    setCenterImmediate,
    setOrbitImmediate,
    setScaleImmediate,
    setBaseSizeImmediate,
  };

  return <DotsContext.Provider value={value}>{children}</DotsContext.Provider>;
}

export function useDots() {
  const context = useContext(DotsContext);
  if (!context) {
    throw new Error("useDots must be used within a DotsProvider");
  }
  return context;
}
