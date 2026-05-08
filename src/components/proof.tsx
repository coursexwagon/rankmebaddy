"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A

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
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
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

        <div className="space-y-2 text-[11px] leading-relaxed text-[#A1A1AA]">
          <p>Hey team,</p>
          <p>
            Just checked our rankings for &quot;best protein powder&quot; — we went from
            page 3 to <span className="font-semibold text-[#FAFAFA]">page 1 in 2 weeks</span>.
            I literally didn&apos;t touch anything after the initial setup.
          </p>
          <p>
            The YouTube rankings are also climbing. Went from position 47 to 12
            since last Monday?? Whatever this thing is doing on the backend, keep
            it running.
          </p>
          <p>
            Also — our Amazon listing just jumped from &quot;Not in top 100&quot; to
            position 34. That&apos;s insane for 2 weeks of zero manual work.
          </p>
          <p className="text-[#52525B]">
            — Sarah
            <br />
            Head of Content, FitContent
          </p>
        </div>

        {/* Scrollbar */}
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
      {/* Slack header */}
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

      <div className="space-y-4 p-4" style={{ fontFamily: "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div className="flex gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6]/20 text-[10px] font-bold text-[#3B82F6]">JM</div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-[#FAFAFA]">Jake M.</span>
              <span className="text-[9px] text-[#52525B]">9:14 AM</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#A1A1AA]">
              yooo just got the notification — we hit #3 for &quot;vegan protein powder&quot; on Google 🎯
            </p>
            <div className="mt-1.5 flex gap-1">
              <span className="inline-flex items-center gap-0.5 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[9px]">🔥 3</span>
              <span className="inline-flex items-center gap-0.5 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[9px]">🚀 2</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8B5CF6]/20 text-[10px] font-bold text-[#8B5CF6]">DP</div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-[#FAFAFA]">Dana P.</span>
              <span className="text-[9px] text-[#52525B]">9:16 AM</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#A1A1AA]">
              Wait seriously?? We were page 4 two weeks ago. It literally did everything while I was on vacation 😭
            </p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]/20 text-[10px] font-bold text-[#F59E0B]">AK</div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-[#FAFAFA]">Amir K.</span>
              <span className="text-[9px] text-[#52525B]">9:18 AM</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#A1A1AA]">
              Also just checked Amazon — listing moved from unranked to position 28. ZERO changes from our side. The content optimizer is wild.
            </p>
            <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-[#52525B]">
              <div className="flex -space-x-1">
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-[#3B82F6]/30" />
                <span className="inline-block h-3.5 w-3.5 rounded-full bg-[#8B5CF6]/30" />
              </div>
              2 replies
            </div>
          </div>
        </div>

        <div className="flex gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10B981]/20 text-[10px] font-bold text-[#10B981]">SC</div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-[#FAFAFA]">Sarah C.</span>
              <span className="text-[9px] text-[#52525B]">9:22 AM</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[#A1A1AA]">
              Page 3 → Page 1 in 14 days. <span className="font-semibold text-[#FAFAFA]">We literally did nothing.</span> This thing is cracked.
            </p>
            <div className="mt-1.5 flex gap-1">
              <span className="inline-flex items-center gap-0.5 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[9px]">💪 5</span>
              <span className="inline-flex items-center gap-0.5 rounded-full border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[9px]">🎉 4</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#27272A]/60 px-3 py-2">
        <div className="flex items-center gap-2 rounded border border-[#27272A] bg-[#0A0A0B]/60 px-2.5 py-1.5">
          <span className="text-[10px] text-[#52525B]">Message #seo-wins</span>
        </div>
      </div>
    </ArtifactCard>
  );
}

/* ─── Card 3: G2/Capterra Review ─────────────────────────────── */
function ReviewArtifact() {
  return (
    <ArtifactCard rotation={2.2} delay={0.3}>
      {/* Review site header */}
      <div className="flex items-center justify-between border-b border-[#27272A] bg-[#1C1C1E] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[#FF6B35]">
            <span className="text-[8px] font-bold text-white">G2</span>
          </div>
          <span className="text-[10px] font-medium text-[#A1A1AA]" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }}>
            Verified Review
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      </div>

      {/* Review content */}
      <div className="p-4" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif" }}>
        <div className="mb-3">
          <h4 className="text-[11px] font-semibold text-[#FAFAFA]">
            &quot;Went from page 3 to page 1 while I was on vacation&quot;
          </h4>
          <div className="mt-1 flex items-center gap-2 text-[9px] text-[#52525B]">
            <span>Marcus D.</span>
            <span>·</span>
            <span>Mid-Market (51-200 employees)</span>
            <span>·</span>
            <span>Health &amp; Fitness</span>
          </div>
        </div>

        {/* Pros/Cons */}
        <div className="space-y-2.5 text-[10.5px] leading-relaxed">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-[#6EE7B7]">What I like best</span>
            <p className="mt-0.5 text-[#A1A1AA]">
              I typed in &quot;best protein powder&quot; and told it to rank on Google, YouTube, and Amazon. Two weeks later I was on page 1 for Google, position 12 on YouTube, and top 30 on Amazon. I didn&apos;t write a single piece of content myself. The chat interface makes it feel like you&apos;re just talking to someone who happens to be really good at SEO.
            </p>
          </div>

          <div>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-[#FCA5A5]">What I dislike</span>
            <p className="mt-0.5 text-[#A1A1AA]">
              The initial setup takes about 10 minutes to connect all your accounts. Would be nice if it auto-detected existing properties. Also the TikTok feature is still in beta — works but not as consistent as Google/YouTube.
            </p>
          </div>

          {/* Bottom stats */}
          <div className="flex items-center justify-between border-t border-[#27272A]/40 pt-2.5 text-[9px] text-[#52525B]">
            <span>Used for 3 months</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                14
              </span>
              <span>Helpful</span>
            </div>
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
      id="proof"
      className="relative px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent" />

      <div className="mx-auto max-w-6xl">
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          <div className="md:mt-0">
            <EmailArtifact />
          </div>
          <div className="md:mt-8">
            <SlackArtifact />
          </div>
          <div className="md:mt-3">
            <ReviewArtifact />
          </div>
        </div>
      </div>
    </section>
  );
}
