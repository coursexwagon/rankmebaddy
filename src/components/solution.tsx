"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Brand Palette ──────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #1A1A1F  |  Accent: #4ADE80  |  Violet: #A78BFA  |  Text: #E4E4E7

/* ─── Syntax Highlighting Colors ────────────────────────────── */
// command keyword → violet, flag → accent green, string → green-300, comment → zinc-600
// JSON key → violet, JSON string → green-300, JSON value → green-300

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
        "relative overflow-hidden rounded-2xl border border-[#1A1A1F] bg-[#1A1A1F]/40",
        "backdrop-blur-sm",
        className
      )}
      initial={{ opacity: 0, scale: 0.95, y: 25 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {/* Top edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E4E4E7]/6 to-transparent" />
      {children}
    </motion.div>
  );
}

/* ─── Terminal Window Dots ──────────────────────────────────── */
function TerminalDots() {
  return (
    <div className="flex gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#4ADE80]/60" />
    </div>
  );
}

/* ─── Box 1: Terminal Command (Largest — 2 cols) ───────────── */
function TerminalBox() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Lines of the terminal session, each with delay
  const terminalLines = [
    {
      delay: 0.3,
      content: (
        <>
          <span className="text-[#71717A]"># Deploy your ranking agent</span>
        </>
      ),
    },
    {
      delay: 0.6,
      content: (
        <>
          <span className="text-[#A78BFA]">rankmebaddy</span>
          <span className="text-[#E4E4E7]"> </span>
          <span className="text-[#A78BFA]">deploy</span>
          <span className="text-[#E4E4E7]"> </span>
          <span className="text-[#4ADE80]">--platforms</span>
          <span className="text-[#E4E4E7]"> </span>
          <span className="text-[#86efac]">youtube,google</span>
          <span className="text-[#E4E4E7]"> </span>
          <span className="text-[#4ADE80]">--keywords</span>
          <span className="text-[#E4E4E7]"> </span>
          <span className="text-[#86efac]">&quot;best protein powder&quot;</span>
        </>
      ),
    },
    {
      delay: 1.4,
      content: (
        <>
          <span className="text-[#71717A]">▸ Initializing agent...</span>
        </>
      ),
    },
    {
      delay: 1.9,
      content: (
        <>
          <span className="text-[#71717A]">▸ Loading skills: </span>
          <span className="text-[#4ADE80]">KeywordScout</span>
          <span className="text-[#71717A]">, </span>
          <span className="text-[#4ADE80]">ContentOptimizer</span>
        </>
      ),
    },
    {
      delay: 2.4,
      content: (
        <>
          <span className="text-[#71717A]">▸ Connecting to </span>
          <span className="text-[#86efac]">2 platforms</span>
          <span className="text-[#71717A]">...</span>
        </>
      ),
    },
    {
      delay: 2.9,
      content: (
        <>
          <span className="text-[#4ADE80]">✓</span>
          <span className="text-[#E4E4E7]"> Agent deployed successfully</span>
        </>
      ),
    },
    {
      delay: 3.2,
      content: (
        <>
          <span className="text-[#71717A]">  Estimated time to results: </span>
          <span className="text-[#4ADE80] font-medium">2 weeks</span>
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
            <span className="font-mono text-xs text-[#71717A]"
              style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
            >
              zsh — rankmebaddy
            </span>
          </div>
          <span className="flex items-center gap-1.5 rounded-md bg-[#4ADE80]/10 px-2 py-0.5 text-[10px] font-medium text-[#4ADE80]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
            </span>
            Connected
          </span>
        </div>

        {/* Terminal content */}
        <div
          className="flex-1 rounded-xl border border-[#1A1A1F] bg-[#0A0A0B]/80 p-4 sm:p-5"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
            {terminalLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: line.delay }}
              >
                {line.content}
              </motion.div>
            ))}
            {/* Blinking cursor */}
            {isInView && (
              <motion.span
                className="inline-block h-4 w-2 bg-[#4ADE80]"
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
      content: (
        <>
          <span className="text-[#71717A]">{"{"}</span>
        </>
      ),
    },
    {
      delay: 0.7,
      content: (
        <>
          <span className="text-[#71717A]">  </span>
          <span className="text-[#A78BFA]">&quot;status&quot;</span>
          <span className="text-[#71717A]">: </span>
          <span className="text-[#86efac]">&quot;deployed&quot;</span>
          <span className="text-[#71717A]">,</span>
        </>
      ),
    },
    {
      delay: 0.9,
      content: (
        <>
          <span className="text-[#71717A]">  </span>
          <span className="text-[#A78BFA]">&quot;skills&quot;</span>
          <span className="text-[#71717A]">: [</span>
        </>
      ),
    },
    {
      delay: 1.1,
      content: (
        <>
          <span className="text-[#71717A]">    </span>
          <span className="text-[#86efac]">&quot;KeywordScout&quot;</span>
          <span className="text-[#71717A]">,</span>
        </>
      ),
    },
    {
      delay: 1.3,
      content: (
        <>
          <span className="text-[#71717A]">    </span>
          <span className="text-[#86efac]">&quot;ContentOptimizer&quot;</span>
        </>
      ),
    },
    {
      delay: 1.5,
      content: (
        <>
          <span className="text-[#71717A]">  ],</span>
        </>
      ),
    },
    {
      delay: 1.7,
      content: (
        <>
          <span className="text-[#71717A]">  </span>
          <span className="text-[#A78BFA]">&quot;estimated_time&quot;</span>
          <span className="text-[#71717A]">: </span>
          <span className="text-[#86efac]">&quot;2 weeks&quot;</span>
        </>
      ),
    },
    {
      delay: 1.9,
      content: (
        <>
          <span className="text-[#71717A]">{"}"}</span>
        </>
      ),
    },
  ];

  return (
    <SolutionCard className="col-span-1" delay={0.15}>
      <div ref={ref} className="flex flex-col p-5 sm:p-7">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#A78BFA]/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#E4E4E7]">
              API Response
            </span>
          </div>
          <span className="rounded-md bg-[#4ADE80]/10 px-2 py-0.5 text-[10px] font-semibold text-[#4ADE80]">
            200 OK
          </span>
        </div>

        {/* JSON content */}
        <div
          className="flex-1 rounded-xl border border-[#1A1A1F] bg-[#0A0A0B]/80 p-4"
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

  // Chart data: ranking position over weeks (lower = better)
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

  // SVG chart dimensions
  const chartWidth = 280;
  const chartHeight = 140;
  const paddingX = 30;
  const paddingY = 15;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingY * 2;
  const maxPosition = 45;

  // Convert data to SVG coordinates (y is inverted — lower rank = higher on chart)
  const points = dataPoints.map((d, i) => ({
    x: paddingX + (i / (dataPoints.length - 1)) * plotWidth,
    y: paddingY + (1 - (maxPosition - d.position) / maxPosition) * plotHeight,
    ...d,
  }));

  // Line path
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  // Area fill path (close to bottom)
  const areaPath = `${linePath} L${points[points.length - 1].x},${paddingY + plotHeight} L${points[0].x},${paddingY + plotHeight} Z`;

  return (
    <SolutionCard className="col-span-1" delay={0.3}>
      <div ref={ref} className="flex flex-col p-5 sm:p-7">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#4ADE80]/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              </svg>
            </span>
            <span className="text-sm font-medium text-[#E4E4E7]">
              Ranking
            </span>
          </div>
          <span className="text-[10px] font-medium text-[#4ADE80]">
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
                stroke="#1A1A1F"
                strokeWidth="0.5"
              />
            ))}

            {/* Y-axis labels */}
            {[1, 15, 30, 45].map((val, i) => {
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

            {/* Area fill with gradient */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
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
              stroke="#4ADE80"
              strokeWidth="2"
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
                r="3"
                fill="#0A0A0B"
                stroke="#4ADE80"
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

            {/* Highlight the last point — #1 */}
            {points.length > 0 && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 2 }}
              >
                <circle
                  cx={points[points.length - 1].x}
                  cy={points[points.length - 1].y}
                  r="6"
                  fill="#4ADE80"
                  opacity="0.15"
                />
                <circle
                  cx={points[points.length - 1].x}
                  cy={points[points.length - 1].y}
                  r="3.5"
                  fill="#4ADE80"
                  opacity="0.3"
                />
              </motion.g>
            )}
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
      transition={{ duration: 0.6 }}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-[#4ADE80]/20 bg-[#4ADE80]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#4ADE80]">
        The Solution
      </span>
      <h2 className="font-heading text-3xl font-bold text-[#E4E4E7] sm:text-4xl md:text-5xl">
        Deploy in{" "}
        <span className="bg-gradient-to-r from-[#4ADE80] to-[#A78BFA] bg-clip-text text-transparent">
          seconds
        </span>
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
      {/* Top divider — green accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4ADE80]/15 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <SectionTitle />

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {/* Row 1: Terminal (2 cols) + API Response (1 col) */}
          <TerminalBox />
          <ApiResponseBox />

          {/* Row 2: Chart (1 col, offset right) */}
          <div className="md:col-start-3">
            <RankingChartBox />
          </div>
        </div>
      </div>
    </section>
  );
}
