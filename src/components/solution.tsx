"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Animated Card ────────────────────────────────────────── */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function Card({ children, className, delay = 0 }: CardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl",
        "transition-colors duration-300 hover:border-white/[0.1] hover:bg-white/[0.05]",
        className
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{
        y: -3,
        transition: { duration: 0.2 },
      }}
    >
      {/* Subtle gradient border at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      {children}
    </motion.div>
  );
}

/* ─── Chat Interface ───────────────────────────────────────── */
function ChatInterfaceBox() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Card className="col-span-1 md:col-span-2" delay={0}>
      <div ref={ref} className="flex flex-col">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-white/[0.06] bg-[#0A0A0B]/50 pt-4 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D4AA]/30 to-emerald-600/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="space-y-2.5 px-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00D4AA]/10">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                </svg>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3F3F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main chat area */}
          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0A0A0B]/30 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white/80">Best Protein Powder</span>
                <span className="flex items-center gap-1 rounded-full bg-[#00D4AA]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#00D4AA]">
                  <span className="h-1 w-1 rounded-full bg-[#00D4AA] animate-pulse" />
                  Live
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[9px] text-[#52525B]">Day 14</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 bg-[#0A0A0B]/40 p-4 sm:p-5">
              {/* User message */}
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#00D4AA]/15 border border-[#00D4AA]/10 px-4 py-2.5 text-[12px] leading-relaxed text-white/90 shadow-sm">
                  I want to rank for &quot;best protein powder&quot; on Google, YouTube, and Amazon. Can you handle all three?
                </div>
              </motion.div>

              {/* Agent response */}
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-white/[0.06] bg-[#0F0F11]/80 px-4 py-3 shadow-sm backdrop-blur-xl">
                  <div className="mb-2 flex items-center gap-1.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#00D4AA]/30 to-emerald-600/20">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-semibold text-[#00D4AA]">RankMeBaddy</span>
                  </div>
                  <p className="text-[12px] leading-relaxed text-white/70">
                    On it. Three campaigns launched in parallel:
                  </p>

                  {/* Mini progress cards */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { letter: "G", color: "#4285F4", name: "Google", pct: "87%", detail: "8 keyword gaps found", delay: 1.2 },
                      { letter: "YT", color: "#FF0000", name: "YouTube", pct: "64%", detail: "Optimizing title & desc", delay: 1.4 },
                      { letter: "A", color: "#FF9900", name: "Amazon", pct: "31%", detail: "Rewriting listing copy", delay: 1.6 },
                    ].map((p) => (
                      <motion.div
                        key={p.letter}
                        className="rounded-xl border p-2.5"
                        style={{ borderColor: `${p.color}15`, backgroundColor: `${p.color}05` }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: p.delay }}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md text-[8px] font-bold" style={{ color: p.color, backgroundColor: `${p.color}15` }}>{p.letter}</span>
                          <span className="text-[9px] font-medium text-white/70">{p.name}</span>
                          <span className="ml-auto text-[9px] font-bold" style={{ color: p.color }}>{p.pct}</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/[0.04]">
                          <motion.div
                            className="h-1 rounded-full"
                            style={{ backgroundColor: p.color }}
                            initial={{ width: 0 }}
                            animate={isInView ? { width: p.pct } : {}}
                            transition={{ duration: 1, delay: p.delay + 0.2 }}
                          />
                        </div>
                        <p className="mt-1.5 text-[8px] text-[#52525B]">{p.detail}</p>
                      </motion.div>
                    ))}
                  </div>

                  <p className="mt-3 text-[11px] text-[#52525B]">
                    Full report in ~48 hours. I&apos;ll notify you when each one completes.
                  </p>
                </div>
              </motion.div>

              {/* Second user message */}
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 2.0 }}
              >
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#00D4AA]/15 border border-[#00D4AA]/10 px-4 py-2.5 text-[12px] leading-relaxed text-white/90 shadow-sm">
                  Also check TikTok — our competitor just ranked there last week.
                </div>
              </motion.div>
            </div>

            {/* Input bar */}
            <div className="border-t border-white/[0.06] bg-[#0A0A0B]/30 px-4 py-3">
              <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-[#0A0A0B]/50 px-4 py-2.5">
                <span className="text-[11px] text-[#3F3F46]">Ask RankMeBaddy to rank anything...</span>
                <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#00D4AA]/30 to-emerald-600/20">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round">
                    <path d="m5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ─── Rankings Snapshot Card ────────────────────────────────── */
function RankingsCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const rankings = [
    { platform: "Google", icon: "G", color: "#4285F4", keyword: "best protein powder", before: "#38", after: "#3" },
    { platform: "YouTube", icon: "YT", color: "#FF0000", keyword: "protein review 2025", before: "#47", after: "#12" },
    { platform: "Amazon", icon: "A", color: "#FF9900", keyword: "whey isolate", before: "—", after: "#28" },
    { platform: "TikTok", icon: "TT", color: "#FE2C55", keyword: "protein tok", before: "—", after: "#15" },
  ];

  return (
    <Card className="col-span-1" delay={0.15}>
      <div ref={ref} className="flex flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4AA]/30 to-emerald-600/20">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-white/80">Rankings</span>
          </div>
          <span className="rounded-full bg-[#00D4AA]/10 px-2 py-0.5 text-[9px] font-medium text-[#00D4AA]">Live</span>
        </div>

        <div className="flex-1 space-y-2">
          {rankings.map((r, i) => (
            <motion.div
              key={r.platform}
              className="group flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 transition-all hover:border-white/[0.08] hover:bg-white/[0.04]"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.4 + i * 0.12 }}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[8px] font-bold"
                style={{ color: r.color, backgroundColor: `${r.color}12` }}
              >
                {r.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] text-[#52525B]">{r.keyword}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] tabular-nums">
                <span className="text-[#3F3F46] line-through">{r.before}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 7-7 7 7" />
                </svg>
                <span className="font-bold text-white/80">{r.after}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-xl border border-[#00D4AA]/10 bg-gradient-to-r from-[#00D4AA]/8 to-[#00D4AA]/3 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00D4AA]/15">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[10px] text-[#00D4AA]/70">Avg improvement</span>
            </div>
            <span className="text-[12px] font-bold text-[#00D4AA]">+35 positions</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ─── Score Ring Card ──────────────────────────────────────── */
function ScoreRingCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const metrics = [
    { label: "Keywords", value: 12, max: 12, color: "#00D4AA" },
    { label: "Content", value: 94, max: 100, color: "#4ADE80" },
    { label: "Authority", value: 78, max: 100, color: "#F59E0B" },
  ];

  return (
    <Card className="col-span-1" delay={0.3}>
      <div ref={ref} className="flex flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4AA]/30 to-emerald-600/20">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.855z" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-white/80">Content Score</span>
          </div>
          <span className="rounded-full bg-[#4ADE80]/10 px-2 py-0.5 text-[9px] font-medium text-[#4ADE80]">Excellent</span>
        </div>

        <div className="flex items-center justify-center py-2">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="absolute h-28 w-28 -rotate-90" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="none" />
              <motion.circle
                cx="56" cy="56" r="48"
                stroke="url(#scoreGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 48}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                animate={isInView ? { strokeDashoffset: 2 * Math.PI * 48 * 0.06 } : {}}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00D4AA" />
                  <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
              </defs>
            </svg>
            <div className="relative text-center">
              <motion.span
                className="block text-2xl font-bold text-white/90"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 1 }}
              >
                94
              </motion.span>
              <span className="block text-[9px] text-[#52525B]">out of 100</span>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
            >
              <span className="w-16 text-[10px] text-[#52525B]">{m.label}</span>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-white/[0.04]">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: m.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${(m.value / m.max) * 100}%` } : {}}
                    transition={{ duration: 0.8, delay: 1 + i * 0.15 }}
                  />
                </div>
              </div>
              <span className="w-8 text-right text-[10px] font-semibold tabular-nums text-white/70">
                {m.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── Section Title ────────────────────────────────────────── */
function SectionTitle() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -20]);

  return (
    <motion.div
      ref={ref}
      className="mb-14 flex flex-col items-center gap-4 text-center"
      style={{ y }}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-[#00D4AA]/15 bg-[#00D4AA]/5 px-3 py-1 text-[11px] font-medium text-[#00D4AA]/70">
        The Solution
      </span>
      <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl">
        Just tell it what to{" "}
        <span className="relative inline-block">
          rank
          <svg className="absolute -bottom-1 left-0 w-full overflow-visible" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ height: "0.12em" }}>
            <motion.path d="M2,8 C40,3 80,11 120,6 C150,2 175,9 198,5" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }} />
          </svg>
        </span>
      </h2>
      <p className="max-w-lg text-[15px] leading-relaxed text-white/40 sm:text-base">
        Chat with your AI SEO partner. It handles keyword research, content optimization, and ranking — across every platform at once.
      </p>
    </motion.div>
  );
}

/* ─── Main Solution Section ────────────────────────────────── */
export default function SolutionSection() {
  return (
    <section
      id="solution"
      className="relative bg-[#09090B] px-4 py-20 sm:px-6 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      <div className="mx-auto max-w-5xl">
        <SectionTitle />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          <ChatInterfaceBox />
          <RankingsCard />
          <div className="md:col-start-3">
            <ScoreRingCard />
          </div>
        </div>
      </div>
    </section>
  );
}
