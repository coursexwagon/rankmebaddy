"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SendIcon } from "lucide-react";
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

  return { textareaRef, adjustHeight };
}

/* ─── Props ──────────────────────────────────────────────────── */
interface AnimatedAIChatProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  className?: string;
}

/* ─── Glass Chat Input Component ─────────────────────────────── */
export function AnimatedAIChat({ onSendMessage, isTyping, className }: AnimatedAIChatProps) {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 56, maxHeight: 160 });

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
      <div className="flex items-end gap-3 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] px-5 py-4 transition-all focus-within:bg-white/[0.09] focus-within:border-white/[0.15] focus-within:shadow-[0_0_30px_rgba(255,255,255,0.04)]">
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
          className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent text-[15px] text-white outline-none placeholder:text-white/25"
        />
        <motion.button
          onClick={handleSend}
          disabled={!value.trim() || isTyping}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all mb-0.5",
            value.trim()
              ? "bg-white text-[#0A0A0B] hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              : "bg-white/[0.06] text-white/20"
          )}
          whileHover={value.trim() ? { scale: 1.05 } : {}}
          whileTap={value.trim() ? { scale: 0.95 } : {}}
        >
          <SendIcon className="w-4 h-4" />
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
