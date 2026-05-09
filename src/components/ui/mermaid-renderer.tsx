"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

/* ─── Mermaid Renderer Component ─────────────────────────────── */
interface MermaidRendererProps {
  chart: string;
  className?: string;
}

export function MermaidRenderer({ chart, className }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const renderAttempted = useRef(false);

  const renderChart = useCallback(async () => {
    if (!chart || renderAttempted.current) return;
    renderAttempted.current = true;

    try {
      const mermaid = (await import("mermaid")).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
        fontFamily: "Space Grotesk, sans-serif",
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: "basis",
          padding: 12,
        },
        sequence: {
          useMaxWidth: true,
          actorMargin: 60,
          messageMargin: 40,
        },
        themeVariables: {
          primaryColor: "#E8F0FE",
          primaryTextColor: "#1A1A1A",
          primaryBorderColor: "#2563EB",
          lineColor: "#9B9B9B",
          secondaryColor: "#F5F0EB",
          tertiaryColor: "#FAFAF7",
          noteBkgColor: "#E8F0FE",
          noteTextColor: "#1A1A1A",
          actorBkg: "#E8F0FE",
          actorBorder: "#2563EB",
          actorTextColor: "#1A1A1A",
          labelBoxBkgColor: "#FAFAF7",
          labelBoxBorderColor: "#E8E5E0",
          labelTextColor: "#1A1A1A",
          loopTextColor: "#1A1A1A",
          activationBorderColor: "#2563EB",
          activationBkgColor: "#E8F0FE",
          sequenceNumberColor: "#FFFFFF",
        },
      });

      const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
      setSvg(renderedSvg);
      setError("");
    } catch (err) {
      console.error("Mermaid render error:", err);
      setError("Diagram rendering failed");
      renderAttempted.current = false;
    }
  }, [chart]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  // Reset render attempt when chart changes
  useEffect(() => {
    renderAttempted.current = false;
  }, [chart]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-3 text-xs text-red-600 dark:text-red-400">
        {error}
        <pre className="mt-2 text-[10px] text-red-400 dark:text-red-500 overflow-x-auto whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <>
      <motion.div
        ref={containerRef}
        className={className || "rounded-xl border border-[#E8E5E0] dark:border-[#2A2A2E] bg-white dark:bg-[#1A1A1E] p-4 overflow-x-auto my-2 relative group"}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Diagram header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-[#2563EB]/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9B9B9B] dark:text-[#6B6B6B]">Interactive Diagram</span>
          </div>
          <button
            onClick={() => setIsFullscreen(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#9B9B9B] hover:text-[#2563EB] flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
            Expand
          </button>
        </div>

        {svg ? (
          <div
            className="mermaid-svg-wrapper [&_svg]:max-w-full [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-xs text-[#9B9B9B]">
              <motion.div
                className="h-2 w-2 rounded-full bg-[#2563EB]"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              Rendering diagram...
            </div>
          </div>
        )}
      </motion.div>

      {/* Fullscreen overlay */}
      {isFullscreen && svg && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFullscreen(false)}
        >
          <motion.div
            className="bg-white dark:bg-[#1A1A1E] rounded-2xl p-6 max-w-[90vw] max-h-[85vh] overflow-auto shadow-2xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-[#2563EB]/10">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[#1A1A1A] dark:text-white">Diagram</span>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#F5F5F0] dark:bg-[#252528] text-[#6B6B6B] hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div
              className="mermaid-svg-wrapper [&_svg]:max-w-full [&_svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

/* ─── Parse Mermaid blocks from text ──────────────────────────── */
export interface ContentBlock {
  type: "text" | "mermaid";
  content: string;
}

export function parseContentBlocks(text: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const mermaidRegex = /\[DIAGRAM\]([\s\S]*?)\[\/DIAGRAM\]/g;
  let lastIndex = 0;
  let match;

  while ((match = mermaidRegex.exec(text)) !== null) {
    // Add text before the diagram
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index).trim();
      if (textBefore) {
        blocks.push({ type: "text", content: textBefore });
      }
    }
    // Add the diagram
    blocks.push({ type: "mermaid", content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex).trim();
    if (textAfter) {
      blocks.push({ type: "text", content: textAfter });
    }
  }

  // If no diagrams found, return the whole text
  if (blocks.length === 0) {
    blocks.push({ type: "text", content: text });
  }

  return blocks;
}
