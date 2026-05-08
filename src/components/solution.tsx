"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A
// Syntax: keys #C4B5FD (muted violet) | strings #86EFAC (muted green) | comments #52525B

/* ─── Bento Card Wrapper ───────────────────────────────────── */
interface SolutionCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function SolutionCard({ children, className, delay = 0 }: SolutionCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#27272A] bg-[#18181B]/40",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Terminal Dots ──────────────────────────────────────────── */
function TerminalDots() {
  return (
    <div className="flex gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]/40" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]/40" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]/40" />
    </div>
  );
}

/* ─── Box 1: Terminal Command (Largest — 2 cols) ───────────── */
function TerminalBox() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const terminalLines = [
    {
      delay: 0.3,
      content: (
        <>
          <span className="text-[#52525B]"># Deploy your ranking agent</span>
        </>
      ),
    },
    {
      delay: 0.6,
      content: (
        <>
          <span className="text-[#C4B5FD]">rankmebaddy</span>
          <span className="text-[#A1A1AA]"> </span>
          <span className="text-[#C4B5FD]">deploy</span>
          <span className="text-[#A1A1AA]"> </span>
          <span className="text-[#86EFAC]">--platforms</span>
          <span className="text-[#A1A1AA]"> </span>
          <span className="text-[#FAFAFA]">youtube,google</span>
          <span className="text-[#A1A1AA]"> </span>
          <span className="text-[#86EFAC]">--keywords</span>
          <span className="text-[#A1A1AA]"> </span>
          <span className="text-[#FAFAFA]">&quot;best protein powder&quot;</span>
        </>
      ),
    },
    {
      delay: 1.4,
      content: (
        <>
          <span className="text-[#52525B]">▸ Initializing agent...</span>
        </>
      ),
    },
    {
      delay: 1.9,
      content: (
        <>
          <span className="text-[#52525B]">▸ Loading skills: </span>
          <span className="text-[#86EFAC]">KeywordScout</span>
          <span className="text-[#52525B]">, </span>
          <span className="text-[#86EFAC]">ContentOptimizer</span>
        </>
      ),
    },
    {
      delay: 2.4,
      content: (
        <>
          <span className="text-[#52525B]">▸ Connecting to </span>
          <span className="text-[#FAFAFA]">2 platforms</span>
          <span className="text-[#52525B]">...</span>
        </>
      ),
    },
    {
      delay: 2.9,
      content: (
        <>
          <span className="text-[#86EFAC]">✓</span>
          <span className="text-[#FAFAFA]"> Agent deployed successfully</span>
        </>
      ),
    },
    {
      delay: 3.2,
      content: (
        <>
          <span className="text-[#52525B]">  Estimated time to results: </span>
          <span className="text-[#FAFAFA] font-medium">2 weeks</span>
        </>
      ),
    },
  ];

  return (
    <SolutionCard className="col-span-1 md:col-span-2" delay={0}>
      <div ref={ref} className="flex flex-col p-5 sm:p-7">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TerminalDots />
            <span
              className="font-mono text-xs text-[#71717A]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              zsh — rankmebaddy
            </span>
          </div>
          <span className="flex items-center gap-1.5 rounded-md border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[10px] font-medium text-[#A1A1AA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6EE7B7]" />
            Connected
          </span>
        </div>

        {/* Terminal content */}
        <div
          className="flex-1 rounded-xl border border-[#27272A] bg-[#0A0A0B]/80 p-4 sm:p-5"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
            {terminalLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.35, delay: line.delay }}
              >
                {line.content}
              </motion.div>
            ))}
            {/* Blinking cursor */}
            {isInView && (
              <motion.span
                className="inline-block h-4 w-2 bg-[#A1A1AA]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "steps(2)" }}
              />
            )}
          </div>
        </div>
      </div>
    </SolutionCard>
  );
}

/* ─── Box 2: API Response JSON (Medium — 1 col) ────────────── */
function ApiResponseBox() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const jsonLines = [
    {
      delay: 0.5,
      content: <span className="text-[#52525B]">{"{"}</span>,
    },
    {
      delay: 0.7,
      content: (
        <>
          <span className="text-[#52525B]">  </span>
          <span className="text-[#C4B5FD]">&quot;status&quot;</span>
          <span className="text-[#52525B]">: </span>
          <span className="text-[#86EFAC]">&quot;deployed&quot;</span>
          <span className="text-[#52525B]">,</span>
        </>
      ),
    },
    {
      delay: 0.9,
      content: (
        <>
          <span className="text-[#52525B]">  </span>
          <span className="text-[#C4B5FD]">&quot;skills&quot;</span>
          <span className="text-[#52525B]">: [</span>
        </>
      ),
    },
    {
      delay: 1.1,
      content: (
        <>
          <span className="text-[#52525B]">    </span>
          <span className="text-[#86EFAC]">&quot;KeywordScout&quot;</span>
          <span className="text-[#52525B]">,</span>
        </>
      ),
    },
    {
      delay: 1.3,
      content: (
        <>
          <span className="text-[#52525B]">    </span>
          <span className="text-[#86EFAC]">&quot;ContentOptimizer&quot;</span>
        </>
      ),
    },
    {
      delay: 1.5,
      content: <span className="text-[#52525B]">  ],</span>,
    },
    {
      delay: 1.7,
      content: (
        <>
          <span className="text-[#52525B]">  </span>
          <span className="text-[#C4B5FD]">&quot;estimated_time&quot;</span>
          <span className="text-[#52525B]">: </span>
          <span className="text-[#86EFAC]">&quot;2 weeks&quot;</span>
        </>
      ),
    },
    {
      delay: 1.9,
      content: <span className="text-[#52525B]">{"}"}</span>,
    },
  ];

  return (
    <SolutionCard className="col-span-1" delay={0.15}>
      <div ref={ref} className="flex flex-col p-5 sm:p-7">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#18181B]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#FAFAFA]">
              API Response
            </span>
          </div>
          <span className="rounded-md border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[10px] font-medium text-[#A1A1AA]">
            200 OK
          </span>
        </div>

        {/* JSON content */}
        <div
          className="flex-1 rounded-xl border border-[#27272A] bg-[#0A0A0B]/80 p-4"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
            {jsonLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: line.delay }}
              >
                {line.content}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SolutionCard>
  );
}

/* ─── Box 3: Ranking Chart (Small — 1 col) ─────────────────── */
function RankingChartBox() {
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

  const chartWidth = 280;
  const chartHeight = 140;
  const paddingX = 30;
  const paddingY = 15;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingY * 2;
  const maxPosition = 45;

  const points = dataPoints.map((d, i) => ({
    x: paddingX + (i / (dataPoints.length - 1)) * plotWidth,
    y: paddingY + (1 - (maxPosition - d.position) / maxPosition) * plotHeight,
    ...d,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L${points[points.length - 1].x},${paddingY + plotHeight} L${points[0].x},${paddingY + plotHeight} Z`;

  return (
    <SolutionCard className="col-span-1" delay={0.3}>
      <div ref={ref} className="flex flex-col p-5 sm:p-7">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#18181B]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#FAFAFA]">
              Ranking
            </span>
          </div>
          <span className="text-[10px] font-medium text-[#A1A1AA]">
            #1 in 8 weeks
          </span>
        </div>

        {/* SVG Chart */}
        <div className="flex-1">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-full w-full"
            style={{ maxHeight: "180px" }}
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={paddingX}
                y1={paddingY + ratio * plotHeight}
                x2={chartWidth - paddingX}
                y2={paddingY + ratio * plotHeight}
                stroke="#27272A"
                strokeWidth="0.5"
              />
            ))}

            {/* Y-axis labels */}
            {[1, 15, 30, 45].map((val) => {
              const y = paddingY + (1 - (maxPosition - val) / maxPosition) * plotHeight;
              return (
                <text
                  key={val}
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#52525B"
                  fontSize="7"
                  style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                >
                  #{val}
                </text>
              );
            })}

            {/* Area fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A1A1AA" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#A1A1AA" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d={areaPath}
              fill="url(#areaGradient)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {/* Line */}
            <motion.path
              d={linePath}
              fill="none"
              stroke="#A1A1AA"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            />

            {/* Data points */}
            {points.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="2.5"
                fill="#0A0A0B"
                stroke="#A1A1AA"
                strokeWidth="1.5"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.12 }}
              />
            ))}

            {/* X-axis labels */}
            {points.map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={chartHeight - 2}
                textAnchor="middle"
                fill="#52525B"
                fontSize="7"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
              >
                {p.week}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </SolutionCard>
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
        Deploy in seconds
      </h2>
      <p className="max-w-lg text-sm text-[#71717A] sm:text-base">
        One command. Multiple platforms. Autonomous ranking from day one.
      </p>
    </motion.div>
  );
}

/* ─── Main Solution Section ─────────────────────────────────── */
export default function SolutionSection() {
  return (
    <section
      className="relative px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent" />

      <div className="mx-auto max-w-5xl">
        <SectionTitle />

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          <TerminalBox />
          <ApiResponseBox />

          <div className="md:col-start-3">
            <RankingChartBox />
          </div>
        </div>
      </div>
    </section>
  );
}
