"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
      "We went from page 3 to page 1 in 2 weeks. I literally didn\u2019t touch anything after the initial setup. Our Amazon listing jumped from unranked to position 34. That\u2019s insane for zero manual work.",
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
      "I typed in \u201cbest protein powder\u201d and told it to rank on Google, YouTube, and Amazon. Two weeks later I was on page 1 for Google, position 12 on YouTube, and top 30 on Amazon. I didn\u2019t write a single piece of content myself.",
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
      "Page 3 to Page 1 while I was on vacation. The chat interface makes it feel like you\u2019re just talking to someone who happens to be really good at SEO. Our TikTok presence went from zero to 15K views in a month.",
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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {/* Top section — photo + name + stars */}
      <div className="border-b border-[#27272A]/60 p-5">
        <div className="flex items-start gap-3.5">
          {/* Real photo */}
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
  return (
    <section
      id="proof"
      className="relative px-4 py-20 sm:px-6 sm:py-28"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27272A] to-transparent" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#27272A] bg-[#18181B] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#A1A1AA]">
            Proof
          </span>
          <h2 className="font-heading text-2xl font-bold text-[#FAFAFA] sm:text-3xl md:text-4xl">
            Real results. Real people.
          </h2>
          <p className="max-w-md text-sm text-[#71717A]">
            Teams that switched to RankMeBaddy saw measurable ranking improvements in under 14 days.
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
