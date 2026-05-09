"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

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
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}

/* ─── Plan Data ──────────────────────────────────────────────── */
const plans = [
  {
    name: "Starter",
    price: "0",
    period: "forever",
    description: "Try it out. See what RankMeBaddy actually suggests.",
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
    description: "Full platform coverage. The words and strategy you need to rank everywhere.",
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
    description: "Unlimited campaigns. Priority strategy. For teams that ship content fast.",
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

/* ─── Pricing Card ───────────────────────────────────────────── */
function PricingCard({
  plan,
  index,
}: {
  plan: (typeof plans)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const yOffset = index === 1 ? 0 : 24;

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl border ${
        plan.highlighted
          ? "border-[#2563EB]/30 bg-white shadow-lg shadow-blue-50"
          : "border-[#E8E5E0] bg-white"
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
      {/* Highlighted glow */}
      {plan.highlighted && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-20 -right-20 h-40 w-40 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)",
            }}
          />
        </div>
      )}

      <div className="relative p-6 sm:p-8">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6B6B6B]">
            {plan.name}
          </h3>
          {plan.highlighted && (
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-600">
              Popular
            </span>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-[#1A1A1A] sm:text-5xl">
            ${plan.price}
          </span>
          <span className="text-sm text-[#9B9B9B]">{plan.period}</span>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-[#6B6B6B]">
          {plan.description}
        </p>

        <a
          href="/onboarding"
          className={`mt-6 block w-full rounded-full py-3 text-center text-sm font-semibold transition-all ${
            plan.highlighted
              ? "bg-[#2563EB] text-white hover:bg-blue-700"
              : "border border-[#E8E5E0] bg-white text-[#1A1A1A] hover:border-[#9B9B9B] hover:bg-[#FAFAF7]"
          }`}
        >
          {plan.cta}
        </a>

        <ul className="mt-6 space-y-3 border-t border-[#E8E5E0] pt-6">
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
                  stroke="#2563EB"
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
                  stroke="#E8E5E0"
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
                  feature.included ? "text-[#6B6B6B]" : "text-[#9B9B9B]"
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

/* ─── Pricing Section ────────────────────────────────────────── */
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
      className="relative px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: "#FAFAF7" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8E5E0] to-transparent" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-14 flex flex-col items-center gap-3 text-center"
          style={{ y: labelY }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E5E0] bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
            Pricing
          </span>
          <h2 className="font-heading text-2xl font-bold text-[#1A1A1A] sm:text-3xl md:text-4xl">
            <UnderlinedWord>Simple</UnderlinedWord> pricing. No surprises.
          </h2>
          <p className="max-w-lg text-sm text-[#6B6B6B]">
            Get the keywords, content strategy, and implementation guidance you
            need — across every platform. Start free, upgrade when you&apos;re ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        <motion.p
          className="mt-10 text-center text-xs text-[#9B9B9B]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          All plans include weekly ranking reports · Cancel anytime ·
          No credit card required for Starter
        </motion.p>
      </div>
    </section>
  );
}
