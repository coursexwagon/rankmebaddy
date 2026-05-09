"use client";

import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  SearchIcon,
  FileUp,
  ShieldCheck,
  BarChart3,
  Sparkles,
  SendIcon,
  XIcon,
  LoaderIcon,
  Command,
  Paperclip,
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
    icon: <SearchIcon className="w-4 h-4" />,
    label: "Rank",
    description: "Start a ranking campaign for a keyword",
    prefix: "/rank",
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    label: "Analyze Site",
    description: "Run a full SEO site analysis",
    prefix: "/analyze",
  },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    label: "Audit Page",
    description: "Audit a specific page for SEO issues",
    prefix: "/audit",
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Optimize",
    description: "Optimize existing content for SEO",
    prefix: "/optimize",
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
  const [attachments, setAttachments] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [recentCommand, setRecentCommand] = useState<string | null>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 48, maxHeight: 160 });
  const commandPaletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true);
      const idx = commandSuggestions.findIndex((cmd) => cmd.prefix.startsWith(value));
      setActiveSuggestion(idx >= 0 ? idx : -1);
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const commandButton = document.querySelector("[data-command-button]");
      if (commandPaletteRef.current && !commandPaletteRef.current.contains(target) && !commandButton?.contains(target)) {
        setShowCommandPalette(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) => (prev < commandSuggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : commandSuggestions.length - 1));
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion];
          setValue(selectedCommand.prefix + " ");
          setShowCommandPalette(false);
          setRecentCommand(selectedCommand.label);
          setTimeout(() => setRecentCommand(null), 3500);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowCommandPalette(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
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

  const handleAttachFile = () => {
    const mockFileName = `file-${Math.floor(Math.random() * 1000)}.pdf`;
    setAttachments((prev) => [...prev, mockFileName]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index];
    setValue(selectedCommand.prefix + " ");
    setShowCommandPalette(false);
    setRecentCommand(selectedCommand.label);
    setTimeout(() => setRecentCommand(null), 2000);
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Command palette */}
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div
            ref={commandPaletteRef}
            className="absolute left-4 right-4 bottom-full mb-2 rounded-xl border border-[#E8E5E0] dark:border-[#2A2A2E] bg-white dark:bg-[#1A1A1E] z-50 shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
          >
            <div className="py-1">
              {commandSuggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.prefix}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer",
                    activeSuggestion === index
                      ? "bg-blue-50 dark:bg-[#2563EB]/10 text-[#1A1A1A] dark:text-white"
                      : "text-[#6B6B6B] dark:text-[#9B9B9B] hover:bg-[#F5F5F0] dark:hover:bg-[#252528]"
                  )}
                  onClick={() => selectCommandSuggestion(index)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="w-5 h-5 flex items-center justify-center text-[#9B9B9B] dark:text-[#6B6B6B]">
                    {suggestion.icon}
                  </div>
                  <div className="font-medium text-[#1A1A1A] dark:text-[#C8C8C8]">{suggestion.label}</div>
                  <div className="text-[#9B9B9B] dark:text-[#6B6B6B] text-xs ml-1">{suggestion.prefix}</div>
                  <div className="ml-auto text-[10px] text-[#9B9B9B] dark:text-[#6B6B6B]">{suggestion.description}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent command indicator */}
      <AnimatePresence>
        {recentCommand && (
          <motion.div
            className="absolute left-4 bottom-full mb-2 rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/20 border border-[#2563EB]/20 dark:border-[#2563EB]/30 px-3 py-1 text-[10px] font-medium text-[#2563EB] dark:text-blue-300"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            {recentCommand}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachments */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            className="mb-2 flex gap-2 flex-wrap"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {attachments.map((file, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 text-xs bg-[#F5F0EB] dark:bg-[#252528] py-1.5 px-3 rounded-lg text-[#1A1A1A] dark:text-[#9B9B9B]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <FileUp className="w-3 h-3 text-[#9B9B9B]" />
                <span>{file}</span>
                <button onClick={() => removeAttachment(index)} className="text-[#9B9B9B] hover:text-[#1A1A1A] dark:hover:text-white transition-colors">
                  <XIcon className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex items-end gap-2 rounded-2xl border border-[#E8E5E0] dark:border-[#2A2A2E] bg-white dark:bg-[#1E1E22] px-4 py-3 transition-colors focus-within:border-[#2563EB]/30 dark:focus-within:border-[#2563EB]/40 focus-within:ring-1 focus-within:ring-[#2563EB]/10 dark:focus-within:ring-[#2563EB]/20">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask RankMeBaddy to rank anything... (/ for commands)"
          rows={1}
          className="max-h-[120px] min-h-[20px] flex-1 resize-none bg-transparent text-[14px] text-[#1A1A1A] dark:text-[#E8E8E8] outline-none placeholder:text-[#9B9B9B] dark:placeholder:text-[#6B6B6B]"
        />

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleAttachFile}
            className="p-1.5 text-[#9B9B9B] dark:text-[#6B6B6B] hover:text-[#1A1A1A] dark:hover:text-white rounded-lg transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-command-button
            onClick={(e) => {
              e.stopPropagation();
              setShowCommandPalette((prev) => !prev);
            }}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              showCommandPalette
                ? "bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#2563EB]/20 dark:text-blue-300"
                : "text-[#9B9B9B] dark:text-[#6B6B6B] hover:text-[#1A1A1A] dark:hover:text-white"
            )}
          >
            <Command className="w-4 h-4" />
          </button>
          <motion.button
            onClick={handleSend}
            disabled={!value.trim() || isTyping}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
              value.trim()
                ? "bg-gradient-to-br from-[#2563EB] to-[#6A3093] text-white shadow-sm"
                : "bg-[#F5F5F0] dark:bg-[#2A2A2E] text-[#9B9B9B] dark:text-[#6B6B6B]"
            )}
            whileHover={value.trim() ? { scale: 1.05 } : {}}
            whileTap={value.trim() ? { scale: 0.95 } : {}}
          >
            {isTyping ? (
              <LoaderIcon className="w-3.5 h-3.5 animate-[spin_2s_linear_infinite]" />
            ) : (
              <SendIcon className="w-3.5 h-3.5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Quick command chips */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {commandSuggestions.map((suggestion) => (
          <button
            key={suggestion.prefix}
            onClick={() => selectCommandSuggestion(commandSuggestions.indexOf(suggestion))}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E5E0] dark:border-[#2A2A2E] bg-white dark:bg-[#1E1E22] px-2.5 py-1 text-[10px] text-[#6B6B6B] dark:text-[#9B9B9B] transition-colors hover:border-[#9B9B9B] dark:hover:border-[#444] hover:text-[#1A1A1A] dark:hover:text-white"
          >
            {suggestion.icon}
            <span>{suggestion.label}</span>
          </button>
        ))}
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
          className="w-1.5 h-1.5 bg-[#2563EB] dark:bg-blue-400 rounded-full"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
