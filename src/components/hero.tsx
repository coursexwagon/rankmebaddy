"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AgentNetwork } from "@/components/ui/agent-network";

/* ─── Brand Palette ──────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #1A1A1F  |  Accent: #4ADE80  |  Violet: #A78BFA  |  Text: #E4E4E7

/* ─── Problem Side: Split Screen ────────────────────────────── */
function ProblemSide() {
  return (
    <motion.div
      className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#1A1A1F] bg-[#1A1A1F]/40 sm:flex-row"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {/* Left: Messy spreadsheet screenshot */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-[#0A0A0B]/40 backdrop-blur-[2px]" />
        <img
          src="/messy-spreadsheet.png"
          alt="Chaotic SEO spreadsheet with scattered tasks"
          className="h-full w-full object-cover"
          style={{ filter: "saturate(0.6) brightness(0.7)" }}
        />
        {/* Red tint overlay to convey frustration */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 via-transparent to-transparent" />
        {/* Scanline effect for screen look */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(228,228,231,0.1) 2px, rgba(228,228,231,0.1) 4px)",
          }}
        />
      </div>

      {/* Right: Frustrated person */}
      <div className="relative w-full sm:w-[45%]">
        <div className="absolute inset-0 bg-[#0A0A0B]/30" />
        <img
          src="/frustrated-person.png"
          alt="Frustrated person staring at their screen"
          className="h-full w-full object-cover"
          style={{ filter: "saturate(0.7) brightness(0.8)" }}
        />
        {/* Blue monitor glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-blue-950/20 via-transparent to-transparent" />
      </div>

      {/* Overlay label */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-red-950/60 px-3 py-1.5 backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <span className="text-[11px] font-medium text-red-300">Manual SEO</span>
      </div>
    </motion.div>
  );
}

/* ─── Solution Side: AgentNetwork ───────────────────────────── */
function SolutionSide() {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-[#4ADE80]/15 bg-[#1A1A1F]/40"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {/* Subtle green inner glow at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4ADE80]/20 to-transparent" />

      <AgentNetwork className="h-[320px] sm:h-[400px]" />

      {/* Overlay label */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-[#4ADE80]/10 px-3 py-1.5 backdrop-blur-sm border border-[#4ADE80]/20">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ADE80]" />
        </span>
        <span className="text-[11px] font-medium text-[#4ADE80]">AI Agent Active</span>
      </div>
    </motion.div>
  );
}

/* ─── CTA Button — subtle green glow, not neon ──────────────── */
function DeployButton() {
  return (
    <motion.button
      className={cn(
        "group relative inline-flex items-center gap-2.5 rounded-full",
        "bg-[#4ADE80] px-8 py-4 text-sm font-semibold text-[#0A0A0B]",
        "transition-all duration-300",
        "hover:bg-[#86efac]",
        "hover:shadow-[0_0_30px_rgba(74,222,128,0.3),0_0_60px_rgba(74,222,128,0.08)]",
        "active:scale-[0.97]",
        "shadow-[0_0_20px_rgba(74,222,128,0.15)]",
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-300 group-hover:translate-x-0.5"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
      Deploy Your First Agent
    </motion.button>
  );
}

/* ─── Main PAS Hero Section ─────────────────────────────────── */
export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 md:py-36"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      {/* Subtle ambient gradient at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-[#4ADE80]/[0.03] via-transparent to-transparent" />

      {/* ── Copy Section ── */}
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mb-14 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Problem label */}
          <motion.span
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1A1A1F] bg-[#1A1A1F]/50 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#71717A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            The Problem
          </motion.span>

          {/* Headline */}
          <motion.h1
            className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-[#E4E4E7] sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Stop guessing what ranks{" "}
            <span className="bg-gradient-to-r from-[#4ADE80] to-[#A78BFA] bg-clip-text text-transparent">
              where.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-5 max-w-lg text-base leading-relaxed text-[#A1A1AA] sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            One AI agent that learns every platform&apos;s algorithm—so you don&apos;t have to.
          </motion.p>

          {/* CTA — slightly off-center to the right */}
          <motion.div
            className="mt-8 pl-0 sm:pl-[10%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <DeployButton />
          </motion.div>
        </motion.div>

        {/* ── Visual: Problem vs Solution ── */}
        {/* Broken grid: solution extends 20% beyond the container on the right */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Problem Side */}
            <div className="relative">
              <motion.span
                className="mb-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[#71717A]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block h-3 w-3 rounded-full border border-red-500/50 bg-red-500/20" />
                Before
              </motion.span>
              <ProblemSide />
            </div>

            {/* Solution Side — extends 20% beyond container */}
            <div className="relative md:-mr-[20%] md:pr-[20%]">
              <motion.span
                className="mb-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[#4ADE80]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="inline-block h-3 w-3 rounded-full border border-[#4ADE80]/50 bg-[#4ADE80]/20" />
                After
              </motion.span>
              <SolutionSide />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-[#0A0A0B] to-transparent" />
    </section>
  );
}
