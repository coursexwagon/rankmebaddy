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
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [scale, setScale] = useState(1.2);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posx: 0, posy: 0 });
  const renderAttempted = useRef(false);
  const chartRef = useRef(chart);
  const hasAutoOpened = useRef(false);

  // Track chart changes for re-render
  useEffect(() => {
    chartRef.current = chart;
    renderAttempted.current = false;
    setSvg("");
    setError("");
  }, [chart]);

  // Auto-open canvas ONLY ONCE when SVG is first rendered (if autoOpen)
  // Uses hasAutoOpened ref to prevent re-opening after user closes
  useEffect(() => {
    if (autoOpen && svg && !isCanvasOpen && !hasAutoOpened.current) {
      hasAutoOpened.current = true;
      setIsCanvasOpen(true);
    }
  }, [autoOpen, svg, isCanvasOpen]);

  // Reset auto-open tracking when chart changes (new diagram)
  useEffect(() => {
    hasAutoOpened.current = false;
  }, [chart]);

  const renderChart = useCallback(async () => {
    if (!chart || renderAttempted.current) return;
    renderAttempted.current = true;

    try {
      const mermaid = (await import("mermaid")).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 14,
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: "basis",
          padding: 25,
          nodeSpacing: 70,
          rankSpacing: 90,
        },
        sequence: {
          useMaxWidth: false,
          actorMargin: 80,
          messageMargin: 50,
        },
        themeVariables: {
          darkMode: true,
          background: "#0B0B12",
          primaryColor: "#0D3D35",
          primaryTextColor: "#F0F0F0",
          primaryBorderColor: "#00D4AA",
          lineColor: "#00D4AA80",
          secondaryColor: "#12121E",
          tertiaryColor: "#0F0F1A",
          noteBkgColor: "#0D3D35",
          noteTextColor: "#F0F0F0",
          actorBkg: "#0D3D35",
          actorBorder: "#00D4AA",
          actorTextColor: "#F0F0F0",
          labelBoxBkgColor: "#12121E",
          labelBoxBorderColor: "#00D4AA",
          labelTextColor: "#F0F0F0",
          loopTextColor: "#A0A0B8",
          activationBorderColor: "#00D4AA",
          activationBkgColor: "#0D3D35",
          sequenceNumberColor: "#FFFFFF",
          nodeBorder: "#00D4AA",
          mainBkg: "#0D3D35",
          clusterBkg: "#0A0A14",
          clusterBorder: "#00D4AA60",
          titleColor: "#F0F0F0",
          edgeLabelBackground: "#0B0B12",
          nodeTextColor: "#F0F0F0",
        },
      });

      // The server-side fixMermaidSyntax already handles subgraph ID conflicts.
      // Just do basic client-side sanitization.
      let sanitized = chart.trim();

      // Remove any ```mermaid or ``` wrappers that might have slipped through
      sanitized = sanitized.replace(/^```mermaid\s*\n?/i, "").replace(/\n?```\s*$/i, "");

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
    setScale(1.2);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Close handler
  const closeCanvas = useCallback(() => {
    setIsCanvasOpen(false);
  }, []);

  // Click backdrop to close
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCanvas();
    }
  }, [closeCanvas]);

  // ESC to close canvas — robust with proper cleanup
  useEffect(() => {
    if (!isCanvasOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setIsCanvasOpen(false);
      }
    };

    // Use capture phase to ensure we get the event before anything else
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isCanvasOpen]);

  // Lock body scroll when canvas is open
  useEffect(() => {
    if (isCanvasOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isCanvasOpen]);

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
          className="w-full rounded-xl border border-[#0D3D35]/60 bg-gradient-to-br from-[#0A0A14] to-[#0F0F1A] p-4 text-left transition-all hover:border-[#00D4AA]/50 hover:shadow-lg hover:shadow-[#00D4AA]/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#00D4AA]/15">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#00D4AA]">Interactive Workflow</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#6B6B9B]">
              <span>Click to expand</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6" /><path d="M10 14L21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </div>
          </div>

          {/* Mini preview */}
          <div className="rounded-lg bg-[#0B0B12] p-4 overflow-hidden max-h-72 relative">
            {svg ? (
              <div
                className="mermaid-svg-wrapper [&_svg]:max-w-full [&_svg]:h-auto opacity-80"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-xs text-[#6B6B9B]">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-[#00D4AA]"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                  Rendering diagram...
                </div>
              </div>
            )}
            {/* Fade overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0A0A14] to-transparent pointer-events-none" />
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
            onClick={handleBackdropClick}
          >
            {/* Semi-transparent overlay backdrop — click to close */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Canvas content (above overlay) */}
            <div className="relative z-10 flex flex-col h-full">
              {/* Canvas toolbar */}
              <div className="flex items-center justify-between px-5 py-3 bg-[#06060A]/95 border-b border-[#1A1A2E] backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00D4AA]/15">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-[#F0F0F0]">Workflow Canvas</span>
                  <span className="text-[10px] text-[#00D4AA] bg-[#00D4AA]/10 px-2 py-0.5 rounded-full border border-[#00D4AA]/20">Interactive</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Zoom controls */}
                  <button
                    onClick={() => setScale((s) => Math.max(0.3, s - 0.2))}
                    className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#1A1A2E] text-[#A0A0B8] hover:text-white hover:bg-[#252538] transition-colors text-sm"
                  >
                    −
                  </button>
                  <span className="text-[11px] text-[#A0A0B8] min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
                  <button
                    onClick={() => setScale((s) => Math.min(3, s + 0.2))}
                    className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#1A1A2E] text-[#A0A0B8] hover:text-white hover:bg-[#252538] transition-colors text-sm"
                  >
                    +
                  </button>
                  <button
                    onClick={resetView}
                    className="h-7 px-2.5 flex items-center justify-center rounded-lg bg-[#1A1A2E] text-[#A0A0B8] hover:text-white hover:bg-[#252538] transition-colors text-[11px]"
                  >
                    Reset
                  </button>

                  <div className="w-px h-5 bg-[#1A1A2E] mx-1" />

                  {/* Close button — prominent and clear */}
                  <button
                    onClick={closeCanvas}
                    className="h-8 px-3 flex items-center justify-center gap-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors text-xs font-medium border border-red-800/30"
                    title="Close canvas (ESC)"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                    Close
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
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage: "radial-gradient(circle, #00D4AA 1px, transparent 1px)",
                    backgroundSize: `${30 * scale}px ${30 * scale}px`,
                    backgroundPosition: `${position.x % (30 * scale)}px ${position.y % (30 * scale)}px`,
                  }}
                />

                {/* Ambient glow effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D4AA]/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#00D4AA]/3 rounded-full blur-[100px] pointer-events-none" />

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
