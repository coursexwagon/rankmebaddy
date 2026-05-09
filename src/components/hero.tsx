"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

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

/* ─── Network Visualization ──────────────────────────────────── */
function NetworkViz() {
  const nodes = [
    { angle: 0, radius: 140, size: 36, delay: 0, label: "G", color: "#4285F4" },
    { angle: 72, radius: 140, size: 32, delay: 0.3, label: "YT", color: "#FF0000" },
    { angle: 144, radius: 140, size: 30, delay: 0.6, label: "A", color: "#FF9900" },
    { angle: 216, radius: 140, size: 34, delay: 0.9, label: "TT", color: "#FE2C55" },
    { angle: 288, radius: 140, size: 28, delay: 1.2, label: "AI", color: "#8B5CF6" },
    { angle: 36, radius: 200, size: 22, delay: 0.5, label: "K", color: "#6EE7B7" },
    { angle: 108, radius: 200, size: 20, delay: 0.8, label: "C", color: "#F59E0B" },
    { angle: 180, radius: 200, size: 24, delay: 1.1, label: "T", color: "#60A5FA" },
    { angle: 252, radius: 200, size: 18, delay: 1.4, label: "S", color: "#A78BFA" },
    { angle: 324, radius: 200, size: 22, delay: 1.7, label: "B", color: "#FB923C" },
  ];

  return (
    <div className="relative mx-auto mt-12 h-[340px] w-[340px] sm:mt-16 sm:h-[440px] sm:w-[440px] md:h-[500px] md:w-[500px]">
      {/* Concentric rings */}
      {[80, 140, 200, 260].map((r, i) => (
        <div
          key={`ring-${r}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            width: r * 2,
            height: r * 2,
            borderColor: i % 2 === 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
            animation: i % 2 === 0 ? "ringRotate 40s linear infinite" : "ringRotateReverse 35s linear infinite",
          }}
        >
          {/* Ring dot markers */}
          {[0, 90, 180, 270].map((deg) => (
            <div
              key={deg}
              className="absolute h-1 w-1 rounded-full bg-white/20"
              style={{
                left: `${50 + 50 * Math.cos((deg * Math.PI) / 180)}%`,
                top: `${50 + 50 * Math.sin((deg * Math.PI) / 180)}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
      ))}

      {/* Center stat */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="animate-pulse-glow rounded-full bg-white/10 px-6 py-4 backdrop-blur-sm border border-white/10">
          <p className="font-heading text-3xl font-bold text-white sm:text-4xl">20k+</p>
          <p className="text-[10px] uppercase tracking-widest text-white/60 sm:text-[11px]">SEO Campaigns</p>
        </div>
      </motion.div>

      {/* Floating specialist nodes */}
      {nodes.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = Math.cos(rad) * node.radius;
        const y = Math.sin(rad) * node.radius;
        const floatClass = i % 3 === 0 ? "animate-float" : i % 3 === 1 ? "animate-float-slow" : "animate-float-reverse";

        return (
          <motion.div
            key={i}
            className={`absolute left-1/2 top-1/2 z-10 ${floatClass}`}
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              animationDelay: `${node.delay}s`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + node.delay }}
          >
            <div
              className="flex items-center justify-center rounded-full border border-white/20 backdrop-blur-sm"
              style={{
                width: node.size,
                height: node.size,
                background: `radial-gradient(circle at 30% 30%, ${node.color}40, ${node.color}15)`,
                boxShadow: `0 0 20px ${node.color}25, 0 0 40px ${node.color}10`,
              }}
            >
              <span className="text-[9px] font-bold text-white/90">{node.label}</span>
            </div>
          </motion.div>
        );
      })}

      {/* Connection lines (SVG) */}
      <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
        {nodes.slice(0, 5).map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = 50 + (Math.cos(rad) * node.radius) / 5;
          const y = 50 + (Math.sin(rad) * node.radius) / 5;
          return (
            <motion.line
              key={`line-${i}`}
              x1="50%"
              y1="50%"
              x2={`${x}%`}
              y2={`${y}%`}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.15 }}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Partner Logos Strip ────────────────────────────────────── */
function PartnerStrip() {
  const partners = [
    "Shopify", "Webflow", "WordPress", "Wix", "Squarespace", "Ghost", "Next.js",
  ];

  return (
    <motion.div
      className="relative z-10 mt-16 border-t border-white/10 pt-8 pb-4 sm:mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      <p className="mb-5 text-center text-[10px] uppercase tracking-[0.2em] text-white/30">
        Trusted by teams on
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4">
        {partners.map((name, i) => (
          <motion.span
            key={name}
            className="text-sm font-medium text-white/25 transition-colors hover:text-white/40"
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

/* ─── Social Proof Stats ─────────────────────────────────────── */
function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const stats = [
    { value: 2400, suffix: "+", label: "Sites analyzed" },
    { value: 147, suffix: "", label: "Avg. keywords tracked" },
    { value: 14, suffix: " days", label: "Avg. time to page 1" },
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
      className="relative overflow-hidden px-4 pb-8 sm:px-6 sm:pb-12"
    >
      {/* ── Rich gradient background ── */}
      <motion.div className="absolute inset-0" style={{ opacity: bgOpacity }}>
        {/* Main gradient: warm peach → deep purple → dark navy */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 30%, rgba(255,216,168,0.35) 0%, transparent 50%),
              radial-gradient(ellipse 60% 50% at 80% 20%, rgba(106,48,147,0.3) 0%, transparent 50%),
              radial-gradient(ellipse 90% 70% at 50% 80%, rgba(26,26,46,0.9) 0%, transparent 60%),
              linear-gradient(160deg, #FFD8A8 0%, #E8A0BF 20%, #6A3093 50%, #1A1A2E 85%)
            `,
          }}
        />

        {/* Animated gradient overlay that shifts */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(106,48,147,0.15) 0%, rgba(26,26,46,0.4) 50%, rgba(255,216,168,0.1) 100%)",
            backgroundSize: "200% 200%",
            animation: "gradientShift 15s ease infinite",
          }}
        />

        {/* Floating orbs — subtle glow effects */}
        <motion.div
          className="absolute w-72 h-72 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,216,168,0.2) 0%, transparent 70%)",
            left: "10%", top: "15%",
          }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(106,48,147,0.25) 0%, transparent 70%)",
            right: "10%", top: "25%",
          }}
          animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-44 h-44 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
            right: "25%", bottom: "15%",
          }}
          animate={{ x: [0, 15, -10, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
      </motion.div>

      {/* ── Content ── */}
      <motion.div className="relative z-10 mx-auto max-w-3xl text-center" style={{ y: textY }}>
        {/* Nav spacer */}
        <div className="h-24 sm:h-32 md:h-36" />

        {/* Headline — WHITE text on gradient */}
        <motion.h1
          className="font-heading text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Rank everywhere.{" "}
          <span className="relative inline-block">
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
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Your AI SEO partner. Tell it what to rank — it handles the rest across
          Google, YouTube, Amazon, TikTok, and AI Search.
        </motion.p>

        {/* CTA — dark button with white text and arrow */}
        <motion.div
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="/onboarding"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#1A1A2E] shadow-lg shadow-black/20 transition-all hover:bg-white/90 hover:shadow-xl hover:shadow-black/30"
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
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-medium text-white/70 backdrop-blur-sm transition-colors hover:border-white/30 hover:text-white"
          >
            See results
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-5 text-xs text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Free to start · No credit card · Results in 2 weeks
        </motion.p>
      </motion.div>

      {/* Network Visualization */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <NetworkViz />
      </motion.div>

      {/* Partner logos strip */}
      <PartnerStrip />

      {/* ── Below-fold transition: beige background starts ── */}
      <SocialProof />
    </section>
  );
}
