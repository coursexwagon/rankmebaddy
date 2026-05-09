"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  SearchIcon,
  ShieldCheck,
  BarChart3,
  Sparkles,
  SendIcon,
  Paperclip,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

/* ─── Auto-resize textarea hook ──────────────────────────────── */
interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY));
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = `${minHeight}px`;
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

/* ─── Types ──────────────────────────────────────────────────── */
interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

/* ─── SEO Commands ───────────────────────────────────────────── */
const commandSuggestions: CommandSuggestion[] = [
  {
    icon: <SearchIcon className="w-3.5 h-3.5" />,
    label: "Rank",
    description: "Start a ranking campaign",
    prefix: "/rank",
  },
  {
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    label: "Analyze",
    description: "Full SEO site analysis",
    prefix: "/analyze",
  },
  {
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    label: "Audit",
    description: "Audit a page for SEO",
    prefix: "/audit",
  },
  {
    icon: <Sparkles className="w-3.5 h-3.5" />,
    label: "Optimize",
    description: "Optimize content for SEO",
    prefix: "/optimize",
  },
  {
    icon: <SearchIcon className="w-3.5 h-3.5" />,
    label: "Search",
    description: "Search the web for data",
    prefix: "/search",
  },
  {
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    label: "Workflow",
    description: "SEO workflow diagram",
    prefix: "/workflow",
  },
];

/* ─── Props ──────────────────────────────────────────────────── */
interface AnimatedAIChatProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  className?: string;
}

/* ─── Animated AI Chat Component ─────────────────────────────── */
export function AnimatedAIChat({ onSendMessage, isTyping, className }: AnimatedAIChatProps) {
  const [value, setValue] = useState("");
  const [deepThinking, setDeepThinking] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 44, maxHeight: 160 });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        handleSend();
      }
    }
  };

  const handleSend = () => {
    if (value.trim()) {
      const prefix = deepThinking ? "Think deeply about this: " : "";
      onSendMessage(prefix + value.trim());
      setValue("");
      adjustHeight(true);
    }
  };

  const handleAttachFile = () => {
    // Placeholder for file attachment
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Input area */}
      <div className="flex items-end gap-3 rounded-2xl border border-[#2A2A2E] bg-[#1A1A1E] px-4 py-3 transition-colors focus-within:border-[#3A3A3E] focus-within:ring-1 focus-within:ring-white/5">
        {/* Left side icons */}
        <div className="flex items-center gap-1 pb-0.5">
          <button
            type="button"
            onClick={handleAttachFile}
            className="p-1.5 text-[#6B6B6B] hover:text-[#9B9B9B] rounded-lg transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeepThinking(!deepThinking)}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              deepThinking
                ? "text-amber-400 bg-amber-400/10"
                : "text-[#6B6B6B] hover:text-[#9B9B9B]"
            )}
            title="Deep thinking mode"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or make a request..."
          rows={1}
          className="max-h-[120px] min-h-[20px] flex-1 resize-none bg-transparent text-[14px] text-[#E8E8E8] outline-none placeholder:text-[#6B6B6B]"
        />

        {/* Send button */}
        <motion.button
          onClick={handleSend}
          disabled={!value.trim() || isTyping}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all mb-0.5",
            value.trim()
              ? "bg-white text-[#0A0A0B] hover:bg-[#E8E8E8]"
              : "bg-[#2A2A2E] text-[#6B6B6B]"
          )}
          whileHover={value.trim() ? { scale: 1.05 } : {}}
          whileTap={value.trim() ? { scale: 0.95 } : {}}
        >
          <SendIcon className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Command chips below input */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {commandSuggestions.map((suggestion) => (
          <button
            key={suggestion.prefix}
            onClick={() => {
              setValue(suggestion.prefix + " ");
              textareaRef.current?.focus();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#2A2A2E] bg-[#1A1A1E] px-2.5 py-1 text-[10px] text-[#9B9B9B] transition-colors hover:border-[#3A3A3E] hover:text-white"
          >
            {suggestion.icon}
            <span>{suggestion.label}</span>
          </button>
        ))}
      </div>

      {/* Deep thinking indicator */}
      <AnimatePresence>
        {deepThinking && (
          <motion.div
            className="mt-2 flex items-center gap-2 text-[10px] text-amber-400/70"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Lightbulb className="w-3 h-3" />
            Deep thinking mode enabled — AI will provide more detailed analysis
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Typing Dots ───────────────────────────────────────────── */
export function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 bg-white/40 rounded-full"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
