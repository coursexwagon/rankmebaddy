import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

const LONGCAT_API_KEY = process.env.LONGCAT_API_KEY || "";
const LONGCAT_BASE_URL = process.env.LONGCAT_BASE_URL || "https://api.longcat.chat/openai";
const LONGCAT_MODEL = process.env.LONGCAT_MODEL || "LongCat-Flash-Thinking-2601";

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
 */
function fixMermaidSyntax(diagram: string): string {
  const lines = diagram.split("\n");
  const nodeIds = new Set<string>();
  const subgraphLines: { index: number; oldId: string; newId: string }[] = [];

  // First pass: collect all node IDs (e.g., A[Label] or A["Label"] or A{Label})
  const nodeIdRegex = /^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s*[\[{]/;
  // Also catch arrow definitions: A --> B or A[Label] --> B[Label]
  const arrowNodeRegex = /([A-Za-z_][A-Za-z0-9_]*)\s*[\[{]/g;

  for (const line of lines) {
    // Skip subgraph lines for node ID collection
    if (/^\s*subgraph\s+/i.test(line)) continue;
    if (/^\s*end\s*$/i.test(line)) continue;

    let match;
    while ((match = arrowNodeRegex.exec(line)) !== null) {
      nodeIds.add(match[1]);
    }
  }

  // Second pass: find subgraph lines with conflicting IDs
  let sgCounter = 1;
  const subgraphRegex = /^(\s*subgraph\s+)([A-Za-z_][A-Za-z0-9_]*)\s*(\[.*\])/i;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(subgraphRegex);
    if (match) {
      const subgraphId = match[2];
      if (nodeIds.has(subgraphId)) {
        // This subgraph ID conflicts with a node ID — rename it
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
    // Also need to update any references to the old subgraph ID in subsequent lines
    // (though subgraph IDs are rarely referenced, this is for safety)
  }

  // Fix node labels with unquoted colons (e.g., A[Module 1: Site] -> A["Module 1: Site"])
  for (let i = 0; i < lines.length; i++) {
    // Match node definitions with brackets that contain colons but aren't quoted
    const nodeLabelRegex = /^(\s*[A-Za-z_][A-Za-z0-9_]*\s*\[)([^\]]*)(\]\s*)/;
    const match = lines[i].match(nodeLabelRegex);
    if (match) {
      const label = match[2];
      if (label.includes(":") && !label.startsWith('"')) {
        lines[i] = `${match[1]}"${label}"${match[3]}`;
      }
      // Also fix labels with parentheses
      if ((label.includes("(") || label.includes(")")) && !label.startsWith('"')) {
        lines[i] = `${match[1]}"${label.replace(/[()]/g, " ")}"${match[3]}`;
      }
    }
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

Example for a workflow with subgraphs:
[DIAGRAM]
flowchart TD
    A[Current State] --> B[Module 1: Site Intelligence]
    B --> C[Module 2: Entity Architecture]
    C --> D[Module 3: Content Engineering]
    D --> E[Module 4: Technical Blueprint]
    E --> F[Module 5: Behavioral Engineering]
    F --> G[Module 6: Authority Acquisition]
    G --> H[Module 7: SERP Feature Capture]
    H --> I[Target State]

    subgraph S1[Days 1-3: Intelligence]
        B1[Topical Landscape] --> B2[Query Intent]
        B2 --> B3[Competitor Profile]
    end

    subgraph S2[Days 4-5: Entity Build]
        C1[Brand Entity] --> C2[Author Entity]
        C2 --> C3[Content Schema]
    end
[/DIAGRAM]

Example for a strategy timeline:
[DIAGRAM]
flowchart LR
    M1[Month 1: Foundation] --> M2[Month 2: Content Engine]
    M2 --> M3[Month 3: Authority Building]
    M3 --> M4[Month 4: Scale]
[/DIAGRAM]

DIAGRAM RULES (CRITICAL — VIOLATION CAUSES SYNTAX ERRORS):
- ALWAYS include a diagram when explaining a process, workflow, or strategy
- Use flowchart TD (top-down) for workflows and processes
- Use flowchart LR (left-right) for timelines and sequences
- Use short, clear labels in nodes
- Keep diagrams focused — 5-15 nodes for clarity
- Every arrow should have a clear relationship
- You can include text explanation BEFORE the diagram, then the diagram visualizes it
- Do NOT use markdown inside [DIAGRAM] blocks — only valid Mermaid syntax

CRITICAL SYNTAX RULES (FAILURE TO FOLLOW = BROKEN DIAGRAM — THIS IS THE #1 BUG):
1. NEVER use the same ID for both a node and a subgraph. This is the most common error that breaks diagrams. If you have "A[Module 1] --> B[Module 2]", then a subgraph MUST NOT use A, B, C, D, E, F, G, H, or I as its ID. Instead, ALWAYS prefix subgraph IDs with "sg_" like: "subgraph sg1[Phase 1]", "subgraph sg2[Phase 2]", "subgraph sg_intel[Intelligence Phase]", etc.
2. Subgraph IDs must be COMPLETELY DIFFERENT from any node IDs. Use sg1, sg2, sg3, sg4 etc. as subgraph IDs.
3. Node labels with special characters like quotes, colons, or parentheses MUST use double quotes: A["Module 1: Site Intelligence"]
4. Do NOT nest subgraphs — keep them flat at the same level
5. Each subgraph must end with "end" on its own line
6. Do NOT use parentheses () in node labels — use brackets [] instead
7. Avoid special characters in labels: no &, %, @, #, etc.

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
    throw new Error(`AI service error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Try again?";
}

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

export async function POST(request: NextRequest) {
  try {
    const { messages, siteData, keyword, platforms, userName } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

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
        return `Search results for "${query}":\n${results}`;
      });
      const searchResults = await Promise.all(searchPromises);

      // Remove [WEB_SEARCH:...] tags from the reply
      rawReply = rawReply.replace(webSearchRegex, "").trim();
      rawReply = rawReply.replace(/\n{3,}/g, "\n\n");

      // Make a second API call with the search results
      const augmentedMessages = [
        ...messages,
        { role: "assistant" as const, content: rawReply },
        {
          role: "user" as const,
          content: `Here are the web search results I requested:\n\n${searchResults.join("\n\n---\n\n")}\n\nNow provide a comprehensive answer based on this current data. Remember to follow the OUTPUT FORMATTING RULES — no markdown symbols, use ALL CAPS for emphasis, natural language only. If your response involves steps, processes, workflows, or strategies, include a Mermaid diagram in [DIAGRAM]...[/DIAGRAM] tags. Also include 2-3 [ACTION:type] suggestions at the end.`,
        },
      ];

      rawReply = await callLongCatAPI(systemPrompt, augmentedMessages);
    }

    // Clean markdown from the final response (but preserve diagram blocks)
    rawReply = cleanMarkdown(rawReply);

    // Parse actions
    const { cleanReply, actions } = parseActions(rawReply);

    return NextResponse.json({ reply: cleanReply, actions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Chat API error:", message);
    return NextResponse.json(
      { error: `Failed to generate response: ${message}` },
      { status: 500 }
    );
  }
}
