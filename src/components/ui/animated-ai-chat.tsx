"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  SendIcon,
} from "lucide-react";
import { motion } from "framer-motion";
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

/* ─── Props ──────────────────────────────────────────────────── */
interface AnimatedAIChatProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  className?: string;
}

/* ─── Animated AI Chat Component ─────────────────────────────── */
export function AnimatedAIChat({ onSendMessage, isTyping, className }: AnimatedAIChatProps) {
  const [value, setValue] = useState("");
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
      onSendMessage(value.trim());
      setValue("");
      adjustHeight(true);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex items-end gap-3 rounded-2xl border border-[#2A2A2E] bg-[#1A1A1E] px-4 py-3 transition-colors focus-within:border-[#3A3A3E] focus-within:ring-1 focus-within:ring-white/5">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="What do you want to rank for?"
          rows={1}
          className="max-h-[120px] min-h-[20px] flex-1 resize-none bg-transparent text-[14px] text-[#E8E8E8] outline-none placeholder:text-[#4A4A4E]"
        />
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
