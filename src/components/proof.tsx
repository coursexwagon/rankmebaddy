"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";

/* ─── Color System ───────────────────────────────────────────── */
// Background: #0A0A0B  |  Surface: #18181B  |  Border: #27272A
// Text: #FAFAFA  |  Secondary: #A1A1AA  |  Muted: #71717A

/* ─── Testimonial Data ───────────────────────────────────────── */
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Content",
    company: "FitContent",
    photo: "/people/sarah.jpg",
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
    role: "SEO Manager",
    company: "HealthStack",
    photo: "/people/marcus.jpg",
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
    role: "Growth Lead",
    company: "VegaFit",
    photo: "/people/jake.jpg",
    quote:
      "The chat gives you implementation-ready content — titles, descriptions, keyword placements — you just apply it. Our TikTok went from zero to 15K views after following its content plan. It\u2019s like having an SEO expert tell you exactly what to write.",
    metrics: [
      { label: "Google", value: "#3", before: "Page 4" },
      { label: "TikTok", value: "#15", before: "Unranked" },
    ],
    rating: 5,
  },
];

/* ─── Star Rating ────────────────────────────────────────────── */
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

/* ─── Testimonial Card ───────────────────────────────────────── */
function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const rotation = index === 0 ? -1.5 : index === 1 ? 1 : -0.8;

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-[#27272A] bg-[#18181B]/60"
      style={{ transform: `rotate(${rotation}deg)` }}
      initial={{ opacity: 0, y: 40, scale: 0.95, rotateY: -10 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
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
      {/* Top section — photo + name + stars */}
      <div className="border-b border-[#27272A]/60 p-5">
        <div className="flex items-start gap-3.5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#27272A]">
            <Image
              src={testimonial.photo}
              alt={testimonial.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#FAFAFA]">
                  {testimonial.name}
                </p>
                <p className="text-[10px] text-[#71717A]">
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
        <p className="text-[12px] leading-relaxed text-[#A1A1AA]">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      {/* Metrics */}
      <div className="border-t border-[#27272A]/40 px-5 py-4">
        <div className="flex gap-4">
          {testimonial.metrics.map((m) => (
            <div key={m.label} className="flex-1">
              <p className="text-[9px] uppercase tracking-wider text-[#52525B]">
                {m.label}
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-[#6EE7B7]">
                  {m.value}
                </span>
                <span className="text-[9px] text-[#52525B]">
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

/* ─── Proof Section ──────────────────────────────────────────── */
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
      className="relative px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 flex flex-col items-center gap-3 text-center"
          style={{ y: headerY }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#18181B] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
            Proof
          </span>
          <h2 className="font-heading text-2xl font-bold text-[#FAFAFA] sm:text-3xl md:text-4xl">
            Real results. Real people.
          </h2>
          <p className="max-w-md text-sm text-[#71717A]">
            Teams using RankMeBaddy get the exact keywords, content, and strategy they need to rank — then see results in under 14 days.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5">
          {testimonials.map((t, i) => (
            <div key={t.name} className={i === 1 ? "md:mt-6" : ""}>
              <TestimonialCard testimonial={t} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
