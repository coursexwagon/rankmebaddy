"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A

/* ─── Animated Card with scroll-triggered 3D tilt ────────────── */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function Card({ children, className, delay = 0 }: CardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#27272A] bg-[#18181B]/40",
        className
      )}
      initial={{ opacity: 0, y: 30, rotateX: 5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{
        y: -3,
        borderColor: "rgba(110,231,183,0.15)",
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Chat Interface (Full Product Mockup) ───────────────────── */
function ChatInterfaceBox() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Card className="col-span-1 md:col-span-2" delay={0}>
      <div ref={ref} className="flex flex-col">
        {/* App chrome — sidebar + top bar */}
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-[#27272A]/60 bg-[#18181B]/60 pt-4 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6EE7B7]/10">
              <span className="text-[11px] font-bold text-[#6EE7B7]">R</span>
            </div>
            <div className="space-y-2.5 px-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#27272A]/60">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6EE7B7]/10">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                </svg>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#27272A]/60">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
            <div className="mt-auto mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#27272A]/60">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main chat area */}
          <div className="flex flex-1 flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-[#27272A]/60 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#FAFAFA]">Best Protein Powder</span>
                <span className="rounded bg-[#6EE7B7]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#6EE7B7]">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[9px] text-[#A1A1AA]">Day 14</span>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 space-y-4 p-4 sm:p-5">
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[#27272A] px-4 py-2.5 text-[12px] leading-relaxed text-[#FAFAFA]">
                  I want to rank for &quot;best protein powder&quot; on Google, YouTube, and Amazon. Can you handle all three?
                </div>
              </motion.div>

              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-[#27272A]/60 bg-[#18181B] px-4 py-3">
                  <p className="text-[12px] leading-relaxed text-[#A1A1AA]">
                    On it. Three campaigns launched in parallel:
                  </p>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { letter: "G", color: "#4285F4", name: "Google", pct: "87%", detail: "8 keyword gaps found", delay: 1.2 },
                      { letter: "YT", color: "#FF0000", name: "YouTube", pct: "64%", detail: "Optimizing title & desc", delay: 1.4 },
                      { letter: "A", color: "#FF9900", name: "Amazon", pct: "31%", detail: "Rewriting listing copy", delay: 1.6 },
                    ].map((p) => (
                      <motion.div
                        key={p.letter}
                        className="rounded-lg border p-2.5"
                        style={{ borderColor: `${p.color}20`, backgroundColor: `${p.color}05` }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: p.delay }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-4 w-4 items-center justify-center rounded text-[7px] font-bold" style={{ color: p.color, backgroundColor: `${p.color}20` }}>{p.letter}</span>
                          <span className="text-[9px] font-medium text-[#FAFAFA]">{p.name}</span>
                        </div>
                        <div className="mt-2">
                          <div className="h-1 rounded-full bg-[#27272A]">
                            <motion.div
                              className="h-1 rounded-full"
                              style={{ backgroundColor: p.color }}
                              initial={{ width: 0 }}
                              animate={isInView ? { width: p.pct } : {}}
                              transition={{ duration: 1, delay: p.delay + 0.2 }}
                            />
                          </div>
                          <p className="mt-1 text-[8px] text-[#A1A1AA]">{p.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <p className="mt-3 text-[11px] text-[#71717A]">
                    Full report in ~48 hours. I&apos;ll notify you when each one completes.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 2.0 }}
              >
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[#27272A] px-4 py-2.5 text-[12px] leading-relaxed text-[#FAFAFA]">
                  Also check TikTok — our competitor just ranked there last week.
                </div>
              </motion.div>

              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 2.4 }}
              >
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-[#27272A]/60 bg-[#18181B] px-4 py-2.5">
                  <p className="text-[12px] leading-relaxed text-[#A1A1AA]">
                    Added TikTok to the campaign. Found their video strategy — drafting a content plan that targets the same keywords with a different angle.
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[#FE2C55]/20 bg-[#FE2C55]/5 px-2.5 py-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-[#FE2C55]/20 text-[7px] font-bold text-[#FE2C55]">TT</span>
                    <span className="text-[10px] text-[#A1A1AA]">Analyzing competitor content</span>
                    <span className="ml-1 text-[10px] font-medium text-[#F59E0B]">12%</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Input bar */}
            <div className="border-t border-[#27272A]/60 px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#0A0A0B]/60 px-3.5 py-2.5">
                <span className="text-[11px] text-[#52525B]">Ask RankMeBaddy to rank anything...</span>
                <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg bg-[#6EE7B7]/10">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 7-7 7 7" />
                    <path d="M12 19V5" />
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

/* ─── Rankings Snapshot Card ─────────────────────────────────── */
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
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#6EE7B7]/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#FAFAFA]">Rankings</span>
          </div>
          <span className="rounded bg-[#6EE7B7]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#6EE7B7]">14 days</span>
        </div>

        <div className="flex-1 space-y-2.5">
          {rankings.map((r, i) => (
            <motion.div
              key={r.platform}
              className="group flex items-center gap-2.5 rounded-lg border border-[#27272A]/40 bg-[#0A0A0B]/30 px-3 py-2.5 transition-colors hover:border-[#27272A]/70"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.4 + i * 0.12 }}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[8px] font-bold"
                style={{ color: r.color, backgroundColor: `${r.color}15` }}
              >
                {r.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] text-[#71717A]">{r.keyword}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] tabular-nums">
                <span className="text-[#52525B] line-through">{r.before}</span>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 7-7 7 7" />
                </svg>
                <span className="font-semibold text-[#FAFAFA]">{r.after}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 border-t border-[#27272A]/40 pt-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#71717A]">Average improvement</span>
            <span className="font-semibold text-[#6EE7B7]">+35 positions</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ─── Score Ring Card ────────────────────────────────────────── */
function ScoreRingCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const metrics = [
    { label: "Keywords", value: 12, max: 12, color: "#6EE7B7" },
    { label: "Content", value: 94, max: 100, color: "#4285F4" },
    { label: "Authority", value: 78, max: 100, color: "#FF9900" },
  ];

  return (
    <Card className="col-span-1" delay={0.3}>
      <div ref={ref} className="flex flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#6EE7B7]/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.855z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#FAFAFA]">Content Score</span>
          </div>
          <span className="rounded bg-[#6EE7B7]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#6EE7B7]">Excellent</span>
        </div>

        <div className="flex items-center justify-center py-2">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="absolute h-28 w-28 -rotate-90" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="48" stroke="#27272A" strokeWidth="6" fill="none" />
              <motion.circle
                cx="56" cy="56" r="48"
                stroke="#6EE7B7"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 48}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                animate={isInView ? { strokeDashoffset: 2 * Math.PI * 48 * 0.06 } : {}}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="relative text-center">
              <motion.span
                className="block text-2xl font-bold text-[#FAFAFA]"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 1 }}
              >
                94
              </motion.span>
              <span className="block text-[9px] text-[#71717A]">out of 100</span>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2.5">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
            >
              <span className="w-16 text-[10px] text-[#71717A]">{m.label}</span>
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-[#27272A]">
                  <motion.div
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: m.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${(m.value / m.max) * 100}%` } : {}}
                    transition={{ duration: 0.8, delay: 1 + i * 0.15 }}
                  />
                </div>
              </div>
              <span className="w-8 text-right text-[10px] font-medium tabular-nums text-[#FAFAFA]">
                {m.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── Section Title ─────────────────────────────────────────── */
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
      className="mb-12 flex flex-col items-center gap-4 text-center"
      style={{ y }}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#18181B] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
        The Solution
      </span>
      <h2 className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl md:text-5xl">
        Just tell it what to rank
      </h2>
      <p className="max-w-lg text-sm text-[#71717A] sm:text-base">
        Chat with your AI SEO partner. It handles keyword research, content optimization, and ranking — across every platform at once.
      </p>
    </motion.div>
  );
}

/* ─── Main Solution Section ─────────────────────────────────── */
export default function SolutionSection() {
  return (
    <section
      id="solution"
      className="relative px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent" />

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
