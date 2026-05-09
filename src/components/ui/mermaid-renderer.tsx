"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Mermaid Renderer Component — Grok-style dark canvas ────── */
interface MermaidRendererProps {
  chart: string;
  className?: string;
  autoOpen?: boolean;
}

export function MermaidRenderer({ chart, className, autoOpen = false }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isCanvasOpen, setIsCanvasOpen] = useState(autoOpen);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posx: 0, posy: 0 });
  const renderAttempted = useRef(false);

  const renderChart = useCallback(async () => {
    if (!chart || renderAttempted.current) return;
    renderAttempted.current = true;

    try {
      const mermaid = (await import("mermaid")).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        fontFamily: "Space Grotesk, sans-serif",
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: "basis",
          padding: 20,
          nodeSpacing: 50,
          rankSpacing: 60,
        },
        sequence: {
          useMaxWidth: false,
          actorMargin: 80,
          messageMargin: 50,
        },
        themeVariables: {
          darkMode: true,
          background: "#0A0A0F",
          primaryColor: "#1E3A5F",
          primaryTextColor: "#E8E8E8",
          primaryBorderColor: "#2563EB",
          lineColor: "#4A90D9",
          secondaryColor: "#1A1A2E",
          tertiaryColor: "#0F0F1A",
          noteBkgColor: "#1E3A5F",
          noteTextColor: "#E8E8E8",
          actorBkg: "#1E3A5F",
          actorBorder: "#2563EB",
          actorTextColor: "#E8E8E8",
          labelBoxBkgColor: "#1A1A2E",
          labelBoxBorderColor: "#2563EB",
          labelTextColor: "#E8E8E8",
          loopTextColor: "#9B9B9B",
          activationBorderColor: "#2563EB",
          activationBkgColor: "#1E3A5F",
          sequenceNumberColor: "#FFFFFF",
          nodeBorder: "#2563EB",
          mainBkg: "#1E3A5F",
          clusterBkg: "#111122",
          clusterBorder: "#2563EB",
          titleColor: "#E8E8E8",
          edgeLabelBackground: "#0A0A0F",
        },
      });

      // Sanitize chart — fix common syntax errors
      let sanitized = chart.trim();

      // Remove duplicate node IDs (node A used both as node and subgraph ID)
      // If a node ID is also used as a subgraph ID, rename the node
      const subgraphIds = new Set<string>();
      const subgraphRegex = /subgraph\s+(\w+)\s*\[/g;
      let m;
      while ((m = subgraphRegex.exec(sanitized)) !== null) {
        subgraphIds.add(m[1]);
      }

      // Also match: subgraph ID[Label]
      const subgraphRegex2 = /subgraph\s+(\w+)\[/g;
      while ((m = subgraphRegex2.exec(sanitized)) !== null) {
        subgraphIds.add(m[1]);
      }

      // Also match: subgraph ID
      const subgraphRegex3 = /subgraph\s+(\w+)\s*$/gm;
      while ((m = subgraphRegex3.exec(sanitized)) !== null) {
        subgraphIds.add(m[1]);
      }

      // Replace standalone node definitions that conflict with subgraph IDs
      // e.g. A[Current State] --> B[Module 1] where A and B are also subgraph IDs
      // We need to rename these
      let counter = 0;
      subgraphIds.forEach((id) => {
        // Replace node usages in arrows: A[Label] --> becomes node_A[Label] -->
        const nodeDefRegex = new RegExp(`(\\b)${id}(\\[[^\\]]*\\])`, "g");
        sanitized = sanitized.replace(nodeDefRegex, (_, pre, label) => {
          counter++;
          return `${pre}node_${id}${label}`;
        });
        // Replace arrow references: --> A[ becomes --> node_A[
        // Also replace in arrow targets without labels: --> A
        const arrowRefRegex = new RegExp(`(->|--)\\s*${id}(?![\\w\\[])`, "g");
        sanitized = sanitized.replace(arrowRefRegex, `$1 node_${id}`);
        // Replace in arrow targets with labels: --> A[
        const arrowLabelRefRegex = new RegExp(`(->|--)\\s*${id}(\\[)`, "g");
        sanitized = sanitized.replace(arrowLabelRefRegex, `$1 node_${id}$2`);
      });

      const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const { svg: renderedSvg } = await mermaid.render(id, sanitized);
      setSvg(renderedSvg);
      setError("");
    } catch (err) {
      console.error("Mermaid render error:", err);
      setError("Diagram rendering failed — check syntax");
      renderAttempted.current = false;
    }
  }, [chart]);

  useEffect(() => {
    renderChart();
  }, [renderChart]);

  useEffect(() => {
    renderAttempted.current = false;
  }, [chart]);

  // Zoom handlers
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.3), 3));
  }, []);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, posx: position.x, posy: position.y };
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPosition({ x: dragStart.current.posx + dx, y: dragStart.current.posy + dy });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-3 text-xs text-red-400 my-2">
        {error}
        <pre className="mt-2 text-[10px] text-red-500/60 overflow-x-auto whitespace-pre-wrap max-h-32">{chart}</pre>
      </div>
    );
  }

  return (
    <>
      {/* Inline preview — compact card that opens the canvas */}
      <motion.div
        ref={containerRef}
        className={className || "my-2 relative group"}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => setIsCanvasOpen(true)}
          className="w-full rounded-xl border border-[#1E3A5F]/50 bg-gradient-to-br from-[#0A0A14] to-[#0F0F1A] p-4 text-left transition-all hover:border-[#2563EB]/70 hover:shadow-lg hover:shadow-blue-900/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2563EB]/20">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4A90D9]">Interactive Workflow</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#6B6B9B]">
              <span>Click to expand</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6" /><path d="M10 14L21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </div>
          </div>

          {/* Mini preview */}
          <div className="rounded-lg bg-[#0A0A0F] p-3 overflow-hidden max-h-40 relative">
            {svg ? (
              <div
                className="mermaid-svg-wrapper [&_svg]:max-w-full [&_svg]:h-auto opacity-60"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ) : (
              <div className="flex items-center justify-center py-6">
                <div className="flex items-center gap-2 text-xs text-[#6B6B9B]">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-[#2563EB]"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                  Rendering diagram...
                </div>
              </div>
            )}
            {/* Fade overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0A0A14] to-transparent pointer-events-none" />
          </div>
        </button>
      </motion.div>

      {/* Full-screen dark canvas — Grok style */}
      <AnimatePresence>
        {isCanvasOpen && svg && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Canvas toolbar */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#06060A] border-b border-[#1A1A2E]">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB]/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[#E8E8E8]">Workflow Canvas</span>
                <span className="text-[10px] text-[#6B6B9B] bg-[#1A1A2E] px-2 py-0.5 rounded-full">Interactive</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom controls */}
                <button
                  onClick={() => setScale((s) => Math.max(0.3, s - 0.2))}
                  className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#1A1A2E] text-[#9B9B9B] hover:text-white hover:bg-[#252538] transition-colors text-sm"
                >
                  −
                </button>
                <span className="text-[11px] text-[#6B6B9B] min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
                <button
                  onClick={() => setScale((s) => Math.min(3, s + 0.2))}
                  className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#1A1A2E] text-[#9B9B9B] hover:text-white hover:bg-[#252538] transition-colors text-sm"
                >
                  +
                </button>
                <button
                  onClick={resetView}
                  className="h-7 px-2.5 flex items-center justify-center rounded-lg bg-[#1A1A2E] text-[#9B9B9B] hover:text-white hover:bg-[#252538] transition-colors text-[11px]"
                >
                  Reset
                </button>

                <div className="w-px h-5 bg-[#1A1A2E] mx-1" />

                <button
                  onClick={() => setIsCanvasOpen(false)}
                  className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#1A1A2E] text-[#9B9B9B] hover:text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Canvas area — dark with dot grid pattern */}
            <div
              className="flex-1 overflow-hidden bg-[#08080E] relative"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              {/* Dot grid background */}
              <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                  backgroundImage: "radial-gradient(circle, #2563EB 1px, transparent 1px)",
                  backgroundSize: `${30 * scale}px ${30 * scale}px`,
                  backgroundPosition: `${position.x % (30 * scale)}px ${position.y % (30 * scale)}px`,
                }}
              />

              {/* Ambient glow effects */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-900/8 rounded-full blur-[100px] pointer-events-none" />

              {/* The diagram */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
              >
                <div
                  className="mermaid-canvas-wrapper [&_svg]:max-w-none [&_svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </div>

              {/* Bottom hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] text-[#4A4A6A] bg-[#0A0A14]/80 px-3 py-1.5 rounded-full backdrop-blur-sm border border-[#1A1A2E]/50">
                <span>Scroll to zoom</span>
                <span className="w-px h-3 bg-[#1A1A2E]" />
                <span>Drag to pan</span>
                <span className="w-px h-3 bg-[#1A1A2E]" />
                <span>ESC to close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index).trim();
      if (textBefore) {
        blocks.push({ type: "text", content: textBefore });
      }
    }
    blocks.push({ type: "mermaid", content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex).trim();
    if (textAfter) {
      blocks.push({ type: "text", content: textAfter });
    }
  }

  if (blocks.length === 0) {
    blocks.push({ type: "text", content: text });
  }

  return blocks;
}
