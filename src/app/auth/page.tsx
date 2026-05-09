"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Suspense } from "react";

/* ─── Floating Particles for Brand Side ────────────────────── */
function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? "#00D4AA" : i % 3 === 1 ? "rgba(255,255,255,0.4)" : "rgba(0,212,170,0.3)",
          }}
          animate={{
            y: [0, -(Math.random() * 80 + 40), 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0, Math.random() * 0.6 + 0.2, 0],
          }}
          transition={{
            duration: Math.random() * 6 + 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated Grid Lines for Brand Side ────────────────────── */
function AnimatedGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, #09090B 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2, delay: 1 }}
      />
    </div>
  );
}

/* ─── Brand Side Content ──────────────────────────────────── */
function BrandSide() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-[#09090B] p-8 sm:p-10 lg:p-12">
      {/* Gradient background layers */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(0,212,170,0.18) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 70% 60%, rgba(0,212,170,0.08) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute left-[15%] top-[20%] h-[300px] w-[300px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "radial-gradient(circle, #00D4AA 0%, transparent 70%)" }}
        animate={{ x: [0, 30, -20, 0], y: [0, -25, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[15%] h-[250px] w-[250px] rounded-full opacity-15 blur-[80px]"
        style={{ background: "radial-gradient(circle, #00D4AA 0%, transparent 70%)" }}
        animate={{ x: [0, -25, 15, 0], y: [0, 20, -30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <AnimatedGrid />
      <FloatingParticles />

      {/* Top: Logo */}
      <div className="relative z-10">
        <a href="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D4AA]/25 to-emerald-600/15 border border-[#00D4AA]/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="font-heading text-lg font-bold text-white">RankMeBaddy</span>
        </a>
      </div>

      {/* Center: Tagline */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <motion.h2
          className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Your SEO,{" "}
          <span className="relative inline-block">
            automated
            <svg className="absolute -bottom-1 left-0 w-full overflow-visible" viewBox="0 0 200 12" preserveAspectRatio="none" style={{ height: "0.12em" }}>
              <motion.path d="M2,8 C40,3 80,11 120,6 C150,2 175,9 198,5" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1, ease: "easeOut" }} />
            </svg>
          </span>
          .
        </motion.h2>
        <motion.p
          className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/50"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Rank across Google, YouTube, Amazon, TikTok, and AI Search — all from a single AI agent.
        </motion.p>

        {/* Mini metric cards */}
        <motion.div
          className="mt-8 flex gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {[
            { label: "Platforms", value: "5+" },
            { label: "Avg. improvement", value: "+35" },
            { label: "Time to rank", value: "14d" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
            >
              <p className="font-heading text-lg font-bold text-[#00D4AA]">{stat.value}</p>
              <p className="text-[10px] text-white/30">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom: Testimonial */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
      >
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-xl">
          <p className="text-[13px] leading-relaxed text-white/50 italic">
            &ldquo;RankMeBaddy gave us the exact keywords and content to rank #3 on Google in 14 days. We just implemented what it suggested.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00D4AA]/15 text-[11px] font-bold text-[#00D4AA]">
              S
            </div>
            <div>
              <p className="text-[12px] font-medium text-white/70">Sarah C.</p>
              <p className="text-[10px] text-white/30">Head of Content, FitContent</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Floating Label Input ─────────────────────────────────── */
function FloatingLabelInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  minLength,
  icon,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  icon: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525B] transition-colors duration-200" style={{ opacity: isFloating ? 0.5 : 1 }}>
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        minLength={minLength}
        className="peer w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 pt-5 pb-2 text-[13px] text-white placeholder-transparent outline-none transition-all duration-200 focus:border-[#00D4AA]/30 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#00D4AA]/8"
        placeholder={label}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-10 transition-all duration-200 ${
          isFloating
            ? "top-2 text-[9px] font-medium text-[#00D4AA]/70"
            : "top-1/2 -translate-y-1/2 text-[13px] text-[#52525B]"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

/* ─── Auth Form ────────────────────────────────────────────── */
function AuthForm() {
  const { signInWithEmail, signUp, signInWithGoogle, user, loading: authLoading, emailVerified } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const nextPath = searchParams.get("next") || "/onboarding";
  const verificationRequired = searchParams.get("verification_required") === "true";

  useEffect(() => {
    if (!authLoading && user && emailVerified) {
      const onboarding = typeof window !== "undefined" ? localStorage.getItem("rankmebaddy_onboarding") : null;
      const destination = onboarding ? "/dashboard" : nextPath;
      router.replace(destination);
    }
  }, [user, authLoading, router, nextPath, emailVerified]);

  useEffect(() => {
    if (verificationRequired) {
      setError("Please verify your email address before accessing the dashboard. Check your inbox for the confirmation link.");
    }
  }, [verificationRequired]);

  useEffect(() => {
    if (!authLoading && user && !emailVerified) {
      setSuccess("Your email is not yet verified. Please check your inbox for the confirmation link, then sign in.");
    }
  }, [user, authLoading, emailVerified]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { error: err } = await signInWithEmail(email, password);
        if (err) {
          if (err.includes("Invalid login credentials")) {
            setError("Wrong email or password. Try again or create a new account.");
          } else if (err.includes("Email not confirmed")) {
            setError("Please check your email and click the confirmation link first, then sign in.");
          } else {
            setError(err);
          }
        } else {
          setSuccess("Welcome back! Redirecting...");
        }
      } else {
        const { error: err } = await signUp(email, password, name);
        if (err) {
          if (err.includes("already registered")) {
            setError("This email is already registered. Try signing in instead.");
          } else {
            setError(err);
          }
        } else {
          setSuccess("Account created! Check your email to verify, then sign in.");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [mode, email, password, name, signInWithEmail, signUp]);

  const handleGoogleSignIn = useCallback(async () => {
    setError("");
    try {
      const { error: err } = await signInWithGoogle();
      if (err) setError(err);
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  }, [signInWithGoogle]);

  const switchMode = useCallback((newMode: "login" | "signup") => {
    setMode(newMode);
    setError("");
    setSuccess("");
  }, []);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#00D4AA]/20 border-t-[#00D4AA] animate-spin" />
          <p className="text-sm text-[#71717A]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#09090B]">
      {/* ── Left: Brand Side (hidden on mobile) ── */}
      <div className="relative hidden lg:flex lg:w-[52%]">
        <BrandSide />
      </div>

      {/* ── Right: Form Side ── */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-8 sm:px-8">
        {/* Subtle background elements for mobile/single page */}
        <div className="pointer-events-none absolute inset-0 lg:hidden">
          <div
            className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full opacity-15 blur-[100px]"
            style={{ background: "radial-gradient(circle, #00D4AA 0%, transparent 70%)" }}
          />
          <div
            className="absolute right-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full opacity-10 blur-[80px]"
            style={{ background: "radial-gradient(circle, #00D4AA 0%, transparent 70%)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* Form Container */}
        <motion.div
          className="relative z-10 w-full max-w-[420px]"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {/* Glass Card */}
          <div className="relative rounded-2xl border border-white/[0.06] bg-[#0F0F11]/80 p-7 backdrop-blur-3xl shadow-2xl shadow-black/50">
            {/* Subtle gradient border highlight at top */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#00D4AA]/20 to-transparent" />

            {/* Close button */}
            <div className="absolute right-4 top-4">
              <a
                href="/"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/25 transition-colors hover:bg-white/[0.06] hover:text-white/50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </a>
            </div>

            {/* Logo (visible on all screens; on desktop it's more of a small header) */}
            <div className="mb-7 text-center">
              {/* Mobile-only larger logo area */}
              <div className="lg:hidden mb-5">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D4AA]/25 to-emerald-600/15 border border-[#00D4AA]/20">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h1 className="font-heading text-xl font-bold text-white">RankMeBaddy</h1>
              </div>

              {/* Desktop: simpler header */}
              <div className="hidden lg:block mb-1">
                <h1 className="font-heading text-2xl font-bold text-white">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h1>
              </div>

              <p className="text-[13px] text-[#71717A]">
                {mode === "login" ? "Sign in to continue to your dashboard" : "Get started with AI-powered SEO"}
              </p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#00D4AA]/8 border border-[#00D4AA]/15 px-2.5 py-1 text-[10px] font-medium text-[#00D4AA]">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                Beta — Free for everyone
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 flex rounded-xl bg-white/[0.03] border border-white/[0.06] p-1">
              <button
                onClick={() => switchMode("signup")}
                className={`relative flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                  mode === "signup"
                    ? "text-[#00D4AA]"
                    : "text-[#52525B] hover:text-white/50"
                }`}
              >
                {mode === "signup" && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-[#00D4AA]/10 border border-[#00D4AA]/15"
                    layoutId="authTab"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">Sign up</span>
              </button>
              <button
                onClick={() => switchMode("login")}
                className={`relative flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                  mode === "login"
                    ? "text-[#00D4AA]"
                    : "text-[#52525B] hover:text-white/50"
                }`}
              >
                {mode === "login" && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-[#00D4AA]/10 border border-[#00D4AA]/15"
                    layoutId="authTab"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">Sign in</span>
              </button>
            </div>

            {/* Social Login Buttons */}
            <div className="mb-5 space-y-2.5">
              <motion.button
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-[13px] font-medium text-white/70 transition-all duration-200 hover:bg-white/[0.06] hover:border-white/[0.1] hover:text-white/90"
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </motion.button>
              <motion.button
                onClick={() => setError("Apple sign-in coming soon. Please use email or Google.")}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-[13px] font-medium text-white/70 transition-all duration-200 hover:bg-white/[0.06] hover:border-white/[0.1] hover:text-white/90"
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.05]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0F0F11] px-3 text-[10px] uppercase tracking-[0.15em] text-[#3F3F46]">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="overflow-hidden"
                  >
                    <FloatingLabelInput
                      id="name"
                      label="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <FloatingLabelInput
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                }
              />

              <FloatingLabelInput
                id="password"
                label="Password (6+ characters)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
              />

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-2 rounded-xl bg-red-500/8 border border-red-500/15 px-3.5 py-2.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <p className="text-[12px] text-red-400">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-2 rounded-xl bg-[#00D4AA]/8 border border-[#00D4AA]/15 px-3.5 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00D4AA] animate-pulse mt-1 shrink-0" />
                      <p className="text-[12px] text-[#00D4AA]">{success}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#00D4AA] px-4 py-3 text-[13px] font-semibold text-[#09090B] transition-all duration-200 hover:bg-[#00D4AA]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00D4AA]/15 hover:shadow-[#00D4AA]/25"
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.99 } : {}}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-[#09090B]/30 border-t-[#09090B] animate-spin" />
                    <span>Please wait...</span>
                  </div>
                ) : mode === "login" ? "Sign in" : "Create an account"}
              </motion.button>
            </form>

            {/* Toggle */}
            <p className="mt-5 text-center text-[12px] text-[#3F3F46]">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                className="font-semibold text-[#00D4AA] hover:text-[#00D4AA]/80 transition-colors"
              >
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-5 text-center text-[10px] text-[#3F3F46]">
            By continuing, you agree to RankMeBaddy&apos;s{" "}
            <a href="#" className="underline hover:text-white/30 transition-colors">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-white/30 transition-colors">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Page Export ──────────────────────────────────────────── */
export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-[#00D4AA]/20 border-t-[#00D4AA] animate-spin" />
            <p className="text-sm text-[#71717A]">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
