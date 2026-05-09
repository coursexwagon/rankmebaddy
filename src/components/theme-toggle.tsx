"use client";

import { useTheme } from "@/components/theme-provider";

export interface ThemeToggleProps {
  variant?: "default" | "icon";
  className?: string;
}

export function ThemeToggle({ variant = "default", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const isIcon = variant === "icon";

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
        isIcon
          ? "h-8 w-8 border border-[#E8E5E0] bg-white text-[#6B6B6B] hover:border-[#9B9B9B] dark:border-[#333333] dark:bg-[#1E1E1E] dark:text-[#9B9B9B] dark:hover:border-[#555555]"
          : "h-9 px-3 border border-[#E8E5E0] bg-white text-[#6B6B6B] text-sm hover:border-[#9B9B9B] dark:border-[#333333] dark:bg-[#1E1E1E] dark:text-[#9B9B9B] dark:hover:border-[#555555]"
      } ${className}`}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={theme === "dark"}
    >
      {theme === "light" ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      )}
    </button>
  );
}
