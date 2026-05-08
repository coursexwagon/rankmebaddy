"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A
// System fonts for "real" feel

/* ─── Artifact Card Wrapper ──────────────────────────────────── */
interface ArtifactCardProps {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
  delay?: number;
}

function ArtifactCard({ children, className, rotation = 0, delay = 0 }: ArtifactCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-lg border border-[#27272A]",
        "bg-[#18181B]/90",
        "shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Card 1: Email Screenshot ───────────────────────────────── */
function EmailArtifact() {
  return (
    <ArtifactCard rotation={-2.5} delay={0}>
      {/* macOS window bar */}
      <div className="flex items-center justify-between border-b border-[#27272A] bg-[#1C1C1E] px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-[10px] text-[#52525B]" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
          Mail
        </span>
        <div className="w-12" />
      </div>

      {/* Email content */}
      <div className="p-4" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif" }}>
        {/* Email headers */}
        <div className="mb-3 space-y-1.5 border-b border-[#27272A]/60 pb-3">
          <div className="flex items-start gap-2 text-[10px]">
            <span className="shrink-0 text-[#52525B]">From:</span>
            <span className="text-[#A1A1AA]">Sarah Chen &lt;sarah@fitcontent.io&gt;</span>
          </div>
          <div className="flex items-start gap-2 text-[10px]">
            <span className="shrink-0 text-[#52525B]">To:</span>
            <span className="text-[#A1A1AA]">team@rankmebaddy.com</span>
          </div>
          <div className="flex items-start gap-2 text-[10px]">
            <span className="shrink-0 text-[#52525B]">Date:</span>
            <span className="text-[#A1A1AA]">Mon, Jan 13 2025 at 9:41 AM</span>
          </div>
          <div className="flex items-start gap-2 text-[10px]">
            <span className="shrink-0 text-[#52525B]">Subject:</span>
            <span className="text-[#FAFAFA] font-medium">holy shit we&#39;re on page 1</span>
          </div>
        </div>

        {/* Email body */}
        <div className="space-y-2 text-[11px] leading-relaxed text-[#A1A1AA]">
          <p>Hey team,</p>
          <p>
            Just checked our rankings for &quot;best protein powder&quot; — we went from
            page 3 to <span className="font-semibold text-[#FAFAFA]">page 1 in 2 weeks</span>.
            I literally didn&#39;t touch anything after the initial deploy.
          </p>
          <p>
            The YouTube rankings are also climbing. Went from position 47 to 12
            since last Monday?? Whatever this agent is doing on the backend, keep
            it running.
          </p>
          <p>
            Also — our Amazon listing just jumped from &quot;Not in top 100&quot; to
            position 34. That&#39;s insane for 2 weeks of zero manual work.
          </p>
          <p className="text-[#52525B]">
            — Sarah
            <br />
            Head of Content, FitContent
          </p>
        </div>

        {/* Fake scrollbar */}
        <div className="absolute right-0 top-8 bottom-0 w-2 bg-transparent">
          <div className="mt-8 h-12 w-1 rounded-full bg-[#3F3F46]/40" />
        </div>
      </div>
    </ArtifactCard>
  );
}

/* ─── Card 2: Slack Message ──────────────────────────────────── */
function SlackArtifact() {
  return (
    <ArtifactCard rotation={1.8} delay={0.15}>
      {/* Slack-like header */}
      <div className="flex items-center gap-2 border-b border-[#27272A] bg-[#1C1C1E] px-3 py-2">
        <span className="text-xs font-bold text-[#FAFAFA]" style={{ fontFamily: "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
          # seo-wins
        </span>
        <span className="rounded bg-[#27272A] px-1.5 py-0.5 text-[9px] text-[#71717A]">4</span>
        <div className="ml-auto flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]/30" />
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4 p-4" style={{ fontFamily: "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {/* Message 1 */}
        <div className="flex gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6]/20 text-[10px] font-bold text-[#3B82F6]">
            JM
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-[#FAFAFA]">Jake M.</span>
              <span className="text-[9px] text-[#52525B]">9:14 AM</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#A1A1AA]">
              yooo just got the notification — we hit #3 for &quot;vegan protein powder&quot; on Google 🎯
            </p>
            {/* Reactions */}
            <div className="mt-1.5 flex gap-1">
              <span className="inline-flex items-center gap-0.5 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[9px]">
                🔥 3
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[9px]">
                🚀 2
              </span>
            </div>
          </div>
        </div>

        {/* Message 2 */}
        <div className="flex gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8B5CF6]/20 text-[10px] font-bold text-[#8B5CF6]">
            DP
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-[#FAFAFA]">Dana P.</span>
              <span className="text-[9px] text-[#52525B]">9:16 AM</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#A1A1AA]">
              Wait seriously?? We were page 4 two weeks ago. The agent literally did everything while I was on vacation 😭
            </p>
          </div>
        </div>

        {/* Message 3 */}
        <div className="flex gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]/20 text-[10px] font-bold text-[#F59E0B]">
            AK
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-[#FAFAFA]">Amir K.</span>
              <span className="text-[9px] text-[#52525B]">9:18 AM</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#A1A1AA]">
              Also just checked Amazon — listing moved from unranked to position 28. This is with ZERO changes from our side. The content optimizer skill is wild.
            </p>
            {/* Thread reply indicator */}
            <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-[#52525B]">
              <div className="flex -space-x-1">
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-[#3B82F6]/30" />
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-[#8B5CF6]/30" />
              </div>
              2 replies
            </div>
          </div>
        </div>

        {/* Message 4 */}
        <div className="flex gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/20 text-[10px] font-bold text-[#10B981]">
            SC
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-[#FAFAFA]">Sarah C.</span>
              <span className="text-[9px] text-[#52525B]">9:22 AM</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#A1A1AA]">
              I just sent the email to the team lol. Page 3 → Page 1 in 14 days. <span className="font-semibold text-[#FAFAFA]">We literally did nothing.</span> This agent is cracked.
            </p>
            {/* Reactions */}
            <div className="mt-1.5 flex gap-1">
              <span className="inline-flex items-center gap-0.5 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[9px]">
                💪 5
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[9px]">
                🎉 4
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-[#27272A]/60 px-3 py-2">
        <div className="flex items-center gap-2 rounded border border-[#27272A] bg-[#0A0A0B]/60 px-2.5 py-1.5">
          <span className="text-[10px] text-[#52525B]">Message #seo-wins</span>
        </div>
      </div>
    </ArtifactCard>
  );
}

/* ─── Card 3: GitHub Issue ───────────────────────────────────── */
function GitHubArtifact() {
  return (
    <ArtifactCard rotation={2.2} delay={0.3}>
      {/* GitHub-like header */}
      <div className="flex items-center gap-2 border-b border-[#27272A] bg-[#1C1C1E] px-3 py-2">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="#71717A">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span className="text-[10px] text-[#52525B]" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }}>
          rankmebaddy/agent
        </span>
        <div className="ml-auto flex items-center gap-1.5 text-[9px] text-[#52525B]">
          <span className="flex items-center gap-1 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
            bug
          </span>
          <span className="flex items-center gap-1 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
            improvement
          </span>
        </div>
      </div>

      {/* Issue content */}
      <div className="p-4" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }}>
        {/* Issue title */}
        <div className="mb-3 flex items-start gap-2">
          <span className="text-[11px] font-semibold text-[#FAFAFA]">
            #247 — ContentOptimizer occasionally skips H2 tags
          </span>
        </div>

        {/* Issue body */}
        <div className="space-y-2 text-[10.5px] leading-relaxed text-[#A1A1AA]">
          <p>
            <span className="font-semibold text-[#A1A1AA]">@marcus-dev</span> opened this issue 3 days ago · 6 comments
          </p>

          <div className="rounded border border-[#27272A]/60 bg-[#0A0A0B]/40 p-2.5">
            <p className="mb-1.5">
              The ContentOptimizer skill sometimes skips H2 tags when the page already has 3+ H2s. Not critical but would be nice to fix.
            </p>
            <p className="text-[#52525B]">
              That said — despite this bug, our rankings still improved from #38 to #9 on Google for our target keyword. So... the agent works even when it&#39;s slightly broken lol.
            </p>
          </div>

          {/* Comment */}
          <div className="border-l-2 border-[#27272A] pl-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="h-4 w-4 rounded-full bg-[#6EE7B7]/20" />
              <span className="text-[10px] font-medium text-[#FAFAFA]">maintainer</span>
              <span className="rounded bg-[#27272A] px-1 py-0.5 text-[8px] text-[#71717A]">member</span>
              <span className="text-[9px] text-[#52525B]">2 days ago</span>
            </div>
            <p className="text-[10.5px] text-[#A1A1AA]">
              Fix shipped in v2.4.1. Also — #38 to #9 in 11 days is wild. We&#39;re seeing similar results across beta users. Average improvement is 20+ positions in the first 2 weeks.
            </p>
          </div>

          {/* Another comment */}
          <div className="border-l-2 border-[#27272A] pl-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="h-4 w-4 rounded-full bg-[#3B82F6]/20" />
              <span className="text-[10px] font-medium text-[#A1A1AA]">marcus-dev</span>
              <span className="text-[9px] text-[#52525B]">1 day ago</span>
            </div>
            <p className="text-[10.5px] text-[#A1A1AA]">
              Just pulled the update. Rankings are at #4 now. Going from #38 → #4 with basically zero manual SEO work is actually insane.
            </p>
            <p className="mt-1 text-[9px] text-[#52525B]">
              🎉 reacted with +1 from 3 people
            </p>
          </div>
        </div>

        {/* Close button / status bar */}
        <div className="mt-3 flex items-center justify-between border-t border-[#27272A]/40 pt-2.5">
          <span className="flex items-center gap-1 text-[9px] text-[#6EE7B7]">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
            </svg>
            Closed 1 day ago
          </span>
          <div className="flex gap-2 text-[9px] text-[#52525B]">
            <span>+12 upvotes</span>
          </div>
        </div>
      </div>

      {/* Scrollbar */}
      <div className="absolute right-0 top-8 bottom-0 w-2 bg-transparent">
        <div className="mt-4 h-8 w-1 rounded-full bg-[#3F3F46]/40" />
      </div>
    </ArtifactCard>
  );
}

/* ─── Proof Section ──────────────────────────────────────────── */
export default function ProofSection() {
  return (
    <section
      className="relative px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      {/* Top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent" />

      <div className="mx-auto max-w-6xl">
        {/* Minimal header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#18181B] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
            Proof
          </span>
        </motion.div>

        {/* Artifact cards — staggered grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          <div className="md:mt-0">
            <EmailArtifact />
          </div>
          <div className="md:mt-8">
            <SlackArtifact />
          </div>
          <div className="md:mt-3">
            <GitHubArtifact />
          </div>
        </div>
      </div>
    </section>
  );
}
