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

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#E8E5E0]/60 bg-[#FAFAF7]/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="font-heading text-sm font-bold text-[#1A1A1A]">
            RankMeBaddy
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <a href="#solution" className="text-[13px] text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]">
            Features
          </a>
          <a href="#proof" className="text-[13px] text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]">
            Results
          </a>
          <a href="#pricing" className="text-[13px] text-[#6B6B6B] transition-colors hover:text-[#1A1A1A]">
            Pricing
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="hidden rounded-lg border border-[#E8E5E0] bg-white px-4 py-2 text-[12px] font-medium text-[#6B6B6B] transition-colors hover:border-[#9B9B9B] hover:text-[#1A1A1A] sm:inline-flex"
          >
            Log in
          </a>
          <a
            href="/onboarding"
            className="rounded-lg bg-[#2563EB] px-4 py-2 text-[12px] font-semibold text-white transition-all hover:bg-blue-700"
          >
            Start free
          </a>

          {/* Mobile hamburger */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E5E0] sm:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2" strokeLinecap="round">
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
            className="border-t border-[#E8E5E0]/60 bg-[#FAFAF7]/95 px-4 py-4 backdrop-blur-xl sm:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-3">
              <a href="#solution" className="text-sm text-[#6B6B6B]" onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#proof" className="text-sm text-[#6B6B6B]" onClick={() => setMobileOpen(false)}>Results</a>
              <a href="#pricing" className="text-sm text-[#6B6B6B]" onClick={() => setMobileOpen(false)}>Pricing</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
