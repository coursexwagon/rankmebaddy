"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ─── Floating Glass Cards ────────────────────────────────── */
function FloatingCards() {
  return (
    <div className="relative mx-auto mt-10 h-[360px] max-w-3xl sm:mt-14 sm:h-[420px] md:h-[460px]">
      {/* Card: Keywords — top left */}
      <motion.div
        className="absolute left-[2%] top-[5%] w-[175px] rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl sm:left-[5%] sm:w-[195px]"
        initial={{ opacity: 0, y: 20, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="mb-2.5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00D4AA]/12">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-white/75">Keywords</span>
        </div>
        <div className="space-y-1.5">
          {["best seo tool", "rank on google", "seo strategy"].map((kw, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-1.5">
              <span className="text-[10px] text-white/50">{kw}</span>
              <span className="text-[9px] font-bold text-[#00D4AA]">{["4.2k", "2.8k", "1.9k"][i]}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Card: SEO Score — top right */}
      <motion.div
        className="absolute right-[2%] top-[2%] w-[155px] rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl sm:right-[5%] sm:w-[175px]"
        initial={{ opacity: 0, y: 20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.7, delay: 1.0 }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="mb-3 text-center">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
              <motion.circle
                cx="40" cy="40" r="34" fill="none"
                stroke="#00D4AA"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${(78 / 100) * 213.6} 213.6`}
                initial={{ strokeDasharray: "0 213.6" }}
                animate={{ strokeDasharray: `${(78 / 100) * 213.6} 213.6` }}
                transition={{ duration: 1.5, delay: 1.5 }}
              />
            </svg>
            <span className="absolute font-heading text-lg font-bold text-white">78</span>
          </div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/30">SEO Score</p>
        </div>
      </motion.div>

      {/* Card: Today's Tasks — bottom left */}
      <motion.div
        className="absolute bottom-[5%] left-[5%] w-[195px] rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl sm:left-[8%] sm:w-[215px]"
        initial={{ opacity: 0, y: -20, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.7, delay: 1.2 }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="mb-2.5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00D4AA]/12">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-white/75">Today&apos;s Tasks</span>
        </div>
        <div className="space-y-1.5">
          {[
            { text: "Optimize title tags", done: true },
            { text: "Fix meta descriptions", done: true },
            { text: "Submit sitemap", done: false },
          ].map((task, i) => (
            <div key={i} className="flex items-center gap-2 px-1 py-0.5">
              <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${task.done ? "bg-[#00D4AA]/15 border-[#00D4AA]/25" : "border-white/[0.08]"}`}>
                {task.done && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className={`text-[10px] ${task.done ? "text-white/40 line-through" : "text-white/60"}`}>{task.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Card: Integrations — bottom right */}
      <motion.div
        className="absolute bottom-[8%] right-[5%] w-[175px] rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl sm:right-[8%] sm:w-[195px]"
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.7, delay: 1.4 }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="mb-2 text-center">
          <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/30">5+ Platforms</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>, label: "Google" },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81z" fill="#FF0000" /><path d="M9.75 15.02 15.75 12 9.75 8.98v6.04z" fill="#FFF" /></svg>, label: "YouTube" },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M.05 18.47c.08-.1.2-.1.36-.02 3.7 2.13 7.72 3.2 12.06 3.2 2.9 0 5.76-.54 8.58-1.63l.3-.13c.27-.12.45-.02.25.2-.2.2-.45.4-.7.6-2.64 1.96-5.73 2.93-9.24 2.93-4.05 0-7.77-1.36-11.17-4.09-.22-.17-.36-.3-.44-.36a.23.23 0 0 1 0-.3v-.4z" fill="#FF9900" /></svg>, label: "Amazon" },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#FE2C55" /></svg>, label: "TikTok" },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>, label: "AI" },
          ].map((p, i) => (
            <div key={i} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06]">
              {p.icon}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Center: Logo icon */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00D4AA]/20 to-emerald-600/10 border border-[#00D4AA]/15 backdrop-blur-xl shadow-lg shadow-[#00D4AA]/8 sm:h-20 sm:w-20">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Partner Logos Strip ──────────────────────────────────── */
function PartnerStrip() {
  const partners = [
    "Shopify", "Webflow", "WordPress", "Wix", "Squarespace", "Ghost", "Next.js",
  ];

  return (
    <motion.div
      className="relative z-10 mt-12 border-t border-white/[0.05] pt-8 pb-4 sm:mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      <p className="mb-5 text-center text-[10px] uppercase tracking-[0.2em] text-white/20">
        Works with your stack
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4">
        {partners.map((name, i) => (
          <motion.span
            key={name}
            className="text-sm font-medium text-white/20 transition-colors hover:text-white/35"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.4 + i * 0.05 }}
          >
            {name}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Hero Section ─────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-4 pb-8 sm:px-6 sm:pb-12"
    >
      {/* ── Rich gradient background ── */}
      <motion.div className="absolute inset-0" style={{ opacity: bgOpacity }}>
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 30%, rgba(0,212,170,0.12) 0%, transparent 50%),
              radial-gradient(ellipse 60% 50% at 80% 20%, rgba(0,212,170,0.06) 0%, transparent 50%),
              radial-gradient(ellipse 90% 70% at 50% 80%, rgba(26,26,46,0.9) 0%, transparent 60%),
              linear-gradient(160deg, #0A0A0B 0%, #0D1117 30%, #1A1A2E 70%, #0A0A0B 100%)
            `,
          }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)", left: "10%", top: "15%" }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)", right: "10%", top: "25%" }}
          animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </motion.div>

      {/* ── Content ── */}
      <motion.div className="relative z-10 mx-auto max-w-3xl text-center" style={{ y: textY }}>
        <div className="h-24 sm:h-32 md:h-36" />

        {/* Badge */}
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00D4AA]/15 bg-[#00D4AA]/5 px-4 py-1.5 backdrop-blur-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          <span className="text-[11px] font-medium text-[#00D4AA]/70">AI-powered multi-platform SEO</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Think, plan, and{" "}
          <span className="relative inline-block">
            rank
            <svg className="absolute -bottom-1 left-0 w-full overflow-visible" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ height: "0.12em" }}>
              <motion.path d="M2,8 C40,3 80,11 120,6 C150,2 175,9 198,5" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8, ease: "easeOut" }} />
            </svg>
          </span>
          {" "}everywhere
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mx-auto mt-5 max-w-lg text-[15px] leading-[1.7] text-white/50 sm:text-base sm:leading-[1.75]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Your AI SEO partner that handles it all — keywords, content, and rankings across Google, YouTube, Amazon, TikTok, and AI Search.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-9 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center sm:gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="/auth"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#00D4AA] px-8 py-3.5 text-sm font-semibold text-[#0A0A0B] shadow-lg shadow-[#00D4AA]/15 transition-all duration-200 hover:bg-[#00D4AA]/90 hover:shadow-xl hover:shadow-[#00D4AA]/25"
          >
            Get started free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a
            href="#proof"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white/60 backdrop-blur-sm transition-colors duration-200 hover:border-white/[0.15] hover:text-white/80 hover:bg-white/[0.05]"
          >
            See results
          </a>
        </motion.div>

        <motion.p className="mt-5 text-xs text-white/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          Free to start · No credit card · 100 credits/hour in beta
        </motion.p>
      </motion.div>

      {/* Floating Cards */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <FloatingCards />
      </motion.div>

      <PartnerStrip />
    </section>
  );
}
