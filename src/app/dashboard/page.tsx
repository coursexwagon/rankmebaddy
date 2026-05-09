"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useSubscription, SubscriptionProvider } from "@/hooks/use-subscription";
import { useAuth } from "@/hooks/use-auth";
import { CreditsProvider, useCredits } from "@/hooks/use-credits";
import { Paywall } from "@/components/paywall";
import { CustomerCenter } from "@/components/customer-center";
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat";
import { MermaidRenderer, parseContentBlocks, type ContentBlock } from "@/components/ui/mermaid-renderer";
import {
  Home,
  MessageSquare,
  Search,
  Settings,
  Plus,
  ArrowUp,
  Sparkles,
  TrendingUp,
  FileText,
  Star,
  LogOut,
  X,
} from "lucide-react";

// Beta mode — free access for everyone
const BETA_MODE = process.env.NEXT_PUBLIC_BETA_MODE === "true";

/* ─── Turquoise accent ─────────────────────────────────────── */
const T = "#00D4AA";

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

/* ─── Sidebar navigation items ────────────────────────────── */
const sidebarItems = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "overview", label: "Overview", icon: Home },
  { id: "keywords", label: "Keywords", icon: Search },
  { id: "rankings", label: "Rankings", icon: TrendingUp },
  { id: "content", label: "Content", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

/* ─── Suggested Prompt Cards with gradient colors ─────────── */
const suggestedPrompts = [
  { title: "Audit my site", prompt: "Run a comprehensive SEO audit on my site covering technical SEO, content, and authority factors.", gradient: "from-blue-500/20 to-cyan-500/20", hoverGlow: "rgba(59,130,246,0.15)" },
  { title: "Find keyword gaps", prompt: "What keyword gaps should I target for my site?", gradient: "from-teal-500/20 to-emerald-500/20", hoverGlow: "rgba(20,184,166,0.15)" },
  { title: "Analyze competitors", prompt: "Who are my top SEO competitors and what are they ranking for?", gradient: "from-purple-500/20 to-pink-500/20", hoverGlow: "rgba(168,85,247,0.15)" },
  { title: "SEO roadmap", prompt: "Create a visual SEO strategy timeline showing month-by-month milestones", gradient: "from-amber-500/20 to-orange-500/20", hoverGlow: "rgba(245,158,11,0.15)" },
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
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#6B6B6B" />
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

/* ─── Action Buttons — iOS26 liquid glass with colored gradients ── */
const actionColors = [
  { gradient: "from-blue-500/20 to-cyan-500/15", hoverGlow: "rgba(59,130,246,0.2)", border: "border-blue-400/15" },
  { gradient: "from-pink-500/20 to-rose-500/15", hoverGlow: "rgba(236,72,153,0.2)", border: "border-pink-400/15" },
  { gradient: "from-emerald-500/20 to-teal-500/15", hoverGlow: "rgba(16,185,129,0.2)", border: "border-emerald-400/15" },
];

function ActionButtons({ actions, onAction }: { actions: AgentAction[]; onAction: (prompt: string) => void }) {
  if (!actions || actions.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2.5">
      {actions.map((action, i) => {
        const color = actionColors[i % actionColors.length];
        return (
          <motion.button
            key={action.type}
            onClick={() => onAction(action.prompt)}
            className={`glass-button glass-button-shine inline-flex items-center gap-2.5 bg-gradient-to-r ${color.gradient} backdrop-blur-xl border ${color.border} px-5 py-2.5 text-[12px] font-medium text-white/90 transition-all`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{ ["--hover-glow" as string]: color.hoverGlow }}
          >
            <ArrowUp className="w-3 h-3 text-white" />
            {action.label}
          </motion.button>
        );
      })}
    </div>
  );
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
      className="flex min-h-screen items-center justify-center px-4 bg-[#0A0A0B]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-sm text-center">
        <motion.div
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="h-8 w-8 rounded-full border-2 border-[#00D4AA]/30 border-t-[#00D4AA]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <h2 className="font-heading text-xl font-bold text-white">
          Setting up your workspace
        </h2>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Building your SEO command center
        </p>

        <div className="mt-8 space-y-3">
          {steps.map((text, i) => (
            <motion.div
              key={text}
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-xl px-4 py-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{
                opacity: step >= i ? 1 : 0,
                x: step >= i ? 0 : -12,
              }}
              transition={{ duration: 0.3 }}
            >
              {step > i ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : step === i ? (
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-[#00D4AA]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
              )}
              <span
                className={`text-[12px] ${
                  step > i ? "text-[#00D4AA]" : step === i ? "text-[#9B9B9B]" : "text-[#6B6B6B]"
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

/* ─── Chat Bubble — frosted glass, more spacious ──────────── */
function ChatBubble({ message, onAction }: { message: ChatMessage; onAction: (prompt: string) => void }) {
  const isUser = message.role === "user";

  const contentBlocks = useMemo(() => {
    if (isUser) return [];
    return parseContentBlocks(message.content);
  }, [message.content, isUser]);

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`max-w-[80%] ${
          isUser
            ? "rounded-2xl bg-gradient-to-r from-[#00D4AA]/15 to-[#00D4AA]/8 backdrop-blur-xl border border-[#00D4AA]/15 text-white px-5 py-3.5"
            : "glass-card bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] px-5 py-4 text-white/90"
        }`}
      >
        {isUser ? (
          <div className="text-[14px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        ) : contentBlocks.length > 0 ? (
          <div>
            {contentBlocks.map((block: ContentBlock, idx: number) =>
              block.type === "mermaid" ? (
                <MermaidRenderer key={`diagram-${idx}`} chart={block.content} autoOpen />
              ) : (
                <div key={`text-${idx}`} className="markdown-content">
                  <ReactMarkdown>{block.content}</ReactMarkdown>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}

        {!isUser && message.actions && message.actions.length > 0 && (
          <ActionButtons actions={message.actions} onAction={onAction} />
        )}
      </div>
    </motion.div>
  );
}

/* ─── Thinking Indicator — turquoise accent ─────────────────── */
function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 text-[12px] text-white/40">
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((dot) => (
          <motion.div
            key={dot}
            className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]/50"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
      <span className="text-[#00D4AA]/60">Thinking...</span>
    </div>
  );
}

/* ─── Suggested Prompt Card — iOS26 liquid glass with gradient ── */
function SuggestedPromptCard({ title, gradient, onClick }: { title: string; gradient: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={`glass-button glass-button-shine inline-flex items-center gap-2 bg-gradient-to-r ${gradient} backdrop-blur-xl border border-white/[0.12] px-5 py-3 text-[13px] font-medium text-white/80 transition-all`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <Sparkles className="w-3.5 h-3.5 text-white/60" />
      {title}
    </motion.button>
  );
}

/* ─── Credits Display — glass card with progress bar + tier ── */
function CreditsDisplay() {
  const { creditsRemaining, maxCredits, tier, nextReset, loading } = useCredits();
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!nextReset || creditsRemaining > 0) return;

    const updateCountdown = () => {
      const resetTime = new Date(nextReset).getTime();
      const now = Date.now();
      const diff = Math.max(0, resetTime - now);
      if (diff <= 0) {
        setCountdown("Resetting...");
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextReset, creditsRemaining]);

  if (loading) return null;

  const progress = maxCredits > 0 ? (creditsRemaining / maxCredits) * 100 : 0;
  const tierLabel = tier === "pro" ? "Pro" : tier === "enterprise" ? "Enterprise" : "Free";
  const tierColor = tier === "pro" ? "text-emerald-400" : tier === "enterprise" ? "text-violet-400" : "text-white/50";

  return (
    <div className={`glass-card flex items-center gap-2.5 bg-white/[0.04] backdrop-blur-xl border px-3.5 py-2 text-[11px] font-medium transition-all ${
      creditsRemaining <= 0
        ? "!border-red-500/20 bg-red-500/10 text-red-400"
        : progress <= 20
        ? "!border-amber-500/20 bg-amber-500/10 text-amber-400"
        : ""
    }`}>
      {/* Mini progress bar */}
      <div className="relative h-1.5 w-14 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
            creditsRemaining <= 0
              ? "bg-red-500"
              : progress <= 20
              ? "bg-amber-500"
              : progress <= 50
              ? "bg-white/40"
              : "bg-[#00D4AA]"
          }`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      <span className="tabular-nums text-white/70">{creditsRemaining}/{maxCredits}</span>
      <span className={`${tierColor} text-[9px] font-bold uppercase tracking-wider`}>{tierLabel}</span>
      {creditsRemaining <= 0 && countdown && (
        <span className="text-red-400/70 ml-0.5">· {countdown}</span>
      )}
    </div>
  );
}

/* ─── Credits Exhausted Banner ──────────────────────────────── */
function CreditsExhaustedBanner() {
  const { creditsRemaining, maxCredits, tier, nextReset } = useCredits();
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (creditsRemaining > 0 || !nextReset) return;

    const updateCountdown = () => {
      const resetTime = new Date(nextReset).getTime();
      const now = Date.now();
      const diff = Math.max(0, resetTime - now);
      if (diff <= 0) {
        setCountdown("Resetting now...");
        return;
      }
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`${minutes}m ${seconds}s until reset`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [creditsRemaining, nextReset]);

  if (creditsRemaining > 0) return null;

  const tierLabel = tier === "pro" ? "Pro" : tier === "enterprise" ? "Enterprise" : "Free";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 sm:mx-6 mb-2 glass-card bg-red-500/10 backdrop-blur-xl border-red-500/20 px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div className="flex-1">
          <p className="text-[12px] font-medium text-red-400">No credits remaining</p>
          <p className="text-[11px] text-red-400/60">Your {tierLabel} plan gives you {maxCredits} credits/hour. {countdown}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] tabular-nums text-red-400/80">0/{maxCredits}</span>
          <div className="h-1 w-16 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-0 rounded-full bg-red-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Liquid Glass Empty State Button ──────────────────────── */
function GlassActionCard({ icon: Icon, title, subtitle, gradient, hoverGlow, onClick }: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  gradient: string;
  hoverGlow: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`glass-button glass-button-shine flex flex-col items-center justify-center gap-3 bg-gradient-to-r ${gradient} backdrop-blur-xl border border-white/[0.12] px-6 py-8 w-full text-center transition-all`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.1]">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-[14px] font-medium text-white/90 mb-0.5">{title}</p>
        <p className="text-[11px] text-white/40">{subtitle}</p>
      </div>
    </motion.button>
  );
}

/* ─── Overview Section ────────────────────────────────────── */
function OverviewSection({ siteData, keyword, platforms, onAskAI }: {
  siteData: SiteData;
  keyword: string;
  platforms: string[];
  onAskAI: (prompt: string) => void;
}) {
  const seoScore = [
    siteData.title ? 20 : 0,
    siteData.description ? 20 : 0,
    siteData.h1 ? 15 : 0,
    siteData.ogImage ? 15 : 0,
    siteData.lang ? 10 : 0,
    siteData.favicon ? 10 : 0,
    10,
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
      <div>
        <h2 className="font-heading text-lg font-bold text-white">SEO Overview</h2>
        <p className="text-[12px] text-white/50">Analysis of {siteData.domain}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          className="glass-card flex flex-col items-center justify-center bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <motion.circle
                cx="40" cy="40" r="34" fill="none"
                stroke={seoScore >= 70 ? T : seoScore >= 40 ? "#FBBF24" : "#F87171"}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${(seoScore / 100) * 213.6} 213.6`}
                initial={{ strokeDasharray: "0 213.6" }}
                animate={{ strokeDasharray: `${(seoScore / 100) * 213.6} 213.6` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </svg>
            <span className="absolute font-heading text-2xl font-bold text-white">{seoScore}</span>
          </div>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">SEO Score</p>
        </motion.div>

        <motion.div
          className="glass-card bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">Site Issues</h3>
          <div className="space-y-2.5">
            {issues.map((issue) => (
              <div key={issue.text} className="flex items-start gap-2">
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${issue.type === "error" ? "bg-red-500" : issue.type === "warning" ? "bg-amber-500" : "bg-[#00D4AA]"}`} />
                <span className={`text-[12px] ${issue.type === "error" ? "text-red-400" : issue.type === "warning" ? "text-amber-400" : "text-white/50"}`}>{issue.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="glass-card overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/[0.08]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="px-4 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">Site Preview</h3>
        <div className="relative h-48 w-full overflow-hidden bg-[#0A0A0B]">
          <img src={siteData.screenshot} alt={`Screenshot of ${siteData.domain}`} className="h-full w-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/70 backdrop-blur-sm px-3 py-1.5 border border-white/[0.08]">
            {siteData.favicon && <img src={siteData.favicon} alt="" className="h-3.5 w-3.5 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
            <span className="text-[11px] font-medium text-white">{siteData.domain}</span>
          </div>
        </div>
      </motion.div>

      <div className="glass-card bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-5 text-center">
        <p className="text-[12px] text-white/40 mb-4">Chat with the AI agent to discover keywords, track rankings, and get content recommendations</p>
        <motion.button
          onClick={() => onAskAI("Analyze my site and give me a full SEO action plan")}
          className="glass-button glass-button-shine inline-flex items-center gap-2 bg-gradient-to-r from-[#00D4AA]/20 to-emerald-500/15 backdrop-blur-xl border border-[#00D4AA]/20 px-6 py-3 text-[13px] font-medium text-white/90 transition-all"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <Sparkles className="w-4 h-4 text-[#00D4AA]" />
          Start SEO Analysis
        </motion.button>
      </div>
    </div>
  );
}

/* ─── Keywords Section — empty state with glass action ────── */
function KeywordsSection({ onAskAI }: { onAskAI: (prompt: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-white">Keywords</h2>
        <p className="text-[12px] text-white/40">Your keyword data will appear here</p>
      </div>
      <GlassActionCard
        icon={Search}
        title="Discover Keywords"
        subtitle="Chat with the AI to find keyword opportunities"
        gradient="from-blue-500/15 to-cyan-500/10"
        hoverGlow="rgba(59,130,246,0.15)"
        onClick={() => onAskAI("Find keyword opportunities for my site")}
      />
    </div>
  );
}

/* ─── Rankings Section — empty state with glass action ────── */
function RankingsSection({ onAskAI }: { onAskAI: (prompt: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-white">Rankings</h2>
        <p className="text-[12px] text-white/40">Your ranking data will appear here</p>
      </div>
      <GlassActionCard
        icon={TrendingUp}
        title="Check Rankings"
        subtitle="The AI agent will track your positions"
        gradient="from-emerald-500/15 to-teal-500/10"
        hoverGlow="rgba(16,185,129,0.15)"
        onClick={() => onAskAI("Check my current ranking positions")}
      />
    </div>
  );
}

/* ─── Content Section — empty state with glass action ─────── */
function ContentSection({ onAskAI }: { onAskAI: (prompt: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-white">Content</h2>
        <p className="text-[12px] text-white/40">Your content strategy will appear here</p>
      </div>
      <GlassActionCard
        icon={FileText}
        title="Generate Content Plan"
        subtitle="Let the AI agent engineer content for you"
        gradient="from-purple-500/15 to-pink-500/10"
        hoverGlow="rgba(168,85,247,0.15)"
        onClick={() => onAskAI("Create a content strategy and calendar for my site")}
      />
    </div>
  );
}

/* ─── Settings Section — glassmorphism ─────────────────────── */
function SettingsSection({ onboardingData, onUpdateData, onUpgrade, onSignOut }: { onboardingData: OnboardingData; onUpdateData: (data: OnboardingData) => void; onUpgrade: () => void; onSignOut: () => void }) {
  const [name, setName] = useState(onboardingData.name);
  const [keyword, setKeyword] = useState(onboardingData.keyword);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated = { ...onboardingData, name, keyword };
    onUpdateData(updated);
    try { localStorage.setItem("rankmebaddy_onboarding", JSON.stringify(updated)); } catch { /* ignore */ }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-white">Settings</h2>
        <p className="text-[12px] text-white/40">Manage your campaign and profile</p>
      </div>

      <CustomerCenter onUpgrade={onUpgrade} />

      <div className="glass-card space-y-4 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Profile</h3>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-[#00D4AA]/30 focus:ring-1 focus:ring-[#00D4AA]/10" />
        </div>
      </div>

      <div className="glass-card space-y-4 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Campaign</h3>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Primary Keyword</label>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-[#00D4AA]/30 focus:ring-1 focus:ring-[#00D4AA]/10" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Website</label>
          <input type="text" value={onboardingData.website} readOnly className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-3 py-2.5 text-[13px] text-white/40 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {onboardingData.platforms.map((p) => (
              <span key={p} className="flex items-center gap-1.5 glass-card border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl px-3 py-1 text-[11px] text-white/50">
                <PlatformIcon platform={p} size={12} />
                {p === "aisearch" ? "AI Search" : p.charAt(0).toUpperCase() + p.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        onClick={handleSave}
        className="glass-button glass-button-shine w-full bg-gradient-to-r from-[#00D4AA]/20 to-emerald-500/15 backdrop-blur-xl border border-[#00D4AA]/20 py-3 text-sm font-semibold text-white transition-all"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {saved ? "Saved ✓" : "Save changes"}
      </motion.button>

      <div className="glass-card space-y-3 bg-red-500/[0.04] backdrop-blur-xl border border-red-900/30 p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-red-400">Danger zone</h3>
        <p className="text-[11px] text-white/30">Reset all onboarding data and start over.</p>
        <button onClick={() => { localStorage.removeItem("rankmebaddy_onboarding"); onSignOut(); }} className="glass-button bg-red-500/[0.08] backdrop-blur-xl border border-red-900/30 px-4 py-2 text-[11px] text-red-400 transition-all hover:bg-red-900/20">Reset everything</button>
      </div>
    </div>
  );
}

/* ─── Sidebar Component ───────────────────────────────────── */
function Sidebar({ activeSection, setActiveSection, userName, onSignOut, effectiveIsPro }: {
  activeSection: string;
  setActiveSection: (id: string) => void;
  userName: string;
  onSignOut: () => void;
  effectiveIsPro: boolean;
}) {
  return (
    <aside className="hidden md:flex w-[68px] flex-col items-center border-r border-white/[0.06] bg-[#0D0D0E] py-4 shrink-0">
      {/* Logo */}
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D4AA]/25 to-emerald-600/15 border border-[#00D4AA]/15 mb-6">
        <span className="font-heading text-[11px] font-bold text-[#00D4AA]">R</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col items-center gap-1.5 sidebar-scrollbar">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn_sidebarItem(isActive)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#00D4AA] shadow-[0_0_8px_rgba(0,212,170,0.4)]"
                  layoutId="sidebar-active"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={cn(
                "w-[18px] h-[18px] transition-colors",
                isActive ? "text-[#00D4AA]" : "text-white/30"
              )} />
            </motion.button>
          );
        })}

        {/* Pro button */}
        <motion.button
          onClick={() => setActiveSection("pro")}
          className={cn_sidebarItem(activeSection === "pro")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title="Pro"
        >
          {activeSection === "pro" && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#00D4AA] shadow-[0_0_8px_rgba(0,212,170,0.4)]"
              layoutId="sidebar-active-pro"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <Star className={cn(
            "w-[18px] h-[18px] transition-colors",
            activeSection === "pro" ? "text-[#00D4AA]" : effectiveIsPro ? "text-amber-400/50" : "text-white/30"
          )} />
        </motion.button>
      </nav>

      {/* User avatar at bottom */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <button
          onClick={onSignOut}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/20 hover:text-white/50 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-[12px] font-bold text-[#00D4AA]"
          title={userName}
        >
          {userName ? userName[0].toUpperCase() : "U"}
        </div>
      </div>
    </aside>
  );
}

function cn_sidebarItem(isActive: boolean) {
  return cn(
    "relative flex h-10 w-10 items-center justify-center rounded-xl transition-all",
    isActive
      ? "bg-[#00D4AA]/10 border border-[#00D4AA]/15"
      : "bg-transparent border border-transparent hover:bg-white/[0.04] hover:border-white/[0.06]"
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ─── Inner Dashboard ────────────────────────────────────── */
function DashboardInner() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [setup, setSetup] = useState(true);
  const [activeSection, setActiveSection] = useState("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { isPro } = useSubscription();
  const { user, signOut, loading, emailVerified } = useAuth();
  const { creditsRemaining, refreshCredits } = useCredits();

  const effectiveIsPro = BETA_MODE || isPro;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rankmebaddy_onboarding");
      if (stored) { const data = JSON.parse(stored) as OnboardingData; setOnboardingData(data); }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isSending]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isSending) return;

      if (creditsRemaining <= 0) {
        setMessages((prev) => [...prev, {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "No credits remaining. Your credits reset every hour — please wait for the reset timer to count down.",
          timestamp: new Date()
        }]);
        return;
      }

      const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: content.trim(), timestamp: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setIsSending(true);

      try {
        const chatMessages = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
        const userId = typeof window !== "undefined" ? localStorage.getItem("rankmebaddy_user_id") : null;
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: chatMessages, siteData: onboardingData?.siteData, keyword: onboardingData?.keyword, platforms: onboardingData?.platforms, userName: onboardingData?.name, userId }),
        });

        if (res.status === 429) {
          const data = await res.json().catch(() => ({}));
          setMessages((prev) => [...prev, {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: data.error || "No credits remaining. Credits reset every hour.",
            timestamp: new Date()
          }]);
          refreshCredits();
          return;
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || `Server error (${res.status})`);
        }

        const data = await res.json();

        if (data.error) throw new Error(data.error);
        const aiActions: AgentAction[] = data.actions || [];
        setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, role: "assistant", content: data.reply, timestamp: new Date(), actions: aiActions.length > 0 ? aiActions : undefined }]);

        refreshCredits();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        console.error("Chat error:", errorMessage);
        setMessages((prev) => [...prev, { id: `error-${Date.now()}`, role: "assistant", content: `Error: ${errorMessage}. Please try again.`, timestamp: new Date() }]);
        refreshCredits();
      } finally {
        setIsSending(false);
      }
    },
    [messages, isSending, onboardingData, creditsRemaining, refreshCredits]
  );

  const askInChat = useCallback((prompt: string) => { setActiveSection("chat"); setTimeout(() => sendMessage(prompt), 100); }, [sendMessage]);
  const updateOnboardingData = useCallback((data: OnboardingData) => { setOnboardingData(data); }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = "/auth";
      } else if (!emailVerified) {
        window.location.href = "/auth?verification_required=true";
      }
    }
  }, [user, loading, emailVerified]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = localStorage.getItem("rankmebaddy_onboarding");
      if (!stored && user) window.location.href = "/onboarding";
    }, 3000);
    return () => clearTimeout(timer);
  }, [user]);

  if (setup && onboardingData) {
    return (<AnimatePresence><SetupScreen onComplete={() => setSetup(false)} /></AnimatePresence>);
  }

  if (!onboardingData) {
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
          <motion.div className="h-6 w-6 rounded-full border-2 border-[#00D4AA]/30 border-t-[#00D4AA]" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
        </div>
      );
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <motion.div className="h-6 w-6 rounded-full border-2 border-[#00D4AA]/30 border-t-[#00D4AA]" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
      </div>
    );
  }

  const siteData = onboardingData.siteData;
  const userName = user?.email?.split("@")[0] || onboardingData.name;

  return (
    <SubscriptionProvider>
    <div className="flex h-screen overflow-hidden bg-[#0A0A0B]">
      {/* Paywall Modal */}
      <Paywall open={paywallOpen} onClose={() => setPaywallOpen(false)} />

      {/* ─── Sidebar (desktop) ──────────────────────────────── */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userName={userName}
        onSignOut={async () => { await signOut(); window.location.href = "/auth"; }}
        effectiveIsPro={effectiveIsPro}
      />

      {/* ─── Main Content Area ──────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* ─── Top Bar ──────────────────────────────── */}
        <header className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl px-4 py-3 sm:px-6 shrink-0">
          {/* Left: Mobile menu + Brand */}
          <div className="flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] md:hidden transition-all hover:bg-white/[0.1] hover:border-white/[0.12]" onClick={() => setMobileMenuOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9B9B9B" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <span className="font-heading text-sm font-bold text-white">RankMeBaddy</span>
          </div>

          {/* Right: Credits + New chat + Avatar */}
          <div className="flex items-center gap-2.5">
            <CreditsDisplay />
            {activeSection === "chat" && (
              <motion.button
                onClick={() => setMessages([])}
                className="glass-button glass-button-shine flex items-center gap-1.5 bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] px-3.5 py-2 text-[11px] font-medium text-white/60 transition-all"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Plus className="w-3 h-3 text-white/40" />
                New chat
              </motion.button>
            )}
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-[11px] font-bold text-[#00D4AA] cursor-pointer"
              onClick={() => setActiveSection("settings")}
              title="Settings"
            >
              {userName ? userName[0].toUpperCase() : "U"}
            </div>
          </div>
        </header>

        {/* ─── Mobile Menu Overlay ──────────────────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                className="fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0D0D0E]/95 border-r border-white/[0.06] shadow-xl md:hidden flex flex-col backdrop-blur-xl"
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D4AA]/25 to-emerald-600/15 border border-[#00D4AA]/15">
                      <span className="font-heading text-[11px] font-bold text-[#00D4AA]">R</span>
                    </div>
                    <span className="font-heading text-sm font-bold text-white">RankMeBaddy</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-white/30 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex-1 space-y-0.5 px-2 py-2">
                  {sidebarItems.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-all ${
                          isActive
                            ? "bg-[#00D4AA]/10 text-[#00D4AA] font-medium border border-[#00D4AA]/15"
                            : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => { setActiveSection("pro"); setMobileMenuOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-all ${
                      activeSection === "pro"
                        ? "bg-[#00D4AA]/10 text-[#00D4AA] font-medium border border-[#00D4AA]/15"
                        : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    Pro
                  </button>
                </nav>
                <div className="border-t border-white/[0.06] px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-[12px] font-bold text-[#00D4AA]">
                      {userName ? userName[0].toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-white">{userName || "User"}</p>
                      <p className="text-[10px] text-white/30">{effectiveIsPro ? "Pro plan" : BETA_MODE ? "Beta - Free" : "Free plan"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ─── Content area ──────────────────────────────── */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeSection === "chat" && (
              <motion.div key="chat" className="flex h-full flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <CreditsExhaustedBanner />
                {messages.length === 0 ? (
                  /* Welcome state — centered, spacious */
                  <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6">
                    <motion.div
                      className="w-full max-w-2xl flex flex-col items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Greeting */}
                      <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                      >
                        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
                          How can I help?
                        </h1>
                        <p className="text-[14px] text-white/30">Your SEO command center, powered by AI</p>
                      </motion.div>

                      {/* Input — front and center */}
                      <motion.div
                        className="w-full mb-8"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <AnimatedAIChat onSendMessage={sendMessage} isTyping={isSending} disabled={creditsRemaining <= 0} />
                      </motion.div>

                      {/* Quick action cards — horizontal scroll */}
                      <motion.div
                        className="flex gap-3 overflow-x-auto pb-2 w-full justify-center flex-wrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {suggestedPrompts.map((prompt) => (
                          <SuggestedPromptCard
                            key={prompt.title}
                            title={prompt.title}
                            gradient={prompt.gradient}
                            onClick={() => sendMessage(prompt.prompt)}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  </div>
                ) : (
                  <>
                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 custom-scrollbar-dark">
                      <div className="mx-auto max-w-2xl space-y-6">
                        {messages.map((msg) => (
                          <ChatBubble key={msg.id} message={msg} onAction={sendMessage} />
                        ))}

                        {isSending && (
                          <motion.div className="flex justify-start" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                            <ThinkingIndicator />
                          </motion.div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                    </div>

                    {/* Input bar pinned to bottom */}
                    <div className="border-t border-white/[0.06] bg-white/[0.02] backdrop-blur-xl px-4 py-4 sm:px-6 shrink-0">
                      <div className="mx-auto max-w-2xl">
                        <AnimatedAIChat onSendMessage={sendMessage} isTyping={isSending} disabled={creditsRemaining <= 0} />
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeSection === "overview" && siteData && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <OverviewSection siteData={siteData} keyword={onboardingData.keyword} platforms={onboardingData.platforms || []} onAskAI={askInChat} />
              </motion.div>
            )}

            {activeSection === "keywords" && siteData && (
              <motion.div key="keywords" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <KeywordsSection onAskAI={askInChat} />
              </motion.div>
            )}

            {activeSection === "rankings" && siteData && (
              <motion.div key="rankings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <RankingsSection onAskAI={askInChat} />
              </motion.div>
            )}

            {activeSection === "content" && siteData && (
              <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ContentSection onAskAI={askInChat} />
              </motion.div>
            )}

            {activeSection === "pro" && (
              <motion.div key="pro" className="flex items-center justify-center min-h-[50vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center space-y-4 p-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center glass-card bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-400/15">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-white">RankMeBaddy Pro</h2>
                  {BETA_MODE ? (
                    <>
                      <div className="inline-flex items-center gap-2 glass-card bg-[#00D4AA]/10 border border-[#00D4AA]/15 px-4 py-2 text-sm font-medium text-[#00D4AA]">
                        <div className="h-2 w-2 rounded-full bg-[#00D4AA] animate-pulse" />
                        Beta — All features unlocked for free
                      </div>
                      <p className="text-sm text-white/40 max-w-sm mx-auto">You have full access to all Pro features during the beta. Enjoy unlimited SEO campaigns, all platforms, AI optimization, and more.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-white/40 max-w-sm mx-auto">Unlock unlimited SEO campaigns, all platforms, AI optimization, and priority support.</p>
                      <motion.button
                        onClick={() => setPaywallOpen(true)}
                        className="glass-button glass-button-shine inline-flex items-center gap-2 bg-gradient-to-r from-[#00D4AA]/20 to-emerald-500/15 backdrop-blur-xl border border-[#00D4AA]/20 px-6 py-3 text-sm font-semibold text-white transition-all"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        {effectiveIsPro ? "Manage Subscription" : "Upgrade to Pro"}
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {activeSection === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SettingsSection onboardingData={onboardingData} onUpdateData={updateOnboardingData} onUpgrade={() => setPaywallOpen(true)} onSignOut={async () => { await signOut(); window.location.href = "/auth"; }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </SubscriptionProvider>
  );
}

/* ─── Main Dashboard ────────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <CreditsProvider>
      <DashboardInner />
    </CreditsProvider>
  );
}
