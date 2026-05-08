"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Brand Palette ──────────────────────────────────────────── */
// Accent: #4ADE80  |  Violet: #A78BFA  |  Surface: #1A1A1F  |  Text: #E4E4E7

/**
 * AgentNetwork SVG — animated visualization showing data flowing
 * from multiple platforms (Google, YouTube, Amazon, TikTok) into
 * a central hub. Uses Framer Motion for path drawing and particle
 * animation along the connection lines.
 */
interface AgentNetworkProps {
  className?: string;
}

export function AgentNetwork({ className }: AgentNetworkProps) {
  // Platform node positions (in a 500x400 viewBox)
  const platforms = [
    {
      name: "Google",
      x: 80,
      y: 80,
      color: "#4285F4",
      icon: (
        <g transform="translate(80, 80)">
          <circle r="24" fill="#4285F4" opacity="0.15" />
          <circle r="18" fill="#4285F4" opacity="0.3" />
          <text textAnchor="middle" dy="5" fill="#4285F4" fontSize="14" fontWeight="bold">G</text>
        </g>
      ),
    },
    {
      name: "YouTube",
      x: 420,
      y: 80,
      color: "#FF0000",
      icon: (
        <g transform="translate(420, 80)">
          <circle r="24" fill="#FF0000" opacity="0.15" />
          <circle r="18" fill="#FF0000" opacity="0.3" />
          <text textAnchor="middle" dy="5" fill="#FF0000" fontSize="12" fontWeight="bold">YT</text>
        </g>
      ),
    },
    {
      name: "Amazon",
      x: 80,
      y: 320,
      color: "#FF9900",
      icon: (
        <g transform="translate(80, 320)">
          <circle r="24" fill="#FF9900" opacity="0.15" />
          <circle r="18" fill="#FF9900" opacity="0.3" />
          <text textAnchor="middle" dy="5" fill="#FF9900" fontSize="12" fontWeight="bold">A</text>
        </g>
      ),
    },
    {
      name: "TikTok",
      x: 420,
      y: 320,
      color: "#FE2C55",
      icon: (
        <g transform="translate(420, 320)">
          <circle r="24" fill="#FE2C55" opacity="0.15" />
          <circle r="18" fill="#FE2C55" opacity="0.3" />
          <text textAnchor="middle" dy="5" fill="#FE2C55" fontSize="12" fontWeight="bold">TT</text>
        </g>
      ),
    },
  ];

  // Center hub
  const hub = { x: 250, y: 200 };

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          {/* Glow filter for the center hub */}
          <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Subtle glow for data particles */}
          <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines from each platform to center hub */}
        {platforms.map((platform, i) => {
          const dx = hub.x - platform.x;
          const dy = hub.y - platform.y;
          // Control point for a slight curve
          const cpx = platform.x + dx * 0.5 + (i % 2 === 0 ? -20 : 20);
          const cpy = platform.y + dy * 0.5;

          return (
            <g key={platform.name}>
              {/* Background glow line */}
              <motion.path
                d={`M${platform.x},${platform.y} Q${cpx},${cpy} ${hub.x},${hub.y}`}
                stroke={platform.color}
                strokeWidth="2"
                strokeOpacity="0.08"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.3 + i * 0.2, ease: "easeOut" }}
              />
              {/* Main connection line */}
              <motion.path
                d={`M${platform.x},${platform.y} Q${cpx},${cpy} ${hub.x},${hub.y}`}
                stroke={platform.color}
                strokeWidth="1"
                strokeOpacity="0.3"
                fill="none"
                strokeDasharray="4 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.3 + i * 0.2, ease: "easeOut" }}
              />
              {/* Data particle flowing toward center */}
              <motion.circle
                r="3"
                fill={platform.color}
                filter="url(#particleGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 2,
                  delay: 1.5 + i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                <animateMotion
                  dur="2s"
                  begin={`${1.5 + i * 0.3}s`}
                  repeatCount="indefinite"
                  path={`M${platform.x},${platform.y} Q${cpx},${cpy} ${hub.x},${hub.y}`}
                />
              </motion.circle>
              {/* Secondary particle (slightly delayed) */}
              <motion.circle
                r="2"
                fill={platform.color}
                opacity="0.5"
              >
                <animateMotion
                  dur="2.3s"
                  begin={`${2.2 + i * 0.3}s`}
                  repeatCount="indefinite"
                  path={`M${platform.x},${platform.y} Q${cpx},${cpy} ${hub.x},${hub.y}`}
                />
              </motion.circle>
            </g>
          );
        })}

        {/* Center hub — the AI agent core */}
        <g filter="url(#hubGlow)">
          <motion.circle
            cx={hub.x}
            cy={hub.y}
            r="36"
            fill="#4ADE80"
            opacity="0.06"
            animate={{ r: [36, 42, 36], opacity: [0.06, 0.1, 0.06] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
        <circle cx={hub.x} cy={hub.y} r="28" fill="#4ADE80" opacity="0.12" />
        <circle cx={hub.x} cy={hub.y} r="20" fill="#4ADE80" opacity="0.2" />
        <circle cx={hub.x} cy={hub.y} r="12" fill="#4ADE80" opacity="0.35" />

        {/* Hub icon — agent/robot symbol */}
        <motion.g
          transform={`translate(${hub.x}, ${hub.y})`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2, type: "spring" }}
        >
          <circle r="4" fill="#4ADE80" />
          {/* Signal arcs */}
          <motion.circle
            r="8"
            fill="none"
            stroke="#4ADE80"
            strokeWidth="0.5"
            opacity="0.4"
            animate={{ r: [8, 16], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.circle
            r="8"
            fill="none"
            stroke="#4ADE80"
            strokeWidth="0.5"
            opacity="0.4"
            animate={{ r: [8, 16], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
          />
        </motion.g>

        {/* Platform nodes */}
        {platforms.map((platform, i) => (
          <motion.g
            key={platform.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2 + i * 0.15,
              type: "spring",
              stiffness: 200,
            }}
          >
            {platform.icon}
            {/* Platform label */}
            <text
              x={platform.x}
              y={platform.y + 36}
              textAnchor="middle"
              fill="#71717A"
              fontSize="9"
              fontWeight="500"
            >
              {platform.name}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
