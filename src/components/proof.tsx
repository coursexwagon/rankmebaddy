"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ─── Testimonial Data ──────────────────────────────────────── */
const testimonials = [
  {
    name: "Sarah Chen",
    initials: "SC",
    role: "Head of Content",
    company: "FitContent",
    quote:
      "RankMeBaddy told us exactly which keywords to target and gave us the optimized copy to implement. We just pasted it in and two weeks later we were on page 1. It doesn\u2019t auto-rank you — it gives you the exact words and strategy so you can rank yourself.",
    metrics: [
      { label: "Google", value: "#3", before: "#38" },
      { label: "Amazon", value: "#34", before: "Unranked" },
    ],
    rating: 5,
  },
  {
    name: "Marcus Davis",
    initials: "MD",
    role: "SEO Manager",
    company: "HealthStack",
    quote:
      "I told it \u201crank best protein powder\u201d and it gave me a full keyword plan, optimized titles, and the exact content changes to make for Google, YouTube, and Amazon. I just implemented what it suggested. Page 1 in 14 days without writing anything from scratch.",
    metrics: [
      { label: "Google", value: "#1", before: "Page 3" },
      { label: "YouTube", value: "#12", before: "#47" },
    ],
    rating: 5,
  },
  {
    name: "Jake Morales",
    initials: "JM",
    role: "Growth Lead",
    company: "VegaFit",
    quote:
      "The chat gives you implementation-ready content — titles, descriptions, keyword placements — you just apply it. Our TikTok went from zero to 15K views after following its content plan. It\u2019s like having an SEO expert tell you exactly what to write.",
    metrics: [
      { label: "Google", value: "#3", before: "Page 4" },
      { label: "TikTok", value: "#15", before: "Unranked" },
    ],
    rating: 5,
  },
];

/* ─── Star Rating ──────────────────────────────────────────── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="#F59E0B"
          stroke="none"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Testimonial Card ──────────────────────────────────────── */
function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
    >
      {/* Top gradient highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Top section */}
      <div className="border-b border-white/[0.04] p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/15">
            <span className="text-[11px] font-bold text-[#00D4AA]">{testimonial.initials}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-white/80">
                  {testimonial.name}
                </p>
                <p className="text-[10px] text-[#52525B]">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
              <Stars count={testimonial.rating} />
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="p-5">
        <p className="text-[12px] leading-[1.7] text-[#71717A]">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      {/* Metrics */}
      <div className="border-t border-white/[0.04] px-5 py-4">
        <div className="flex gap-4">
          {testimonial.metrics.map((m) => (
            <div key={m.label} className="flex-1">
              <p className="text-[9px] uppercase tracking-[0.12em] text-[#3F3F46]">
                {m.label}
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-[#00D4AA]">
                  {m.value}
                </span>
                <span className="text-[9px] text-[#3F3F46]">
                  from {m.before}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Proof Section ────────────────────────────────────────── */
export default function ProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [50, -30]);

  return (
    <section
      id="proof"
      ref={sectionRef}
      className="relative bg-[#0A0A0B] px-4 py-20 sm:px-6 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 flex flex-col items-center gap-4 text-center"
          style={{ y: headerY }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00D4AA]/15 bg-[#00D4AA]/5 px-3 py-1 text-[11px] font-medium text-[#00D4AA]/70">
            Proof
          </span>
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Real results. Real rankings.
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-white/40">
            Teams using RankMeBaddy get the exact keywords, content, and strategy they need to rank — then see results in under 14 days.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={t.name} className={i === 1 ? "md:mt-5" : ""}>
              <TestimonialCard testimonial={t} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
