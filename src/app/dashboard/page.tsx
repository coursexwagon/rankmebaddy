"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A
// Accent: #6EE7B7 (emerald-300)

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

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface OnboardingData {
  name: string;
  website: string;
  siteData: SiteData | null;
  platforms: string[];
  keyword: string;
  context: string;
}

/* ─── Sidebar Nav Items ─────────────────────────────────────── */
const navItems = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "keywords",
    label: "Keywords",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 21-4.35-4.35" />
        <circle cx="11" cy="11" r="8" />
      </svg>
    ),
  },
  {
    id: "rankings",
    label: "Rankings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
  },
  {
    id: "content",
    label: "Content",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
    ),
  },
  {
    id: "competitors",
    label: "Competitors",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

/* ─── Quick Action Chips ────────────────────────────────────── */
const quickActions = [
  { label: "Keyword gaps", prompt: "What keyword gaps should I target for my site?" },
  { label: "Optimize my titles", prompt: "Review and optimize my page titles for better SEO" },
  { label: "Competitor analysis", prompt: "Who are my top competitors and what are they ranking for?" },
  { label: "Content ideas", prompt: "Give me content ideas that could rank for my target keyword" },
];

/* ─── Platform Icons ────────────────────────────────────────── */
function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "google":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      );
    case "youtube":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81z" fill="#FF0000" />
          <path d="M9.75 15.02 15.75 12 9.75 8.98v6.04z" fill="#FAFAFA" />
        </svg>
      );
    case "amazon":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M.05 18.47c.08-.1.2-.1.36-.02 3.7 2.13 7.72 3.2 12.06 3.2 2.9 0 5.76-.54 8.58-1.63l.3-.13c.27-.12.45-.02.25.2-.2.2-.45.4-.7.6-2.64 1.96-5.73 2.93-9.24 2.93-4.05 0-7.77-1.36-11.17-4.09-.22-.17-.36-.3-.44-.36a.23.23 0 0 1 0-.3v-.4z" fill="#FF9900" />
        </svg>
      );
    case "tiktok":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#FAFAFA" />
        </svg>
      );
    case "aisearch":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Setup Animation ───────────────────────────────────────── */
function SetupScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing your site structure...",
    "Mapping keyword opportunities...",
    "Scanning competitor landscape...",
    "Building your strategy...",
  ];

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setStep(i), i * 600)
    );
    const done = setTimeout(onComplete, steps.length * 600 + 800);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#0A0A0B" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-sm text-center">
        {/* Animated ring */}
        <motion.div
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#6EE7B7]/20 bg-[#6EE7B7]/5"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="h-8 w-8 rounded-full border-2 border-[#6EE7B7]/30 border-t-[#6EE7B7]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <h2 className="font-heading text-xl font-bold text-[#FAFAFA]">
          Setting up your workspace
        </h2>
        <p className="mt-2 text-sm text-[#71717A]">
          Building your SEO command center
        </p>

        <div className="mt-8 space-y-3">
          {steps.map((text, i) => (
            <motion.div
              key={text}
              className="flex items-center gap-3 rounded-lg border border-[#27272A]/40 bg-[#18181B]/30 px-4 py-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{
                opacity: step >= i ? 1 : 0,
                x: step >= i ? 0 : -12,
              }}
              transition={{ duration: 0.3 }}
            >
              {step > i ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : step === i ? (
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-[#6EE7B7]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-[#27272A]" />
              )}
              <span
                className={`text-[12px] ${
                  step > i
                    ? "text-[#6EE7B7]"
                    : step === i
                    ? "text-[#A1A1AA]"
                    : "text-[#3F3F46]"
                }`}
              >
                {text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Sidebar ───────────────────────────────────────────────── */
function Sidebar({
  siteData,
  activeSection,
  onSectionChange,
  userName,
  platforms,
  mobileOpen,
  onMobileClose,
}: {
  siteData: SiteData | null;
  activeSection: string;
  onSectionChange: (id: string) => void;
  userName: string;
  platforms: string[];
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 sm:py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6EE7B7]/10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="font-heading text-sm font-bold text-[#FAFAFA]">
          RankMeBaddy
        </span>
      </div>

      {/* Site Card */}
      {siteData && (
        <div className="mx-3 mb-3 overflow-hidden rounded-xl border border-[#27272A]/60 bg-[#18181B]/60">
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            {siteData.favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={siteData.favicon}
                alt=""
                className="h-5 w-5 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded bg-[#27272A]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-[#FAFAFA]">
                {siteData.domain}
              </p>
              <p className="truncate text-[10px] text-[#52525B]">
                {siteData.title
                  ? siteData.title.slice(0, 30) + (siteData.title.length > 30 ? "..." : "")
                  : "No title detected"}
              </p>
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-[#6EE7B7]" title="Connected" />
          </div>
          {platforms.length > 0 && (
            <div className="flex items-center gap-1.5 border-t border-[#27272A]/40 px-3 py-2">
              {platforms.map((p) => (
                <PlatformIcon key={p} platform={p} />
              ))}
              <span className="ml-1 text-[9px] text-[#52525B]">
                {platforms.length} platform{platforms.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                onMobileClose();
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-all ${
                isActive
                  ? "bg-[#6EE7B7]/[0.06] text-[#6EE7B7]"
                  : "text-[#71717A] hover:bg-[#18181B]/60 hover:text-[#A1A1AA]"
              }`}
            >
              <span className={isActive ? "text-[#6EE7B7]" : "text-[#52525B]"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-[#27272A]/40 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6EE7B7]/10 text-[11px] font-bold text-[#6EE7B7]">
            {userName ? userName[0].toUpperCase() : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-[#FAFAFA]">
              {userName || "User"}
            </p>
            <p className="text-[10px] text-[#52525B]">Free plan</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-[220px] shrink-0 border-r border-[#27272A]/40 bg-[#0A0A0B] sm:flex sm:flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0A0A0B] sm:hidden"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Chat Message ──────────────────────────────────────────── */
function ChatMessageComponent({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          isUser
            ? "bg-[#18181B] text-[#A1A1AA]"
            : "bg-[#6EE7B7]/10 text-[#6EE7B7]"
        }`}
      >
        {isUser ? "You" : "R"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "rounded-tr-sm bg-[#18181B] text-[#FAFAFA]"
            : "rounded-tl-sm border border-[#27272A]/40 bg-[#0A0A0B] text-[#A1A1AA]"
        }`}
      >
        <div className="text-[13px] leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        <p
          className={`mt-1.5 text-[10px] ${
            isUser ? "text-[#52525B]" : "text-[#3F3F46]"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Site Context Card ─────────────────────────────────────── */
function SiteContextCard({ siteData }: { siteData: SiteData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="overflow-hidden rounded-xl border border-[#27272A]/60 bg-[#18181B]/40"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Screenshot preview */}
      <div className="relative h-28 w-full overflow-hidden bg-[#0A0A0B]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={siteData.screenshot}
          alt={`Screenshot of ${siteData.domain}`}
          className="h-full w-full object-cover object-top"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181B] via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
          {siteData.favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={siteData.favicon}
              alt=""
              className="h-3 w-3 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <span className="text-[10px] font-medium text-[#FAFAFA]">
            {siteData.domain}
          </span>
        </div>
      </div>

      {/* Quick metadata */}
      <div className="space-y-2 p-3">
        {siteData.title && (
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#52525B]">
              Title
            </p>
            <p className="text-[11px] text-[#A1A1AA] line-clamp-2">
              {siteData.title}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {siteData.ogImage && (
            <span className="rounded-full border border-[#6EE7B7]/20 bg-[#6EE7B7]/5 px-2 py-0.5 text-[9px] text-[#6EE7B7]">
              OG Image
            </span>
          )}
          {siteData.h1 && (
            <span className="rounded-full border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[9px] text-[#71717A]">
              H1 set
            </span>
          )}
          {siteData.lang && (
            <span className="rounded-full border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[9px] text-[#71717A]">
              {siteData.lang}
            </span>
          )}
          {siteData.themeColor && (
            <span className="flex items-center gap-1 rounded-full border border-[#27272A] bg-[#18181B] px-2 py-0.5 text-[9px] text-[#71717A]">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: siteData.themeColor }}
              />
              Theme
            </span>
          )}
        </div>

        {/* Expand for description */}
        {siteData.description && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] text-[#52525B] hover:text-[#71717A] transition-colors"
            >
              {expanded ? "Less" : "More details"}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-[10px] text-[#71717A] leading-relaxed">
                    {siteData.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#27272A]/60 bg-[#18181B]/40 p-3.5">
      <p
        className={`font-heading text-xl font-bold ${
          accent ? "text-[#6EE7B7]" : "text-[#FAFAFA]"
        }`}
      >
        {value}
      </p>
      <p className="text-[10px] text-[#52525B]">{label}</p>
      {sub && <p className="mt-0.5 text-[9px] text-[#3F3F46]">{sub}</p>}
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────── */
export default function DashboardPage() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [setup, setSetup] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load onboarding data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("rankmebaddy_onboarding");
      if (stored) {
        const data = JSON.parse(stored) as OnboardingData;
        setOnboardingData(data);
      }
    } catch {
      // No onboarding data — they might have navigated directly
    }
  }, []);

  // Generate welcome message after setup
  useEffect(() => {
    if (!setup && onboardingData && messages.length === 0) {
      const name = onboardingData.name?.split(" ")[0] || "there";
      const domain = onboardingData.siteData?.domain || "your site";
      const keyword = onboardingData.keyword || "your target keyword";

      const welcomeMsg: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content: `Hey ${name}! I've finished analyzing ${domain}.\n\nHere's what I found:\n\n• ${
          onboardingData.siteData?.title
            ? `Your page title is "${onboardingData.siteData.title.slice(0, 60)}" — ${
                onboardingData.siteData.title.length > 60
                  ? "it's a bit long, we should trim it"
                  : "good length"
              }`
            : "No page title detected — this is critical for SEO"
        }\n• ${
          onboardingData.siteData?.description
            ? "Meta description is set"
            : "No meta description — we need to add one"
        }\n• ${
          onboardingData.siteData?.ogImage
            ? "OG image is configured for social sharing"
            : "Missing OG image — social shares will look bare"
        }\n• ${
          onboardingData.siteData?.h1
            ? `H1 tag found: "${onboardingData.siteData.h1.slice(0, 40)}"`
            : "No H1 tag found — search engines use this"
        }\n\nI'm ready to help you rank for "${keyword}" across ${
          onboardingData.platforms?.length || 1
        } platform${onboardingData.platforms?.length !== 1 ? "s" : ""}. What would you like to tackle first?`,
        timestamp: new Date(),
      };

      setMessages([welcomeMsg]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setup, onboardingData]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isSending) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsSending(true);

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }

      try {
        const chatMessages = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: chatMessages,
            siteData: onboardingData?.siteData,
            keyword: onboardingData?.keyword,
            platforms: onboardingData?.platforms,
            userName: onboardingData?.name,
          }),
        });

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "Something went wrong. Could you try that again? If it keeps happening, there might be a connection issue.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsSending(false);
      }
    },
    [messages, isSending, onboardingData]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // If no onboarding data, redirect
  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = localStorage.getItem("rankmebaddy_onboarding");
      if (!stored) {
        window.location.href = "/onboarding";
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  /* ─── Setup screen ─── */
  if (setup && onboardingData) {
    return (
      <AnimatePresence>
        <SetupScreen onComplete={() => setSetup(false)} />
      </AnimatePresence>
    );
  }

  /* ─── Loading ─── */
  if (!onboardingData) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "#0A0A0B" }}
      >
        <motion.div
          className="h-6 w-6 rounded-full border-2 border-[#27272A] border-t-[#6EE7B7]"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const siteData = onboardingData.siteData;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      {/* Sidebar */}
      <Sidebar
        siteData={siteData}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        userName={onboardingData.name}
        platforms={onboardingData.platforms || []}
        mobileOpen={mobileSidebar}
        onMobileClose={() => setMobileSidebar(false)}
      />

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-[#27272A]/40 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#27272A] sm:hidden"
              onClick={() => setMobileSidebar(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div>
              <h1 className="font-heading text-sm font-bold text-[#FAFAFA] capitalize">
                {activeSection}
              </h1>
              <p className="text-[10px] text-[#52525B]">
                {siteData?.domain || "No site connected"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle context panel */}
            <button
              onClick={() => setShowContext(!showContext)}
              className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] transition-all sm:flex ${
                showContext
                  ? "border-[#6EE7B7]/20 bg-[#6EE7B7]/5 text-[#6EE7B7]"
                  : "border-[#27272A] text-[#71717A] hover:text-[#A1A1AA]"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
              </svg>
              Context
            </button>

            {/* New chat */}
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1.5 rounded-lg border border-[#27272A] px-2.5 py-1.5 text-[11px] text-[#71717A] transition-colors hover:text-[#A1A1AA]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              New chat
            </button>
          </div>
        </header>

        {/* Content area */}
        <div className="flex min-h-0 flex-1">
          {/* Chat area */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="mx-auto max-w-2xl space-y-5">
                {messages.map((msg) => (
                  <ChatMessageComponent key={msg.id} message={msg} />
                ))}

                {/* Typing indicator */}
                {isSending && (
                  <motion.div
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6EE7B7]/10 text-[10px] font-bold text-[#6EE7B7]">
                      R
                    </div>
                    <div className="rounded-2xl rounded-tl-sm border border-[#27272A]/40 bg-[#0A0A0B] px-4 py-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-[#6EE7B7]/40"
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Quick actions (show when chat is empty-ish) */}
            {messages.length <= 1 && (
              <div className="border-t border-[#27272A]/20 px-4 py-3 sm:px-6">
                <div className="mx-auto flex max-w-2xl flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => sendMessage(action.prompt)}
                      disabled={isSending}
                      className="rounded-full border border-[#27272A] bg-[#18181B]/40 px-3 py-1.5 text-[11px] text-[#71717A] transition-all hover:border-[#3F3F46] hover:text-[#A1A1AA] disabled:opacity-40"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input bar */}
            <div className="border-t border-[#27272A]/40 px-4 py-3 sm:px-6">
              <div className="mx-auto max-w-2xl">
                <div className="flex items-end gap-2 rounded-xl border border-[#27272A] bg-[#18181B]/60 px-4 py-2.5 transition-colors focus-within:border-[#6EE7B7]/30">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isSending
                        ? "Thinking..."
                        : "Ask about keywords, rankings, content..."
                    }
                    disabled={isSending}
                    rows={1}
                    className="max-h-[120px] min-h-[20px] flex-1 resize-none bg-transparent text-[13px] text-[#FAFAFA] placeholder:text-[#52525B] outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={() => sendMessage(inputValue)}
                    disabled={!inputValue.trim() || isSending}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6EE7B7] transition-all hover:bg-[#6EE7B7]/90 disabled:opacity-30"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0A0A0B"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[9px] text-[#3F3F46]">
                  RankMeBaddy may produce inaccurate info. Verify important details.
                </p>
              </div>
            </div>
          </div>

          {/* Right context panel */}
          <AnimatePresence>
            {showContext && siteData && (
              <motion.aside
                className="hidden w-[280px] shrink-0 overflow-y-auto border-l border-[#27272A]/40 bg-[#0A0A0B] p-4 lg:block"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <div className="space-y-4">
                  {/* Site Context */}
                  <SiteContextCard siteData={siteData} />

                  {/* Quick Stats */}
                  <div>
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-[#52525B]">
                      SEO Overview
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <StatCard
                        label="Keywords"
                        value="147"
                        sub="23 high-opportunity"
                        accent
                      />
                      <StatCard
                        label="Rankings"
                        value="12"
                        sub="Tracked positions"
                      />
                      <StatCard
                        label="Content"
                        value="8"
                        sub="Optimization tasks"
                      />
                      <StatCard
                        label="Score"
                        value="72"
                        sub="Out of 100"
                        accent
                      />
                    </div>
                  </div>

                  {/* Active Campaign */}
                  {onboardingData.keyword && (
                    <div>
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-[#52525B]">
                        Active Campaign
                      </p>
                      <div className="rounded-xl border border-[#27272A]/60 bg-[#18181B]/40 p-3">
                        <p className="text-[12px] font-medium text-[#FAFAFA]">
                          &ldquo;{onboardingData.keyword}&rdquo;
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1 flex-1 rounded-full bg-[#27272A]">
                            <div
                              className="h-1 rounded-full bg-[#6EE7B7]"
                              style={{ width: "35%" }}
                            />
                          </div>
                          <span className="text-[9px] text-[#52525B]">35%</span>
                        </div>
                        <p className="mt-1 text-[9px] text-[#52525B]">
                          Strategy in progress
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Platforms */}
                  {onboardingData.platforms &&
                    onboardingData.platforms.length > 0 && (
                      <div>
                        <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-[#52525B]">
                          Target Platforms
                        </p>
                        <div className="space-y-1.5">
                          {onboardingData.platforms.map((p) => (
                            <div
                              key={p}
                              className="flex items-center gap-2 rounded-lg border border-[#27272A]/40 bg-[#18181B]/20 px-3 py-2"
                            >
                              <PlatformIcon platform={p} />
                              <span className="text-[11px] capitalize text-[#A1A1AA]">
                                {p === "aisearch" ? "AI Search" : p}
                              </span>
                              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#6EE7B7]" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
