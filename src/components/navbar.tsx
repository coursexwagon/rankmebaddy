"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
          ? "border-b border-[#27272A]/40 bg-[#0A0A0B]/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-icon.png"
            alt="RankMeBaddy"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-heading text-sm font-bold text-[#FAFAFA]">
            RankMeBaddy
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <a href="#solution" className="text-[13px] text-[#71717A] transition-colors hover:text-[#A1A1AA]">
            Features
          </a>
          <a href="#proof" className="text-[13px] text-[#71717A] transition-colors hover:text-[#A1A1AA]">
            Results
          </a>
          <a href="#pricing" className="text-[13px] text-[#71717A] transition-colors hover:text-[#A1A1AA]">
            Pricing
          </a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="/onboarding"
            className="hidden rounded-full border border-[#27272A] bg-[#18181B] px-4 py-2 text-[12px] font-medium text-[#A1A1AA] transition-colors hover:border-[#3F3F46] hover:text-[#FAFAFA] sm:inline-flex"
          >
            Log in
          </a>
          <a
            href="/onboarding"
            className="rounded-full bg-[#6EE7B7] px-4 py-2 text-[12px] font-semibold text-[#0A0A0B] transition-all hover:bg-[#6EE7B7]/90"
          >
            Start free
          </a>

          {/* Mobile hamburger */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#27272A] sm:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round">
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
            className="border-t border-[#27272A]/40 bg-[#0A0A0B]/95 px-4 py-4 backdrop-blur-xl sm:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-3">
              <a href="#solution" className="text-sm text-[#A1A1AA]" onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#proof" className="text-sm text-[#A1A1AA]" onClick={() => setMobileOpen(false)}>Results</a>
              <a href="#pricing" className="text-sm text-[#A1A1AA]" onClick={() => setMobileOpen(false)}>Pricing</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
