"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative min-h-[200vh] bg-[#f5f5f0]">
      {/* Fixed dots that stay on screen */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative text-[20vw] font-bold leading-none tracking-tight">
          {/* Invisible text to maintain spacing for dots */}
          <span className="invisible">its</span>
          <span className="relative inline-block">
            <span className="invisible">e</span>
            <motion.span
              className="absolute left-[40%] top-[0.4em] h-[0.15em] w-[0.15em] -translate-x-1/2 rounded-full bg-neutral-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </span>
          <span className="relative inline-block">
            <span className="invisible">e</span>
            <motion.span
              className="absolute left-[40%] top-[0.4em] h-[0.15em] w-[0.15em] -translate-x-1/2 rounded-full bg-neutral-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </span>
          <span className="invisible">s</span>
        </div>
      </div>

      {/* Scrollable text */}
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-[20vw] font-bold leading-none tracking-tight text-neutral-900">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            its
          </motion.span>
          <span className="relative inline-block">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              e
            </motion.span>
          </span>
          <span className="relative inline-block">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              e
            </motion.span>
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            s
          </motion.span>
        </h1>
      </div>
    </main>
  );
}
