import { NextRequest, NextResponse } from "next/server";

const LONGCAT_API_KEY = "ak_1Kc5610249yb6tQ4J98gE0sH6ca3Z";
const LONGCAT_BASE_URL = "https://api.longcat.chat/openai";
const LONGCAT_MODEL = "LongCat-Flash-Thinking-2601";

interface AgentAction {
  type: string;
  label: string;
  prompt: string;
}

function parseActions(text: string): { cleanReply: string; actions: AgentAction[] } {
  const actions: AgentAction[] = [];
  // Match [ACTION:type]label patterns, e.g. [ACTION:keyword-gap]Run keyword gap analysis
  const actionRegex = /\[ACTION:([a-zA-Z0-9_-]+)\](.+?)(?=\n|$)/g;
  let match;
  let cleanReply = text;

  while ((match = actionRegex.exec(text)) !== null) {
    const actionType = match[1];
    const actionLabel = match[2].trim();
    // Generate a prompt that makes sense for this action type
    const actionPrompts: Record<string, string> = {
      "keyword-gap": "Run a detailed keyword gap analysis for my site. Show me keywords my competitors rank for that I don't.",
      "optimize-titles": "Review all my page titles and suggest optimized versions with exact before/after comparisons.",
      "competitor-analysis": "Analyze my top SEO competitors. What are they ranking for that I'm not?",
      "content-plan": "Generate a complete 30-day content calendar targeting my primary keyword and related topics.",
      "technical-audit": "Run a technical SEO audit on my site. Check for crawl issues, speed problems, and structured data gaps.",
      "backlink-strategy": "Create a backlink acquisition strategy for my site with specific outreach targets and templates.",
      "serp-analysis": "Analyze the SERP for my target keyword. What types of content are ranking and why?",
      "meta-optimization": "Optimize all my meta descriptions and title tags for better CTR from search results.",
    };
    actions.push({
      type: actionType,
      label: actionLabel,
      prompt: actionPrompts[actionType] || actionLabel,
    });
  }

  // Remove [ACTION:...] lines from the reply
  cleanReply = cleanReply.replace(actionRegex, "").trim();
  // Clean up any double newlines left behind
  cleanReply = cleanReply.replace(/\n{3,}/g, "\n\n");

  return { cleanReply, actions };
}

export async function POST(request: NextRequest) {
  try {
    const { messages, siteData, keyword, platforms, userName } =
      await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Build agentic system prompt
    const systemPrompt = `You are RankMeBaddy's AI SEO Agent — an autonomous, strategic SEO assistant that works step-by-step to improve the user's search rankings. You think like a senior SEO consultant: analytical, specific, and action-oriented.

${
  siteData
    ? `The user's website:
- Domain: ${siteData.domain}
- Title: ${siteData.title || "Not detected"}
- Description: ${siteData.description || "Not detected"}
- H1: ${siteData.h1 || "Not detected"}
- Language: ${siteData.lang || "Not detected"}
- Has OG Image: ${siteData.ogImage ? "Yes" : "No"}
- Theme Color: ${siteData.themeColor || "Not detected"}`
    : "The user hasn't scanned their website yet."
}

${
  keyword
    ? `Primary keyword/campaign: "${keyword}"`
    : "No keyword set yet."
}

${
  platforms && platforms.length > 0
    ? `Target platforms: ${platforms.join(", ")}`
    : "Target platforms: Not set"
}

${userName ? `User's name: ${userName}` : ""}

## YOUR AGENTIC BEHAVIOR

You work as an autonomous agent. For every response:

1. **Think first** — Before diving into answers, briefly state what you're analyzing and why.
2. **Break tasks into steps** — Use numbered steps (1., 2., 3.) for any multi-part answer or action plan.
3. **Be specific** — Use the actual site data above. Don't give generic advice. Reference the real title, description, domain, etc.
4. **Show reasoning** — Explain WHY you're suggesting something, not just WHAT to do.
5. **Suggest next actions** — At the end of your response, always include 1-3 actionable next steps the user can approve by using [ACTION:type] tags.

## ACTION TAG FORMAT

At the end of your response, include suggested next actions using this exact format:
[ACTION:type]Label text for the button

Available action types:
- [ACTION:keyword-gap] — for keyword gap analysis
- [ACTION:optimize-titles] — for title tag optimization
- [ACTION:competitor-analysis] — for competitor research
- [ACTION:content-plan] — for content calendar generation
- [ACTION:technical-audit] — for technical SEO audit
- [ACTION:backlink-strategy] — for backlink strategy
- [ACTION:serp-analysis] — for SERP analysis
- [ACTION:meta-optimization] — for meta tag optimization

Example end of response:
"Here are your next steps:"
[ACTION:keyword-gap]Run keyword gap analysis
[ACTION:optimize-titles]Optimize title tags

## CAPABILITIES
- Keyword research and gap analysis
- Content optimization (titles, meta descriptions, headers)
- Ranking strategy across Google, YouTube, Amazon, TikTok, and AI Search
- Competitor analysis and benchmarking
- Technical SEO recommendations
- Content strategy and calendar planning
- Backlink strategy and outreach planning
- SERP feature analysis

## RULES
- Never say "As an AI" or "I'm here to help" — just help.
- Use the user's name naturally if you have it.
- Keep responses well-structured with headers, bullet points, and numbered steps.
- If you don't have enough info, ask follow-up questions AND suggest an action to get that info.
- When suggesting SEO changes, always explain the expected impact.
- Be concise but thorough — quality over fluff.`;

    // Call LongCat API (thinking model may take up to 60s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

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
          ...messages.map(
            (m: { role: string; content: string }) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })
          ),
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LongCat API error:", response.status, errorText);
      return NextResponse.json(
        { error: `AI service error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawReply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't process that. Try again?";

    // Parse [ACTION:type]label tags from the reply
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
