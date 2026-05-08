"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A
// Accent: #6EE7B7 (emerald-300)

const TOTAL_STEPS = 5;

/* ─── Mascot Component ──────────────────────────────────────── */
function Mascot({ mood = "wave", size = 80 }: { mood?: string; size?: number }) {
  const bounce = mood === "wave" ? [0, -6, 0] : mood === "excited" ? [0, -12, 0, -8, 0] : [0];
  const rotate = mood === "wave" ? [0, 5, 0, -5, 0] : mood === "excited" ? [0, -3, 0, 3, 0] : [0];

  return (
    <motion.div
      className="relative"
      animate={{ y: bounce, rotate }}
      transition={{ duration: mood === "excited" ? 0.6 : 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image
        src="/mascot.png"
        alt="RankMeBaddy mascot"
        width={size}
        height={size}
        className="drop-shadow-lg"
        priority
      />
      {/* Speech bubble tail — only shown when mascot is "talking" */}
      {(mood === "wave" || mood === "excited") && (
        <motion.div
          className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#18181B] border-b border-r border-[#27272A]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        />
      )}
    </motion.div>
  );
}

/* ─── Speech Bubble ─────────────────────────────────────────── */
function SpeechBubble({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      className="relative rounded-2xl border border-[#27272A] bg-[#18181B] px-5 py-4"
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <p className="text-sm leading-relaxed text-[#A1A1AA]">{children}</p>
    </motion.div>
  );
}

/* ─── Typing Indicator ──────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-[#6EE7B7]"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

/* ─── Progress Dots ─────────────────────────────────────────── */
function ProgressDots({ step }: { step: number }) {
  return (
    <div className="mx-auto mb-8 flex items-center gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const idx = i + 1;
        const isActive = idx === step;
        const isDone = idx < step;
        return (
          <motion.div
            key={idx}
            className="relative flex items-center justify-center"
            animate={{ width: isActive ? 28 : 8, height: 8 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div
              className={`h-full w-full rounded-full transition-colors duration-300 ${
                isDone
                  ? "bg-[#6EE7B7]"
                  : isActive
                  ? "bg-[#6EE7B7]/40"
                  : "bg-[#27272A]"
              }`}
            />
            {isDone && (
              <motion.svg
                className="absolute inset-0 m-auto"
                width="10"
                height="10"
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
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Custom Input ───────────────────────────────────────────── */
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
      className="w-full rounded-xl border border-[#27272A] bg-[#18181B]/60 px-4 py-3.5 text-sm text-[#FAFAFA] placeholder:text-[#52525B] outline-none transition-all focus:border-[#6EE7B7]/40 focus:bg-[#18181B] focus:shadow-[0_0_20px_-5px_rgba(110,231,183,0.1)]"
    />
  );
}

/* ─── CTA Button ─────────────────────────────────────────────── */
function CtaButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const isPrimary = variant === "primary";
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative rounded-full text-sm font-semibold transition-all ${isPrimary ? "w-full py-3.5" : "py-2 px-4"} ${className} ${
        isPrimary
          ? "bg-[#6EE7B7] text-[#0A0A0B] hover:bg-[#6EE7B7]/90 disabled:opacity-30 disabled:hover:bg-[#6EE7B7]"
          : "text-[#52525B] hover:text-[#A1A1AA]"
      }`}
      whileHover={!disabled && isPrimary ? { scale: 1.01 } : {}}
      whileTap={!disabled && isPrimary ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
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

/* ─── Fake "Scanning" Animation ─────────────────────────────── */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#6EE7B7]/40 to-transparent"
      initial={{ top: "0%" }}
      animate={{ top: "100%" }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Step 0: Welcome ───────────────────────────────────────── */
function StepWelcome({ onNext }: { onNext: () => void }) {
  const [showBubble, setShowBubble] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowBubble(true), 600);
    const t2 = setTimeout(() => setShowButton(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-sm text-center"
    >
      {/* Mascot entrance */}
      <motion.div
        className="mb-6 flex justify-center"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      >
        <Mascot mood="wave" size={100} />
      </motion.div>

      {/* Brand name */}
      <motion.h1
        className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        Hey, I&apos;m Baddy.
      </motion.h1>

      <motion.p
        className="mt-2 text-sm text-[#71717A]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Your SEO ranking sidekick.
      </motion.p>

      {/* Speech bubble */}
      {showBubble && (
        <SpeechBubble delay={0}>
          I figure out exactly what keywords, content, and strategy you need to rank across
          Google, YouTube, Amazon, TikTok, and AI Search. You just tell me what to rank — I handle the thinking.
        </SpeechBubble>
      )}

      {/* CTA */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CtaButton onClick={onNext}>
              Let&apos;s get you ranking
            </CtaButton>
            <p className="mt-3 text-[11px] text-[#3F3F46]">
              Takes 60 seconds · No credit card
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Step 1: Name ──────────────────────────────────────────── */
function StepName({
  name,
  setName,
  onNext,
  onBack,
}: {
  name: string;
  setName: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [typedGreeting, setTypedGreeting] = useState("");
  const canContinue = name.trim().length > 0;

  // Mascot "reacts" as you type your name
  useEffect(() => {
    if (name.trim().length > 0) {
      setTypedGreeting(`Nice to meet you, ${name.trim()}!`);
    } else {
      setTypedGreeting("");
    }
  }, [name]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canContinue) onNext();
  };

  return (
    <motion.div
      key="name"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-sm"
    >
      <div className="mb-6 flex justify-center">
        <Mascot mood="wave" size={64} />
      </div>

      <SpeechBubble delay={0}>
        What should I call you?
      </SpeechBubble>

      <div className="mt-5">
        <Input
          placeholder="Your first name"
          value={name}
          onChange={setName}
          autoFocus
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Live reaction */}
      <AnimatePresence>
        {typedGreeting && (
          <motion.p
            className="mt-3 text-center text-sm text-[#6EE7B7]"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {typedGreeting} 👋
          </motion.p>
        )}
      </AnimatePresence>

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

/* ─── Step 2: Website ───────────────────────────────────────── */
function StepWebsite({
  name,
  website,
  setWebsite,
  onNext,
  onBack,
}: {
  name: string;
  website: string;
  setWebsite: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const canContinue = website.trim().length > 0;

  // Fake "scan" animation when you type a URL
  useEffect(() => {
    if (website.trim().length > 3 && website.includes(".")) {
      setIsScanning(true);
      const timer = setTimeout(() => {
        setIsScanning(false);
        const domain = website.replace(/https?:\/\//, "").replace(/\/.*/, "").replace("www.", "");
        setScanResult(`${domain} — looks good. I can work with this.`);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsScanning(false);
      setScanResult("");
    }
  }, [website]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canContinue) onNext();
  };

  return (
    <motion.div
      key="website"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-sm"
    >
      <div className="mb-6 flex justify-center">
        <Mascot mood={isScanning ? "excited" : "wave"} size={64} />
      </div>

      <SpeechBubble delay={0}>
        {name}, drop your website URL. I need to know what we&apos;re working with.
      </SpeechBubble>

      <div className="mt-5 relative">
        <Input
          placeholder="yoursite.com"
          value={website}
          onChange={setWebsite}
          type="url"
          autoFocus
          onKeyDown={handleKeyDown}
        />
        {/* Scan overlay */}
        {isScanning && (
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <ScanLine />
          </div>
        )}
      </div>

      {/* Scan result */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            className="mt-3 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TypingIndicator />
            <span className="text-[11px] text-[#52525B]">Scanning your site...</span>
          </motion.div>
        )}
        {scanResult && !isScanning && (
          <motion.div
            className="mt-3 flex items-center gap-2"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[12px] text-[#6EE7B7]">{scanResult}</span>
          </motion.div>
        )}
      </AnimatePresence>

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

/* ─── Step 3: Platform Selection ─────────────────────────────── */
function StepPlatforms({
  name,
  selected,
  onToggle,
  onNext,
  onBack,
}: {
  name: string;
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
      <div className="mb-6 flex justify-center">
        <Mascot mood="excited" size={64} />
      </div>

      <SpeechBubble delay={0}>
        Where do you want to show up, {name}? Pick your battlegrounds.
      </SpeechBubble>

      <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {platforms.map((p, i) => {
          const isActive = selected.includes(p.id);
          return (
            <motion.button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className={`group relative flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                isActive
                  ? "border-[#6EE7B7]/30 bg-[#6EE7B7]/[0.04]"
                  : "border-[#27272A] bg-[#18181B]/40 hover:border-[#3F3F46]"
              }`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 + i * 0.05 }}
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
              {/* Selection indicator */}
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                  isActive
                    ? "border-[#6EE7B7] bg-[#6EE7B7]"
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

      {/* Selection count */}
      <motion.p
        className="mt-4 text-center text-[11px] text-[#52525B]"
        key={selected.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {selected.length === 0
          ? "Pick at least one platform"
          : selected.length === 1
          ? "1 platform selected — solid start"
          : `${selected.length} platforms — we're going wide`}
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
  name,
  keyword,
  setKeyword,
  context,
  setContext,
  onNext,
  onBack,
}: {
  name: string;
  keyword: string;
  setKeyword: (v: string) => void;
  context: string;
  setContext: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canContinue = keyword.trim().length > 0;
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHints(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Generate smart hints based on what they type
  const hints = keyword.trim().length > 2
    ? [
        `"best ${keyword.trim()}"`,
        `"${keyword.trim()} near me"`,
        `"${keyword.trim()} reviews"`,
      ]
    : ['"best protein powder"', '"vegan meal delivery"', '"project management tool"'];

  return (
    <motion.div
      key="keyword"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-md"
    >
      <div className="mb-6 flex justify-center">
        <Mascot mood="excited" size={64} />
      </div>

      <SpeechBubble delay={0}>
        This is the fun part, {name}. What do you want to rank for?
      </SpeechBubble>

      <div className="mt-5 space-y-4">
        <div>
          <Input
            placeholder="e.g. best protein powder"
            value={keyword}
            onChange={setKeyword}
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter" && canContinue) onNext(); }}
          />
          {/* Quick-fill hints */}
          <AnimatePresence>
            {showHints && keyword.trim().length <= 2 && (
              <motion.div
                className="mt-2.5 flex flex-wrap gap-2"
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

        <div>
          <textarea
            placeholder="Anything else I should know? (optional)"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-[#27272A] bg-[#18181B]/60 px-4 py-3 text-sm text-[#FAFAFA] placeholder:text-[#52525B] outline-none transition-colors focus:border-[#6EE7B7]/40 focus:bg-[#18181B]"
          />
        </div>

        {/* What Baddy will do */}
        <motion.div
          className="rounded-xl border border-[#27272A]/60 bg-[#18181B]/30 px-4 py-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-[11px] text-[#52525B]">
            <span className="font-medium text-[#71717A]">Here&apos;s what I&apos;ll do:</span>{" "}
            Scan your keyword across every platform you picked, find gaps &amp; opportunities, then give you
            the exact titles, descriptions, content, and implementation steps to rank.
          </p>
        </motion.div>

        <div className="flex gap-3 pt-1">
          <CtaButton onClick={onBack} variant="ghost">
            Back
          </CtaButton>
          <div className="flex-1">
            <CtaButton onClick={onNext} disabled={!canContinue}>
              Launch my campaign
            </CtaButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 5: Done — The "Wow" Moment ───────────────────────── */
function StepDone({ name, keyword }: { name: string; keyword: string }) {
  const [phase, setPhase] = useState(0); // 0=loading, 1=results

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2000);
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
            <div className="flex justify-center">
              <Mascot mood="excited" size={80} />
            </div>
            <SpeechBubble delay={0}>
              Analyzing &ldquo;{keyword}&rdquo; across your platforms...
            </SpeechBubble>
            <div className="space-y-2">
              {["Scanning search volume...", "Finding keyword gaps...", "Building strategy..."].map((text, i) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-2.5 rounded-lg border border-[#27272A]/40 bg-[#18181B]/30 px-4 py-2.5"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.5 }}
                >
                  <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-[#6EE7B7]"
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
            {/* Success mascot */}
            <motion.div
              className="mx-auto mb-5 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Mascot mood="excited" size={80} />
            </motion.div>

            <h1 className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
              You&apos;re live, {name.split(" ")[0]}!
            </h1>
            <p className="mt-3 text-sm text-[#71717A]">
              Your campaign for &ldquo;{keyword}&rdquo; is ready. Keywords, content, and implementation
              steps are waiting for you.
            </p>

            {/* Quick stats preview */}
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
                  <p className="font-heading text-xl font-bold text-[#6EE7B7]">{stat.value}</p>
                  <p className="text-[10px] text-[#52525B]">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA to dashboard */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <CtaButton onClick={() => (window.location.href = "/")}>
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
                "Apply the optimized titles & descriptions I wrote for you",
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
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#6EE7B7]/10 text-[9px] font-bold text-[#6EE7B7] mt-0.5">
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
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["google"]);
  const [keyword, setKeyword] = useState("");
  const [context, setContext] = useState("");

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Current step number for progress (step 0 is welcome, doesn't count)
  const progressStep = step === 0 ? 1 : step;

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
        {/* Back to home link */}
        {step > 0 && (
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

        {/* Progress dots */}
        {step > 0 && <ProgressDots step={progressStep} />}

        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepWelcome onNext={() => setStep(1)} />
          )}
          {step === 1 && (
            <StepName
              name={name}
              setName={setName}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <StepWebsite
              name={name.split(" ")[0] || "there"}
              website={website}
              setWebsite={setWebsite}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepPlatforms
              name={name.split(" ")[0] || "there"}
              selected={selectedPlatforms}
              onToggle={togglePlatform}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <StepKeyword
              name={name.split(" ")[0] || "there"}
              keyword={keyword}
              setKeyword={setKeyword}
              context={context}
              setContext={setContext}
              onNext={() => setStep(5)}
              onBack={() => setStep(3)}
            />
          )}
          {step === 5 && (
            <StepDone name={name} keyword={keyword} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
