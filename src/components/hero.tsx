"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ─── Platform Icons (Professional SVGs) ────────────────────── */

function GoogleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function YouTubeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81z" fill="#FF0000"/>
      <path d="M9.75 15.02 15.75 12 9.75 8.98v6.04z" fill="#FFFFFF"/>
    </svg>
  );
}

function AmazonIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M.05 18.47c.08-.1.2-.1.36-.02 3.7 2.13 7.72 3.2 12.06 3.2 2.9 0 5.76-.54 8.58-1.63l.3-.13c.27-.12.45-.02.25.2-.2.2-.45.4-.7.6-2.64 1.96-5.73 2.93-9.24 2.93-4.05 0-7.77-1.36-11.17-4.09-.22-.17-.36-.3-.44-.36a.23.23 0 0 1 0-.3v-.4z" fill="#FF9900"/>
    </svg>
  );
}

function TikTokIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#010101"/>
    </svg>
  );
}

function AISeoIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
      <path d="M16 14H8a6 6 0 0 0-6 6v1h20v-1a6 6 0 0 0-6-6z"/>
    </svg>
  );
}

function KeywordIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>
    </svg>
  );
}

function ContentIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}

function TechIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  );
}

function SiteIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function BacklinkIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function ShopifyIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#95BF47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

/* ─── Orbit Visualization ──────────────────────────────────── */
// Uses an SVG-based approach for perfect scaling and positioning
function OrbitViz() {
  // Node data: angle in degrees, orbit ring (1=inner, 2=main, 3=outer)
  const orbitNodes = [
    { angle: 0, ring: 2, size: 48, delay: 0, icon: <GoogleIcon size={22} />, label: "Google", glow: "#4285F4" },
    { angle: 60, ring: 2, size: 44, delay: 0.2, icon: <YouTubeIcon size={20} />, label: "YouTube", glow: "#FF0000" },
    { angle: 120, ring: 2, size: 46, delay: 0.4, icon: <AmazonIcon size={20} />, label: "Amazon", glow: "#FF9900" },
    { angle: 180, ring: 2, size: 42, delay: 0.6, icon: <TikTokIcon size={18} />, label: "TikTok", glow: "#FE2C55" },
    { angle: 240, ring: 2, size: 44, delay: 0.8, icon: <AISeoIcon size={20} />, label: "AI Search", glow: "#8B5CF6" },
    { angle: 300, ring: 2, size: 40, delay: 1.0, icon: <ShopifyIcon size={18} />, label: "Shopify", glow: "#95BF47" },
    // Outer orbit — secondary SEO elements
    { angle: 30, ring: 3, size: 36, delay: 0.3, icon: <KeywordIcon size={16} />, label: "Keywords", glow: "#10B981" },
    { angle: 90, ring: 3, size: 34, delay: 0.5, icon: <ContentIcon size={16} />, label: "Content", glow: "#F59E0B" },
    { angle: 150, ring: 3, size: 36, delay: 0.7, icon: <TechIcon size={16} />, label: "Analytics", glow: "#60A5FA" },
    { angle: 210, ring: 3, size: 32, delay: 0.9, icon: <SiteIcon size={14} />, label: "Site Audit", glow: "#FB923C" },
    { angle: 270, ring: 3, size: 34, delay: 1.1, icon: <BacklinkIcon size={16} />, label: "Backlinks", glow: "#A78BFA" },
    { angle: 330, ring: 3, size: 32, delay: 1.3, icon: <AISeoIcon size={14} />, label: "On-Page", glow: "#EC4899" },
  ];

  // SVG viewBox is 500x500, center at 250,250
  const cx = 250;
  const cy = 250;
  const ringRadii = { 1: 70, 2: 135, 3: 210 };

  return (
    <div className="relative mx-auto mt-8 h-[320px] w-[320px] sm:mt-12 sm:h-[460px] sm:w-[460px] md:h-[540px] md:w-[540px]">
      {/* Full SVG-based orbit — scales automatically */}
      <svg
        viewBox="0 0 500 500"
        className="h-full w-full"
        style={{ overflow: "visible" }}
      >
        {/* Orbit rings */}
        <circle cx={cx} cy={cy} r={ringRadii[1]} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={ringRadii[2]} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" strokeDasharray="6 4" />
        <circle cx={cx} cy={cy} r={ringRadii[3]} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Connection lines from center to main orbit nodes */}
        {orbitNodes.filter(n => n.ring === 2).map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = cx + Math.cos(rad) * ringRadii[2];
          const y = cy + Math.sin(rad) * ringRadii[2];
          return (
            <motion.line
              key={`line-${i}`}
              x1={cx} y1={cy} x2={x} y2={y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 + i * 0.15 }}
            />
          );
        })}

        {/* Center glow */}
        <defs>
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor="rgba(37,99,235,0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r="45" fill="url(#centerGlow)" />

        {/* Center logo */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <rect
            x={cx - 22} y={cy - 22}
            width="44" height="44"
            rx="10" ry="10"
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
          <polyline
            points={`${cx - 6},${cy + 2} ${cx - 1},${cy + 7} ${cx + 6},${cy - 4}`}
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Orbit nodes */}
        {orbitNodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const r = ringRadii[node.ring as keyof typeof ringRadii];
          const x = cx + Math.cos(rad) * r;
          const y = cy + Math.sin(rad) * r;
          const halfSize = node.size / 2;

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                // Gentle floating animation using Framer Motion
                y: [0, -3, 0, 3, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.4 + node.delay },
                scale: { duration: 0.6, delay: 0.4 + node.delay },
                y: {
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: node.delay,
                },
              }}
              style={{ cursor: "pointer" }}
            >
              {/* Background circle for the icon */}
              <rect
                x={x - halfSize / 2} y={y - halfSize / 2}
                width={node.size / 2} height={node.size / 2}
                rx="6" ry="6"
                fill={`linear-gradient(135deg, ${node.glow}18, ${node.glow}08)`}
                stroke="rgba(255,255,255,0.20)"
                strokeWidth="0.5"
              />
              {/* Use foreignObject to render React SVG icons inside SVG */}
              <foreignObject
                x={x - halfSize / 2}
                y={y - halfSize / 2}
                width={node.size / 2}
                height={node.size / 2}
              >
                <div
                  className="flex items-center justify-center w-full h-full rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${node.glow}25, ${node.glow}10)`,
                    border: "1px solid rgba(255,255,255,0.20)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div style={{ transform: `scale(${(node.size / 2) / 48})`, transformOrigin: "center" }}>
                    {node.icon}
                  </div>
                </div>
              </foreignObject>

              {/* Label */}
              <text
                x={x}
                y={y + halfSize / 2 + 10}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="8"
                fontFamily="system-ui, sans-serif"
                fontWeight="500"
              >
                {node.label}
              </text>
            </motion.g>
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
      className="relative z-10 mt-12 border-t border-white/10 pt-8 pb-4 sm:mt-16"
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
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(106,48,147,0.15) 0%, rgba(26,26,46,0.4) 50%, rgba(255,216,168,0.1) 100%)",
            backgroundSize: "200% 200%",
            animation: "gradientShift 15s ease infinite",
          }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,216,168,0.2) 0%, transparent 70%)", left: "10%", top: "15%" }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(106,48,147,0.25) 0%, transparent 70%)", right: "10%", top: "25%" }}
          animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />
      </motion.div>

      {/* ── Content ── */}
      <motion.div className="relative z-10 mx-auto max-w-3xl text-center" style={{ y: textY }}>
        <div className="h-24 sm:h-32 md:h-36" />

        {/* Badge */}
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#6EE7B7] animate-pulse" />
          <span className="text-[11px] font-medium text-white/70">AI-powered multi-platform SEO</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-heading text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Rank everywhere.{" "}
          <span className="relative inline-block">
            Autonomously
            <svg className="absolute -bottom-1 left-0 w-full overflow-visible" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ height: "0.12em" }}>
              <motion.path d="M2,8 C40,3 80,11 120,6 C150,2 175,9 198,5" stroke="#6EE7B7" strokeWidth="3" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8, ease: "easeOut" }} />
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

        {/* CTA */}
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
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

        <motion.p className="mt-5 text-xs text-white/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          Free to start · No credit card · Results in 2 weeks
        </motion.p>
      </motion.div>

      {/* Orbit Visualization */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <OrbitViz />
      </motion.div>

      <PartnerStrip />
    </section>
  );
}
