"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A
// Underline accent: #6EE7B7 (emerald-300)

/* ─── Wireframe Globe ────────────────────────────────────────── */
function WireframeGlobe() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 600 600"
        className="absolute h-[800px] w-[800px] opacity-[0.07] sm:h-[1000px] sm:w-[1000px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle cx="300" cy="300" r="260" stroke="#FAFAFA" strokeWidth="0.8" />

        {/* Latitude lines */}
        <ellipse cx="300" cy="180" rx="240" ry="40" stroke="#FAFAFA" strokeWidth="0.4" />
        <ellipse cx="300" cy="240" rx="255" ry="55" stroke="#FAFAFA" strokeWidth="0.4" />
        <ellipse cx="300" cy="300" rx="260" ry="70" stroke="#FAFAFA" strokeWidth="0.5" />
        <ellipse cx="300" cy="360" rx="255" ry="55" stroke="#FAFAFA" strokeWidth="0.4" />
        <ellipse cx="300" cy="420" rx="240" ry="40" stroke="#FAFAFA" strokeWidth="0.4" />

        {/* Longitude lines */}
        <ellipse cx="300" cy="300" rx="70" ry="260" stroke="#FAFAFA" strokeWidth="0.4" />
        <ellipse cx="300" cy="300" rx="140" ry="260" stroke="#FAFAFA" strokeWidth="0.4" />
        <ellipse cx="300" cy="300" rx="200" ry="260" stroke="#FAFAFA" strokeWidth="0.3" />

        {/* Diagonal meridians */}
        <ellipse
          cx="300" cy="300" rx="180" ry="260"
          stroke="#FAFAFA" strokeWidth="0.3"
          transform="rotate(25 300 300)"
        />
        <ellipse
          cx="300" cy="300" rx="180" ry="260"
          stroke="#FAFAFA" strokeWidth="0.3"
          transform="rotate(-25 300 300)"
        />

        {/* Scattered dots — cities/nodes */}
        <circle cx="220" cy="240" r="2" fill="#6EE7B7" opacity="0.6" />
        <circle cx="380" cy="260" r="2" fill="#6EE7B7" opacity="0.5" />
        <circle cx="310" cy="340" r="2" fill="#6EE7B7" opacity="0.4" />
        <circle cx="260" cy="380" r="1.5" fill="#6EE7B7" opacity="0.3" />
        <circle cx="350" cy="200" r="1.5" fill="#6EE7B7" opacity="0.5" />
        <circle cx="190" cy="310" r="1.5" fill="#6EE7B7" opacity="0.4" />
        <circle cx="400" cy="350" r="1.5" fill="#6EE7B7" opacity="0.3" />

        {/* Connection arcs between dots */}
        <path d="M220,240 Q290,210 380,260" stroke="#6EE7B7" strokeWidth="0.4" opacity="0.3" fill="none" />
        <path d="M380,260 Q350,310 310,340" stroke="#6EE7B7" strokeWidth="0.4" opacity="0.2" fill="none" />
        <path d="M310,340 Q280,370 260,380" stroke="#6EE7B7" strokeWidth="0.3" opacity="0.2" fill="none" />
        <path d="M350,200 Q300,230 220,240" stroke="#6EE7B7" strokeWidth="0.3" opacity="0.2" fill="none" />
      </svg>

      {/* Subtle radial gradient behind globe */}
      <div
        className="absolute h-[600px] w-[600px] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, #6EE7B7 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/* ─── Floating Particles ─────────────────────────────────────── */
function FloatingParticles() {
  const particles = [
    { x: "10%", y: "20%", size: 3, delay: 0, duration: 18 },
    { x: "85%", y: "15%", size: 2, delay: 2, duration: 22 },
    { x: "70%", y: "70%", size: 2.5, delay: 4, duration: 20 },
    { x: "20%", y: "75%", size: 2, delay: 1, duration: 24 },
    { x: "50%", y: "10%", size: 1.5, delay: 3, duration: 16 },
    { x: "90%", y: "45%", size: 2, delay: 5, duration: 19 },
    { x: "5%", y: "50%", size: 1.5, delay: 2.5, duration: 21 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#6EE7B7]"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 10, -8, 5, 0],
            opacity: [0.15, 0.35, 0.2, 0.4, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Underline Span ─────────────────────────────────────────── */
function UnderlinedWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg
        className="absolute -bottom-1 left-0 w-full overflow-visible"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        style={{ height: "0.12em" }}
      >
        <motion.path
          d="M2,8 C40,3 80,11 120,6 C150,2 175,9 198,5"
          stroke="#6EE7B7"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}

/* ─── Grid Lines Background ──────────────────────────────────── */
function GridLines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage:
          "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}

/* ─── Hero Section ───────────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28 md:pt-44"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      {/* Background layers */}
      <GridLines />
      <WireframeGlobe />
      <FloatingParticles />

      {/* Top fade from globe */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0A0A0B]/60 to-transparent" />

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

        {/* Headline with creative underlines */}
        <motion.h1
          className="font-heading text-center text-4xl font-bold leading-[1.08] tracking-tight text-[#FAFAFA] sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <UnderlinedWord>Rank</UnderlinedWord> everywhere.
          <br />
          <UnderlinedWord>Autonomously</UnderlinedWord>.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-[#A1A1AA] sm:text-lg"
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

        {/* Trust line */}
        <motion.p
          className="mt-5 text-center text-xs text-[#52525B]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          No credit card required · Setup in under 60 seconds
        </motion.p>

        {/* Platform logos row */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {[
            { name: "Google", color: "#4285F4" },
            { name: "YouTube", color: "#FF0000" },
            { name: "Amazon", color: "#FF9900" },
            { name: "TikTok", color: "#FE2C55" },
            { name: "AI Search", color: "#6EE7B7" },
          ].map((platform) => (
            <span
              key={platform.name}
              className="text-xs font-medium tracking-wide text-[#52525B]"
            >
              {platform.name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
