"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A
// Error: #FCA5A5 (red-300, muted)  |  Accent: #6EE7B7

/* ─── Platform Data ──────────────────────────────────────────── */
const platforms = [
  {
    name: "Google",
    letter: "G",
    color: "#4285F4",
    hours: 4,
    result: "Page 2 rankings",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    letter: "YT",
    color: "#FF0000",
    hours: 3,
    result: "Inconsistent views",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81z" fill="#FF0000" />
        <path d="M9.75 15.02 15.75 12 9.75 8.98v6.04z" fill="#FAFAFA" />
      </svg>
    ),
  },
  {
    name: "Amazon",
    letter: "A",
    color: "#FF9900",
    hours: 2,
    result: "Low visibility",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M.05 18.47c.08-.1.2-.1.36-.02 3.7 2.13 7.72 3.2 12.06 3.2 2.9 0 5.76-.54 8.58-1.63l.3-.13c.27-.12.45-.02.25.2-.2.2-.45.4-.7.6-2.64 1.96-5.73 2.93-9.24 2.93-4.05 0-7.77-1.36-11.17-4.09-.22-.17-.36-.3-.44-.36a.23.23 0 0 1 0-.3v-.4z" fill="#FF9900" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    letter: "TT",
    color: "#FE2C55",
    hours: 1.5,
    result: "Zero traction",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#FAFAFA" />
      </svg>
    ),
  },
  {
    name: "AI Search",
    letter: "AI",
    color: "#A1A1AA",
    hours: 0.5,
    result: "Not optimized",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
        <path d="M16 14H8a6 6 0 0 0-6 6v1h20v-1a6 6 0 0 0-6-6z" />
      </svg>
    ),
  },
];

const totalHours = 10.5;

/* ─── Agitation Section ─────────────────────────────────────── */
export default function AgitationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax for header
  const headerY = useTransform(scrollYProgress, [0, 1], [60, -30]);
  // Parallax for the content (slower)
  const contentY = useTransform(scrollYProgress, [0, 1], [30, -15]);

  return (
    <section
      className="relative px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: "#0A0A0B" }}
      ref={sectionRef}
    >
      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent" />

      <div className="mx-auto max-w-4xl">
        {/* Section label — parallax */}
        <motion.div
          className="mb-14 flex flex-col items-center gap-3 text-center"
          style={{ y: headerY }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#18181B] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
            The Reality
          </span>
          <h2 className="font-heading text-2xl font-bold text-[#FAFAFA] sm:text-3xl md:text-4xl">
            Your week in SEO
          </h2>
          <p className="max-w-md text-sm text-[#71717A]">
            Hours poured in. Platforms juggled. Rankings barely moved.
          </p>
        </motion.div>

        {/* Content — parallax */}
        <motion.div className="relative" style={{ y: contentY }}>
          {/* Total time callout */}
          <motion.div
            className="mb-8 flex items-center justify-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 rounded-full border border-[#FCA5A5]/20 bg-[#FCA5A5]/5 px-5 py-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="text-lg font-bold tabular-nums text-[#FCA5A5]">
                {totalHours} hrs
              </span>
              <span className="text-xs text-[#FCA5A5]/70">/week wasted</span>
            </div>
          </motion.div>

          {/* Platform time blocks */}
          <div className="space-y-3">
            {platforms.map((p, i) => {
              const barWidth = (p.hours / totalHours) * 100;
              return (
                <motion.div
                  key={p.name}
                  className="group relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.1,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex w-24 shrink-0 items-center gap-2.5 sm:w-28">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${p.color}15` }}
                      >
                        {p.icon}
                      </span>
                      <span className="text-xs font-medium text-[#FAFAFA] sm:text-sm">
                        {p.name}
                      </span>
                    </div>

                    <div className="relative flex-1">
                      <div className="h-8 overflow-hidden rounded-lg bg-[#18181B]/60">
                        <motion.div
                          className="relative flex h-full items-center"
                          style={{
                            backgroundColor: `${p.color}20`,
                            borderLeft: `2px solid ${p.color}40`,
                          }}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${barWidth}%` } : {}}
                          transition={{
                            duration: 0.8,
                            delay: 0.5 + i * 0.1,
                            ease: [0.21, 0.47, 0.32, 0.98],
                          }}
                        >
                          <span
                            className="ml-3 text-[11px] font-semibold tabular-nums"
                            style={{ color: `${p.color}CC` }}
                          >
                            {p.hours}h
                          </span>
                        </motion.div>
                      </div>
                    </div>

                    <motion.div
                      className="hidden w-32 shrink-0 sm:block"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                    >
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-[#FCA5A5]/80">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        {p.result}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary bar */}
          <motion.div
            className="mt-6 flex items-center justify-between rounded-xl border border-[#27272A] bg-[#18181B]/30 px-5 py-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 1.2 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCA5A5]/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#FAFAFA]">
                  5 platforms. {totalHours}+ hours. Zero progress.
                </p>
                <p className="text-xs text-[#71717A]">
                  Every week you repeat this cycle — and your rankings don&apos;t budge.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
