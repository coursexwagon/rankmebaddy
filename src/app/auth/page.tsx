"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Suspense } from "react";

function AuthForm() {
  const { signInWithEmail, signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const nextPath = searchParams.get("next") || "/onboarding";

  // If already logged in, redirect
  useEffect(() => {
    if (!authLoading && user) {
      const onboarding = typeof window !== "undefined" ? localStorage.getItem("rankmebaddy_onboarding") : null;
      const destination = onboarding ? "/dashboard" : nextPath;
      router.replace(destination);
    }
  }, [user, authLoading, router, nextPath]);

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
          // During beta, try to auto-confirm via our API
          try {
            await fetch("/api/auth/auto-confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
          } catch {
            // Auto-confirm may fail, that's ok
          }
          setSuccess("Account created! Redirecting...");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking auth state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#2A2A2E] border-t-white animate-spin" />
          <p className="text-sm text-[#6B6B6B]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B] px-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-heading text-xl font-bold text-white">
            RankMeBaddy
          </h1>
          <p className="mt-1 text-[13px] text-[#6B6B6B]">
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1E] border border-[#2A2A2E] px-2.5 py-1 text-[10px] font-medium text-[#4ADE80]">
            <div className="h-1.5 w-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
            Beta — Free for everyone
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#1A1A1E] bg-[#111113] p-5">
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
                    className="w-full rounded-xl border border-[#2A2A2E] bg-[#0A0A0B] px-4 py-3 text-sm text-white placeholder-[#4A4A4E] outline-none focus:border-[#3A3A3E] focus:ring-1 focus:ring-white/5 transition-all"
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
              className="w-full rounded-xl border border-[#2A2A2E] bg-[#0A0A0B] px-4 py-3 text-sm text-white placeholder-[#4A4A4E] outline-none focus:border-[#3A3A3E] focus:ring-1 focus:ring-white/5 transition-all"
            />
            <input
              type="password"
              placeholder="Password (6+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-[#2A2A2E] bg-[#0A0A0B] px-4 py-3 text-sm text-white placeholder-[#4A4A4E] outline-none focus:border-[#3A3A3E] focus:ring-1 focus:ring-white/5 transition-all"
            />

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[12px] text-red-400"
              >
                {error}
              </motion.p>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg bg-[#4ADE80]/10 px-3 py-2"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                <p className="text-[12px] text-[#4ADE80]">{success}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#0A0A0B] transition-all hover:bg-[#E8E8E8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          {/* Toggle */}
          <p className="mt-4 text-center text-[12px] text-[#6B6B6B]">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
              className="font-medium text-white hover:underline"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-[10px] text-[#4A4A4E]">
          By continuing, you agree to RankMeBaddy&apos;s Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-[#2A2A2E] border-t-white animate-spin" />
            <p className="text-sm text-[#6B6B6B]">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
