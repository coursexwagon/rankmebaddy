"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const isHero = !scrolled;

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHero
          ? "bg-transparent"
          : theme === "dark"
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
            isHero ? "bg-white/10" : theme === "dark" ? "bg-white/10" : "bg-blue-50"
          }`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isHero ? "#fff" : theme === "dark" ? "#fff" : "#2563EB"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className={`font-heading text-sm font-bold transition-colors duration-300 ${
            isHero ? "text-white" : theme === "dark" ? "text-white" : "text-[#1A1A1A]"
          }`}>
            RankMeBaddy
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <a href="#solution" className={`text-[13px] transition-colors hover:opacity-80 ${
            isHero ? "text-white/70" : theme === "dark" ? "text-white/70" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
          }`}>
            Features
          </a>
          <a href="#proof" className={`text-[13px] transition-colors hover:opacity-80 ${
            isHero ? "text-white/70" : theme === "dark" ? "text-white/70" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
          }`}>
            Results
          </a>
          <a href="#pricing" className={`text-[13px] transition-colors hover:opacity-80 ${
            isHero ? "text-white/70" : theme === "dark" ? "text-white/70" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
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
                : theme === "dark"
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
                : theme === "dark"
                ? "bg-white text-[#1A1A1A] hover:bg-white/90"
                : "bg-[#2563EB] text-white hover:bg-blue-700"
            }`}
          >
            Start free
          </a>

          {/* Theme toggle */}
          <ThemeToggle
            variant="icon"
            defaultTheme="light"
            buttonSize={32}
            duration={400}
            onThemeChange={(t) => setTheme(t)}
          />

          {/* Mobile hamburger */}
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-lg border sm:hidden ${
              isHero ? "border-white/20 text-white/70" : theme === "dark" ? "border-white/20 text-white/70" : "border-[#E8E5E0] text-[#6B6B6B]"
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
              isHero ? "border-white/10 bg-[#1A1A2E]/80" : theme === "dark" ? "border-white/10 bg-[#1A1A1A]/95" : "border-[#E8E5E0]/60 bg-[#FAFAF7]/95"
            }`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-3">
              <a href="#solution" className={`text-sm ${isHero ? "text-white/70" : theme === "dark" ? "text-white/70" : "text-[#6B6B6B]"}`} onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#proof" className={`text-sm ${isHero ? "text-white/70" : theme === "dark" ? "text-white/70" : "text-[#6B6B6B]"}`} onClick={() => setMobileOpen(false)}>Results</a>
              <a href="#pricing" className={`text-sm ${isHero ? "text-white/70" : theme === "dark" ? "text-white/70" : "text-[#6B6B6B]"}`} onClick={() => setMobileOpen(false)}>Pricing</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
