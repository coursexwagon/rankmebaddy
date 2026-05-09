"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          : "border-b border-white/[0.05] bg-[#09090B]/80 backdrop-blur-xl"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-300 ${
            isHero ? "bg-white/10" : "bg-[#00D4AA]/10"
          }`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isHero ? "#fff" : "#00D4AA"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className={`font-heading text-sm font-bold transition-colors duration-300 ${
            isHero ? "text-white" : "text-white/80"
          }`}>
            RankMeBaddy
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <a href="#solution" className={`text-[13px] transition-colors hover:opacity-80 ${
            isHero ? "text-white/50 hover:text-white/70" : "text-white/40 hover:text-white/60"
          }`}>
            Features
          </a>
          <a href="#proof" className={`text-[13px] transition-colors hover:opacity-80 ${
            isHero ? "text-white/50 hover:text-white/70" : "text-white/40 hover:text-white/60"
          }`}>
            Results
          </a>
          <a href="#pricing" className={`text-[13px] transition-colors hover:opacity-80 ${
            isHero ? "text-white/50 hover:text-white/70" : "text-white/40 hover:text-white/60"
          }`}>
            Pricing
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="/auth"
            className={`hidden rounded-lg border px-4 py-2 text-[12px] font-medium transition-all duration-200 sm:inline-flex ${
              isHero
                ? "border-white/[0.12] text-white/50 hover:border-white/[0.2] hover:text-white/80 bg-white/[0.03]"
                : "border-white/[0.08] text-white/40 hover:border-white/[0.12] hover:text-white/60 bg-white/[0.02]"
            }`}
          >
            Log in
          </a>
          <a
            href="/auth"
            className={`rounded-lg px-4 py-2 text-[12px] font-semibold transition-all duration-200 ${
              isHero
                ? "bg-[#00D4AA] text-[#0A0A0B] hover:bg-[#00D4AA]/90 shadow-lg shadow-[#00D4AA]/15"
                : "bg-[#00D4AA] text-[#0A0A0B] hover:bg-[#00D4AA]/90 shadow-lg shadow-[#00D4AA]/10"
            }`}
          >
            Start free
          </a>

          {/* Mobile hamburger */}
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-lg border sm:hidden ${
              isHero ? "border-white/[0.12] text-white/50" : "border-white/[0.08] text-white/40"
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
              isHero ? "border-white/[0.05] bg-[#09090B]/90" : "border-white/[0.05] bg-[#09090B]/95"
            }`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-3">
              <a href="#solution" className={`text-sm ${isHero ? "text-white/50" : "text-white/40"}`} onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#proof" className={`text-sm ${isHero ? "text-white/50" : "text-white/40"}`} onClick={() => setMobileOpen(false)}>Results</a>
              <a href="#pricing" className={`text-sm ${isHero ? "text-white/50" : "text-white/40"}`} onClick={() => setMobileOpen(false)}>Pricing</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
