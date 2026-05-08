"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A
// Error: #FCA5A5 (red-300, muted)

/* ─── Spreadsheet Data ──────────────────────────────────────── */
const rows = [
  {
    platform: "Google",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
    timeSpent: "4hrs/week",
    result: "Page 2 rankings",
  },
  {
    platform: "YouTube",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81z" fill="#FF0000" />
        <path d="M9.75 15.02 15.75 12 9.75 8.98v6.04z" fill="#FAFAFA" />
      </svg>
    ),
    timeSpent: "3hrs/week",
    result: "Inconsistent views",
  },
  {
    platform: "Amazon",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M.05 18.47c.08-.1.2-.1.36-.02 3.7 2.13 7.72 3.2 12.06 3.2 2.9 0 5.76-.54 8.58-1.63l.3-.13c.27-.12.45-.02.25.2-.2.2-.45.4-.7.6-2.64 1.96-5.73 2.93-9.24 2.93-4.05 0-7.77-1.36-11.17-4.09-.22-.17-.36-.3-.44-.36a.23.23 0 0 1 0-.3v-.4z" fill="#FF9900" />
        <path d="M15.05 9.3c0-.94.17-1.76.5-2.44.34-.7.8-1.24 1.38-1.62.58-.38 1.24-.57 1.96-.57.58 0 1.08.12 1.5.35.42.23.74.55.96.95V2.2c0-.13.04-.24.13-.33.09-.09.2-.13.33-.13h2c.13 0 .24.04.33.13.09.09.13.2.13.33v14.73c0 .13-.04.24-.13.33-.09.09-.2.13-.33.13h-2.07c-.13 0-.24-.04-.33-.13a.45.45 0 0 1-.13-.33v-.96c-.22.4-.55.72-.97.96-.43.24-.93.36-1.52.36-.7 0-1.34-.19-1.92-.57-.58-.38-1.04-.92-1.38-1.62-.33-.7-.5-1.52-.5-2.46v-.47z" fill="#FAFAFA" />
        <path d="M6.75 14.5c-.12 0-.22-.04-.3-.13a.41.41 0 0 1-.12-.3V6.8c0-.12.04-.22.12-.3.08-.08.18-.12.3-.12h2.08c.12 0 .22.04.3.12.08.08.12.18.12.3v.63c.36-.55.84-.96 1.43-1.24.59-.28 1.27-.42 2.03-.42.12 0 .22.04.3.12.08.08.12.18.12.3v1.88c0 .12-.04.22-.12.3-.08.08-.18.12-.3.12h-1.03c-.74 0-1.32.2-1.73.6-.41.4-.62 1-.62 1.78v3.5c0 .12-.04.22-.12.3-.08.08-.18.13-.3.13H6.75z" fill="#FAFAFA" />
      </svg>
    ),
    timeSpent: "2hrs/week",
    result: "Low visibility",
  },
  {
    platform: "TikTok",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#FAFAFA" />
      </svg>
    ),
    timeSpent: "1.5hrs/week",
    result: "Zero traction",
  },
  {
    platform: "AI Search",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
        <path d="M16 14H8a6 6 0 0 0-6 6v1h20v-1a6 6 0 0 0-6-6z" />
      </svg>
    ),
    timeSpent: "0.5hrs/week",
    result: "Not optimized",
  },
];

/* ─── Spreadsheet Row Component ─────────────────────────────── */
function SpreadsheetRow({
  row,
  index,
  isInView,
}: {
  row: (typeof rows)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.tr
      className="border-b border-[#27272A]/60 transition-colors hover:bg-[#18181B]/40"
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.45,
        delay: 0.4 + index * 0.12,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {/* Platform */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#18181B]">
            {row.icon}
          </span>
          <span className="text-sm font-medium text-[#FAFAFA]">
            {row.platform}
          </span>
        </div>
      </td>

      {/* Time Spent */}
      <td className="py-3.5 px-4">
        <span className="text-sm tabular-nums text-[#A1A1AA]">
          {row.timeSpent}
        </span>
      </td>

      {/* Result */}
      <td className="py-3.5 pl-4">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1",
            "bg-red-950/30 text-sm font-medium text-[#FCA5A5]",
            "border border-red-900/20"
          )}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {row.result}
        </span>
      </td>
    </motion.tr>
  );
}

/* ─── Agitation Section ─────────────────────────────────────── */
export default function AgitationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const totalHours = "10+";

  return (
    <section
      className="relative px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: "#0A0A0B" }}
      ref={sectionRef}
    >
      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent" />

      <div className="mx-auto max-w-4xl">
        {/* Section label */}
        <motion.div
          className="mb-10 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#18181B] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
            The Reality
          </span>
          <h2 className="font-heading text-2xl font-bold text-[#FAFAFA] sm:text-3xl md:text-4xl">
            Your SEO workload this week
          </h2>
          <p className="text-sm text-[#71717A]">
            Hours spent. Platforms juggled. Rankings barely moved.
          </p>
        </motion.div>

        {/* Spreadsheet Component */}
        <motion.div
          className="overflow-hidden rounded-xl border border-[#27272A] bg-[#18181B]/40"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Spreadsheet header bar */}
          <div className="flex items-center justify-between border-b border-[#27272A]/60 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]/50" />
              </div>
              <span className="text-xs text-[#71717A]">
                SEO_Time_Tracker.xlsx
              </span>
            </div>
            <span className="flex h-5 items-center rounded bg-red-950/30 px-2 text-[10px] font-medium text-[#FCA5A5]">
              Live
            </span>
          </div>

          {/* Table header row */}
          <div className="border-b border-[#27272A]/60 bg-[#18181B]/30 px-5">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-2.5 pr-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                    Platform
                  </th>
                  <th className="py-2.5 px-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
                    Time Spent
                  </th>
                  <th className="py-2.5 pl-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#FCA5A5]/70">
                    Result
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Table body */}
          <div className="px-5">
            <table className="w-full">
              <tbody>
                {rows.map((row, i) => (
                  <SpreadsheetRow
                    key={row.platform}
                    row={row}
                    index={i}
                    isInView={isInView}
                  />
                ))}

                {/* Totals row */}
                <motion.tr
                  className="border-t border-[#27272A]"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + rows.length * 0.12 + 0.2 }}
                >
                  <td className="py-3.5 pr-4">
                    <span className="text-sm font-semibold text-[#FAFAFA]">
                      Total
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-semibold tabular-nums text-[#FAFAFA]">
                      {totalHours} hrs/week
                    </span>
                  </td>
                  <td className="py-3.5 pl-4">
                    <span className="text-sm font-semibold text-[#FCA5A5]">
                      Wasted effort
                    </span>
                  </td>
                </motion.tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Agitation Copy */}
        <motion.div
          className="mt-10 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="max-w-xl rounded-xl border border-[#27272A] bg-[#18181B]/30 px-6 py-5">
            <p className="text-base leading-relaxed text-[#A1A1AA] sm:text-lg">
              This week, you spent{" "}
              <span className="font-semibold text-[#FAFAFA]">{totalHours} hours</span>{" "}
              on SEO across five platforms. Your results?{" "}
              <span className="text-[#FCA5A5]">Inconsistent rankings</span>,{" "}
              <span className="text-[#FCA5A5]">wasted hours</span>, and still{" "}
              <span className="text-[#FCA5A5]">no clear strategy</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
