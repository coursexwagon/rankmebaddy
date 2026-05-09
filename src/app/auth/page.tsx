"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function AuthPage() {
  const { signInWithEmail, signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // If already logged in, redirect to onboarding or dashboard
  useEffect(() => {
    if (!authLoading && user) {
      const onboarding = typeof window !== "undefined" ? localStorage.getItem("rankmebaddy_onboarding") : null;
      router.replace(onboarding ? "/dashboard" : "/onboarding");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { error: err } = await signInWithEmail(email, password);
        if (err) {
          setError(err);
        } else {
          setSuccess("Welcome back! Redirecting...");
        }
      } else {
        const { error: err } = await signUp(email, password, name);
        if (err) {
          setError(err);
        } else {
          setSuccess("Account created! Check your email to confirm, then you'll be redirected.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] dark:bg-[#0F0F11] px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1A1A1A] dark:text-white">
            RankMeBaddy
          </h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            {mode === "login" ? "Welcome back" : "Start your SEO journey"}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 px-3 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Beta — Free for everyone
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#E8E5E0] dark:border-[#2A2A2E] bg-white dark:bg-[#1A1A1E] p-6 shadow-sm">
          {/* Google SSO */}
          <button
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E8E5E0] dark:border-[#2A2A2E] bg-white dark:bg-[#252528] px-4 py-3 text-sm font-medium text-[#1A1A1A] dark:text-white transition-all hover:bg-[#F5F5F0] dark:hover:bg-[#2A2A2E]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E8E5E0] dark:bg-[#2A2A2E]" />
            <span className="text-[11px] text-[#9B9B9B]">or</span>
            <div className="h-px flex-1 bg-[#E8E5E0] dark:bg-[#2A2A2E]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E5E0] dark:border-[#2A2A2E] bg-[#FAFAF7] dark:bg-[#0F0F11] px-4 py-3 text-sm text-[#1A1A1A] dark:text-white placeholder-[#9B9B9B] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-[#E8E5E0] dark:border-[#2A2A2E] bg-[#FAFAF7] dark:bg-[#0F0F11] px-4 py-3 text-sm text-[#1A1A1A] dark:text-white placeholder-[#9B9B9B] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-[#E8E5E0] dark:border-[#2A2A2E] bg-[#FAFAF7] dark:bg-[#0F0F11] px-4 py-3 text-sm text-[#1A1A1A] dark:text-white placeholder-[#9B9B9B] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[12px] text-red-500"
              >
                {error}
              </motion.p>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[12px] text-emerald-600 dark:text-emerald-400">{success}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          {/* Toggle */}
          <p className="mt-4 text-center text-[12px] text-[#6B6B6B]">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-[10px] text-[#9B9B9B]">
          By continuing, you agree to RankMeBaddy&apos;s Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
