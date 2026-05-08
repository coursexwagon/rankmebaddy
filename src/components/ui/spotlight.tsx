"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = "white" }: SpotlightProps) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute z-[1] h-[200%] w-[200%] opacity-0",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          />
        </filter>
      </defs>
    </svg>
  );
}

interface SpotlightLayerProps {
  className?: string;
}

export function SpotlightLayer({ className }: SpotlightLayerProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Primary green spotlight */}
      <motion.div
        className="absolute"
        animate={{
          x: [0, 300, 100, 400, 0],
          y: [0, -100, -200, -50, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          top: "10%",
          left: "20%",
        }}
      >
        <Spotlight fill="#22c55e" className="opacity-30" />
      </motion.div>

      {/* Secondary white/green spotlight */}
      <motion.div
        className="absolute"
        animate={{
          x: [0, -200, -100, -300, 0],
          y: [0, -150, -50, -200, 0],
          scale: [1, 0.8, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          top: "5%",
          right: "10%",
        }}
      >
        <Spotlight fill="#86efac" className="opacity-20" />
      </motion.div>

      {/* Tertiary subtle white spotlight */}
      <motion.div
        className="absolute"
        animate={{
          x: [0, 150, 250, 100, 0],
          y: [0, -80, -160, -40, 0],
          scale: [1, 1.15, 0.85, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        style={{
          top: "0%",
          left: "50%",
        }}
      >
        <Spotlight fill="white" className="opacity-10" />
      </motion.div>
    </div>
  );
}

/**
 * Animated radial gradient spotlight that follows a slow automated path
 * behind the hero text. Pure CSS + Framer Motion — no static backgrounds.
 */
export function MovingSpotlight({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Main moving radial gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(600px circle at 30% 20%, rgba(34,197,94,0.15), rgba(34,197,94,0.05) 40%, transparent 70%)",
            "radial-gradient(600px circle at 70% 30%, rgba(134,239,172,0.12), rgba(34,197,94,0.04) 40%, transparent 70%)",
            "radial-gradient(700px circle at 50% 10%, rgba(255,255,255,0.08), rgba(34,197,94,0.06) 40%, transparent 70%)",
            "radial-gradient(600px circle at 20% 40%, rgba(34,197,94,0.18), rgba(34,197,94,0.05) 40%, transparent 70%)",
            "radial-gradient(600px circle at 80% 15%, rgba(134,239,172,0.10), rgba(34,197,94,0.03) 40%, transparent 70%)",
            "radial-gradient(600px circle at 30% 20%, rgba(34,197,94,0.15), rgba(34,197,94,0.05) 40%, transparent 70%)",
          ],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary slower gradient layer */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(500px circle at 60% 60%, rgba(139,92,246,0.06), transparent 60%)",
            "radial-gradient(500px circle at 40% 40%, rgba(139,92,246,0.04), transparent 60%)",
            "radial-gradient(500px circle at 20% 70%, rgba(34,197,94,0.06), transparent 60%)",
            "radial-gradient(500px circle at 80% 30%, rgba(139,92,246,0.06), transparent 60%)",
            "radial-gradient(500px circle at 60% 60%, rgba(139,92,246,0.06), transparent 60%)",
          ],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
    </div>
  );
}
