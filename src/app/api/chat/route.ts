import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import ZAI from "z-ai-web-dev-sdk";

const LONGCAT_API_KEY = process.env.LONGCAT_API_KEY || "";
const LONGCAT_BASE_URL = process.env.LONGCAT_BASE_URL || "https://api.longcat.chat/openai";
const LONGCAT_MODEL = process.env.LONGCAT_MODEL || "LongCat-Flash-Thinking-2601";

const OLOSTEP_API_KEY = process.env.OLOSTEP_API_KEY || "";
const OLOSTEP_BASE_URL = "https://api.olostep.com/v1/scrapes";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "";
const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || "nvidia/nemotron-3-super-120b-a12b";

/* ─── Direct Supabase Admin Client for Credits ──────────────── */
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const BETA_MODE = process.env.NEXT_PUBLIC_BETA_MODE === "true";
const FREE_CREDITS_PER_RESET = BETA_MODE ? 500 : 25;
const PRO_CREDITS_PER_RESET = BETA_MODE ? 1000 : 100;
const ENTERPRISE_CREDITS_PER_RESET = 999;
const RESET_INTERVAL_MS = 60 * 60 * 1000; // 1 hour
const BETA_BONUS_CREDITS = 200;

type Tier = "free" | "pro" | "enterprise";

function getCreditsForTier(tier: Tier): number {
  switch (tier) {
    case "pro": return PRO_CREDITS_PER_RESET;
    case "enterprise": return ENTERPRISE_CREDITS_PER_RESET;
    default: return FREE_CREDITS_PER_RESET;
  }
}

interface AgentAction {
  type: string;
  label: string;
  prompt: string;
}

const ACTION_PROMPTS: Record<string, string> = {
  "keyword-gap": "Run a detailed keyword gap analysis for my site. Show me keywords my competitors rank for that I don't.",
  "optimize-titles": "Review all my page titles and suggest optimized versions with exact before/after comparisons.",
  "competitor-analysis": "Analyze my top SEO competitors. What are they ranking for that I'm not?",
  "content-plan": "Generate a complete 30-day content calendar targeting my primary keyword and related topics.",
  "technical-audit": "Run a technical SEO audit on my site. Check for crawl issues, speed problems, and structured data gaps.",
  "backlink-strategy": "Create a backlink acquisition strategy for my site with specific outreach targets and templates.",
  "serp-analysis": "Analyze the SERP for my target keyword. What types of content are ranking and why?",
  "meta-optimization": "Optimize all my meta descriptions and title tags for better CTR from search results.",
  "web-search": "Search the web for the latest SEO data and competitor information for my site.",
  "site-audit": "Perform a comprehensive site audit covering technical SEO, content, and authority factors.",
  "content-engineer": "Engineer content using the Sovereign Rank Module 3 framework: intent mapping, semantic field construction, BERT/MUM alignment, E-E-A-T engineering, and SERP feature structure.",
  "entity-build": "Build entity architecture using Module 2: brand entity, author entities, content entities, schema markup strategy.",
  "behavior-optimize": "Optimize behavioral signals using Module 5: CTR engineering, pogo-stick prevention, dwell time engineering, scroll depth engineering.",
  "authority-build": "Create an authority acquisition strategy using Module 6: Tier 1-4 link building, link velocity targets, and relationship-based outreach.",
  "serp-capture": "Create a SERP feature capture plan using Module 7: featured snippets, PAA targeting, Knowledge Panel, Video Carousel, AI Overview citation.",
  "diagram-workflow": "Create a visual workflow diagram showing the SEO process for my site.",
  "diagram-architecture": "Create a site architecture diagram showing the recommended structure for my site.",
  "diagram-keyword-map": "Create a keyword mapping diagram showing how keywords map to pages on my site.",
  "diagram-strategy": "Create a visual SEO strategy diagram showing the timeline and key milestones.",
};

function parseActions(text: string): { cleanReply: string; actions: AgentAction[] } {
  const actions: AgentAction[] = [];
  const actionRegex = /\[ACTION:([a-zA-Z0-9_-]+)\](.+?)(?=\n|$)/g;
  let match;
  let cleanReply = text;

  while ((match = actionRegex.exec(text)) !== null) {
    const actionType = match[1];
    const actionLabel = match[2].trim();
    actions.push({
      type: actionType,
      label: actionLabel,
      prompt: ACTION_PROMPTS[actionType] || actionLabel,
    });
  }

  cleanReply = cleanReply.replace(actionRegex, "").trim();
  cleanReply = cleanReply.replace(/\n{3,}/g, "\n\n");

  return { cleanReply, actions };
}

function cleanMarkdown(text: string): string {
  // Don't strip markdown inside [DIAGRAM] blocks
  const diagramBlocks: string[] = [];
  let processed = text.replace(/\[DIAGRAM\]([\s\S]*?)\[\/DIAGRAM\]/g, (match, content) => {
    const placeholder = `__DIAGRAM_PLACEHOLDER_${diagramBlocks.length}__`;
    diagramBlocks.push(match);
    return placeholder;
  });

  processed = processed
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Restore diagram blocks (with syntax fixing)
  diagramBlocks.forEach((block, i) => {
    // Extract the mermaid content and fix syntax
    const fixedBlock = block.replace(/\[DIAGRAM\]([\s\S]*?)\[\/DIAGRAM\]/g, (_match, content) => {
      return `[DIAGRAM]${fixMermaidSyntax(content)}[/DIAGRAM]`;
    });
    processed = processed.replace(`__DIAGRAM_PLACEHOLDER_${i}__`, fixedBlock);
  });

  return processed;
}

/**
 * Auto-fix common Mermaid syntax issues in diagrams:
 * 1. Subgraph IDs that conflict with node IDs (e.g., subgraph A[...] when A[Node] exists)
 * 2. Special characters in node labels that break parsing
 * 3. Long labels truncated to 25 chars
 * 4. Markdown artifacts stripped from Mermaid code
 * 5. AI-generated gibberish patterns cleaned up
 */
function fixMermaidSyntax(diagram: string): string {
  let code = diagram;

  // 1. Remove markdown artifacts that may have slipped in
  code = code.replace(/\*\*/g, "");           // bold markers
  code = code.replace(/##/g, "");             // heading markers
  code = code.replace(/__/g, "");             // italic markers
  code = code.replace(/`{1,3}/g, "");         // code backticks

  // 2. Remove leftover markdown link syntax inside labels
  code = code.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

  const lines = code.split("\n");
  const nodeIds = new Set<string>();
  const subgraphLines: { index: number; oldId: string; newId: string }[] = [];

  // 3. First pass: collect all node IDs (e.g., A[Label] or A["Label"] or A{Label})
  const arrowNodeRegex = /([A-Za-z_][A-Za-z0-9_]*)\s*[\[{]/g;

  for (const line of lines) {
    if (/^\s*subgraph\s+/i.test(line)) continue;
    if (/^\s*end\s*$/i.test(line)) continue;

    let match;
    while ((match = arrowNodeRegex.exec(line)) !== null) {
      nodeIds.add(match[1]);
    }
  }

  // 4. Second pass: find subgraph lines with conflicting IDs
  let sgCounter = 1;
  const subgraphRegex = /^(\s*subgraph\s+)([A-Za-z_][A-Za-z0-9_]*)\s*(\[.*\])/i;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(subgraphRegex);
    if (match) {
      const subgraphId = match[2];
      if (nodeIds.has(subgraphId)) {
        const newId = `sg${sgCounter}`;
        subgraphLines.push({ index: i, oldId: subgraphId, newId });
        sgCounter++;
      }
    }
  }

  // Apply fixes: rename conflicting subgraph IDs
  for (const fix of subgraphLines) {
    const match = lines[fix.index].match(subgraphRegex);
    if (match) {
      lines[fix.index] = `${match[1]}${fix.newId} ${match[3]}`;
    }
  }

  // 5. Fix node labels — clean up and truncate
  for (let i = 0; i < lines.length; i++) {
    const nodeLabelRegex = /^(\s*[A-Za-z_][A-Za-z0-9_]*\s*\[)([^\]]*)(\]\s*)/;
    const match = lines[i].match(nodeLabelRegex);
    if (match) {
      let label = match[2];

      // Strip any remaining markdown symbols
      label = label.replace(/\*\*/g, "").replace(/##/g, "").replace(/`/g, "");

      // Remove emojis and special Unicode characters
      label = label.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, "");

      // Fix labels with colons — wrap in quotes
      if (label.includes(":") && !label.startsWith('"')) {
        label = `"${label}"`;
      }

      // Fix labels with parentheses — remove them and wrap in quotes
      if ((label.includes("(") || label.includes(")")) && !label.startsWith('"')) {
        label = `"${label.replace(/[()]/g, " ")}"`;
      }

      // Fix labels with special characters that break Mermaid — wrap in quotes
      if (/[&#%@!;]/.test(label) && !label.startsWith('"')) {
        label = `"${label.replace(/[&#%@!;]/g, " ")}"`;
      }

      // Truncate labels that are too long (max 25 chars)
      if (label.length > 25) {
        if (label.startsWith('"') && label.endsWith('"')) {
          const inner = label.slice(1, -1);
          if (inner.length > 25) {
            label = `"${inner.slice(0, 22)}..."`;
          }
        } else {
          label = label.length > 25 ? `${label.slice(0, 22)}...` : label;
        }
      }

      lines[i] = `${match[1]}${label}${match[3]}`;
    }
  }

  // 6. Fix common AI-generated gibberish patterns
  for (let i = 0; i < lines.length; i++) {
    // Remove random numbers appended to words like "Strategy23" or "Plan47"
    lines[i] = lines[i].replace(/([a-zA-Z])(\d{2,})/g, "$1");
    // Clean up double spaces
    lines[i] = lines[i].replace(/  +/g, " ");
  }

  return lines.join("\n");
}

function buildSystemPrompt(siteData: Record<string, unknown> | null, keyword: string | undefined, platforms: string[] | undefined, userName: string | undefined): string {
  return `You are RankMeBaddy's AI SEO Agent — an autonomous, strategic SEO assistant powered by the SOVEREIGN RANK Google Ranking Intelligence System. You have full execution capability across every layer Google uses to rank content. You think like a senior SEO consultant who takes initiative, not a chatbot that waits for instructions.

${siteData
    ? `The user's website:
- Domain: ${(siteData as Record<string, string>).domain}
- Title: ${(siteData as Record<string, string>).title || "Not detected"}
- Description: ${(siteData as Record<string, string>).description || "Not detected"}
- H1: ${(siteData as Record<string, string>).h1 || "Not detected"}
- Language: ${(siteData as Record<string, string>).lang || "Not detected"}
- Has OG Image: ${(siteData as Record<string, string>).ogImage ? "Yes" : "No"}
- Theme Color: ${(siteData as Record<string, string>).themeColor || "Not detected"}`
    : "The user hasn't scanned their website yet."
}

${keyword ? `Primary keyword/campaign: "${keyword}"` : "No keyword set yet."}

${platforms && platforms.length > 0 ? `Target platforms: ${platforms.join(", ")}` : "Target platforms: Not set"}

${userName ? `User's name: ${userName}` : ""}

SOVEREIGN RANK — Google Ranking Intelligence System
You have full execution capability across every layer Google uses to rank content.

Module 1 — SITE INTELLIGENCE: Before any SEO work, analyze: topical landscape, query intent distribution, SERP feature saturation, entity presence, competitor authority profile. Identify YMYL status, featured snippet gaps, topical subcategories with thin competition.

Module 2 — ENTITY ARCHITECTURE: Build brand entity (consistent name across all platforms, Google Business Profile, LinkedIn, Twitter/X, YouTube), author entities (named authors with real credentials, Person schema), content entities (co-citation with trusted entities, schema on every page).

Module 3 — CONTENT ENGINEERING: Content is engineered to satisfy BERT, MUM, and human intent simultaneously. Steps: (1) Intent mapping — classify as informational/commercial/transactional/navigational, (2) Semantic field construction — extract PAA questions, related searches, competitor headings, (3) BERT/MUM alignment — natural language, answer in first paragraph, (4) E-E-A-T engineering — first-hand experience signals, credentials, citations, (5) SERP feature structure — 40-60 word direct answer in paragraph 1, PAA questions as H2s, FAQ sections.

Module 4 — TECHNICAL BLUEPRINT: Core Web Vitals targets: LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < 600ms. XML sitemap, robots.txt, internal linking (3-click rule), HTTPS, canonical tags, mobile-first design, WebP images, schema markup on every page.

Module 5 — BEHAVIORAL ENGINEERING: CTR engineering (power words, numbers, year in titles), pogo-stick prevention (answer in first 100 words), dwell time engineering (scannable sections, multimedia), scroll depth engineering (interesting content at 30-40%), branded search engineering.

Module 6 — AUTHORITY ACQUISITION: Tier 1 foundational (GSC, Google Business, directories), Tier 2 content-driven (original research, tools, ultimate guides, guest posts), Tier 3 relationship-based (HARO, podcasts, expert roundups), Tier 4 competitive gap filling (broken link building, skyscraper, unlinked mentions). Link velocity: 5-15 new domains/month in months 1-3.

Module 7 — SERP FEATURE CAPTURE: Featured snippet optimization (40-60 word direct answer), PAA targeting, Knowledge Panel strategy, Video Carousel (YouTube for every content piece), AI Overview citation (rank top 10 + structured data + clear factual statements).

Module 8 — COMPOUNDING LOOP: Content refresh loop (update pages ranking positions 8-20), internal link loop (every new piece links to 3 older pieces), email/community loop, YouTube loop, data loop (original data attracts backlinks passively).

Module 9 — MULTI-SITE SCALING: Only after site 1 reaches page 1 for 3+ keywords, 10K monthly organic visitors, 50 linking root domains.

Module 10 — ENDGAME: Knowledge Graph entity status, AI Overview citation, branded search dominance, category ownership.

OUTPUT FORMATTING RULES (CRITICAL — the user sees your response in a clean chat UI, NOT a markdown renderer):
- NEVER use ## or ### for headings. Instead, use ALL CAPS for emphasis like: KEYWORD ANALYSIS
- NEVER use **bold** or ***bold italic***. Instead, use plain text with natural emphasis.
- NEVER use \`code backticks\` for emphasis. Only use them for actual code snippets.
- NEVER use > blockquotes.
- Use numbered lists (1. 2. 3.) for steps — these render nicely.
- Use bullet points with - or • for lists.
- Keep paragraphs short — 2-3 sentences max.
- Use natural language, not markdown formatting.

DIAGRAM GENERATION (CRITICAL — This is what makes you different from ChatGPT):
When your response involves ANY of the following, you MUST include a Mermaid diagram using the [DIAGRAM]...[/DIAGRAM] format:
- Steps, processes, workflows, or sequences
- Strategy timelines or roadmaps
- Site architecture or structure
- Keyword mapping or content planning
- Data flows or system interactions
- Decision trees or conditional logic
- Entity relationships or hierarchies
- Comparisons or competitive analysis
- Any multi-step process the user should follow
- ANY planning, SEO strategy, or campaign request — ALWAYS generate a diagram

DIAGRAM FORMAT:
Wrap your Mermaid diagram code in [DIAGRAM] and [/DIAGRAM] tags. Use valid Mermaid syntax ONLY.

Example for a workflow (MINIMAL, CLEAN):
[DIAGRAM]
flowchart TD
    A[Analyze] --> B[Plan]
    B --> C[Build]
    C --> D[Optimize]
    D --> E[Monitor]
[/DIAGRAM]

Example for a strategy timeline:
[DIAGRAM]
flowchart LR
    A[Foundation] --> B[Content]
    B --> C[Authority]
    C --> D[Scale]
[/DIAGRAM]

DIAGRAM RULES (CRITICAL — FOLLOW THESE OR DIAGRAMS WILL BE UGLY AND BROKEN):
- ALWAYS include a diagram when explaining a process, workflow, or strategy
- Keep diagrams MINIMAL — 4-8 nodes maximum. Less is more. A clean 5-node diagram is better than a messy 15-node one.
- Use SHORT labels — 1-3 words per node only. Examples: "Research", "Analyze", "Plan", "Execute", "Monitor"
- NEVER use long phrases or sentences as node labels. "Optimize Title Tags" is okay, but "Optimize All Title Tags For Better CTR" is NOT.
- SPELL CHECK every label. If a word looks misspelled or awkward, use a simpler word. "Analyze" not "Analsye", "Strategy" not "Stratgy".
- Use professional, clean labels. Examples: "Research" -> "Analyze" -> "Plan" -> "Execute" -> "Monitor"
- NEVER use special characters in labels: no &, %, @, #, !, ;, or emojis
- Use flowchart TD (top-down) for workflows and processes
- Use flowchart LR (left-right) for timelines and sequences
- Do NOT use subgraphs unless absolutely necessary — flat diagrams are cleaner and less error-prone
- If you use subgraphs, max 2 subgraphs with 2-3 nodes each
- Every arrow should have a clear relationship
- You can include text explanation BEFORE the diagram, then the diagram visualizes it
- Do NOT use markdown inside [DIAGRAM] blocks — only valid Mermaid syntax

CRITICAL SYNTAX RULES (FAILURE TO FOLLOW = BROKEN DIAGRAM — THIS IS THE #1 BUG):
1. NEVER use the same ID for both a node and a subgraph. If you have "A[Module 1] --> B[Module 2]", then a subgraph MUST NOT use A, B, C, D, E, F, G, H, or I as its ID. Instead, ALWAYS prefix subgraph IDs with "sg_" like: "subgraph sg1[Phase 1]", "subgraph sg2[Phase 2]", etc.
2. Subgraph IDs must be COMPLETELY DIFFERENT from any node IDs. Use sg1, sg2, sg3, sg4 etc.
3. Node labels with colons or special characters MUST use double quotes: A["Step 1: Research"]
4. Do NOT nest subgraphs — keep them flat at the same level
5. Each subgraph must end with "end" on its own line
6. Do NOT use parentheses () in node labels — use brackets [] instead
7. Avoid special characters in labels: no &, %, @, #, etc.
8. Keep node IDs simple and unique: A, B, C, D, E, F — single letters are best
9. Truncate any label longer than 25 characters to keep diagrams clean

AUTONOMOUS BEHAVIOR:
- When the user asks about SEO, DON'T just give advice — give a complete execution plan with specific steps
- ALWAYS include a visual diagram when explaining processes, workflows, or strategies — this is what makes you NOT ChatGPT
- Always include web searches for current data when analyzing competitors, keywords, or rankings
- Proactively identify issues and suggest fixes — don't wait for the user to ask
- After each response, suggest 2-3 next actions using [ACTION:type] tags
- If the user's site has obvious SEO problems, flag them immediately without being asked
- Think like a senior SEO consultant who takes initiative, not a chatbot that waits for instructions
- When analyzing a site, automatically check: title tags, meta descriptions, H1 structure, schema markup, Core Web Vitals indicators, content depth, internal linking

WEB SEARCH TOOL:
You have a WEB SEARCH tool. When you need current data, competitor info, or real-time information, include [WEB_SEARCH:query] in your response. The system will execute the search and provide results in the next message. Use this proactively whenever you need fresh data about:
- Current competitor rankings
- Latest keyword trends
- Recent SERP changes
- Current search volume data
- Industry news affecting SEO

WEB SCRAPING TOOL:
You have a WEB SCRAPING tool powered by Olostep. When you need to deeply analyze a specific webpage, competitor page, or any URL for SEO data, include [SCRAPE:url] in your response. The system will scrape the full content of that URL and provide it to you. Use this when:
- You need to analyze a competitor's page content and structure
- You want to check a specific page's SEO elements (title, headings, meta tags)
- You need the actual content of a search result for deeper analysis
- You want to extract data from a specific webpage

MULTI-AGENT VERIFICATION:
When you want a second expert opinion or verification of your analysis, include [AGENT:analyze] in your response. The system will consult another AI model (NVIDIA Nemotron) independently, and both analyses will be combined. Use this when:
- You want to verify your SEO recommendations with a second opinion
- The analysis is complex and would benefit from multiple perspectives
- You want to provide the user with confidence that your advice is sound
- You're making significant strategic recommendations

ACTION TAG FORMAT:
At the end of your response, always include 2-3 suggested next actions using this format:
[ACTION:type]Label text for the button

Available action types:
- [ACTION:web-search] — trigger a web search for current data
- [ACTION:site-audit] — full site audit
- [ACTION:keyword-gap] — for keyword gap analysis
- [ACTION:optimize-titles] — for title tag optimization
- [ACTION:competitor-analysis] — for competitor research
- [ACTION:content-plan] — for content calendar generation
- [ACTION:technical-audit] — for technical SEO audit
- [ACTION:backlink-strategy] — for backlink strategy
- [ACTION:serp-analysis] — for SERP analysis
- [ACTION:meta-optimization] — for meta tag optimization
- [ACTION:content-engineer] — engineer content using Module 3 framework
- [ACTION:entity-build] — build entity architecture (Module 2)
- [ACTION:behavior-optimize] — optimize behavioral signals (Module 5)
- [ACTION:authority-build] — authority acquisition strategy (Module 6)
- [ACTION:serp-capture] — SERP feature capture plan (Module 7)
- [ACTION:diagram-workflow] — create a visual SEO workflow diagram
- [ACTION:diagram-architecture] — create a site architecture diagram
- [ACTION:diagram-keyword-map] — create a keyword mapping diagram
- [ACTION:diagram-strategy] — create a visual SEO strategy timeline

RULES:
- Never say "As an AI" or "I'm here to help" — just help.
- Use the user's name naturally if you have it.
- If you don't have enough info, ask follow-up questions AND suggest an action to get that info.
- When suggesting SEO changes, always explain the expected impact.
- Be concise but thorough — quality over fluff.
- Always be specific to the user's actual site data — not generic advice.
- ALWAYS include a diagram when your answer involves steps, processes, workflows, strategies, or anything visual — this is what makes you NOT just another ChatGPT clone.`;
}

async function callLongCatAPI(systemPrompt: string, messages: { role: string; content: string }[]): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);

  const response = await fetch(`${LONGCAT_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LONGCAT_API_KEY}`,
    },
    body: JSON.stringify({
      model: LONGCAT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 3000,
    }),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("LongCat API error:", response.status, errorText);
    // If LongCat fails, try NVIDIA as fallback
    console.log("Trying NVIDIA fallback...");
    try {
      return await callNvidiaAPI(systemPrompt, messages);
    } catch (nvidiaErr) {
      console.error("NVIDIA fallback also failed:", nvidiaErr);
      throw new Error(`AI service unavailable (status ${response.status}). Please try again in a moment.`);
    }
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Try again?";
}

/* ─── Olostep Web Scraping ─────────────────────────────────── */
async function executeOlostepScrape(url: string): Promise<string> {
  try {
    if (!OLOSTEP_API_KEY) {
      return `Olostep scraping not configured (missing API key). Could not scrape: ${url}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(OLOSTEP_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OLOSTEP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url_to_scrape: url,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Olostep API error:", response.status, errorText);
      return `Failed to scrape ${url}: HTTP ${response.status}`;
    }

    const data = await response.json();

    // Extract content from Olostep response
    const content = data?.data?.content || data?.content || data?.text || data?.raw_content || "";
    const title = data?.data?.title || data?.title || "";
    const metaDescription = data?.data?.meta_description || data?.meta_description || "";
    const h1 = data?.data?.h1 || data?.h1 || "";

    if (!content && !title) {
      return `No content extracted from ${url}`;
    }

    let result = `Scraped content from: ${url}\n`;
    if (title) result += `Title: ${title}\n`;
    if (metaDescription) result += `Meta Description: ${metaDescription}\n`;
    if (h1) result += `H1: ${h1}\n`;
    if (content) result += `\nContent:\n${content.slice(0, 8000)}\n`;
    if (content.length > 8000) result += `\n[Content truncated — ${content.length} total characters]`;

    return result;
  } catch (err) {
    console.error("Olostep scrape error:", err);
    return `Web scraping failed for ${url}. Proceeding without scraped content.`;
  }
}

/* ─── NVIDIA Nemotron Multi-Agent ──────────────────────────── */
async function callNvidiaAPI(systemPrompt: string, messages: { role: string; content: string }[]): Promise<string> {
  try {
    if (!NVIDIA_API_KEY) {
      return "NVIDIA agent not configured (missing API key). Skipping second opinion.";
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const nvidiaSystemPrompt = `You are RankMeBaddy's AI SEO Agent — an autonomous, strategic SEO assistant. You have full execution capability across every layer Google uses to rank content. Think like a senior SEO consultant who takes initiative. Provide specific, actionable SEO advice. Use natural language, not markdown formatting (no ##, **, or backticks for emphasis). If your response involves steps, processes, or strategies, include a Mermaid diagram in [DIAGRAM]...[/DIAGRAM] tags. Also include 2-3 [ACTION:type] suggestions at the end. When you need current data, include [WEB_SEARCH:query] in your response. For deep page analysis, include [SCRAPE:url].`;

    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          { role: "system", content: nvidiaSystemPrompt },
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA API error:", response.status, errorText);
      return "Second opinion unavailable — NVIDIA agent encountered an error.";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response from NVIDIA agent.";
  } catch (err) {
    console.error("NVIDIA agent error:", err);
    return "Second opinion unavailable — NVIDIA agent timed out or encountered an error.";
  }
}

/* ─── Web Search via z-ai ──────────────────────────────────── */
async function executeWebSearch(query: string): Promise<string> {
  try {
    const zai = await ZAI.create();
    const searchResult = await zai.functions.invoke("web_search", { query, num: 8 });

    if (!Array.isArray(searchResult) || searchResult.length === 0) {
      return "No search results found for this query.";
    }

    return searchResult
      .map(
        (r: { name?: string; url?: string; snippet?: string; date?: string }, i: number) =>
          `${i + 1}. ${r.name || "Untitled"}\n   URL: ${r.url || "N/A"}\n   ${r.snippet || "No snippet"}\n   ${r.date ? `Date: ${r.date}` : ""}`
      )
      .join("\n\n");
  } catch (err) {
    console.error("Web search error:", err);
    return "Web search failed. Proceeding without current data.";
  }
}

/* ─── Direct Credit Helpers (no HTTP self-call) ─────────────── */

interface CreditRecord {
  user_id: string;
  credits_remaining: number;
  total_used: number;
  total_refunded: number;
  tier: Tier;
  last_reset_at: string;
  created_at: string;
}

async function ensureCreditRecord(userId: string): Promise<{ record: CreditRecord | null; error: string | null }> {
  const { data, error } = await supabaseAdmin
    .from("user_credits")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    const now = new Date().toISOString();
    const tier: Tier = "free";
    const startingCredits = FREE_CREDITS_PER_RESET + (BETA_MODE ? BETA_BONUS_CREDITS : 0);
    const { data: newData, error: insertError } = await supabaseAdmin
      .from("user_credits")
      .insert({
        user_id: userId,
        credits_remaining: startingCredits,
        total_used: 0,
        total_refunded: 0,
        tier,
        last_reset_at: now,
        created_at: now,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Credits insert error:", insertError);
      return { record: null, error: "Failed to create credit record" };
    }
    return { record: newData as CreditRecord, error: null };
  }

  if (error) {
    console.error("Credits fetch error:", error);
    return { record: null, error: "Failed to fetch credit record" };
  }

  return { record: data as CreditRecord, error: null };
}

async function checkAndResetCredits(record: CreditRecord): Promise<CreditRecord> {
  const lastReset = new Date(record.last_reset_at).getTime();
  const now = Date.now();
  const maxCredits = getCreditsForTier(record.tier);

  if (now - lastReset >= RESET_INTERVAL_MS && record.credits_remaining < maxCredits) {
    const { data: updatedData, error: updateError } = await supabaseAdmin
      .from("user_credits")
      .update({
        credits_remaining: maxCredits,
        last_reset_at: new Date(now).toISOString(),
      })
      .eq("user_id", record.user_id)
      .select()
      .single();

    if (updatedData && !updateError) {
      return updatedData as CreditRecord;
    }
  }

  return record;
}

async function verifyCreditsDirect(userId: string): Promise<{ allowed: boolean; creditsRemaining: number; tier: string; maxCredits: number; error?: string }> {
  try {
    if (!userId) {
      return { allowed: false, creditsRemaining: 0, tier: "free", maxCredits: FREE_CREDITS_PER_RESET, error: "User ID required" };
    }

    const { record, error } = await ensureCreditRecord(userId);

    if (error || !record) {
      if (BETA_MODE) {
        return {
          allowed: true,
          creditsRemaining: FREE_CREDITS_PER_RESET,
          tier: "free" as Tier,
          maxCredits: FREE_CREDITS_PER_RESET,
        };
      }
      return { allowed: false, creditsRemaining: 0, tier: "free", maxCredits: FREE_CREDITS_PER_RESET, error: error || "Unable to verify credits" };
    }

    const currentRecord = await checkAndResetCredits(record);
    const maxCredits = getCreditsForTier(currentRecord.tier);

    if (currentRecord.credits_remaining <= 0) {
      return {
        allowed: false,
        creditsRemaining: 0,
        tier: currentRecord.tier,
        maxCredits,
        error: "No credits remaining. Credits reset every hour.",
      };
    }

    return {
      allowed: true,
      creditsRemaining: currentRecord.credits_remaining,
      tier: currentRecord.tier,
      maxCredits,
    };
  } catch (err) {
    console.error("Credit verification direct error:", err);
    if (BETA_MODE) {
      return { allowed: true, creditsRemaining: FREE_CREDITS_PER_RESET, tier: "free", maxCredits: FREE_CREDITS_PER_RESET };
    }
    return { allowed: false, creditsRemaining: 0, tier: "free", maxCredits: FREE_CREDITS_PER_RESET, error: "Credit verification failed" };
  }
}

async function deductCreditsDirect(userId: string): Promise<{ success: boolean; creditsRemaining: number }> {
  try {
    const { record, error } = await ensureCreditRecord(userId);

    if (error || !record) {
      return { success: false, creditsRemaining: 0 };
    }

    const currentRecord = await checkAndResetCredits(record);

    if (currentRecord.credits_remaining <= 0) {
      return { success: false, creditsRemaining: 0 };
    }

    const { error: updateError } = await supabaseAdmin
      .from("user_credits")
      .update({
        credits_remaining: currentRecord.credits_remaining - 1,
        total_used: currentRecord.total_used + 1,
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Credits deduct direct error:", updateError);
      return { success: false, creditsRemaining: currentRecord.credits_remaining };
    }

    return { success: true, creditsRemaining: currentRecord.credits_remaining - 1 };
  } catch (err) {
    console.error("Credit deduction direct error:", err);
    return { success: false, creditsRemaining: 0 };
  }
}

async function refundCreditsDirect(userId: string, amount: number = 1): Promise<void> {
  try {
    const { record } = await ensureCreditRecord(userId);
    if (!record) return;

    const maxCredits = getCreditsForTier(record.tier);
    const newCredits = Math.min(record.credits_remaining + amount, maxCredits);

    await supabaseAdmin
      .from("user_credits")
      .update({
        credits_remaining: newCredits,
        total_refunded: record.total_refunded + amount,
      })
      .eq("user_id", userId);
  } catch (err) {
    console.error("Credit refund direct error:", err);
  }
}

export async function POST(request: NextRequest) {
  const { messages, siteData, keyword, platforms, userName, userId } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
  }

  // ─── Server-side credit verification (fail-closed, direct DB) ─
  const creditStatus = await verifyCreditsDirect(userId);
  if (!creditStatus.allowed) {
    return NextResponse.json(
      {
        error: creditStatus.error || "No credits remaining. Credits reset every hour.",
        credits_remaining: creditStatus.creditsRemaining,
        tier: creditStatus.tier,
        max_credits: creditStatus.maxCredits,
      },
      { status: 429 }
    );
  }

  try {
    const systemPrompt = buildSystemPrompt(siteData, keyword, platforms, userName);

    // First API call
    let rawReply = await callLongCatAPI(systemPrompt, messages);

    // Check for [WEB_SEARCH:query] patterns
    const webSearchRegex = /\[WEB_SEARCH:([^\]]+)\]/g;
    const searchMatches = [...rawReply.matchAll(webSearchRegex)];

    if (searchMatches.length > 0) {
      // Execute all web searches in parallel for speed
      const searchPromises = searchMatches.map(async (match) => {
        const query = match[1].trim();
        const results = await executeWebSearch(query);
        return { query, results };
      });
      const searchResults = await Promise.all(searchPromises);

      // Remove [WEB_SEARCH:...] tags from the reply
      rawReply = rawReply.replace(webSearchRegex, "").trim();
      rawReply = rawReply.replace(/\n{3,}/g, "\n\n");

      // Check if we should deep-scrape the top search result for more content
      let scrapedContent = "";
      for (const sr of searchResults) {
        const urlMatch = sr.results.match(/URL:\s*(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          // Scrape the top result for deeper analysis
          scrapedContent = await executeOlostepScrape(urlMatch[1]);
          break; // Only scrape the top result
        }
      }

      // Make a second API call with the search results
      const searchResultsText = searchResults.map((sr) => `Search results for "${sr.query}":\n${sr.results}`).join("\n\n---\n\n");
      let augmentedContext = `Here are the web search results I requested:\n\n${searchResultsText}`;
      if (scrapedContent) {
        augmentedContext += `\n\n---\n\nDeep scraped content from top result:\n${scrapedContent}`;
      }
      augmentedContext += `\n\nNow provide a comprehensive answer based on this current data. Remember to follow the OUTPUT FORMATTING RULES — no markdown symbols, use ALL CAPS for emphasis, natural language only. If your response involves steps, processes, workflows, or strategies, include a Mermaid diagram in [DIAGRAM]...[/DIAGRAM] tags. Also include 2-3 [ACTION:type] suggestions at the end.`;

      const augmentedMessages = [
        ...messages,
        { role: "assistant" as const, content: rawReply },
        {
          role: "user" as const,
          content: augmentedContext,
        },
      ];

      rawReply = await callLongCatAPI(systemPrompt, augmentedMessages);
    }

    // Check for [SCRAPE:url] patterns
    const scrapeRegex = /\[SCRAPE:(https?:\/\/[^\]]+)\]/g;
    const scrapeMatches = [...rawReply.matchAll(scrapeRegex)];

    if (scrapeMatches.length > 0) {
      // Execute all scrapes in parallel
      const scrapePromises = scrapeMatches.map(async (match) => {
        const url = match[1].trim();
        const content = await executeOlostepScrape(url);
        return `Scraped content from ${url}:\n${content}`;
      });
      const scrapeResults = await Promise.all(scrapePromises);

      // Remove [SCRAPE:url] tags from the reply
      rawReply = rawReply.replace(scrapeRegex, "").trim();
      rawReply = rawReply.replace(/\n{3,}/g, "\n\n");

      // Make another API call with the scraped content
      const augmentedMessages = [
        ...messages,
        { role: "assistant" as const, content: rawReply },
        {
          role: "user" as const,
          content: `Here is the scraped content I requested:\n\n${scrapeResults.join("\n\n---\n\n")}\n\nNow provide a comprehensive answer based on this scraped data. Remember to follow the OUTPUT FORMATTING RULES — no markdown symbols, use ALL CAPS for emphasis, natural language only. If your response involves steps, processes, workflows, or strategies, include a Mermaid diagram in [DIAGRAM]...[/DIAGRAM] tags. Also include 2-3 [ACTION:type] suggestions at the end.`,
        },
      ];

      rawReply = await callLongCatAPI(systemPrompt, augmentedMessages);
    }

    // Check for [AGENT:analyze] or [AGENT:verify] patterns — multi-agent verification
    const agentRegex = /\[AGENT:(analyze|verify)\]/g;
    const agentMatches = [...rawReply.matchAll(agentRegex)];

    if (agentMatches.length > 0) {
      // Remove [AGENT:...] tags from the reply
      rawReply = rawReply.replace(agentRegex, "").trim();
      rawReply = rawReply.replace(/\n{3,}/g, "\n\n");

      // Call NVIDIA for a second opinion
      const agentMessages = [
        ...messages,
        { role: "assistant" as const, content: rawReply },
        {
          role: "user" as const,
          content: "Please provide your independent analysis and second opinion on this SEO topic. Focus on any insights, additional recommendations, or alternative strategies that may have been missed.",
        },
      ];

      const nvidiaReply = await callNvidiaAPI(systemPrompt, agentMessages);

      // Combine both responses
      if (nvidiaReply && !nvidiaReply.startsWith("Second opinion unavailable") && !nvidiaReply.startsWith("NVIDIA agent not configured")) {
        rawReply += `\n\n--- SECOND OPINION (NVIDIA Nemotron) ---\n\n${nvidiaReply}`;
      }
    }

    // Clean markdown from the final response (but preserve diagram blocks)
    rawReply = cleanMarkdown(rawReply);

    // Parse actions
    const { cleanReply, actions } = parseActions(rawReply);

    // ─── Deduct credits AFTER successful AI response ────────────
    // Credits were only CHECKED before, not deducted. Now we deduct.
    if (userId) {
      const deduction = await deductCreditsDirect(userId);
      if (!deduction.success) {
        console.warn("Credit deduction failed after successful AI call for user:", userId);
        // Still return the response — user got the value, we just failed to track it
      }
    }

    return NextResponse.json({
      reply: cleanReply,
      actions,
      credits_remaining: creditStatus.creditsRemaining - 1, // Optimistic update for client
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Chat API error:", message, err instanceof Error ? err.stack : "");

    // ─── No credits deducted on failure ───────────────────────
    // Credits were only CHECKED before the AI call, never deducted.
    // So on failure, no refund is needed.

    return NextResponse.json(
      { error: `Failed to generate response: ${message}` },
      { status: 500 }
    );
  }
}
