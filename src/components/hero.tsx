"use client";

import { motion } from "framer-motion";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A

/* ─── Hero Section ───────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28 md:pt-44"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Badge */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#18181B] px-3.5 py-1.5 text-xs font-medium text-[#A1A1AA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6EE7B7]" />
            Powered by Nemotron 3 Super
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-heading text-center text-4xl font-bold leading-[1.08] tracking-tight text-[#FAFAFA] sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Rank everywhere.
          <br />
          Autonomously.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-[#A1A1AA] sm:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          One AI agent that learns every platform&apos;s algorithm — so you don&apos;t have to.
          Google, YouTube, Amazon, TikTok, AI Search. All covered.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-9 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="#solution"
            className="inline-flex items-center gap-2 rounded-lg bg-[#FAFAFA] px-6 py-3 text-sm font-semibold text-[#0A0A0B] transition-colors hover:bg-white"
          >
            Deploy Your First Agent
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        {/* Subtle trust line */}
        <motion.p
          className="mt-5 text-center text-xs text-[#52525B]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          No credit card required · Setup in under 60 seconds
        </motion.p>
      </div>
    </section>
  );
}
