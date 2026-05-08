"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MovingSpotlight } from "@/components/ui/spotlight";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

/* ─── Brand Palette ──────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #1A1A1F  |  Accent: #4ADE80  |  Violet: #A78BFA  |  Text: #E4E4E7

/* ─── Glowing Pill Badge ─────────────────────────────────────── */
function GlowPill() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <span
        className={cn(
          "relative inline-flex items-center gap-2 rounded-full px-4 py-1.5",
          "border border-[#4ADE80]/50 bg-[#4ADE80]/10",
          "text-xs font-medium tracking-wide text-[#4ADE80]",
          "shadow-[0_0_15px_rgba(74,222,128,0.2),inset_0_0_15px_rgba(74,222,128,0.05)]"
        )}
      >
        {/* Green dot indicator */}
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ADE80]" />
        </span>
        Powered by Nemotron 3 Super
      </span>
    </motion.div>
  );
}

/* ─── Headline with Gradient ─────────────────────────────────── */
function Headline() {
  return (
    <motion.h1
      className="max-w-4xl text-center font-heading text-5xl font-bold leading-[1.1] tracking-tight text-[#E4E4E7] sm:text-6xl md:text-7xl lg:text-8xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      Rank Everywhere.{" "}
      <span
        className="bg-gradient-to-r from-[#4ADE80] via-[#4ADE80] to-[#A78BFA] bg-clip-text text-transparent"
      >
        Autonomously.
      </span>
    </motion.h1>
  );
}

/* ─── Typewriter Sub-headline ────────────────────────────────── */
function Subheadline() {
  const subText =
    "Not just Google. YouTube, Amazon, TikTok, AI Search. Your AI agent handles the skills, you handle the results.";

  return (
    <motion.div
      className="max-w-2xl text-center text-base leading-relaxed text-[#A1A1AA] sm:text-lg md:text-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <TypewriterEffect
        words={subText}
        typingSpeed={30}
        startDelay={1200}
        cursorClassName="bg-[#4ADE80]"
      />
    </motion.div>
  );
}

/* ─── Pulsing CTA Button ─────────────────────────────────────── */
function GlowButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.5 }}
    >
      <button
        className={cn(
          "group relative inline-flex items-center gap-2 rounded-full",
          "bg-[#4ADE80] px-8 py-3.5 text-sm font-semibold text-[#0A0A0B]",
          "transition-all duration-300",
          "hover:bg-[#86efac] hover:shadow-[0_0_40px_rgba(74,222,128,0.45)]",
          "active:scale-[0.97]",
          "shadow-[0_0_25px_rgba(74,222,128,0.3)]",
          "animate-[glow-pulse_3s_ease-in-out_infinite]"
        )}
      >
        {/* Icon */}
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
        Deploy Your Agent
      </button>
    </motion.div>
  );
}

/* ─── Main Hero Section ──────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-6"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      {/* Animated Spotlight Background */}
      <MovingSpotlight className="z-0" />

      {/* Grid pattern overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(228,228,231,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(228,228,231,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <GlowPill />
        <Headline />
        <Subheadline />
        <GlowButton />
      </div>

      {/* Bottom fade-out */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-40 bg-gradient-to-t from-[#0A0A0B] to-transparent" />
    </section>
  );
}
