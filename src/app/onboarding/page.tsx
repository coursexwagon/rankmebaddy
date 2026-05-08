"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A
// Accent: #6EE7B7 (emerald-300)

/* ─── Shared Vars ────────────────────────────────────────────── */
const TOTAL_STEPS = 4;

/* ─── Underline for headings ─────────────────────────────────── */
function UnderlinedWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <svg
        className="absolute -bottom-1 left-0 w-full overflow-visible"
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        style={{ height: "0.12em" }}
      >
        <motion.path
          d="M2,8 C40,3 80,11 120,6 C150,2 175,9 198,5"
          stroke="#6EE7B7"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}

/* ─── Progress Bar ───────────────────────────────────────────── */
function ProgressBar({ step }: { step: number }) {
  const pct = (step / TOTAL_STEPS) * 100;
  return (
    <div className="mx-auto mb-12 flex items-center gap-3 sm:mb-16">
      <div className="h-[2px] flex-1 rounded-full bg-[#27272A]">
        <motion.div
          className="h-[2px] rounded-full bg-[#6EE7B7]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        />
      </div>
      <span className="text-[11px] tabular-nums text-[#52525B]">
        {step}/{TOTAL_STEPS}
      </span>
    </div>
  );
}

/* ─── Custom Input ───────────────────────────────────────────── */
function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  autoFocus = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className="w-full rounded-xl border border-[#27272A] bg-[#18181B]/60 px-4 py-3.5 text-sm text-[#FAFAFA] placeholder:text-[#52525B] outline-none transition-colors focus:border-[#6EE7B7]/40 focus:bg-[#18181B]"
      />
    </div>
  );
}

/* ─── CTA Button ─────────────────────────────────────────────── */
function CtaButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full rounded-full py-3.5 text-sm font-semibold transition-all ${
        isPrimary
          ? "bg-[#6EE7B7] text-[#0A0A0B] hover:bg-[#6EE7B7]/90 disabled:opacity-40 disabled:hover:bg-[#6EE7B7]"
          : "border border-[#27272A] bg-transparent text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#FAFAFA]"
      }`}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  );
}

/* ─── Platform Card ──────────────────────────────────────────── */
const platforms = [
  {
    id: "google",
    name: "Google",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
    color: "#4285F4",
    desc: "Search & Maps rankings",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81z" fill="#FF0000" />
        <path d="M9.75 15.02 15.75 12 9.75 8.98v6.04z" fill="#FAFAFA" />
      </svg>
    ),
    color: "#FF0000",
    desc: "Video SEO & thumbnails",
  },
  {
    id: "amazon",
    name: "Amazon",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M.05 18.47c.08-.1.2-.1.36-.02 3.7 2.13 7.72 3.2 12.06 3.2 2.9 0 5.76-.54 8.58-1.63l.3-.13c.27-.12.45-.02.25.2-.2.2-.45.4-.7.6-2.64 1.96-5.73 2.93-9.24 2.93-4.05 0-7.77-1.36-11.17-4.09-.22-.17-.36-.3-.44-.36a.23.23 0 0 1 0-.3v-.4z" fill="#FF9900" />
        <path d="M15.05 9.3c0-.94.17-1.76.5-2.44.34-.7.8-1.24 1.38-1.62.58-.38 1.24-.57 1.96-.57.58 0 1.08.12 1.5.35.42.23.74.55.96.95V2.2c0-.13.04-.24.13-.33.09-.09.2-.13.33-.13h2c.13 0 .24.04.33.13.09.09.13.2.13.33v14.73c0 .13-.04.24-.13.33-.09.09-.2.13-.33.13h-2.07c-.13 0-.24-.04-.33-.13a.45.45 0 0 1-.13-.33v-.96c-.22.4-.55.72-.97.96-.43.24-.93.36-1.52.36-.7 0-1.34-.19-1.92-.57-.58-.38-1.04-.92-1.38-1.62-.33-.7-.5-1.52-.5-2.46v-.47z" fill="#FAFAFA" />
        <path d="M6.75 14.5c-.12 0-.22-.04-.3-.13a.41.41 0 0 1-.12-.3V6.8c0-.12.04-.22.12-.3.08-.08.18-.12.3-.12h2.08c.12 0 .22.04.3.12.08.08.12.18.12.3v.63c.36-.55.84-.96 1.43-1.24.59-.28 1.27-.42 2.03-.42.12 0 .22.04.3.12.08.08.12.18.12.3v1.88c0 .12-.04.22-.12.3-.08.08-.18.12-.3.12h-1.03c-.74 0-1.32.2-1.73.6-.41.4-.62 1-.62 1.78v3.5c0 .12-.04.22-.12.3-.08.08-.18.13-.3.13H6.75z" fill="#FAFAFA" />
      </svg>
    ),
    color: "#FF9900",
    desc: "Product listing optimization",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#FAFAFA" />
      </svg>
    ),
    color: "#FE2C55",
    desc: "Video content strategy",
  },
  {
    id: "aisearch",
    name: "AI Search",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
    color: "#A1A1AA",
    desc: "ChatGPT & Perplexity",
  },
];

/* ─── Step 1: Welcome ────────────────────────────────────────── */
function StepWelcome({
  name,
  website,
  setName,
  setWebsite,
  onNext,
}: {
  name: string;
  website: string;
  setName: (v: string) => void;
  setWebsite: (v: string) => void;
  onNext: () => void;
}) {
  const canContinue = name.trim().length > 0;

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-md"
    >
      <div className="mb-8 text-center">
        <motion.div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6EE7B7]/10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-lg font-bold text-[#6EE7B7]">R</span>
        </motion.div>
        <h1 className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
          Let&apos;s get you <UnderlinedWord>ranking</UnderlinedWord>
        </h1>
        <p className="mt-3 text-sm text-[#71717A]">
          First, tell us a bit about you and your site.
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label="Your name"
          placeholder="e.g. Alex"
          value={name}
          onChange={setName}
          autoFocus
        />
        <Input
          label="Website URL"
          placeholder="e.g. mysite.com"
          value={website}
          onChange={setWebsite}
          type="url"
        />

        <div className="pt-2">
          <CtaButton onClick={onNext} disabled={!canContinue}>
            Continue
          </CtaButton>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 2: Platform Selection ─────────────────────────────── */
function StepPlatforms({
  selected,
  onToggle,
  onNext,
  onBack,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canContinue = selected.length > 0;

  return (
    <motion.div
      key="platforms"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-lg"
    >
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
          Where do you want to <UnderlinedWord>rank</UnderlinedWord>?
        </h1>
        <p className="mt-3 text-sm text-[#71717A]">
          Pick the platforms you care about. You can add more later.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {platforms.map((p, i) => {
          const isActive = selected.includes(p.id);
          return (
            <motion.button
              key={p.id}
              onClick={() => onToggle(p.id)}
              className={`group relative flex items-center gap-3.5 rounded-xl border px-4 py-4 text-left transition-all ${
                isActive
                  ? "border-[#6EE7B7]/30 bg-[#6EE7B7]/5"
                  : "border-[#27272A] bg-[#18181B]/40 hover:border-[#3F3F46]"
              }`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${p.color}12` }}
              >
                {p.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#FAFAFA]">{p.name}</p>
                <p className="text-[11px] text-[#71717A]">{p.desc}</p>
              </div>
              {/* Checkbox indicator */}
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                  isActive
                    ? "border-[#6EE7B7] bg-[#6EE7B7]"
                    : "border-[#27272A] bg-transparent"
                }`}
              >
                {isActive && (
                  <motion.svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0A0A0B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <CtaButton onClick={onBack} variant="secondary">
          Back
        </CtaButton>
        <CtaButton onClick={onNext} disabled={!canContinue}>
          Continue
        </CtaButton>
      </div>
    </motion.div>
  );
}

/* ─── Step 3: First Campaign ─────────────────────────────────── */
function StepCampaign({
  keyword,
  setKeyword,
  context,
  setContext,
  onNext,
  onBack,
}: {
  keyword: string;
  setKeyword: (v: string) => void;
  context: string;
  setContext: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canContinue = keyword.trim().length > 0;

  return (
    <motion.div
      key="campaign"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-md"
    >
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
          Your first <UnderlinedWord>campaign</UnderlinedWord>
        </h1>
        <p className="mt-3 text-sm text-[#71717A]">
          What keyword or topic do you want to rank for? We&apos;ll generate the
          strategy and content to get you there.
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label="Keyword or topic"
          placeholder='e.g. "best protein powder"'
          value={keyword}
          onChange={setKeyword}
          autoFocus
        />

        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A]">
            Anything else?{" "}
            <span className="normal-case tracking-normal font-normal text-[#52525B]">
              (optional)
            </span>
          </label>
          <textarea
            placeholder="e.g. We're a new brand, competing against big names..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-[#27272A] bg-[#18181B]/60 px-4 py-3.5 text-sm text-[#FAFAFA] placeholder:text-[#52525B] outline-none transition-colors focus:border-[#6EE7B7]/40 focus:bg-[#18181B]"
          />
        </div>

        {/* Quick hint */}
        <motion.div
          className="rounded-xl border border-[#27272A]/60 bg-[#18181B]/30 px-4 py-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <p className="text-[11px] text-[#71717A]">
            <span className="font-medium text-[#A1A1AA]">How it works:</span>{" "}
            Tell us what to rank, and we&apos;ll give you the keywords, optimized
            titles, content suggestions, and implementation steps for each
            platform you selected.
          </p>
        </motion.div>

        <div className="flex gap-3 pt-2">
          <CtaButton onClick={onBack} variant="secondary">
            Back
          </CtaButton>
          <CtaButton onClick={onNext} disabled={!canContinue}>
            Launch campaign
          </CtaButton>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 4: All Set ────────────────────────────────────────── */
function StepDone({ name, keyword }: { name: string; keyword: string }) {
  return (
    <motion.div
      key="done"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mx-auto max-w-md text-center"
    >
      {/* Success ring */}
      <motion.div
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#6EE7B7]/30 bg-[#6EE7B7]/5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      >
        <motion.svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6EE7B7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M20 6L9 17l-5-5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.div>

      <h1 className="font-heading text-3xl font-bold text-[#FAFAFA] sm:text-4xl">
        You&apos;re all set, {name.split(" ")[0]}
      </h1>
      <p className="mt-3 text-sm text-[#71717A]">
        We&apos;re building your strategy for &ldquo;{keyword}&rdquo;. You&apos;ll have
        keywords, content, and implementation steps ready in a few minutes.
      </p>

      <div className="mt-8">
        <CtaButton onClick={() => (window.location.href = "/")}>
          Go to dashboard
        </CtaButton>
      </div>

      {/* What happens next */}
      <motion.div
        className="mt-8 space-y-3 text-left"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
          What happens next
        </p>
        {[
          "We scan your keyword across all selected platforms",
          "You get a full keyword map with gaps and opportunities",
          "Optimized titles, descriptions, and content are generated",
          "Implementation steps — just follow and rank",
        ].map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-[#27272A]/40 bg-[#18181B]/30 px-4 py-3"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6EE7B7]/10 text-[10px] font-bold text-[#6EE7B7]">
              {i + 1}
            </span>
            <span className="text-[12px] text-[#A1A1AA]">{item}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Onboarding Page ───────────────────────────────────── */
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["google"]);
  const [keyword, setKeyword] = useState("");
  const [context, setContext] = useState("");

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full">
        <ProgressBar step={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepWelcome
              name={name}
              website={website}
              setName={setName}
              setWebsite={setWebsite}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepPlatforms
              selected={selectedPlatforms}
              onToggle={togglePlatform}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepCampaign
              keyword={keyword}
              setKeyword={setKeyword}
              context={context}
              setContext={setContext}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <StepDone name={name} keyword={keyword} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
