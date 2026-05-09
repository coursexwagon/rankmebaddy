"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send, Paperclip, ArrowUp } from "lucide-react";
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

/* ─── Glass Chat Input — iOS26 liquid glass, spacious, turquoise accent ─ */
export function AnimatedAIChat({ onSendMessage, isTyping, className, disabled }: AnimatedAIChatProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 80, maxHeight: 240 });

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

  const canSend = value.trim() && !disabled && !isTyping;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Outer glow ring on focus */}
      <div
        className={cn(
          "absolute -inset-[1.5px] rounded-[22px] transition-all duration-500 pointer-events-none",
          isFocused && !disabled
            ? "opacity-100"
            : "opacity-0"
        )}
        style={{
          background: isFocused && !disabled
            ? "linear-gradient(135deg, rgba(0,212,170,0.2), rgba(255,255,255,0.08), rgba(0,212,170,0.15))"
            : "transparent",
        }}
      />

      <div
        className={cn(
          "glass-input relative flex items-end gap-3 bg-white/[0.06] px-5 py-5 transition-all duration-400",
          isFocused && !disabled
            ? "bg-white/[0.09] border-white/[0.15]"
            : "border-white/[0.08]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Paperclip / file attachment button */}
        <motion.button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all mb-0.5",
            "bg-white/[0.06] border border-white/[0.08] text-white/30",
            "hover:bg-white/[0.1] hover:text-white/60 hover:border-white/[0.12]",
            disabled && "opacity-40 cursor-not-allowed"
          )}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          title="Attach file"
        >
          <Paperclip className="w-[18px] h-[18px]" />
        </motion.button>

        {/* Textarea — spacious, auto-growing */}
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
          placeholder={disabled ? "No credits remaining..." : "Ask me anything......"}
          rows={1}
          disabled={disabled}
          className="max-h-[200px] min-h-[36px] flex-1 resize-none bg-transparent text-[16px] text-white outline-none placeholder:text-white/20 leading-relaxed py-1"
        />

        {/* Send button — turquoise/cyan, prominent */}
        <motion.button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all mb-0.5",
            canSend
              ? "bg-[#00D4AA] text-white shadow-[0_0_24px_rgba(0,212,170,0.25)] hover:bg-[#00E4BA] hover:shadow-[0_0_32px_rgba(0,212,170,0.35)]"
              : "bg-white/[0.06] text-white/20 border border-white/[0.08]"
          )}
          whileHover={canSend ? { scale: 1.06 } : {}}
          whileTap={canSend ? { scale: 0.94 } : {}}
        >
          <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Hint text */}
      <div className="mt-2.5 flex items-center justify-between px-2">
        <p className="text-[11px] text-white/20">
          Press <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/25 font-mono text-[10px]">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/25 font-mono text-[10px]">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}

/* ─── Typing Dots — turquoise accent ──────────────────────── */
export function TypingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]/60"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
