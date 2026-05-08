"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Shared Bento Card Wrapper ─────────────────────────────── */
interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function BentoCard({ children, className, delay = 0 }: BentoCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]",
        "backdrop-blur-xl",
        "transition-colors duration-300 hover:border-white/[0.15] hover:bg-white/[0.05]",
        className
      )}
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {/* Inner glow at top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </motion.div>
  );
}

/* ─── Box 1: Keyword Scout (Large — 2 cols) ────────────────── */
function KeywordScoutBox() {
  const [lines, setLines] = useState<
    { text: string; type: "input" | "output" | "success" }[]
  >([]);

  const fullLog = [
    { text: "$ rankme scout --keyword 'best protein powder'", type: "input" as const },
    { text: "▸ Scanning 12 search engines...", type: "output" as const },
    { text: "▸ Analyzing SERP competition...", type: "output" as const },
    { text: "✓ 'best protein powder' → opportunity score 92%", type: "success" as const },
    { text: "$ rankme scout --keyword 'vegan protein 2025'", type: "input" as const },
    { text: "▸ Scanning 12 search engines...", type: "output" as const },
    { text: "✓ 'vegan protein 2025' → opportunity score 87%", type: "success" as const },
    { text: "$ rankme scout --keyword 'whey isolate vs concentrate'", type: "input" as const },
    { text: "▸ Cross-referencing AI search results...", type: "output" as const },
    { text: "✓ 'whey isolate vs concentrate' → opportunity score 95%", type: "success" as const },
    { text: "$ rankme scout --auto-discover --niche fitness", type: "input" as const },
    { text: "▸ Running autonomous discovery...", type: "output" as const },
    { text: "✓ Found 14 high-opportunity keywords", type: "success" as const },
  ];

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullLog.length) {
        setLines((prev) => [...prev, fullLog[currentIndex]]);
        currentIndex++;
      } else {
        // Loop after a pause
        setTimeout(() => {
          currentIndex = 0;
          setLines([]);
        }, 2000);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [isInView, fullLog.length]);

  return (
    <BentoCard className="col-span-1 md:col-span-2" delay={0}>
      <div ref={ref} className="flex h-full flex-col p-6 sm:p-8">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">
              Keyword Scout
            </h3>
            <p className="text-xs text-neutral-500">
              AI-powered keyword discovery
            </p>
          </div>
        </div>

        {/* Terminal */}
        <div className="flex-1 rounded-xl border border-white/[0.06] bg-black/40 p-4 font-mono text-xs sm:text-sm">
          {/* Terminal header dots */}
          <div className="mb-3 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>

          {/* Terminal lines */}
          <div className="space-y-1.5 overflow-hidden">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  line.type === "input" && "text-green-400/90",
                  line.type === "output" && "text-neutral-500",
                  line.type === "success" && "text-emerald-400 font-medium"
                )}
              >
                {line.text}
              </motion.div>
            ))}
            {/* Blinking cursor */}
            {isInView && (
              <span className="inline-block h-4 w-2 animate-pulse bg-green-400/70" />
            )}
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

/* ─── Box 2: Content Optimizer (Small) ─────────────────────── */
function ContentOptimizerBox() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <BentoCard className="col-span-1" delay={0.15}>
      <div ref={ref} className="flex h-full flex-col p-6 sm:p-8">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.855z" />
            </svg>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">
              Content Optimizer
            </h3>
            <p className="text-xs text-neutral-500">Real-time SEO scoring</p>
          </div>
        </div>

        {/* Score display */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="relative flex items-end gap-1">
            <motion.span
              className="font-heading text-6xl font-bold text-white sm:text-7xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              98
            </motion.span>
            <motion.span
              className="mb-2 text-lg font-medium text-green-400"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              %
            </motion.span>
          </div>
          <p className="text-sm font-medium text-green-400">SEO Score</p>

          {/* Progress bar */}
          <div className="w-full max-w-[200px]">
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                initial={{ width: "0%" }}
                animate={isInView ? { width: "98%" } : {}}
                transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Mini stats */}
          <div className="mt-2 flex gap-4 text-[11px] text-neutral-500">
            <span>
              Keywords:{" "}
              <span className="text-neutral-300">12/12</span>
            </span>
            <span>
              Links:{" "}
              <span className="text-neutral-300">8/8</span>
            </span>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

/* ─── Box 3: Rank Tracker (Small) ──────────────────────────── */
function RankTrackerBox() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <BentoCard className="col-span-1" delay={0.25}>
      <div ref={ref} className="flex h-full flex-col p-6 sm:p-8">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">
              Rank Tracker
            </h3>
            <p className="text-xs text-neutral-500">Live ranking monitor</p>
          </div>
        </div>

        {/* Giant #1 with glow */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="relative">
            {/* Glow layers behind the text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="h-24 w-24 rounded-full bg-green-500/20 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <motion.span
              className="relative font-heading text-8xl font-extrabold text-green-400 sm:text-9xl"
              style={{
                textShadow:
                  "0 0 40px rgba(34,197,94,0.5), 0 0 80px rgba(34,197,94,0.25), 0 0 120px rgba(34,197,94,0.1)",
              }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.4,
                type: "spring",
                stiffness: 150,
              }}
            >
              #1
            </motion.span>
          </div>

          {/* Upward arrow animation */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-green-400"
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
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
            Climbing
          </motion.div>
        </div>
      </div>
    </BentoCard>
  );
}

/* ─── Box 4: Multi-Platform (Medium — 2 cols) ──────────────── */
function MultiPlatformBox() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const platforms = [
    {
      name: "Google",
      x: 50,
      y: 25,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      ),
    },
    {
      name: "YouTube",
      x: 83,
      y: 55,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81z"
            fill="#FF0000"
          />
          <path d="M9.75 15.02 15.75 12 9.75 8.98v6.04z" fill="white" />
        </svg>
      ),
    },
    {
      name: "Amazon",
      x: 17,
      y: 55,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M.05 18.47c.08-.1.2-.1.36-.02 3.7 2.13 7.72 3.2 12.06 3.2 2.9 0 5.76-.54 8.58-1.63l.3-.13c.27-.12.45-.02.25.2-.2.2-.45.4-.7.6-2.64 1.96-5.73 2.93-9.24 2.93-4.05 0-7.77-1.36-11.17-4.09-.22-.17-.36-.3-.44-.36a.23.23 0 0 1 0-.3v-.4z"
            fill="#FF9900"
          />
          <path
            d="M18.68 16.62c.07-.07.16-.12.26-.12.1 0 .18.04.24.1.06.07.08.16.08.26v3.5c0 .1-.04.2-.12.27-.08.07-.17.1-.27.1h-3.5c-.1 0-.2-.04-.27-.12a.37.37 0 0 1-.1-.27v-3.5c0-.1.04-.2.12-.27.08-.07.17-.1.27-.1h3.3z"
            fill="#FF9900"
          />
          <path
            d="M15.05 9.3c0-.94.17-1.76.5-2.44.34-.7.8-1.24 1.38-1.62.58-.38 1.24-.57 1.96-.57.58 0 1.08.12 1.5.35.42.23.74.55.96.95V2.2c0-.13.04-.24.13-.33.09-.09.2-.13.33-.13h2c.13 0 .24.04.33.13.09.09.13.2.13.33v14.73c0 .13-.04.24-.13.33-.09.09-.2.13-.33.13h-2.07c-.13 0-.24-.04-.33-.13a.45.45 0 0 1-.13-.33v-.96c-.22.4-.55.72-.97.96-.43.24-.93.36-1.52.36-.7 0-1.34-.19-1.92-.57-.58-.38-1.04-.92-1.38-1.62-.33-.7-.5-1.52-.5-2.46v-.47zm3.96.03c0-.64-.16-1.15-.47-1.53-.31-.38-.73-.57-1.24-.57-.52 0-.93.19-1.24.57-.31.38-.47.89-.47 1.53v.4c0 .64.16 1.15.47 1.53.31.38.72.57 1.24.57.51 0 .93-.19 1.24-.57.31-.38.47-.89.47-1.53v-.4z"
            fill="white"
          />
          <path
            d="M6.75 14.5c-.12 0-.22-.04-.3-.13a.41.41 0 0 1-.12-.3V6.8c0-.12.04-.22.12-.3.08-.08.18-.12.3-.12h2.08c.12 0 .22.04.3.12.08.08.12.18.12.3v.63c.36-.55.84-.96 1.43-1.24.59-.28 1.27-.42 2.03-.42.12 0 .22.04.3.12.08.08.12.18.12.3v1.88c0 .12-.04.22-.12.3-.08.08-.18.12-.3.12h-1.03c-.74 0-1.32.2-1.73.6-.41.4-.62 1-.62 1.78v3.5c0 .12-.04.22-.12.3-.08.08-.18.13-.3.13H6.75z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      name: "TikTok",
      x: 50,
      y: 80,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
            fill="white"
          />
          <path
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
            fill="url(#tiktok-gradient)"
            opacity="0.6"
          />
          <defs>
            <linearGradient
              id="tiktok-gradient"
              x1="5"
              y1="2"
              x2="20.63"
              y2="2"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#25F4EE" />
              <stop offset="1" stopColor="#FE2C55" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
  ];

  // Connection lines between platforms
  const connections = [
    { from: 0, to: 1 }, // Google → YouTube
    { from: 0, to: 2 }, // Google → Amazon
    { from: 0, to: 3 }, // Google → TikTok
    { from: 1, to: 3 }, // YouTube → TikTok
    { from: 2, to: 3 }, // Amazon → TikTok
  ];

  return (
    <BentoCard className="col-span-1 md:col-span-2" delay={0.35}>
      <div ref={ref} className="flex h-full flex-col p-6 sm:p-8">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M16 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
              <path d="M6 8H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">
              Multi-Platform
            </h3>
            <p className="text-xs text-neutral-500">
              Simultaneous ranking across platforms
            </p>
          </div>
        </div>

        {/* Platform network visualization */}
        <div className="relative flex flex-1 items-center justify-center py-4">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Animated connection lines */}
            {connections.map((conn, i) => {
              const from = platforms[conn.from];
              const to = platforms[conn.to];
              return (
                <g key={i}>
                  {/* Glow line */}
                  <motion.line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="rgba(34,197,94,0.15)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                      isInView
                        ? { pathLength: 1, opacity: 1 }
                        : {}
                    }
                    transition={{
                      duration: 1.5,
                      delay: 0.6 + i * 0.2,
                      ease: "easeOut",
                    }}
                  />
                  {/* Animated particle traveling along the line */}
                  <motion.circle
                    r="1"
                    fill="#22c55e"
                    filter="url(#greenGlow)"
                    initial={{ opacity: 0 }}
                    animate={
                      isInView
                        ? {
                            opacity: [0, 1, 1, 0],
                            offsetDistance: ["0%", "100%"],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2.5,
                      delay: 1.5 + i * 0.3,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    <animateMotion
                      dur="2.5s"
                      begin={`${1.5 + i * 0.3}s`}
                      repeatCount="indefinite"
                      path={`M${from.x},${from.y} L${to.x},${to.y}`}
                    />
                  </motion.circle>
                </g>
              );
            })}

            {/* Glow filter */}
            <defs>
              <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Platform nodes */}
          <div className="relative h-[200px] w-full sm:h-[220px]">
            {platforms.map((platform, i) => (
              <motion.div
                key={platform.name}
                className="absolute flex flex-col items-center gap-2"
                style={{
                  left: `${platform.x}%`,
                  top: `${platform.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.15,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.06] backdrop-blur-sm transition-colors hover:border-white/[0.2] hover:bg-white/[0.1]">
                  {platform.icon}
                </div>
                <span className="text-[10px] font-medium text-neutral-500">
                  {platform.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

/* ─── Section Title ─────────────────────────────────────────── */
function SectionTitle() {
  return (
    <motion.div
      className="mb-12 flex flex-col items-center gap-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
        Core Skills
      </span>
      <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl">
        What Your Agent{" "}
        <span className="bg-gradient-to-r from-green-400 to-violet-500 bg-clip-text text-transparent">
          Does
        </span>
      </h2>
      <p className="max-w-lg text-sm text-neutral-500 sm:text-base">
        Four autonomous capabilities working in parallel across every platform
        that matters.
      </p>
    </motion.div>
  );
}

/* ─── Main Skills Section ───────────────────────────────────── */
export default function SkillsSection() {
  return (
    <section
      className="relative px-4 py-24 sm:px-6 sm:py-32"
      style={{ backgroundColor: "#050505" }}
    >
      <SectionTitle />

      {/* Bento Grid */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {/* Row 1: Large (2 cols) + Small (1 col) */}
        <KeywordScoutBox />
        <ContentOptimizerBox />

        {/* Row 2: Small (1 col) + Medium (2 cols) */}
        <RankTrackerBox />
        <MultiPlatformBox />
      </div>
    </section>
  );
}
