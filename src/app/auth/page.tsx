"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Suspense } from "react";

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

  // If already logged in and verified, redirect
  useEffect(() => {
    if (!authLoading && user && emailVerified) {
      const onboarding = typeof window !== "undefined" ? localStorage.getItem("rankmebaddy_onboarding") : null;
      const destination = onboarding ? "/dashboard" : nextPath;
      router.replace(destination);
    }
  }, [user, authLoading, router, nextPath, emailVerified]);

  // Show verification required message if redirected from middleware
  useEffect(() => {
    if (verificationRequired) {
      setError("Please verify your email address before accessing the dashboard. Check your inbox for the confirmation link.");
    }
  }, [verificationRequired]);

  // If user exists but email not verified, show verification message
  useEffect(() => {
    if (!authLoading && user && !emailVerified) {
      setSuccess("Your email is not yet verified. Please check your inbox for the confirmation link, then sign in.");
    }
  }, [user, authLoading, emailVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
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
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const { error: err } = await signInWithGoogle();
      if (err) setError(err);
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  };

  // Show loading spinner while checking auth state
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
    <div className="relative flex min-h-screen items-center justify-center bg-[#09090B] px-4 overflow-hidden">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, #6A3093 0%, transparent 70%)" }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "radial-gradient(circle, #00D4AA 0%, transparent 70%)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[80px]"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-[420px]"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <div className="rounded-2xl border border-white/[0.08] bg-[#111113]/90 p-7 backdrop-blur-2xl shadow-2xl shadow-black/40">
          {/* Close button */}
          <div className="absolute right-4 top-4">
            <a
              href="/"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </a>
          </div>

          {/* Logo */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D4AA]/25 to-emerald-600/15 border border-[#00D4AA]/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="font-heading text-xl font-bold text-white">
              RankMeBaddy
            </h1>
            <p className="mt-1 text-[13px] text-[#71717A]">
              AI-powered multi-platform SEO agent
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20 px-2.5 py-1 text-[10px] font-medium text-[#00D4AA]">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
              Beta — Free for everyone
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 flex rounded-xl bg-white/[0.04] border border-white/[0.06] p-1">
            <button
              onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
              className={`flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-all ${
                mode === "signup"
                  ? "bg-[#00D4AA]/15 text-[#00D4AA] shadow-sm"
                  : "text-[#71717A] hover:text-white/60"
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className={`flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-all ${
                mode === "login"
                  ? "bg-[#00D4AA]/15 text-[#00D4AA] shadow-sm"
                  : "text-[#71717A] hover:text-white/60"
              }`}
            >
              Sign in
            </button>
          </div>

          {/* Social Login Buttons */}
          <div className="mb-5 space-y-2.5">
            <motion.button
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-[13px] font-medium text-white/80 transition-all hover:bg-white/[0.08] hover:border-white/[0.12]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
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
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-[13px] font-medium text-white/80 transition-all hover:bg-white/[0.08] hover:border-white/[0.12]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
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
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#111113] px-3 text-[10px] uppercase tracking-widest text-[#52525B]">
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
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525B]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 py-3 text-[13px] text-white placeholder-[#52525B] outline-none transition-all focus:border-[#00D4AA]/30 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#00D4AA]/10"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525B]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 py-3 text-[13px] text-white placeholder-[#52525B] outline-none transition-all focus:border-[#00D4AA]/30 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#00D4AA]/10"
              />
            </div>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52525B]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                placeholder="Password (6+ characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 py-3 text-[13px] text-white placeholder-[#52525B] outline-none transition-all focus:border-[#00D4AA]/30 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#00D4AA]/10"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-[12px] text-red-400">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 px-3.5 py-2.5"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#00D4AA] animate-pulse mt-1 shrink-0" />
                <p className="text-[12px] text-[#00D4AA]">{success}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#00D4AA] px-4 py-3 text-[13px] font-semibold text-[#09090B] transition-all hover:bg-[#00D4AA]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00D4AA]/20"
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
          <p className="mt-5 text-center text-[12px] text-[#52525B]">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
              className="font-semibold text-[#00D4AA] hover:underline"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-5 text-center text-[10px] text-[#3F3F46]">
          By continuing, you agree to RankMeBaddy&apos;s{" "}
          <a href="#" className="underline hover:text-white/40">Terms of Service</a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-white/40">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );
}

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
