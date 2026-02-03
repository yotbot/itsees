"use client";

import { motion, type MotionValue } from "framer-motion";

interface ProcessStage {
  id: string;
  title: string;
  tagline: string;
  description: string;
}

const stages: ProcessStage[] = [
  {
    id: "concept",
    title: "Concept",
    tagline: "We explore your vision together",
    description:
      "Every project starts with understanding. We dig deep into your goals, audience, and what makes your business unique.",
  },
  {
    id: "design",
    title: "Design",
    tagline: "Ideas take shape, excitement builds",
    description:
      "Wireframes become mockups, mockups become prototypes. We iterate until the design feels right.",
  },
  {
    id: "build",
    title: "Build",
    tagline: "Technical craft meets creative vision",
    description:
      "Clean code, modern architecture, pixel-perfect implementation. Your site comes to life.",
  },
  {
    id: "host",
    title: "Host",
    tagline: "Launch with confidence and speed",
    description:
      "Fast, secure hosting with global CDN. We handle deployment, SSL, and infrastructure.",
  },
  {
    id: "maintain",
    title: "Maintain",
    tagline: "Ongoing support, reliable partnership",
    description:
      "Updates, improvements, and peace of mind. Your site evolves with your business.",
  },
];

interface ProcessSectionProps {
  opacity: MotionValue<number>;
  activeStageIndex: MotionValue<number>;
}

export default function ProcessSection({
  opacity,
  activeStageIndex,
}: ProcessSectionProps) {
  return (
    <motion.section
      className="relative z-10"
      style={{ opacity }}
    >
      {stages.map((stage, index) => (
        <ProcessStageSection
          key={stage.id}
          stage={stage}
          index={index}
          activeStageIndex={activeStageIndex}
        />
      ))}
    </motion.section>
  );
}

interface ProcessStageSectionProps {
  stage: ProcessStage;
  index: number;
  activeStageIndex: MotionValue<number>;
}

function ProcessStageSection({
  stage,
  index,
  activeStageIndex,
}: ProcessStageSectionProps) {
  return (
    <div
      className="min-h-[500px] flex items-center"
      data-stage={stage.id}
      data-index={index}
    >
      {/* Asymmetric grid: 7/5 or 5/7 alternating */}
      <div className="mx-auto w-full max-w-6xl px-8">
        <div
          className={`grid grid-cols-12 gap-8 items-center ${
            index % 2 === 0 ? "" : "direction-rtl"
          }`}
        >
          {/* Content column - spans 7 or 5 depending on position */}
          <div
            className={`${
              index % 2 === 0
                ? "col-span-12 md:col-span-7 md:col-start-1"
                : "col-span-12 md:col-span-7 md:col-start-6"
            }`}
            style={{ direction: "ltr" }}
          >
            <div className="space-y-4">
              <span className="text-sm font-medium uppercase tracking-widest text-neutral-500">
                0{index + 1}
              </span>
              <h3 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                {stage.title}
              </h3>
              <p className="text-xl font-medium text-neutral-700">
                {stage.tagline}
              </p>
              <p className="text-lg text-neutral-600 max-w-xl">
                {stage.description}
              </p>
            </div>
          </div>

          {/* Empty space for ball animations - spans opposite side */}
          <div
            className={`hidden md:block ${
              index % 2 === 0
                ? "col-span-5 col-start-8"
                : "col-span-5 col-start-1"
            }`}
            style={{ direction: "ltr" }}
          >
            {/* Ball animation area - handled by FloatingDots */}
            <div className="aspect-square" />
          </div>
        </div>
      </div>
    </div>
  );
}
