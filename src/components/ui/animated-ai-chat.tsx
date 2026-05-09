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
  disabled?: boolean;
}

/* ─── Glass Chat Input Component — larger, premium ───────────── */
export function AnimatedAIChat({ onSendMessage, isTyping, className, disabled }: AnimatedAIChatProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 64, maxHeight: 200 });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        handleSend();
      }
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSendMessage(value.trim());
      setValue("");
      adjustHeight(true);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Gradient glow border effect on focus */}
      <div
        className={cn(
          "absolute -inset-[1px] rounded-2xl transition-all duration-500",
          isFocused && !disabled
            ? "bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-100"
            : "opacity-0"
        )}
      />

      <div
        className={cn(
          "relative flex items-end gap-3 rounded-2xl bg-white/[0.06] backdrop-blur-xl border px-5 py-4 transition-all duration-300",
          isFocused && !disabled
            ? "bg-white/[0.09] border-white/[0.15] shadow-[0_0_40px_rgba(255,255,255,0.06)]"
            : "border-white/[0.08]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "No credits remaining..." : "What do you want to rank for?"}
          rows={1}
          disabled={disabled}
          className="max-h-[160px] min-h-[28px] flex-1 resize-none bg-transparent text-[16px] text-white outline-none placeholder:text-white/25 leading-relaxed"
        />
        <motion.button
          onClick={handleSend}
          disabled={!value.trim() || isTyping || disabled}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all mb-0",
            value.trim() && !disabled
              ? "bg-white text-[#0A0A0B] hover:bg-white/90 shadow-[0_0_24px_rgba(255,255,255,0.12)]"
              : "bg-white/[0.06] text-white/20"
          )}
          whileHover={value.trim() && !disabled ? { scale: 1.05 } : {}}
          whileTap={value.trim() && !disabled ? { scale: 0.95 } : {}}
        >
          <SendIcon className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Press Enter to send hint */}
      <div className="mt-2 flex items-center justify-between px-1">
        <p className="text-[10px] text-white/20">
          Press <kbd className="px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white/30 font-mono text-[9px]">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white/30 font-mono text-[9px]">Shift+Enter</kbd> for new line
        </p>
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
