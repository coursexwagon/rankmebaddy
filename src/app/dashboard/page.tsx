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

// Beta mode — free access for everyone
const BETA_MODE = process.env.NEXT_PUBLIC_BETA_MODE === "true";

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

/* ─── Top Bar Tab Items ─────────────────────────────────────── */
const topBarTabs = [
  { id: "chat", label: "Chat" },
  { id: "overview", label: "Overview" },
  { id: "keywords", label: "Keywords" },
  { id: "rankings", label: "Rankings" },
  { id: "content", label: "Content" },
];

/* ─── Suggested Prompt Chips ────────────────────────────────── */
const suggestedPrompts = [
  { title: "Audit my site", prompt: "Run a comprehensive SEO audit on my site covering technical SEO, content, and authority factors." },
  { title: "Find keyword gaps", prompt: "What keyword gaps should I target for my site?" },
  { title: "Analyze competitors", prompt: "Who are my top SEO competitors and what are they ranking for?" },
  { title: "SEO roadmap", prompt: "Create a visual SEO strategy timeline showing month-by-month milestones" },
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

/* ─── Action Buttons — glass pill ─────────────────────────── */
function ActionButtons({ actions, onAction }: { actions: AgentAction[]; onAction: (prompt: string) => void }) {
  if (!actions || actions.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((action) => (
        <motion.button
          key={action.type}
          onClick={() => onAction(action.prompt)}
          className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] px-4 py-2 text-[11px] font-medium text-white/80 transition-all hover:bg-white/[0.12] hover:border-white/[0.15] hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
          {action.label}
        </motion.button>
      ))}
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
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#2A2A2E] bg-[#1A1A1E]"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="h-8 w-8 rounded-full border-2 border-[#2A2A2E] border-t-white"
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
              className="flex items-center gap-3 rounded-xl border border-[#2A2A2E] bg-[#1A1A1E] px-4 py-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{
                opacity: step >= i ? 1 : 0,
                x: step >= i ? 0 : -12,
              }}
              transition={{ duration: 0.3 }}
            >
              {step > i ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : step === i ? (
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-white"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-[#2A2A2E]" />
              )}
              <span
                className={`text-[12px] ${
                  step > i ? "text-[#4ADE80]" : step === i ? "text-[#9B9B9B]" : "text-[#6B6B6B]"
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

/* ─── Chat Bubble — glass cards ─────────────────────────────── */
function ChatBubble({ message, onAction }: { message: ChatMessage; onAction: (prompt: string) => void }) {
  const isUser = message.role === "user";

  // Parse content blocks (text + mermaid diagrams)
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
        className={`max-w-[85%] ${
          isUser
            ? "rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/[0.06] text-white px-5 py-3.5"
            : "rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] px-5 py-4 text-white/90"
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

/* ─── Thinking Indicator — minimal ──────────────────────────── */
function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 text-[12px] text-[#6B6B6B]">
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((dot) => (
          <motion.div
            key={dot}
            className="w-1.5 h-1.5 bg-white/30 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
      <span>Thinking...</span>
    </div>
  );
}

/* ─── Suggested Prompt Chip — glass pill ────────────────────── */
function SuggestedPromptChip({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] px-5 py-2.5 text-[13px] text-white/70 transition-all hover:bg-white/[0.12] hover:border-white/[0.15] hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {title}
    </motion.button>
  );
}

/* ─── Overview Section — real data only ─────────────────────── */
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
          className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
              <motion.circle
                cx="40" cy="40" r="34" fill="none"
                stroke={seoScore >= 70 ? "#4ADE80" : seoScore >= 40 ? "#FBBF24" : "#F87171"}
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
          className="rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">Site Issues</h3>
          <div className="space-y-2.5">
            {issues.map((issue) => (
              <div key={issue.text} className="flex items-start gap-2">
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${issue.type === "error" ? "bg-red-500" : issue.type === "warning" ? "bg-amber-500" : "bg-green-500"}`} />
                <span className={`text-[12px] ${issue.type === "error" ? "text-red-400" : issue.type === "warning" ? "text-amber-400" : "text-white/50"}`}>{issue.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="overflow-hidden rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.06]"
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

      <div className="rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] p-4 text-center">
        <p className="text-[12px] text-white/40 mb-3">Chat with the AI agent to discover keywords, track rankings, and get content recommendations</p>
        <button onClick={() => onAskAI("Analyze my site and give me a full SEO action plan")} className="rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] px-5 py-2.5 text-[13px] text-white/70 transition-all hover:bg-white/[0.12] hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]">
          Start SEO Analysis
        </button>
      </div>
    </div>
  );
}

/* ─── Keywords Section — empty state ───────────────────────── */
function KeywordsSection({ onAskAI }: { onAskAI: (prompt: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-white">Keywords</h2>
        <p className="text-[12px] text-white/40">Your keyword data will appear here</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] py-16">
        <div className="h-12 w-12 rounded-full bg-white/[0.06] flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <p className="text-[14px] text-white/50 mb-1">No keywords yet</p>
        <p className="text-[12px] text-white/30 mb-4">Chat with the AI to discover keyword opportunities</p>
        <button onClick={() => onAskAI("Find keyword opportunities for my site")} className="rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] px-5 py-2.5 text-[13px] text-white/70 transition-all hover:bg-white/[0.12] hover:text-white">
          Discover Keywords
        </button>
      </div>
    </div>
  );
}

/* ─── Rankings Section — empty state ───────────────────────── */
function RankingsSection({ onAskAI }: { onAskAI: (prompt: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-white">Rankings</h2>
        <p className="text-[12px] text-white/40">Your ranking data will appear here</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] py-16">
        <div className="h-12 w-12 rounded-full bg-white/[0.06] flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </div>
        <p className="text-[14px] text-white/50 mb-1">No rankings tracked yet</p>
        <p className="text-[12px] text-white/30 mb-4">The AI agent will track your positions as you use it</p>
        <button onClick={() => onAskAI("Check my current ranking positions")} className="rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] px-5 py-2.5 text-[13px] text-white/70 transition-all hover:bg-white/[0.12] hover:text-white">
          Check Rankings
        </button>
      </div>
    </div>
  );
}

/* ─── Content Section — empty state ────────────────────────── */
function ContentSection({ onAskAI }: { onAskAI: (prompt: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-white">Content</h2>
        <p className="text-[12px] text-white/40">Your content strategy will appear here</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] py-16">
        <div className="h-12 w-12 rounded-full bg-white/[0.06] flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
          </svg>
        </div>
        <p className="text-[14px] text-white/50 mb-1">No content plan yet</p>
        <p className="text-[12px] text-white/30 mb-4">Let the AI agent engineer content for you</p>
        <button onClick={() => onAskAI("Create a content strategy and calendar for my site")} className="rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] px-5 py-2.5 text-[13px] text-white/70 transition-all hover:bg-white/[0.12] hover:text-white">
          Generate Content Plan
        </button>
      </div>
    </div>
  );
}

/* ─── Settings Section ──────────────────────────────────────── */
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
        <p className="text-[12px] text-[#6B6B6B]">Manage your campaign and profile</p>
      </div>

      <CustomerCenter onUpgrade={onUpgrade} />

      <div className="space-y-4 rounded-2xl border border-[#2A2A2E] bg-[#1A1A1E] p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B]">Profile</h3>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#9B9B9B]">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-[#3A3A3E] focus:ring-1 focus:ring-white/5" />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-[#2A2A2E] bg-[#1A1A1E] p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B]">Campaign</h3>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#9B9B9B]">Primary Keyword</label>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full rounded-xl border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-2.5 text-[13px] text-white outline-none transition-colors focus:border-[#3A3A3E] focus:ring-1 focus:ring-white/5" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#9B9B9B]">Website</label>
          <input type="text" value={onboardingData.website} readOnly className="w-full rounded-xl border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-2.5 text-[13px] text-[#6B6B6B] outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#9B9B9B]">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {onboardingData.platforms.map((p) => (
              <span key={p} className="flex items-center gap-1.5 rounded-full border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-1 text-[11px] text-[#9B9B9B]">
                <PlatformIcon platform={p} size={12} />
                {p === "aisearch" ? "AI Search" : p.charAt(0).toUpperCase() + p.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="w-full rounded-full bg-white py-3 text-sm font-semibold text-[#0A0A0B] transition-all hover:bg-[#E8E8E8]">
        {saved ? "Saved ✓" : "Save changes"}
      </button>

      <div className="space-y-3 rounded-2xl border border-red-900/50 bg-red-900/10 p-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-red-400">Danger zone</h3>
        <p className="text-[11px] text-[#6B6B6B]">Reset all onboarding data and start over.</p>
        <button onClick={() => { localStorage.removeItem("rankmebaddy_onboarding"); onSignOut(); }} className="rounded-full border border-red-900/50 px-3 py-1.5 text-[11px] text-red-400 transition-colors hover:bg-red-900/20">Reset everything</button>
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
  const [isSending, setIsSending] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { isPro } = useSubscription();
  const { user, signOut, loading } = useAuth();

  // In beta mode, everyone is "pro"
  const effectiveIsPro = BETA_MODE || isPro;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rankmebaddy_onboarding");
      if (stored) { const data = JSON.parse(stored) as OnboardingData; setOnboardingData(data); }
    } catch { /* ignore */ }
  }, []);

  // No auto-welcome message — show centered greeting in empty state instead

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isSending]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isSending) return;
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
        const data = await res.json();
        
        // Handle credits exhausted
        if (res.status === 429) {
          setMessages((prev) => [...prev, { id: `error-${Date.now()}`, role: "assistant", content: `No credits remaining. Your credits reset every hour. ${data.next_reset ? `Next reset: ${new Date(data.next_reset).toLocaleTimeString()}` : ""}`, timestamp: new Date() }]);
          return;
        }
        
        if (data.error) throw new Error(data.error);
        const aiActions: AgentAction[] = data.actions || [];
        setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, role: "assistant", content: data.reply, timestamp: new Date(), actions: aiActions.length > 0 ? aiActions : undefined }]);
        
        // Update credits display
        if (data.credits_remaining !== undefined) {
          localStorage.setItem("rankmebaddy_credits", String(data.credits_remaining));
        }
      } catch {
        setMessages((prev) => [...prev, { id: `error-${Date.now()}`, role: "assistant", content: "Something went wrong. Could you try that again?", timestamp: new Date() }]);
      } finally {
        setIsSending(false);
      }
    },
    [messages, isSending, onboardingData]
  );

  const askInChat = useCallback((prompt: string) => { setActiveSection("chat"); setTimeout(() => sendMessage(prompt), 100); }, [sendMessage]);
  const updateOnboardingData = useCallback((data: OnboardingData) => { setOnboardingData(data); }, []);

  // Auth check
  useEffect(() => {
    if (!user && !loading) {
      window.location.href = "/auth";
    }
  }, [user, loading]);

  // Onboarding data check
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
          <motion.div className="h-6 w-6 rounded-full border-2 border-[#2A2A2E] border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
        </div>
      );
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <motion.div className="h-6 w-6 rounded-full border-2 border-[#2A2A2E] border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
      </div>
    );
  }

  const siteData = onboardingData.siteData;
  const userName = user?.email?.split("@")[0] || onboardingData.name;


  return (
    <CreditsProvider>
    <SubscriptionProvider>
    <div className="flex h-screen flex-col overflow-hidden bg-[#0A0A0B]">
      {/* Paywall Modal */}
      <Paywall open={paywallOpen} onClose={() => setPaywallOpen(false)} />

      {/* ─── Top Bar ──────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-[#1A1A1E] bg-[#0A0A0B] px-4 py-3 sm:px-6 shrink-0">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] sm:hidden" onClick={() => setMobileMenuOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9B9B9B" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <span className="font-heading text-sm font-bold text-white">RankMeBaddy</span>
        </div>

        {/* Center: Tabs (desktop only) */}
        <nav className="hidden sm:flex items-center gap-1">
          {topBarTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                activeSection === tab.id
                  ? "bg-[#1A1A1E] text-white"
                  : "text-[#6B6B6B] hover:text-[#9B9B9B] hover:bg-[#1A1A1E]/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right: User avatar + settings */}
        <div className="flex items-center gap-2">
          {activeSection === "chat" && (
            <button onClick={() => setMessages([])} className="flex items-center gap-1.5 rounded-full border border-[#2A2A2E] bg-[#1A1A1E] px-3 py-1.5 text-[11px] font-medium text-[#9B9B9B] transition-colors hover:text-white hover:border-[#3A3A3E] hover:bg-[#1E1E22]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
              New chat
            </button>
          )}
          <button
            onClick={() => setActiveSection("settings")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2A2A2E] bg-[#1A1A1E] text-[11px] font-bold text-white transition-colors hover:border-[#3A3A3E]"
            title="Settings"
          >
            {userName ? userName[0].toUpperCase() : "U"}
          </button>
        </div>
      </header>

      {/* ─── Mobile Menu Overlay ──────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0A0A0B] border-r border-[#1A1A1E] shadow-xl sm:hidden flex flex-col"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[#1A1A1E]">
                <span className="font-heading text-sm font-bold text-white">RankMeBaddy</span>
              </div>
              <nav className="flex-1 space-y-0.5 px-2 py-2">
                {topBarTabs.map((tab) => {
                  const isActive = activeSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveSection(tab.id); setMobileMenuOpen(false); }}
                      className={`flex w-full items-center rounded-lg px-3 py-2 text-[13px] transition-all ${
                        isActive
                          ? "bg-[#1A1A1E] text-white font-medium"
                          : "text-[#6B6B6B] hover:bg-[#1A1A1E] hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
                <button
                  onClick={() => { setActiveSection("settings"); setMobileMenuOpen(false); }}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-[13px] transition-all ${
                    activeSection === "settings"
                      ? "bg-[#1A1A1E] text-white font-medium"
                      : "text-[#6B6B6B] hover:bg-[#1A1A1E] hover:text-white"
                  }`}
                >
                  Settings
                </button>
                <button
                  onClick={() => { setActiveSection("pro"); setMobileMenuOpen(false); }}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-[13px] transition-all ${
                    activeSection === "pro"
                      ? "bg-[#1A1A1E] text-white font-medium"
                      : "text-[#6B6B6B] hover:bg-[#1A1A1E] hover:text-white"
                  }`}
                >
                  Pro
                </button>
              </nav>
              <div className="border-t border-[#1A1A1E] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A1A1E] text-[11px] font-bold text-white">
                    {userName ? userName[0].toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-white">{userName || "User"}</p>
                    <p className="text-[10px] text-[#6B6B6B]">{effectiveIsPro ? "Pro plan" : BETA_MODE ? "Beta - Free" : "Free plan"}</p>
                  </div>
                  <button
                    onClick={async () => { await signOut(); window.location.href = "/auth"; }}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-[#6B6B6B] hover:bg-[#1A1A1E] hover:text-white transition-colors"
                    title="Sign out"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Content area ─────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeSection === "chat" && (
            <motion.div key="chat" className="flex h-full flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              {messages.length === 0 ? (
                /* Clean welcome — straight to the point */
                <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6">
                  <motion.div
                    className="w-full max-w-2xl flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Input area — front and center */}
                    <motion.div
                      className="w-full mb-5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <AnimatedAIChat onSendMessage={sendMessage} isTyping={isSending} />
                    </motion.div>

                    {/* Quick action chips */}
                    <motion.div
                      className="flex flex-wrap justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {suggestedPrompts.map((prompt) => (
                        <SuggestedPromptChip
                          key={prompt.title}
                          title={prompt.title}
                          onClick={() => sendMessage(prompt.prompt)}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Messages area */}
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 custom-scrollbar-dark">
                    <div className="mx-auto max-w-2xl space-y-5">
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
                  <div className="border-t border-[#1A1A1E] bg-[#0A0A0B] px-4 py-3 sm:px-6 shrink-0">
                    <div className="mx-auto max-w-2xl">
                      <AnimatedAIChat onSendMessage={sendMessage} isTyping={isSending} />
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
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl font-bold text-white">RankMeBaddy Pro</h2>
                {BETA_MODE ? (
                  <>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1E] border border-[#2A2A2E] px-4 py-2 text-sm font-medium text-[#4ADE80]">
                      <div className="h-2 w-2 rounded-full bg-[#4ADE80] animate-pulse" />
                      Beta — All features unlocked for free
                    </div>
                    <p className="text-sm text-[#6B6B6B] max-w-sm mx-auto">You have full access to all Pro features during the beta. Enjoy unlimited SEO campaigns, all platforms, AI optimization, and more.</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-[#6B6B6B] max-w-sm mx-auto">Unlock unlimited SEO campaigns, all platforms, AI optimization, and priority support.</p>
                    <motion.button
                      onClick={() => setPaywallOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0A0A0B] shadow-lg transition-all hover:bg-[#E8E8E8]"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
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
    </SubscriptionProvider>
    </CreditsProvider>
  );
}
