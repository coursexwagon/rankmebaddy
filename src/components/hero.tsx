"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #FAFAF7  |  Surface: #FFFFFF  |  Border: #E8E5E0
// Text: #1A1A1A  |  Secondary: #6B6B6B  |  Muted: #9B9B9B
// Accent: #2563EB  |  Accent Warm: #6EE7B7

/* ─── Counter Animation ──────────────────────────────────────── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Dashboard Mockup ───────────────────────────────────────── */
function DashboardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto mt-16 max-w-4xl px-4 sm:mt-20"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {/* Browser chrome */}
      <div className="overflow-hidden rounded-xl border border-[#E8E5E0] bg-white shadow-2xl shadow-black/5">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-[#E8E5E0] bg-[#FAFAF7] px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28CA41]" />
          </div>
          <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white border border-[#E8E5E0] px-3 py-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9B9B9B" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><path d="M2 12h20" />
            </svg>
            <span className="text-[10px] text-[#9B9B9B]">rankmebaddy.com/dashboard</span>
          </div>
        </div>

        {/* Dashboard content mockup */}
        <div className="flex min-h-[320px] sm:min-h-[400px]">
          {/* Sidebar */}
          <div className="hidden w-[180px] shrink-0 border-r border-[#E8E5E0] bg-white sm:block">
            <div className="flex items-center gap-2 px-4 py-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-[#1A1A1A]">RankMeBaddy</span>
            </div>
            <div className="space-y-0.5 px-2">
              {["Chat", "Overview", "Keywords", "Rankings", "Content", "Settings"].map((item, i) => (
                <motion.div
                  key={item}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-[10px] ${
                    i === 0 ? "bg-blue-50 text-blue-600 font-medium" : "text-[#9B9B9B]"
                  }`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.05 }}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 bg-[#FAFAF7] p-4 sm:p-6">
            {/* Header */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1 }}
            >
              <div className="h-3 w-24 rounded bg-[#1A1A1A]/10 mb-2" />
              <div className="h-2 w-32 rounded bg-[#9B9B9B]/20" />
            </motion.div>

            {/* Chat messages */}
            <div className="space-y-3">
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.1 }}
              >
                <div className="max-w-[75%] rounded-xl bg-[#F5F0EB] px-3 py-2">
                  <div className="h-2 w-28 rounded bg-[#1A1A1A]/20" />
                  <div className="mt-1.5 h-2 w-20 rounded bg-[#1A1A1A]/10" />
                </div>
              </motion.div>

              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.3 }}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[8px] font-bold text-blue-600">R</div>
                <div className="max-w-[80%] rounded-xl bg-[#FAF8F5] border-l-[2px] border-l-blue-600 px-3 py-2">
                  <div className="h-2 w-full rounded bg-[#1A1A1A]/15" />
                  <div className="mt-1.5 h-2 w-4/5 rounded bg-[#1A1A1A]/10" />
                  <div className="mt-1.5 h-2 w-3/5 rounded bg-[#1A1A1A]/10" />
                  <div className="mt-2 flex gap-1.5">
                    <div className="rounded-md bg-[#F5F0EB] border-l-[2px] border-l-blue-600 px-2 py-1">
                      <div className="h-1.5 w-14 rounded bg-[#1A1A1A]/20" />
                    </div>
                    <div className="rounded-md bg-[#F5F0EB] border-l-[2px] border-l-blue-600 px-2 py-1">
                      <div className="h-1.5 w-12 rounded bg-[#1A1A1A]/20" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Input bar */}
            <motion.div
              className="mt-4 flex items-center gap-2 rounded-xl border border-[#E8E5E0] bg-white px-3 py-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.5 }}
            >
              <div className="h-2 flex-1 rounded bg-[#9B9B9B]/15" />
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <path d="m5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative shadow/glow under the mockup */}
      <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 h-32 w-3/4 rounded-full bg-blue-200/20 blur-3xl" />
    </motion.div>
  );
}

/* ─── Social Proof Stats ─────────────────────────────────────── */
function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const stats = [
    { value: 2400, suffix: "+", label: "Sites analyzed" },
    { value: 147, suffix: "", label: "Avg. keywords tracked per site" },
    { value: 14, suffix: " days", label: "Average time to page 1" },
  ];

  return (
    <motion.div
      ref={ref}
      className="mx-auto mt-20 max-w-3xl px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="grid grid-cols-3 gap-6 sm:gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
          >
            <p className="font-heading text-2xl font-bold text-[#2563EB] sm:text-3xl">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-[11px] text-[#6B6B6B] sm:text-[12px]">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Hero Section ───────────────────────────────────────────── */
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
      className="relative overflow-hidden px-4 pt-28 pb-8 sm:px-6 sm:pt-36 sm:pb-12 md:pt-44"
      style={{ backgroundColor: "#FAFAF7" }}
    >
      {/* Animated gradient mesh background */}
      <motion.div className="absolute inset-0 overflow-hidden" style={{ opacity: bgOpacity }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #EFF6FF 0%, #FAFAF7 25%, #F0FDF4 50%, #FAFAF7 75%, #EFF6FF 100%)",
            backgroundSize: "400% 400%",
            animation: "gradientShift 15s ease infinite",
          }}
        />
        {/* Floating orbs */}
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)", left: "20%", top: "30%" }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #6EE7B7 0%, transparent 70%)", right: "15%", top: "20%" }}
          animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-36 h-36 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)", right: "30%", bottom: "20%" }}
          animate={{ x: [0, 15, -10, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Text — parallax layer */}
      <motion.div className="relative z-10 mx-auto max-w-3xl text-center" style={{ y: textY }}>
        {/* Headline */}
        <motion.h1
          className="font-heading text-4xl font-bold leading-[1.08] tracking-tight text-[#1A1A1A] sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Rank everywhere.{" "}
          <span className="relative inline-block text-[#2563EB]">
            Autonomously
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
          .
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#6B6B6B] sm:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Your AI SEO partner. Tell it what to rank — it handles the rest across
          Google, YouTube, Amazon, TikTok, and AI Search.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="/onboarding"
            className="group inline-flex items-center gap-2.5 rounded-lg bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700"
          >
            Start ranking free
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>

          <a
            href="#proof"
            className="inline-flex items-center gap-2 rounded-lg border border-[#E8E5E0] bg-white px-6 py-3.5 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#9B9B9B] hover:text-[#1A1A1A]"
          >
            See results
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-5 text-xs text-[#9B9B9B]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Free to start · No credit card · Results in 2 weeks
        </motion.p>

        {/* Platform row */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {["Google", "YouTube", "Amazon", "TikTok", "AI Search"].map((name) => (
            <span
              key={name}
              className="text-xs font-medium tracking-wide text-[#9B9B9B]"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Dashboard Mockup */}
      <DashboardMockup />

      {/* Social Proof */}
      <SocialProof />
    </section>
  );
}
