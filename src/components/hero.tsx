"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MovingSpotlight } from "@/components/ui/spotlight";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

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
          "border border-green-500/60 bg-green-500/10",
          "text-xs font-medium tracking-wide text-green-400",
          "shadow-[0_0_15px_rgba(34,197,94,0.2),inset_0_0_15px_rgba(34,197,94,0.05)]"
        )}
      >
        {/* Green dot indicator */}
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
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
      className="max-w-4xl text-center font-heading text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
    >
      Rank Everywhere.{" "}
      <span
        className="bg-gradient-to-r from-green-400 via-emerald-400 to-violet-500 bg-clip-text text-transparent"
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
      className="max-w-2xl text-center text-base leading-relaxed text-neutral-400 sm:text-lg md:text-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <TypewriterEffect
        words={subText}
        typingSpeed={30}
        startDelay={1200}
        cursorClassName="bg-green-400"
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
          "bg-green-500 px-8 py-3.5 text-sm font-semibold text-black",
          "transition-all duration-300",
          "hover:bg-green-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]",
          "active:scale-[0.97]",
          "shadow-[0_0_25px_rgba(34,197,94,0.35)]",
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
      style={{ backgroundColor: "#050505" }}
    >
      {/* Animated Spotlight Background */}
      <MovingSpotlight className="z-0" />

      {/* Grid pattern overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
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
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-40 bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  );
}
