"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHero = !scrolled;
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHero
          ? "bg-transparent"
          : isDark
          ? "border-b border-white/10 bg-[#1A1A1A]/80 backdrop-blur-xl"
          : "border-b border-[#E8E5E0]/60 bg-[#FAFAF7]/80 backdrop-blur-xl"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-300 ${
            isHero ? "bg-white/10" : isDark ? "bg-white/10" : "bg-blue-50"
          }`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isHero ? "#fff" : isDark ? "#fff" : "#2563EB"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className={`font-heading text-sm font-bold transition-colors duration-300 ${
            isHero ? "text-white" : isDark ? "text-white" : "text-[#1A1A1A]"
          }`}>
            RankMeBaddy
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <a href="#solution" className={`text-[13px] transition-colors hover:opacity-80 ${
            isHero ? "text-white/70" : isDark ? "text-white/70" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
          }`}>
            Features
          </a>
          <a href="#proof" className={`text-[13px] transition-colors hover:opacity-80 ${
            isHero ? "text-white/70" : isDark ? "text-white/70" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
          }`}>
            Results
          </a>
          <a href="#pricing" className={`text-[13px] transition-colors hover:opacity-80 ${
            isHero ? "text-white/70" : isDark ? "text-white/70" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
          }`}>
            Pricing
          </a>
        </div>

        {/* CTA + Theme Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className={`hidden rounded-lg border px-4 py-2 text-[12px] font-medium transition-all sm:inline-flex ${
              isHero
                ? "border-white/20 text-white/70 hover:border-white/30 hover:text-white bg-white/5"
                : isDark
                ? "border-white/20 text-white/70 hover:text-white"
                : "border-[#E8E5E0] bg-white text-[#6B6B6B] hover:border-[#9B9B9B] hover:text-[#1A1A1A]"
            }`}
          >
            Log in
          </a>
          <a
            href="/onboarding"
            className={`rounded-lg px-4 py-2 text-[12px] font-semibold transition-all ${
              isHero
                ? "bg-white/15 text-white backdrop-blur-sm border border-white/20 hover:bg-white/25"
                : isDark
                ? "bg-white text-[#1A1A1A] hover:bg-white/90"
                : "bg-[#2563EB] text-white hover:bg-blue-700"
            }`}
          >
            Start free
          </a>

          {/* Theme toggle button */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                isHero
                  ? "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/15"
                  : isDark
                  ? "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/15"
                  : "bg-[#F5F5F0] text-[#6B6B6B] hover:bg-[#E8E5E0] hover:text-[#1A1A1A] border border-[#E8E5E0]"
              }`}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-lg border sm:hidden ${
              isHero ? "border-white/20 text-white/70" : isDark ? "border-white/20 text-white/70" : "border-[#E8E5E0] text-[#6B6B6B]"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={`border-t px-4 py-4 backdrop-blur-xl sm:hidden ${
              isHero ? "border-white/10 bg-[#1A1A2E]/80" : isDark ? "border-white/10 bg-[#1A1A1A]/95" : "border-[#E8E5E0]/60 bg-[#FAFAF7]/95"
            }`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-3">
              <a href="#solution" className={`text-sm ${isHero ? "text-white/70" : isDark ? "text-white/70" : "text-[#6B6B6B]"}`} onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#proof" className={`text-sm ${isHero ? "text-white/70" : isDark ? "text-white/70" : "text-[#6B6B6B]"}`} onClick={() => setMobileOpen(false)}>Results</a>
              <a href="#pricing" className={`text-sm ${isHero ? "text-white/70" : isDark ? "text-white/70" : "text-[#6B6B6B]"}`} onClick={() => setMobileOpen(false)}>Pricing</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
