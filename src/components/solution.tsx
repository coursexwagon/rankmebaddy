"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A

/* ─── Card Wrapper ───────────────────────────────────────────── */
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Box 1: Chat Interface (Largest — 2 cols) ─────────────── */
function ChatInterfaceBox() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Card className="col-span-1 md:col-span-2" delay={0}>
      <div ref={ref} className="flex flex-col">
        {/* App chrome — sidebar hint + top bar */}
        <div className="flex">
          {/* Thin sidebar accent */}
          <div className="hidden w-12 shrink-0 flex-col items-center gap-4 border-r border-[#27272A]/60 bg-[#18181B]/60 pt-4 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27272A]">
              <span className="text-[10px] font-bold text-[#6EE7B7]">R</span>
            </div>
            <div className="h-6 w-6 rounded-md bg-[#27272A]/50" />
            <div className="h-6 w-6 rounded-md bg-[#27272A]/50" />
            <div className="h-6 w-6 rounded-md bg-[#6EE7B7]/10" />
          </div>

          {/* Main chat area */}
          <div className="flex flex-1 flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-[#27272A]/60 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#FAFAFA]">Best Protein Powder</span>
                <span className="rounded bg-[#27272A] px-1.5 py-0.5 text-[9px] text-[#71717A]">Campaign</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[9px] text-[#A1A1AA]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6EE7B7]" />
                  Active
                </span>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 space-y-4 p-4 sm:p-5">
              {/* User message */}
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#27272A] px-4 py-2.5 text-[12px] leading-relaxed text-[#FAFAFA]">
                  I want to rank for &quot;best protein powder&quot; on Google, YouTube, and Amazon. Can you handle all three?
                </div>
              </motion.div>

              {/* AI response */}
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-[#27272A]/60 bg-[#18181B] px-4 py-2.5">
                  <p className="text-[12px] leading-relaxed text-[#A1A1AA]">
                    On it. I&apos;ve started three parallel tasks:
                  </p>
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="flex h-4 w-4 items-center justify-center rounded bg-[#4285F4]/10 text-[8px] font-bold text-[#4285F4]">G</span>
                      <span className="text-[#A1A1AA]">Google — scanning SERP, found 8 keyword gaps</span>
                      <span className="ml-auto text-[#6EE7B7]">87%</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="flex h-4 w-4 items-center justify-center rounded bg-[#FF0000]/10 text-[8px] font-bold text-[#FF0000]">YT</span>
                      <span className="text-[#A1A1AA]">YouTube — optimizing title &amp; description</span>
                      <span className="ml-auto text-[#6EE7B7]">64%</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="flex h-4 w-4 items-center justify-center rounded bg-[#FF9900]/10 text-[8px] font-bold text-[#FF9900]">A</span>
                      <span className="text-[#A1A1AA]">Amazon — rewriting listing copy</span>
                      <span className="ml-auto text-[#F59E0B]">31%</span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[11px] text-[#71717A]">
                    I&apos;ll send you a full report when all three are complete. ETA: ~48 hours.
                  </p>
                </div>
              </motion.div>

              {/* Second user message */}
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 1.4 }}
              >
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#27272A] px-4 py-2.5 text-[12px] leading-relaxed text-[#FAFAFA]">
                  Also check TikTok — our competitor just ranked there last week.
                </div>
              </motion.div>

              {/* AI quick reply */}
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 1.8 }}
              >
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-[#27272A]/60 bg-[#18181B] px-4 py-2.5">
                  <p className="text-[12px] leading-relaxed text-[#A1A1AA]">
                    Added TikTok to the campaign. Found their video strategy — I&apos;ll draft a content plan that targets the same keywords with a different angle. Starting now.
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-[#FE2C55]/10 text-[8px] font-bold text-[#FE2C55]">TT</span>
                    <span className="text-[#A1A1AA]">TikTok — analyzing competitor content</span>
                    <span className="ml-auto text-[#F59E0B]">12%</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Input bar */}
            <div className="border-t border-[#27272A]/60 px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#0A0A0B]/60 px-3.5 py-2.5">
                <span className="text-[11px] text-[#52525B]">Ask RankMeBaddy to rank anything...</span>
                <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-lg bg-[#FAFAFA]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

/* ─── Box 2: Rankings Dashboard Card ────────────────────────── */
function RankingsCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const rankings = [
    { platform: "Google", icon: "G", color: "#4285F4", keyword: "best protein powder", before: "#38", after: "#3", change: "+35" },
    { platform: "YouTube", icon: "YT", color: "#FF0000", keyword: "protein review 2025", before: "#47", after: "#12", change: "+35" },
    { platform: "Amazon", icon: "A", color: "#FF9900", keyword: "whey isolate", before: "—", after: "#28", change: "New" },
    { platform: "TikTok", icon: "TT", color: "#FE2C55", keyword: "protein tok", before: "—", after: "#15", change: "New" },
  ];

  return (
    <Card className="col-span-1" delay={0.15}>
      <div ref={ref} className="flex flex-col p-5 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#27272A]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#FAFAFA]">Rankings</span>
          </div>
          <span className="text-[10px] text-[#71717A]">14 days</span>
        </div>

        {/* Ranking rows */}
        <div className="flex-1 space-y-2.5">
          {rankings.map((r, i) => (
            <motion.div
              key={r.platform}
              className="flex items-center gap-2.5 rounded-lg border border-[#27272A]/40 bg-[#0A0A0B]/30 px-3 py-2"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.35, delay: 0.4 + i * 0.12 }}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[8px] font-bold" style={{ color: r.color, backgroundColor: `${r.color}15` }}>
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
                <span className="font-medium text-[#FAFAFA]">{r.after}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ─── Box 3: SEO Score + Chart ──────────────────────────────── */
function ScoreChartCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const dataPoints = [
    { week: "W1", position: 42 },
    { week: "W2", position: 35 },
    { week: "W3", position: 28 },
    { week: "W4", position: 18 },
    { week: "W5", position: 11 },
    { week: "W6", position: 5 },
    { week: "W7", position: 3 },
    { week: "W8", position: 1 },
  ];

  const chartWidth = 240;
  const chartHeight = 100;
  const paddingX = 24;
  const paddingY = 12;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingY * 2;
  const maxPosition = 45;

  const points = dataPoints.map((d, i) => ({
    x: paddingX + (i / (dataPoints.length - 1)) * plotWidth,
    y: paddingY + (1 - (maxPosition - d.position) / maxPosition) * plotHeight,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${paddingY + plotHeight} L${points[0].x},${paddingY + plotHeight} Z`;

  return (
    <Card className="col-span-1" delay={0.3}>
      <div ref={ref} className="flex flex-col p-5 sm:p-6">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#27272A]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.855z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#FAFAFA]">Content Score</span>
          </div>
        </div>

        {/* Score circle + label */}
        <div className="mb-3 flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <svg className="absolute h-12 w-12 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke="#27272A" strokeWidth="3" fill="none" />
              <motion.circle
                cx="24" cy="24" r="20"
                stroke="#6EE7B7"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 20}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                animate={isInView ? { strokeDashoffset: 2 * Math.PI * 20 * 0.06 } : {}}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />
            </svg>
            <motion.span
              className="relative text-sm font-bold text-[#FAFAFA]"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              94
            </motion.span>
          </div>
          <div>
            <p className="text-[10px] text-[#6EE7B7]">Excellent</p>
            <p className="text-[10px] text-[#52525B]">12/12 keywords covered</p>
          </div>
        </div>

        {/* Mini chart */}
        <div className="flex-1">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full" style={{ maxHeight: "120px" }}>
            {[0, 0.5, 1].map((ratio) => (
              <line key={ratio} x1={paddingX} y1={paddingY + ratio * plotHeight} x2={chartWidth - paddingX} y2={paddingY + ratio * plotHeight} stroke="#27272A" strokeWidth="0.5" />
            ))}
            <defs>
              <linearGradient id="solAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path d={areaPath} fill="url(#solAreaGrad)" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.5 }} />
            <motion.path d={linePath} fill="none" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }} />
            {points.map((p, i) => (
              <motion.circle key={i} cx={p.x} cy={p.y} r="2" fill="#0A0A0B" stroke="#6EE7B7" strokeWidth="1.5" initial={{ opacity: 0, scale: 0 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }} />
            ))}
            {points.map((p, i) => (
              <text key={i} x={p.x} y={chartHeight - 1} textAnchor="middle" fill="#52525B" fontSize="6">{p.week}</text>
            ))}
          </svg>
        </div>
      </div>
    </Card>
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
      transition={{ duration: 0.5 }}
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
            <ScoreChartCard />
          </div>
        </div>
      </div>
    </section>
  );
}
