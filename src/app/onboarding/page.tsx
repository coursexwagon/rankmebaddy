"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A
// Accent: #00D4AA (turquoise)

const TOTAL_STEPS = 4;

/* ─── Types ──────────────────────────────────────────────────── */
interface SiteData {
  url: string;
  domain: string;
  title: string | null;
  description: string | null;
  ogImage: string | null;
  favicon: string | null;
  lang: string | null;
  h1: string | null;
  siteName: string | null;
  themeColor: string | null;
  screenshot: string;
}

/* ─── Underline ─────────────────────────────────────────────── */
function UnderlinedWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg
        className="absolute -bottom-0.5 left-0 w-full overflow-visible"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        style={{ height: "0.1em" }}
      >
        <motion.path
          d="M2,8 C40,3 80,11 120,6 C150,2 175,9 198,5"
          stroke="#00D4AA"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}

/* ─── Progress Bar ───────────────────────────────────────────── */
function ProgressBar({ step }: { step: number }) {
  const pct = Math.min((step / TOTAL_STEPS) * 100, 100);
  return (
    <div className="mx-auto mb-10 flex items-center gap-3">
      <div className="h-[2px] flex-1 rounded-full bg-[#27272A]">
        <motion.div
          className="h-[2px] rounded-full bg-[#00D4AA]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        />
      </div>
      <span className="text-[11px] tabular-nums text-[#52525B]">
        {step}/{TOTAL_STEPS}
      </span>
    </div>
  );
}

/* ─── Input ──────────────────────────────────────────────────── */
function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  autoFocus = false,
  onKeyDown,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      autoFocus={autoFocus}
      className="w-full rounded-xl border border-[#27272A] bg-[#18181B]/60 px-4 py-3.5 text-sm text-[#FAFAFA] placeholder:text-[#52525B] outline-none transition-all focus:border-[#00D4AA]/40 focus:bg-[#18181B] focus:shadow-[0_0_20px_-5px_rgba(110,231,183,0.08)]"
    />
  );
}

/* ─── CTA Button ─────────────────────────────────────────────── */
function CtaButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}) {
  const isPrimary = variant === "primary";
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full text-sm font-semibold transition-all ${
        isPrimary ? "w-full py-3.5" : "py-2 px-4"
      } ${
        isPrimary
          ? "bg-[#00D4AA] text-[#0A0A0B] hover:bg-[#00D4AA]/90 disabled:opacity-30 disabled:hover:bg-[#00D4AA]"
          : "text-[#52525B] hover:text-[#A1A1AA]"
      }`}
      whileHover={!disabled && isPrimary ? { scale: 1.01 } : {}}
      whileTap={!disabled && isPrimary ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  );
}

/* ─── Step 1: Name + Website + Product ──────────────────────── */
function StepIntro({
  name,
  setName,
  website,
  setWebsite,
  product,
  setProduct,
  onNext,
}: {
  name: string;
  setName: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  product: string;
  setProduct: (v: string) => void;
  onNext: () => void;
}) {
  const canContinue = name.trim().length > 0;
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canContinue) onNext();
  };

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-md"
    >
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
          Let&apos;s get you <UnderlinedWord>ranking</UnderlinedWord>
        </h1>
        <p className="mt-3 text-sm text-[#71717A]">
          Tell us about you and your business. We&apos;ll do the heavy lifting.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Your name
          </label>
          <Input
            placeholder="e.g. Alex"
            value={name}
            onChange={setName}
            autoFocus
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Product or business name
          </label>
          <Input
            placeholder="e.g. My SaaS Tool"
            value={product}
            onChange={setProduct}
            onKeyDown={handleKeyDown}
          />
          <p className="text-[10px] text-[#3F3F46]">
            What are you selling or promoting? This helps us tailor your SEO strategy.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Website URL
          </label>
          <Input
            placeholder="yoursite.com"
            value={website}
            onChange={setWebsite}
            type="url"
          />
          <p className="text-[10px] text-[#3F3F46]">
            We&apos;ll scan your site for SEO insights in the next step.
          </p>
        </div>

        <div className="pt-1">
          <CtaButton onClick={onNext} disabled={!canContinue}>
            Continue
          </CtaButton>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 2: Website Scanner (REAL) ─────────────────────────── */
function StepScanner({
  name,
  website,
  setWebsite,
  siteData,
  setSiteData,
  onNext,
  onBack,
}: {
  name: string;
  website: string;
  setWebsite: (v: string) => void;
  siteData: SiteData | null;
  setSiteData: (d: SiteData | null) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [scanStep, setScanStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const scanSite = useCallback(async () => {
    if (!website.trim()) return;

    // Normalize URL
    let url = website.trim();
    if (!url.startsWith("http")) url = "https://" + url;
    if (!url.includes(".")) {
      setError("Enter a valid URL with a domain");
      return;
    }

    setScanning(true);
    setError("");
    setSiteData(null);
    setScanStep(0);

    // Animate scan steps
    const stepTimers = [
      setTimeout(() => setScanStep(1), 400),
      setTimeout(() => setScanStep(2), 1000),
      setTimeout(() => setScanStep(3), 1600),
    ];

    try {
      const res = await fetch(`/api/scan?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setScanning(false);
        stepTimers.forEach(clearTimeout);
        return;
      }

      // Wait for minimum animation time
      await new Promise((r) => setTimeout(r, 2200));
      stepTimers.forEach(clearTimeout);

      setSiteData(data);
      setScanning(false);
    } catch {
      setError("Could not reach that site. Check the URL and try again.");
      setScanning(false);
      stepTimers.forEach(clearTimeout);
    }
  }, [website, setSiteData]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !scanning) scanSite();
  };

  const canContinue = siteData !== null;

  // Auto-scan when the step loads if there's already a URL
  useEffect(() => {
    if (website.trim().includes(".")) {
      const t = setTimeout(scanSite, 600);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      key="scanner"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-lg"
    >
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
          <UnderlinedWord>Scan</UnderlinedWord> your site
        </h1>
        <p className="mt-3 text-sm text-[#71717A]">
          We&apos;ll pull in everything we need — title, description, screenshots — to build your SEO strategy.
        </p>
      </div>

      {/* URL input + scan button */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="yoursite.com"
            value={website}
            onChange={(v) => {
              setWebsite(v);
              setSiteData(null);
              setError("");
            }}
            autoFocus
            onKeyDown={handleKeyDown}
          />
        </div>
        <motion.button
          onClick={scanSite}
          disabled={scanning || !website.trim()}
          className="shrink-0 rounded-xl bg-[#00D4AA] px-5 py-3.5 text-sm font-semibold text-[#0A0A0B] transition-all hover:bg-[#00D4AA]/90 disabled:opacity-40"
          whileHover={!scanning ? { scale: 1.02 } : {}}
          whileTap={!scanning ? { scale: 0.98 } : {}}
        >
          {scanning ? (
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-[#0A0A0B]/30 border-t-[#0A0A0B]"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            "Scan"
          )}
        </motion.button>
      </div>

      {/* Scanning progress */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            className="mt-5 space-y-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {[
              { label: "Connecting to site...", done: scanStep >= 1 },
              { label: "Extracting metadata...", done: scanStep >= 2 },
              { label: "Capturing screenshot...", done: scanStep >= 3 },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                className="flex items-center gap-2.5 rounded-lg border border-[#27272A]/40 bg-[#18181B]/30 px-4 py-2.5"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                {step.done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-[#00D4AA]"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                )}
                <span className={`text-[12px] ${step.done ? "text-[#00D4AA]" : "text-[#71717A]"}`}>
                  {step.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <motion.div
          className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[12px] text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Result Card — the good stuff */}
      <AnimatePresence>
        {siteData && !scanning && (
          <motion.div
            className="mt-5 overflow-hidden rounded-2xl border border-[#27272A]/60 bg-[#18181B]/60"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {/* Screenshot preview */}
            <div className="relative h-40 w-full overflow-hidden bg-[#0A0A0B]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteData.screenshot}
                alt={`Screenshot of ${siteData.domain}`}
                className="h-full w-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {/* Domain badge overlay */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-[#0A0A0B]/80 px-2.5 py-1 backdrop-blur-sm">
                {siteData.favicon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={siteData.favicon}
                    alt=""
                    className="h-3.5 w-3.5 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <span className="text-[11px] font-medium text-[#FAFAFA]">
                  {siteData.domain}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3 p-4">
              {siteData.title && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#52525B]">
                    Title
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[#FAFAFA] line-clamp-2">
                    {siteData.title}
                  </p>
                </div>
              )}

              {siteData.description && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#52525B]">
                    Description
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#A1A1AA] line-clamp-2">
                    {siteData.description}
                  </p>
                </div>
              )}

              {/* Quick stats row */}
              <div className="flex flex-wrap gap-2 pt-1">
                {siteData.h1 && siteData.h1.trim() && (
                  <span className="rounded-full border border-[#27272A] bg-[#18181B] px-2.5 py-1 text-[10px] text-[#71717A]">
                    H1: {siteData.h1.length > 30 ? siteData.h1.slice(0, 30) + "..." : siteData.h1}
                  </span>
                )}
                {siteData.lang && siteData.lang.trim() && (
                  <span className="rounded-full border border-[#27272A] bg-[#18181B] px-2.5 py-1 text-[10px] text-[#71717A]">
                    Lang: {siteData.lang}
                  </span>
                )}
                {siteData.ogImage && (
                  <span className="rounded-full border border-[#00D4AA]/20 bg-[#00D4AA]/5 px-2.5 py-1 text-[10px] text-[#00D4AA]">
                    OG Image found
                  </span>
                )}
                {siteData.themeColor && (
                  <span className="flex items-center gap-1.5 rounded-full border border-[#27272A] bg-[#18181B] px-2.5 py-1 text-[10px] text-[#71717A]">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full border border-white/10"
                      style={{ backgroundColor: siteData.themeColor }}
                    />
                    Theme
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex gap-3">
        <CtaButton onClick={onBack} variant="ghost">
          Back
        </CtaButton>
        <div className="flex-1">
          <CtaButton onClick={onNext} disabled={!canContinue}>
            Continue
          </CtaButton>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Platform Data ──────────────────────────────────────────── */
const platforms = [
  {
    id: "google",
    name: "Google",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
    color: "#4285F4",
    desc: "Search & Maps",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81z" fill="#FF0000" />
        <path d="M9.75 15.02 15.75 12 9.75 8.98v6.04z" fill="#FAFAFA" />
      </svg>
    ),
    color: "#FF0000",
    desc: "Video SEO",
  },
  {
    id: "amazon",
    name: "Amazon",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M.05 18.47c.08-.1.2-.1.36-.02 3.7 2.13 7.72 3.2 12.06 3.2 2.9 0 5.76-.54 8.58-1.63l.3-.13c.27-.12.45-.02.25.2-.2.2-.45.4-.7.6-2.64 1.96-5.73 2.93-9.24 2.93-4.05 0-7.77-1.36-11.17-4.09-.22-.17-.36-.3-.44-.36a.23.23 0 0 1 0-.3v-.4z" fill="#FF9900" />
        <path d="M15.05 9.3c0-.94.17-1.76.5-2.44.34-.7.8-1.24 1.38-1.62.58-.38 1.24-.57 1.96-.57.58 0 1.08.12 1.5.35.42.23.74.55.96.95V2.2c0-.13.04-.24.13-.33.09-.09.2-.13.33-.13h2c.13 0 .24.04.33.13.09.09.13.2.13.33v14.73c0 .13-.04.24-.13.33-.09.09-.2.13-.33.13h-2.07c-.13 0-.24-.04-.33-.13a.45.45 0 0 1-.13-.33v-.96c-.22.4-.55.72-.97.96-.43.24-.93.36-1.52.36-.7 0-1.34-.19-1.92-.57-.58-.38-1.04-.92-1.38-1.62-.33-.7-.5-1.52-.5-2.46v-.47z" fill="#FAFAFA" />
        <path d="M6.75 14.5c-.12 0-.22-.04-.3-.13a.41.41 0 0 1-.12-.3V6.8c0-.12.04-.22.12-.3.08-.08.18-.12.3-.12h2.08c.12 0 .22.04.3.12.08.08.12.18.12.3v.63c.36-.55.84-.96 1.43-1.24.59-.28 1.27-.42 2.03-.42.12 0 .22.04.3.12.08.08.12.18.12.3v1.88c0 .12-.04.22-.12.3-.08.08-.18.12-.3.12h-1.03c-.74 0-1.32.2-1.73.6-.41.4-.62 1-.62 1.78v3.5c0 .12-.04.22-.12.3-.08.08-.18.13-.3.13H6.75z" fill="#FAFAFA" />
      </svg>
    ),
    color: "#FF9900",
    desc: "Product listings",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#FAFAFA" />
      </svg>
    ),
    color: "#FE2C55",
    desc: "Content strategy",
  },
  {
    id: "aisearch",
    name: "AI Search",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    color: "#A1A1AA",
    desc: "ChatGPT & Perplexity",
  },
];

/* ─── Step 3: Platform Selection ─────────────────────────────── */
function StepPlatforms({
  selected,
  onToggle,
  onNext,
  onBack,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canContinue = selected.length > 0;

  return (
    <motion.div
      key="platforms"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-lg"
    >
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
          Where do you want to <UnderlinedWord>rank</UnderlinedWord>?
        </h1>
        <p className="mt-3 text-sm text-[#71717A]">
          Pick the platforms you care about. You can add more later.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {platforms.map((p, i) => {
          const isActive = selected.includes(p.id);
          return (
            <motion.button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className={`group relative flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                isActive
                  ? "border-[#00D4AA]/30 bg-[#00D4AA]/[0.04]"
                  : "border-[#27272A] bg-[#18181B]/40 hover:border-[#3F3F46]"
              }`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 + i * 0.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${p.color}10` }}
              >
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#FAFAFA]">{p.name}</p>
                <p className="text-[10px] text-[#71717A]">{p.desc}</p>
              </div>
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                  isActive
                    ? "border-[#00D4AA] bg-[#00D4AA]"
                    : "border-[#27272A] bg-transparent"
                }`}
              >
                {isActive && (
                  <motion.svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0A0A0B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.p
        className="mt-4 text-center text-[11px] text-[#52525B]"
        key={selected.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {selected.length === 0
          ? "Pick at least one platform"
          : selected.length === 1
          ? "1 platform selected"
          : `${selected.length} platforms — going wide`}
      </motion.p>

      <div className="mt-5 flex gap-3">
        <CtaButton onClick={onBack} variant="ghost">
          Back
        </CtaButton>
        <div className="flex-1">
          <CtaButton onClick={onNext} disabled={!canContinue}>
            Continue
          </CtaButton>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 4: First Keyword ─────────────────────────────────── */
function StepKeyword({
  keyword,
  setKeyword,
  context,
  setContext,
  onNext,
  onBack,
  siteData,
}: {
  keyword: string;
  setKeyword: (v: string) => void;
  context: string;
  setContext: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  siteData: SiteData | null;
}) {
  const canContinue = keyword.trim().length > 0;
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHints(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Smart hints based on what they type or their site data
  const shortName = siteData?.domain?.split(".")[0] || "tool";
  const baseHints = siteData?.domain
    ? [
        `"${siteData.domain} alternative"`,
        `"best ${shortName}"`,
        `"${siteData.domain} reviews"`,
      ]
    : ['"best protein powder"', '"vegan meal delivery"', '"project management tool"'];

  const hints = keyword.trim().length > 2
    ? [`"best ${keyword.trim()}"`, `"${keyword.trim()} near me"`, `"${keyword.trim()} reviews"`]
    : baseHints;

  return (
    <motion.div
      key="keyword"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-md"
    >
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
          Your first <UnderlinedWord>campaign</UnderlinedWord>
        </h1>
        <p className="mt-3 text-sm text-[#71717A]">
          What keyword or topic do you want to rank for? We&apos;ll generate the
          strategy and content to get you there.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Keyword or topic
          </label>
          <Input
            placeholder='e.g. "best protein powder"'
            value={keyword}
            onChange={setKeyword}
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter" && canContinue) onNext(); }}
          />
          <AnimatePresence>
            {showHints && keyword.trim().length <= 2 && (
              <motion.div
                className="flex flex-wrap gap-2 pt-1"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {hints.map((h) => (
                  <button
                    key={h}
                    onClick={() => setKeyword(h.replace(/"/g, ""))}
                    className="rounded-full border border-[#27272A] bg-[#18181B]/40 px-3 py-1.5 text-[11px] text-[#71717A] transition-colors hover:border-[#3F3F46] hover:text-[#A1A1AA]"
                  >
                    {h}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Anything else?{" "}
            <span className="normal-case tracking-normal font-normal text-[#52525B]">
              (optional)
            </span>
          </label>
          <textarea
            placeholder="e.g. We're a new brand, competing against big names..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-[#27272A] bg-[#18181B]/60 px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#52525B] outline-none transition-colors focus:border-[#00D4AA]/40 focus:bg-[#18181B]"
          />
        </div>

        {/* Site context hint */}
        {siteData && (
          <motion.div
            className="rounded-xl border border-[#27272A]/60 bg-[#18181B]/30 px-4 py-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[11px] text-[#52525B]">
              <span className="font-medium text-[#71717A]">SEO context from your site:</span>{" "}
              {siteData.title
                ? `We see "${siteData.title.slice(0, 50)}" — we'll factor this into your strategy.`
                : `We've scanned ${siteData.domain} and will use what we found.`}
            </p>
          </motion.div>
        )}

        <div className="flex gap-3 pt-1">
          <CtaButton onClick={onBack} variant="ghost">
            Back
          </CtaButton>
          <div className="flex-1">
            <CtaButton onClick={onNext} disabled={!canContinue}>
              Launch campaign
            </CtaButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 5: Done ───────────────────────────────────────────── */
function StepDone({ name, keyword, siteData, website, product, platforms, context }: { name: string; keyword: string; siteData: SiteData | null; website: string; product: string; platforms: string[]; context: string }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      key="done"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-md text-center"
    >
      <AnimatePresence mode="wait">
        {phase === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-4"
          >
            <motion.div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#00D4AA]/20 bg-[#00D4AA]/5"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="h-6 w-6 rounded-full border-2 border-[#00D4AA]/30 border-t-[#00D4AA]"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            <p className="text-sm text-[#71717A]">
              Analyzing &ldquo;{keyword}&rdquo; across your platforms...
            </p>

            <div className="space-y-2">
              {["Scanning search volume...", "Finding keyword gaps...", "Building strategy..."].map((text, i) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-2.5 rounded-lg border border-[#27272A]/40 bg-[#18181B]/30 px-4 py-2.5"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.4 }}
                >
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-[#00D4AA]"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                  <span className="text-[12px] text-[#71717A]">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success check */}
            <motion.div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#00D4AA]/30 bg-[#00D4AA]/5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00D4AA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M20 6L9 17l-5-5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </motion.svg>
            </motion.div>

            <h1 className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
              You&apos;re all set, {name.split(" ")[0]}
            </h1>
            <p className="mt-3 text-sm text-[#71717A]">
              Your campaign for &ldquo;{keyword}&rdquo; is ready.
              Keywords, content, and implementation steps are waiting.
            </p>

            {/* Stats preview */}
            <motion.div
              className="mt-6 grid grid-cols-3 gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { label: "Keywords", value: "147" },
                { label: "Gaps found", value: "23" },
                { label: "Content pieces", value: "12" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="rounded-xl border border-[#27272A]/60 bg-[#18181B]/40 px-3 py-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <p className="font-heading text-xl font-bold text-[#00D4AA]">{stat.value}</p>
                  <p className="text-[10px] text-[#52525B]">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <CtaButton
                onClick={() => {
                  // Save onboarding data for the dashboard
                  try {
                    localStorage.setItem(
                      "rankmebaddy_onboarding",
                      JSON.stringify({
                        name: name,
                        website: website,
                        product: product,
                        siteData: siteData,
                        platforms: platforms,
                        keyword: keyword,
                        context: context,
                      })
                    );
                  } catch {
                    // Storage might be full or blocked
                  }
                  window.location.href = "/dashboard";
                }}
              >
                Open my dashboard
              </CtaButton>
            </motion.div>

            {/* What's next */}
            <motion.div
              className="mt-6 space-y-2 text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3F3F46]">
                What happens next
              </p>
              {[
                "Review your keyword map and competitor gaps",
                "Apply the optimized titles & descriptions",
                "Follow the step-by-step implementation guide",
                "Watch your rankings climb",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg border border-[#27272A]/30 bg-[#18181B]/20 px-3 py-2.5"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.08 }}
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00D4AA]/10 text-[9px] font-bold text-[#00D4AA] mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-[11px] text-[#71717A]">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Onboarding Page ───────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [product, setProduct] = useState("");
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["google"]);
  const [keyword, setKeyword] = useState("");
  const [context, setContext] = useState("");

  // Auth check — redirect to /auth if not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  // Pre-fill name from auth user metadata
  useEffect(() => {
    if (user && !name) {
      const authName = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
      if (authName) setName(authName);
    }
  }, [user, name]);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0A0A0B" }}>
        <div className="h-6 w-6 rounded-full border-2 border-[#27272A] border-t-[#00D4AA] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <section
      className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner accent */}
      <div className="pointer-events-none absolute top-0 right-0 h-[300px] w-[300px]">
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "radial-gradient(circle at top right, rgba(110,231,183,0.03) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Back to home */}
        {step > 1 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-[11px] text-[#52525B] transition-colors hover:text-[#71717A]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to home
            </a>
          </motion.div>
        )}

        <ProgressBar step={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepIntro
              name={name}
              setName={setName}
              website={website}
              setWebsite={setWebsite}
              product={product}
              setProduct={setProduct}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepScanner
              name={name.split(" ")[0] || "there"}
              website={website}
              setWebsite={setWebsite}
              siteData={siteData}
              setSiteData={setSiteData}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepPlatforms
              selected={selectedPlatforms}
              onToggle={togglePlatform}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <StepKeyword
              keyword={keyword}
              setKeyword={setKeyword}
              context={context}
              setContext={setContext}
              onNext={() => setStep(5)}
              onBack={() => setStep(3)}
              siteData={siteData}
            />
          )}
          {step === 5 && (
            <StepDone name={name} keyword={keyword} siteData={siteData} website={website} product={product} platforms={selectedPlatforms} context={context} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
