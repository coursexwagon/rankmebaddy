"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #FAFAF7  |  Surface: #FFFFFF  |  Border: #E8E5E0
// Text Primary: #1A1A1A  |  Secondary: #6B6B6B  |  Muted: #9B9B9B
// Accent: #2563EB (blue-600)  |  Accent Light: #EFF6FF (blue-50)
// Success: #16A34A  |  Error: #DC2626  |  Warning: #D97706
// Surface Hover: #F5F5F0

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

interface AgentAction {
  type: string;
  label: string;
  prompt: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  actions?: AgentAction[];
}

interface OnboardingData {
  name: string;
  website: string;
  siteData: SiteData | null;
  platforms: string[];
  keyword: string;
  context: string;
}

interface KeywordItem {
  keyword: string;
  volume: string;
  difficulty: string;
  intent: string;
  status: "opportunity" | "ranking" | "gap" | "tracked";
}

interface RankingEntry {
  keyword: string;
  position: number;
  previousPosition: number;
  url: string;
  platform: string;
}

interface ContentItem {
  title: string;
  type: "blog" | "page" | "product" | "video";
  score: number;
  status: "optimize" | "publish" | "update" | "draft";
  url?: string;
}

/* ─── Sidebar Nav Items ─────────────────────────────────────── */
const navItems = [
  {
    id: "chat",
    label: "Chat",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
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
  { label: "Optimize titles", prompt: "Review and optimize my page titles for better SEO" },
  { label: "Competitor analysis", prompt: "Who are my top SEO competitors and what are they ranking for?" },
  { label: "Content ideas", prompt: "Give me content ideas that could rank for my target keyword" },
];

/* ─── Agent Thinking Steps ──────────────────────────────────── */
const agentThinkingSteps = [
  "Analyzing your site...",
  "Researching keywords...",
  "Checking competitors...",
  "Evaluating content...",
  "Building recommendations...",
];

/* ─── Platform Icons ────────────────────────────────────────── */
function PlatformIcon({ platform, size = 14 }: { platform: string; size?: number }) {
  switch (platform) {
    case "google":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      );
    case "youtube":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81z" fill="#FF0000" />
          <path d="M9.75 15.02 15.75 12 9.75 8.98v6.04z" fill="#FFFFFF" />
        </svg>
      );
    case "amazon":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M.05 18.47c.08-.1.2-.1.36-.02 3.7 2.13 7.72 3.2 12.06 3.2 2.9 0 5.76-.54 8.58-1.63l.3-.13c.27-.12.45-.02.25.2-.2.2-.45.4-.7.6-2.64 1.96-5.73 2.93-9.24 2.93-4.05 0-7.77-1.36-11.17-4.09-.22-.17-.36-.3-.44-.36a.23.23 0 0 1 0-.3v-.4z" fill="#FF9900" />
        </svg>
      );
    case "tiktok":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#1A1A1A" />
        </svg>
      );
    case "aisearch":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Agent Step Indicator (static, no animation) ────────────── */
function AgentStepIndicator({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  const displayStep = currentStep % steps.length;
  return (
    <div className="flex items-center gap-2 text-[12px] text-[#6B6B6B]">
      <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
      <span className="flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        {steps[displayStep]}
      </span>
    </div>
  );
}

/* ─── Action Buttons ────────────────────────────────────────── */
function ActionButtons({ actions, onAction }: { actions: AgentAction[]; onAction: (prompt: string) => void }) {
  if (!actions || actions.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((action) => (
        <motion.button
          key={action.type}
          onClick={() => onAction(action.prompt)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#F5F0EB] px-3 py-1.5 text-[11px] font-medium text-[#1A1A1A] transition-all hover:bg-[#EDE8E2] border-l-[3px] border-l-blue-600"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
          {action.label}
        </motion.button>
      ))}
    </div>
  );
}

/* ─── Clean Markdown ──────────────────────────────────────────── */
function cleanMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/* ─── Step Visualization ────────────────────────────────────── */
function StepContent({ content }: { content: string }) {
  // Clean markdown first, then parse
  const cleaned = cleanMarkdown(content);
  const lines = cleaned.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stepMatch = line.match(/^(\d+)\.\s+(.+)/);

    if (stepMatch) {
      const stepNum = parseInt(stepMatch[1]);
      elements.push(
        <div key={`step-${i}`} className="flex items-start gap-2.5 my-1.5">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600 mt-0.5">
            {stepNum}
          </div>
          <span className="text-[14px] text-[#1A1A1A] leading-relaxed">{stepMatch[2]}</span>
        </div>
      );
    } else if (line.startsWith("• ") || line.startsWith("- ")) {
      elements.push(
        <div key={`bullet-${i}`} className="flex items-start gap-2 my-0.5 ml-0">
          <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#9B9B9B]" />
          <span className="text-[14px] text-[#1A1A1A] leading-relaxed">{line.slice(2)}</span>
        </div>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={`br-${i}`} className="h-1" />);
    } else {
      // Check if line is ALL CAPS (likely a section header from the AI)
      const isAllCaps = line.length > 2 && line === line.toUpperCase() && /[A-Z]/.test(line);
      if (isAllCaps) {
        elements.push(
          <h3 key={`h-${i}`} className="text-[14px] font-bold text-[#1A1A1A] mt-2.5 mb-1">{line}</h3>
        );
      } else {
        elements.push(
          <span key={`text-${i}`} className="text-[14px] text-[#1A1A1A] leading-relaxed block">{line}</span>
        );
      }
    }
  }

  return <div className="space-y-0.5">{elements}</div>;
}

/* ─── Setup Animation ───────────────────────────────────────── */
function SetupScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

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
    const done = setTimeout(() => onCompleteRef.current(), steps.length * 600 + 800);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, []);

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#FAFAF7" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-sm text-center">
        <motion.div
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-blue-200 bg-blue-50"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="h-8 w-8 rounded-full border-2 border-blue-200 border-t-blue-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <h2 className="font-heading text-xl font-bold text-[#1A1A1A]">
          Setting up your workspace
        </h2>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Building your SEO command center
        </p>

        <div className="mt-8 space-y-3">
          {steps.map((text, i) => (
            <motion.div
              key={text}
              className="flex items-center gap-3 rounded-xl border border-[#E8E5E0] bg-white px-4 py-3 shadow-sm"
              initial={{ opacity: 0, x: -12 }}
              animate={{
                opacity: step >= i ? 1 : 0,
                x: step >= i ? 0 : -12,
              }}
              transition={{ duration: 0.3 }}
            >
              {step > i ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : step === i ? (
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-blue-600"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-[#E8E5E0]" />
              )}
              <span
                className={`text-[12px] ${
                  step > i ? "text-[#16A34A]" : step === i ? "text-[#6B6B6B]" : "text-[#9B9B9B]"
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
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="font-heading text-sm font-bold text-[#1A1A1A]">
          RankMeBaddy
        </span>
      </div>

      {/* Site Card */}
      {siteData && (
        <div className="mx-3 mb-3 overflow-hidden rounded-xl border border-[#E8E5E0] bg-white shadow-sm">
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            {siteData.favicon ? (
              <img
                src={siteData.favicon}
                alt=""
                className="h-5 w-5 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded bg-[#F5F5F0]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9B9B9B" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                </svg>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-[#1A1A1A]">
                {siteData.domain}
              </p>
              <p className="truncate text-[10px] text-[#9B9B9B]">
                {siteData.title
                  ? siteData.title.slice(0, 28) + (siteData.title.length > 28 ? "..." : "")
                  : "No title detected"}
              </p>
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" title="Connected" />
          </div>
          {platforms.length > 0 && (
            <div className="flex items-center gap-1.5 border-t border-[#E8E5E0] px-3 py-2">
              {platforms.map((p) => (
                <PlatformIcon key={p} platform={p} />
              ))}
              <span className="ml-1 text-[9px] text-[#9B9B9B]">
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
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-[#6B6B6B] hover:bg-[#F5F5F0] hover:text-[#1A1A1A]"
              }`}
            >
              <span className={isActive ? "text-blue-600" : "text-[#9B9B9B]"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-[#E8E5E0] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
            {userName ? userName[0].toUpperCase() : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-[#1A1A1A]">
              {userName || "User"}
            </p>
            <p className="text-[10px] text-[#9B9B9B]">Free plan</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-[220px] shrink-0 border-r border-[#E8E5E0] bg-white sm:flex sm:flex-col">
        {sidebarContent}
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-white shadow-xl sm:hidden"
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
function ChatBubble({ message, onAction }: { message: ChatMessage; onAction: (prompt: string) => void }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          isUser ? "bg-[#E8E5E0] text-[#6B6B6B]" : "bg-blue-50 text-blue-600"
        }`}
      >
        {isUser ? "You" : "R"}
      </div>
      <div
        className={`max-w-[85%] ${
          isUser
            ? "rounded-xl bg-[#F5F0EB] text-[#1A1A1A] px-5 py-3.5"
            : "rounded-xl bg-[#FAF8F5] text-[#1A1A1A] px-5 py-3.5 border-l-[3px] border-l-blue-600"
        }`}
      >
        {isUser ? (
          <div className="text-[14px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        ) : (
          <StepContent content={message.content} />
        )}
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-[#9B9B9B]">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        {!isUser && message.actions && message.actions.length > 0 && (
          <ActionButtons actions={message.actions} onAction={onAction} />
        )}
      </div>
    </motion.div>
  );
}

/* ─── Overview Section ──────────────────────────────────────── */
function OverviewSection({ siteData, keyword, platforms, onNavigate }: {
  siteData: SiteData;
  keyword: string;
  platforms: string[];
  onNavigate: (id: string) => void;
}) {
  const seoScore = [
    siteData.title ? 20 : 0,
    siteData.description ? 20 : 0,
    siteData.h1 ? 15 : 0,
    siteData.ogImage ? 15 : 0,
    siteData.lang ? 10 : 0,
    siteData.favicon ? 10 : 0,
    10, // base
  ].reduce((a, b) => a + b, 0);

  const issues: { type: "error" | "warning" | "good"; text: string }[] = [];
  if (!siteData.title) issues.push({ type: "error", text: "Missing page title" });
  else if (siteData.title.length > 60) issues.push({ type: "warning", text: "Title is too long (over 60 chars)" });
  else issues.push({ type: "good", text: "Title tag is set" });

  if (!siteData.description) issues.push({ type: "error", text: "Missing meta description" });
  else if (siteData.description.length > 160) issues.push({ type: "warning", text: "Description is too long (over 160 chars)" });
  else issues.push({ type: "good", text: "Meta description is set" });

  if (!siteData.h1) issues.push({ type: "error", text: "Missing H1 tag" });
  else issues.push({ type: "good", text: "H1 tag is set" });

  if (!siteData.ogImage) issues.push({ type: "warning", text: "Missing OG image for social sharing" });
  else issues.push({ type: "good", text: "OG image configured" });

  if (!siteData.lang) issues.push({ type: "warning", text: "Missing language attribute" });
  else issues.push({ type: "good", text: "Language attribute set" });

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">
          SEO Overview
        </h2>
        <p className="text-[12px] text-[#6B6B6B]">
          Real-time analysis of {siteData.domain}
        </p>
      </div>

      {/* Score + Stats Row */}
      <div className="grid gap-4 sm:grid-cols-4">
        {/* Score Ring */}
        <motion.div
          className="flex flex-col items-center justify-center rounded-xl border border-[#E8E5E0] bg-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex h-20 w-20 items-center justify-center">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#E8E5E0" strokeWidth="5" />
              <motion.circle
                cx="40" cy="40" r="34" fill="none"
                stroke={seoScore >= 70 ? "#2563EB" : seoScore >= 40 ? "#D97706" : "#DC2626"}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${(seoScore / 100) * 213.6} 213.6`}
                initial={{ strokeDasharray: "0 213.6" }}
                animate={{ strokeDasharray: `${(seoScore / 100) * 213.6} 213.6` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </svg>
            <span className="absolute font-heading text-xl font-bold text-[#1A1A1A]">{seoScore}</span>
          </div>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-[#9B9B9B]">SEO Score</p>
        </motion.div>

        {/* Stats */}
        {[
          { label: "Keywords", value: "147", sub: "23 opportunities", accent: true, onClick: () => onNavigate("keywords") },
          { label: "Rankings", value: "12", sub: "Tracked positions", accent: false, onClick: () => onNavigate("rankings") },
          { label: "Content", value: "8", sub: "Optimization tasks", accent: false, onClick: () => onNavigate("content") },
        ].map((stat, i) => (
          <motion.button
            key={stat.label}
            onClick={stat.onClick}
            className="rounded-xl border border-[#E8E5E0] bg-white p-4 text-left shadow-sm transition-colors hover:border-[#9B9B9B]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
          >
            <p className={`font-heading text-2xl font-bold ${stat.accent ? "text-blue-600" : "text-[#1A1A1A]"}`}>
              {stat.value}
            </p>
            <p className="text-[10px] text-[#9B9B9B]">{stat.label}</p>
            <p className="mt-0.5 text-[9px] text-[#9B9B9B]">{stat.sub}</p>
          </motion.button>
        ))}
      </div>

      {/* Issues + Campaign */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* SEO Issues */}
        <motion.div
          className="rounded-xl border border-[#E8E5E0] bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#9B9B9B]">
            Site Issues
          </h3>
          <div className="space-y-2.5">
            {issues.map((issue) => (
              <div key={issue.text} className="flex items-start gap-2">
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                  issue.type === "error" ? "bg-red-500" : issue.type === "warning" ? "bg-amber-500" : "bg-green-500"
                }`} />
                <span className={`text-[12px] ${
                  issue.type === "error" ? "text-red-600" : issue.type === "warning" ? "text-amber-600" : "text-[#6B6B6B]"
                }`}>
                  {issue.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active Campaign */}
        <motion.div
          className="rounded-xl border border-[#E8E5E0] bg-white p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#9B9B9B]">
            Active Campaign
          </h3>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-[13px] font-medium text-[#1A1A1A]">
              &ldquo;{keyword}&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-blue-100">
                <motion.div
                  className="h-1.5 rounded-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: "35%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-[10px] text-[#6B6B6B]">35%</span>
            </div>
            <p className="mt-2 text-[10px] text-[#6B6B6B]">
              Strategy in progress — {platforms.length} platform{platforms.length !== 1 ? "s" : ""} targeted
            </p>
          </div>
        </motion.div>
      </div>

      {/* Site Screenshot */}
      <motion.div
        className="overflow-hidden rounded-xl border border-[#E8E5E0] bg-white shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="px-4 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#9B9B9B]">
          Site Preview
        </h3>
        <div className="relative h-48 w-full overflow-hidden bg-[#F5F5F0]">
          <img
            src={siteData.screenshot}
            alt={`Screenshot of ${siteData.domain}`}
            className="h-full w-full object-cover object-top"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
            {siteData.favicon && (
              <img
                src={siteData.favicon}
                alt=""
                className="h-3.5 w-3.5 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <span className="text-[11px] font-medium text-[#1A1A1A]">{siteData.domain}</span>
          </div>
        </div>
        {siteData.title && (
          <div className="border-t border-[#E8E5E0] px-4 py-3">
            <p className="text-[12px] font-medium text-[#1A1A1A]">{siteData.title}</p>
            {siteData.description && (
              <p className="mt-1 text-[11px] text-[#6B6B6B] line-clamp-2">{siteData.description}</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Keywords Section ──────────────────────────────────────── */
function KeywordsSection({ siteData, keyword, onAskAI }: {
  siteData: SiteData;
  keyword: string;
  onAskAI: (prompt: string) => void;
}) {
  const domainBase = siteData.domain?.split(".")[0] || "site";
  const [filter, setFilter] = useState<string>("all");

  const keywords: KeywordItem[] = [
    { keyword: keyword || domainBase, volume: "12,100", difficulty: "65", intent: "Commercial", status: "tracked" },
    { keyword: `${keyword || domainBase} alternative`, volume: "6,800", difficulty: "42", intent: "Commercial", status: "opportunity" },
    { keyword: `best ${keyword || domainBase}`, volume: "9,400", difficulty: "71", intent: "Informational", status: "gap" },
    { keyword: `${keyword || domainBase} reviews`, volume: "3,200", difficulty: "38", intent: "Commercial", status: "opportunity" },
    { keyword: `${keyword || domainBase} vs`, volume: "2,100", difficulty: "45", intent: "Commercial", status: "gap" },
    { keyword: `how to use ${keyword || domainBase}`, volume: "4,600", difficulty: "33", intent: "Informational", status: "opportunity" },
    { keyword: `${keyword || domainBase} pricing`, volume: "5,500", difficulty: "52", intent: "Transactional", status: "ranking" },
    { keyword: `${keyword || domainBase} tutorial`, volume: "1,800", difficulty: "28", intent: "Informational", status: "opportunity" },
    { keyword: `cheap ${keyword || domainBase}`, volume: "2,400", difficulty: "55", intent: "Transactional", status: "gap" },
    { keyword: `${keyword || domainBase} for beginners`, volume: "3,900", difficulty: "31", intent: "Informational", status: "opportunity" },
  ];

  const filtered = filter === "all" ? keywords : keywords.filter((k) => k.status === filter);
  const statusColors: Record<string, string> = {
    opportunity: "text-blue-600 border-blue-200 bg-blue-50",
    ranking: "text-green-600 border-green-200 bg-green-50",
    gap: "text-amber-600 border-amber-200 bg-amber-50",
    tracked: "text-[#6B6B6B] border-[#E8E5E0] bg-[#F5F5F0]",
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Keywords</h2>
          <p className="text-[12px] text-[#6B6B6B]">{keywords.length} keywords tracked for {siteData.domain}</p>
        </div>
        <button
          onClick={() => onAskAI("Find more keyword opportunities for my site beyond what's listed")}
          className="shrink-0 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-100"
        >
          + Find more
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "opportunity", "ranking", "gap", "tracked"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-[11px] capitalize transition-all ${
              filter === f
                ? "border-blue-300 bg-blue-50 text-blue-600 font-medium"
                : "border-[#E8E5E0] text-[#6B6B6B] hover:text-[#1A1A1A] hover:border-[#9B9B9B]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E8E5E0] bg-white shadow-sm">
        <div className="min-w-[540px]">
        <div className="grid grid-cols-[1fr_80px_80px_90px_90px] gap-2 border-b border-[#E8E5E0] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#9B9B9B]">
          <span>Keyword</span>
          <span>Volume</span>
          <span>Difficulty</span>
          <span>Intent</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-[#E8E5E0]">
          {filtered.map((kw, i) => (
            <motion.div
              key={kw.keyword}
              className="grid grid-cols-[1fr_80px_80px_90px_90px] gap-2 px-4 py-3 text-[12px] transition-colors hover:bg-[#F5F5F0]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <span className="font-medium text-[#1A1A1A] truncate">{kw.keyword}</span>
              <span className="text-[#6B6B6B]">{kw.volume}</span>
              <span className={parseInt(kw.difficulty) > 60 ? "text-red-600" : parseInt(kw.difficulty) > 40 ? "text-amber-600" : "text-green-600"}>
                {kw.difficulty}
              </span>
              <span className="text-[#6B6B6B]">{kw.intent}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] capitalize ${statusColors[kw.status]}`}>
                {kw.status}
              </span>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Rankings Section ──────────────────────────────────────── */
function RankingsSection({ siteData, keyword, platforms }: {
  siteData: SiteData;
  keyword: string;
  platforms: string[];
}) {
  const domainBase = siteData.domain?.split(".")[0] || "site";
  const rankings: RankingEntry[] = [
    { keyword: keyword || domainBase, position: 24, previousPosition: 31, url: "/", platform: "google" },
    { keyword: `${keyword || domainBase} pricing`, position: 8, previousPosition: 12, url: "/pricing", platform: "google" },
    { keyword: `${keyword || domainBase} review`, position: 45, previousPosition: 52, url: "/", platform: "google" },
    { keyword: `best ${keyword || domainBase}`, position: 67, previousPosition: 73, url: "/", platform: "google" },
    { keyword: `how to ${keyword || domainBase}`, position: 15, previousPosition: 18, url: "/guide", platform: "youtube" },
    { keyword: `${keyword || domainBase} tutorial`, position: 33, previousPosition: 41, url: "/tutorial", platform: "youtube" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Rankings</h2>
        <p className="text-[12px] text-[#6B6B6B]">Tracking {rankings.length} positions across {platforms.length} platform{platforms.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Avg. Position", value: "32", trend: "+5", positive: true },
          { label: "Page 1 Rankings", value: "2", trend: "+1", positive: true },
          { label: "Improving", value: "4", trend: "of 6", positive: true },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="rounded-xl border border-[#E8E5E0] bg-white p-3.5 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <p className="font-heading text-xl font-bold text-[#1A1A1A]">{stat.value}</p>
            <p className="text-[10px] text-[#9B9B9B]">{stat.label}</p>
            <p className={`mt-0.5 text-[10px] ${stat.positive ? "text-green-600" : "text-red-600"}`}>
              {stat.trend}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Ranking table */}
      <div className="overflow-x-auto rounded-xl border border-[#E8E5E0] bg-white shadow-sm">
        <div className="min-w-[480px]">
        <div className="grid grid-cols-[1fr_70px_80px_70px_60px] gap-2 border-b border-[#E8E5E0] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#9B9B9B]">
          <span>Keyword</span>
          <span>Platform</span>
          <span>Position</span>
          <span>Change</span>
          <span>URL</span>
        </div>
        <div className="divide-y divide-[#E8E5E0]">
          {rankings.map((r, i) => {
            const change = r.previousPosition - r.position;
            return (
              <motion.div
                key={`${r.keyword}-${r.platform}`}
                className="grid grid-cols-[1fr_70px_80px_70px_60px] gap-2 px-4 py-3 text-[12px] items-center transition-colors hover:bg-[#F5F5F0]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <span className="font-medium text-[#1A1A1A] truncate">{r.keyword}</span>
                <span><PlatformIcon platform={r.platform} size={16} /></span>
                <span className="text-[#1A1A1A]">#{r.position}</span>
                <span className={change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-[#6B6B6B]"}>
                  {change > 0 ? "+" : ""}{change}
                </span>
                <span className="truncate text-[#9B9B9B]">{r.url}</span>
              </motion.div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Content Section ───────────────────────────────────────── */
function ContentSection({ siteData, keyword, onAskAI }: {
  siteData: SiteData;
  keyword: string;
  onAskAI: (prompt: string) => void;
}) {
  const domainBase = siteData.domain?.split(".")[0] || "site";
  const contentItems: ContentItem[] = [
    { title: siteData.title || "Homepage", type: "page", score: siteData.title ? 72 : 25, status: siteData.title ? "optimize" : "update", url: "/" },
    { title: `The Ultimate Guide to ${keyword || domainBase}`, type: "blog", score: 0, status: "publish" },
    { title: `${keyword || domainBase} vs Competitors: 2025 Comparison`, type: "blog", score: 0, status: "publish" },
    { title: `How ${keyword || domainBase} Helps You Rank Better`, type: "blog", score: 0, status: "draft" },
    { title: `${keyword || domainBase} Tutorial for Beginners`, type: "video", score: 0, status: "draft" },
  ];

  const statusStyles: Record<string, string> = {
    optimize: "text-blue-600 border-blue-200 bg-blue-50",
    publish: "text-green-600 border-green-200 bg-green-50",
    update: "text-amber-600 border-amber-200 bg-amber-50",
    draft: "text-[#6B6B6B] border-[#E8E5E0] bg-[#F5F5F0]",
  };

  const typeIcons: Record<string, string> = {
    blog: "Blog",
    page: "Page",
    product: "Product",
    video: "Video",
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Content</h2>
          <p className="text-[12px] text-[#6B6B6B]">Content strategy and optimization tasks</p>
        </div>
        <button
          onClick={() => onAskAI("Generate a complete content calendar for my SEO campaign")}
          className="shrink-0 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-100"
        >
          + Generate plan
        </button>
      </div>

      <div className="space-y-2.5">
        {contentItems.map((item, i) => (
          <motion.div
            key={item.title}
            className="flex items-center gap-4 rounded-xl border border-[#E8E5E0] bg-white px-4 py-3.5 shadow-sm transition-colors hover:border-[#9B9B9B]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Type badge */}
            <span className="shrink-0 rounded-md border border-[#E8E5E0] bg-[#F5F5F0] px-2 py-1 text-[9px] font-semibold uppercase text-[#6B6B6B]">
              {typeIcons[item.type]}
            </span>

            {/* Title + URL */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[#1A1A1A]">{item.title}</p>
              {item.url && <p className="text-[10px] text-[#9B9B9B]">{siteData.domain}{item.url}</p>}
            </div>

            {/* Score */}
            {item.score > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 rounded-full bg-[#E8E5E0]">
                  <div
                    className={`h-1.5 rounded-full ${item.score >= 70 ? "bg-blue-600" : item.score >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#6B6B6B]">{item.score}</span>
              </div>
            )}

            {/* Status */}
            <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] capitalize ${statusStyles[item.status]}`}>
              {item.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Settings Section ──────────────────────────────────────── */
function SettingsSection({ onboardingData, onUpdateData }: {
  onboardingData: OnboardingData;
  onUpdateData: (data: OnboardingData) => void;
}) {
  const [name, setName] = useState(onboardingData.name);
  const [keyword, setKeyword] = useState(onboardingData.keyword);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated = { ...onboardingData, name, keyword };
    onUpdateData(updated);
    try {
      localStorage.setItem("rankmebaddy_onboarding", JSON.stringify(updated));
    } catch { /* ignore */ }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Settings</h2>
        <p className="text-[12px] text-[#6B6B6B]">Manage your campaign and profile</p>
      </div>

      {/* Profile */}
      <div className="space-y-4 rounded-xl border border-[#E8E5E0] bg-white p-4 shadow-sm">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#9B9B9B]">Profile</h3>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[#E8E5E0] bg-white px-3 py-2.5 text-[13px] text-[#1A1A1A] outline-none transition-colors focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Campaign */}
      <div className="space-y-4 rounded-xl border border-[#E8E5E0] bg-white p-4 shadow-sm">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#9B9B9B]">Campaign</h3>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">Primary Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full rounded-lg border border-[#E8E5E0] bg-white px-3 py-2.5 text-[13px] text-[#1A1A1A] outline-none transition-colors focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">Website</label>
          <input
            type="text"
            value={onboardingData.website}
            readOnly
            className="w-full rounded-lg border border-[#E8E5E0] bg-[#F5F5F0] px-3 py-2.5 text-[13px] text-[#9B9B9B] outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {onboardingData.platforms.map((p) => (
              <span key={p} className="flex items-center gap-1.5 rounded-full border border-[#E8E5E0] bg-[#F5F5F0] px-3 py-1 text-[11px] text-[#6B6B6B]">
                <PlatformIcon platform={p} size={12} />
                {p === "aisearch" ? "AI Search" : p.charAt(0).toUpperCase() + p.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700"
      >
        {saved ? "Saved ✓" : "Save changes"}
      </button>

      {/* Danger zone */}
      <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-red-600">Danger zone</h3>
        <p className="text-[11px] text-[#6B6B6B]">Reset all onboarding data and start over.</p>
        <button
          onClick={() => {
            localStorage.removeItem("rankmebaddy_onboarding");
            window.location.href = "/onboarding";
          }}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-[11px] text-red-600 transition-colors hover:bg-red-100"
        >
          Reset everything
        </button>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────── */
export default function DashboardPage() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [setup, setSetup] = useState(true);
  const [activeSection, setActiveSection] = useState("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [agentStep, setAgentStep] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const agentStepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load onboarding data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("rankmebaddy_onboarding");
      if (stored) {
        const data = JSON.parse(stored) as OnboardingData;
        setOnboardingData(data);
      }
    } catch { /* ignore */ }
  }, []);

  // Generate welcome message after setup
  useEffect(() => {
    if (!setup && onboardingData && messages.length === 0) {
      const name = onboardingData.name?.split(" ")[0] || "there";
      const domain = onboardingData.siteData?.domain || "your site";
      const keyword = onboardingData.keyword || "your target keyword";

      const welcomeActions: AgentAction[] = [
        { type: "keyword-gap", label: "Run keyword gap analysis", prompt: "Run a detailed keyword gap analysis for my site. Show me keywords my competitors rank for that I don't." },
        { type: "optimize-titles", label: "Optimize title tags", prompt: "Review all my page titles and suggest optimized versions with exact before/after comparisons." },
        { type: "competitor-analysis", label: "Analyze competitors", prompt: "Analyze my top SEO competitors. What are they ranking for that I'm not?" },
      ];

      const welcomeMsg: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content: `Hey ${name}! I've finished analyzing ${domain}.\n\nHere's what I found:\n\n1. ${
          onboardingData.siteData?.title
            ? `Your page title is "${onboardingData.siteData.title.slice(0, 60)}" — ${
                onboardingData.siteData.title.length > 60 ? "it's a bit long, we should trim it" : "good length"
              }`
            : "No page title detected — this is critical for SEO"
        }\n2. ${
          onboardingData.siteData?.description ? "Meta description is set" : "No meta description — we need to add one"
        }\n3. ${
          onboardingData.siteData?.ogImage ? "OG image is configured for social sharing" : "Missing OG image — social shares will look bare"
        }\n4. ${
          onboardingData.siteData?.h1 ? `H1 tag found: "${onboardingData.siteData.h1.slice(0, 40)}"` : "No H1 tag found — search engines use this"
        }\n\nI'm ready to help you rank for "${keyword}" across ${
          onboardingData.platforms?.length || 1
        } platform${onboardingData.platforms?.length !== 1 ? "s" : ""}. What would you like to tackle first?`,
        timestamp: new Date(),
        actions: welcomeActions,
      };
      setMessages([welcomeMsg]);
    }
  }, [setup, onboardingData, messages.length]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Agent thinking step rotation
  useEffect(() => {
    if (isSending) {
      setAgentStep(0);
      agentStepIntervalRef.current = setInterval(() => {
        setAgentStep((prev) => prev + 1);
      }, 1500);
    } else {
      if (agentStepIntervalRef.current) {
        clearInterval(agentStepIntervalRef.current);
        agentStepIntervalRef.current = null;
      }
    }
    return () => {
      if (agentStepIntervalRef.current) {
        clearInterval(agentStepIntervalRef.current);
      }
    };
  }, [isSending]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // Send message to AI
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

      if (inputRef.current) inputRef.current.style.height = "auto";

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

        if (data.error) throw new Error(data.error);

        const aiActions: AgentAction[] = data.actions || [];

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: data.reply,
            timestamp: new Date(),
            actions: aiActions.length > 0 ? aiActions : undefined,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: "Something went wrong. Could you try that again?",
            timestamp: new Date(),
          },
        ]);
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

  // Navigate to chat with a pre-filled question
  const askInChat = useCallback(
    (prompt: string) => {
      setActiveSection("chat");
      setTimeout(() => sendMessage(prompt), 100);
    },
    [sendMessage]
  );

  // Update onboarding data (from settings)
  const updateOnboardingData = useCallback((data: OnboardingData) => {
    setOnboardingData(data);
  }, []);

  // Redirect if no data
  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = localStorage.getItem("rankmebaddy_onboarding");
      if (!stored) window.location.href = "/onboarding";
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

  if (!onboardingData) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#FAFAF7" }}>
        <motion.div
          className="h-6 w-6 rounded-full border-2 border-[#E8E5E0] border-t-blue-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const siteData = onboardingData.siteData;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#FAFAF7" }}>
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

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-[#E8E5E0] bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E5E0] bg-white sm:hidden"
              onClick={() => setMobileSidebar(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <h1 className="font-heading text-sm font-bold text-[#1A1A1A] capitalize">
                {activeSection === "chat" ? "Chat" : activeSection}
              </h1>
              <p className="text-[10px] text-[#9B9B9B]">
                {siteData?.domain || "No site connected"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeSection === "chat" && (
              <button
                onClick={() => setMessages([])}
                className="flex items-center gap-1.5 rounded-lg border border-[#E8E5E0] bg-white px-2.5 py-1.5 text-[11px] text-[#6B6B6B] transition-colors hover:text-[#1A1A1A] hover:border-[#9B9B9B]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" /><path d="M5 12h14" />
                </svg>
                New chat
              </button>
            )}
          </div>
        </header>

        {/* Content area — switches by section */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeSection === "chat" && (
              <motion.div key="chat" className="flex h-full flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="mx-auto max-w-2xl space-y-5">
                    {messages.map((msg) => (
                      <ChatBubble key={msg.id} message={msg} onAction={sendMessage} />
                    ))}
                    {isSending && (
                      <motion.div className="flex gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600">R</div>
                        <div className="rounded-xl bg-[#FAF8F5] px-5 py-3.5 border-l-[3px] border-l-blue-600">
                          <AgentStepIndicator steps={agentThinkingSteps} currentStep={agentStep} />
                        </div>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                {/* Quick actions */}
                {messages.length <= 1 && (
                  <div className="border-t border-[#E8E5E0] px-4 py-3 sm:px-6 bg-white">
                    <div className="mx-auto flex max-w-2xl flex-wrap gap-2">
                      {quickActions.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => sendMessage(action.prompt)}
                          disabled={isSending}
                          className="rounded-lg bg-[#F5F0EB] border border-[#E8E5E0] px-3 py-1.5 text-[11px] text-[#1A1A1A] transition-all hover:bg-[#EDE8E2] disabled:opacity-40"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="border-t border-[#E8E5E0] bg-white px-4 py-3 sm:px-6">
                  <div className="mx-auto max-w-2xl">
                    <div className="flex items-end gap-2 rounded-2xl border border-[#E8E5E0] bg-white px-4 py-2.5 transition-all focus-within:border-blue-300 focus-within:shadow-lg focus-within:shadow-blue-50">
                      <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={isSending ? "Agent is working..." : "Ask about keywords, rankings, content..."}
                        disabled={isSending}
                        rows={1}
                        className="max-h-[120px] min-h-[20px] flex-1 resize-none bg-transparent text-[14px] text-[#1A1A1A] placeholder:text-[#9B9B9B] outline-none disabled:opacity-50"
                      />
                      <button
                        onClick={() => sendMessage(inputValue)}
                        disabled={!inputValue.trim() || isSending}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 transition-all hover:bg-blue-700 disabled:opacity-30"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1.5 text-center text-[9px] text-[#9B9B9B]">
                      RankMeBaddy may produce inaccurate info. Verify important details.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "overview" && siteData && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <OverviewSection
                  siteData={siteData}
                  keyword={onboardingData.keyword}
                  platforms={onboardingData.platforms || []}
                  onNavigate={setActiveSection}
                />
              </motion.div>
            )}

            {activeSection === "keywords" && siteData && (
              <motion.div key="keywords" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <KeywordsSection
                  siteData={siteData}
                  keyword={onboardingData.keyword}
                  onAskAI={askInChat}
                />
              </motion.div>
            )}

            {activeSection === "rankings" && siteData && (
              <motion.div key="rankings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <RankingsSection
                  siteData={siteData}
                  keyword={onboardingData.keyword}
                  platforms={onboardingData.platforms || []}
                />
              </motion.div>
            )}

            {activeSection === "content" && siteData && (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <ContentSection
                  siteData={siteData}
                  keyword={onboardingData.keyword}
                  onAskAI={askInChat}
                />
              </motion.div>
            )}

            {activeSection === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <SettingsSection
                  onboardingData={onboardingData}
                  onUpdateData={updateOnboardingData}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
