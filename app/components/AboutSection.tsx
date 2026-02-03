"use client";

import { motion, type MotionValue } from "framer-motion";

interface AboutSectionProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}

export default function AboutSection({ opacity, y }: AboutSectionProps) {
  return (
    <motion.section
      className="relative z-10 min-h-screen flex items-center"
      style={{ opacity, y }}
    >
      <div className="mx-auto max-w-4xl px-8 py-24">
        <div className="space-y-8">
          <h2 className="text-5xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
            Full-service web development
          </h2>
          <p className="text-xl leading-relaxed text-neutral-900 max-w-2xl">
            We build custom websites that work. From initial concept to launch
            and beyond, itsees partners with you through every step—design,
            development, hosting, and ongoing support.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 pt-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900">
                Custom Development
              </h3>
              <p className="text-neutral-900">
                No templates. Every project is built from scratch to match your
                unique needs and brand identity.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900">
                Modern Tech Stack
              </h3>
              <p className="text-neutral-900">
                Fast, secure, and future-proof. We use the latest technologies
                to ensure your site performs at its best.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900">
                Managed Hosting
              </h3>
              <p className="text-neutral-900">
                Reliable hosting with monitoring, backups, and updates handled
                for you. Focus on your business, not servers.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900">
                Ongoing Partnership
              </h3>
              <p className="text-neutral-900">
                Your website evolves with your business. We&apos;re here for
                updates, improvements, and strategic guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
