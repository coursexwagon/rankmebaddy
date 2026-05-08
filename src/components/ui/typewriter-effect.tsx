"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypewriterEffectProps {
  words: string;
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  startDelay?: number;
}

export function TypewriterEffect({
  words,
  className,
  cursorClassName,
  typingSpeed = 40,
  startDelay = 800,
}: TypewriterEffectProps) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Start after delay
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timer);
  }, [startDelay]);

  // Typing effect
  useEffect(() => {
    if (!started) return;
    if (currentIndex < words.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + words[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, words, typingSpeed, started]);

  // Blinking cursor after typing is done
  useEffect(() => {
    if (currentIndex >= words.length) {
      const interval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530);
      return () => clearInterval(interval);
    }
  }, [currentIndex, words.length]);

  return (
    <span className={cn("inline", className)}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {currentText}
      </motion.span>
      <span
        className={cn(
          "inline-block w-[2px] translate-y-[0.05em] bg-green-400 ml-[1px]",
          showCursor ? "opacity-100" : "opacity-0",
          cursorClassName
        )}
        style={{ height: "1.1em" }}
      />
    </span>
  );
}
