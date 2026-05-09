"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ─── Underline for headings ────────────────────────────────── */
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
          stroke="#00D4AA"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}

/* ─── Plan Data ─────────────────────────────────────────────── */
const plans = [
  {
    name: "Starter",
    price: "0",
    period: "forever",
    description: "Try it out. See what RankMeBaddy actually suggests for your keywords.",
    cta: "Start free",
    highlighted: false,
    features: [
      { text: "1 campaign", included: true },
      { text: "Google keyword suggestions", included: true },
      { text: "Content optimization tips", included: true },
      { text: "Basic ranking reports", included: true },
      { text: "YouTube & Amazon", included: false },
      { text: "TikTok & AI Search", included: false },
      { text: "Priority content delivery", included: false },
    ],
  },
  {
    name: "Pro",
    price: "49",
    period: "/month",
    description: "Full platform coverage. The keywords, content, and strategy you need to rank everywhere.",
    cta: "Get Pro",
    highlighted: true,
    features: [
      { text: "10 campaigns", included: true },
      { text: "Google keyword suggestions", included: true },
      { text: "Content optimization tips", included: true },
      { text: "Full ranking reports", included: true },
      { text: "YouTube & Amazon", included: true },
      { text: "TikTok & AI Search", included: true },
      { text: "Priority content delivery", included: false },
    ],
  },
  {
    name: "Scale",
    price: "149",
    period: "/month",
    description: "Unlimited campaigns. Priority strategy. For teams that ship content at scale.",
    cta: "Go Scale",
    highlighted: false,
    features: [
      { text: "Unlimited campaigns", included: true },
      { text: "Google keyword suggestions", included: true },
      { text: "Content optimization tips", included: true },
      { text: "Full ranking reports", included: true },
      { text: "YouTube & Amazon", included: true },
      { text: "TikTok & AI Search", included: true },
      { text: "Priority content delivery", included: true },
    ],
  },
];

/* ─── Pricing Card ──────────────────────────────────────────── */
function PricingCard({
  plan,
  index,
}: {
  plan: (typeof plans)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const yOffset = index === 1 ? 0 : 20;

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl ${
        plan.highlighted
          ? "border-[#00D4AA]/20 bg-[#00D4AA]/[0.03] shadow-lg shadow-[#00D4AA]/5"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
      style={{ marginTop: yOffset }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {/* Top gradient highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Highlighted glow */}
      {plan.highlighted && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-20 -right-20 h-40 w-40 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,212,170,0.05) 0%, transparent 70%)",
            }}
          />
        </div>
      )}

      <div className="relative p-6 sm:p-8">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#52525B]">
            {plan.name}
          </h3>
          {plan.highlighted && (
            <span className="rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/15 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#00D4AA]">
              Popular
            </span>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white sm:text-5xl">
            ${plan.price}
          </span>
          <span className="text-sm text-[#3F3F46]">{plan.period}</span>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-[#52525B]">
          {plan.description}
        </p>

        <a
          href="/auth"
          className={`mt-6 block w-full rounded-full py-3 text-center text-sm font-semibold transition-all duration-200 ${
            plan.highlighted
              ? "bg-[#00D4AA] text-[#0A0A0B] shadow-lg shadow-[#00D4AA]/15 hover:bg-[#00D4AA]/90 hover:shadow-[#00D4AA]/25"
              : "border border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white/90"
          }`}
        >
          {plan.cta}
        </a>

        <ul className="mt-6 space-y-3 border-t border-white/[0.05] pt-6">
          {plan.features.map((feature, i) => (
            <motion.li
              key={feature.text}
              className="flex items-center gap-3 text-[13px]"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
            >
              {feature.included ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00D4AA"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#27272A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
              <span
                className={
                  feature.included ? "text-[#71717A]" : "text-[#3F3F46]"
                }
              >
                {feature.text}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ─── Pricing Section ──────────────────────────────────────── */
export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const labelY = useTransform(scrollYProgress, [0, 1], [40, -20]);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative bg-[#09090B] px-4 py-20 sm:px-6 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-14 flex flex-col items-center gap-4 text-center"
          style={{ y: labelY }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00D4AA]/15 bg-[#00D4AA]/5 px-3 py-1 text-[11px] font-medium text-[#00D4AA]/70">
            Pricing
          </span>
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            <UnderlinedWord>Simple</UnderlinedWord> pricing. No surprises.
          </h2>
          <p className="max-w-lg text-[15px] leading-relaxed text-white/40">
            Get the keywords, content strategy, and implementation guidance you need — across every platform. Start free, upgrade when you&apos;re ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        <motion.p
          className="mt-10 text-center text-xs text-[#3F3F46]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          All plans include weekly ranking reports · Cancel anytime · No credit card required for Starter
        </motion.p>
      </div>
    </section>
  );
}
