import { NextRequest, NextResponse } from "next/server";

const LONGCAT_API_KEY = "ak_1Kc5610249yb6tQ4J98gE0sH6ca3Z";
const LONGCAT_BASE_URL = "https://api.longcat.chat/openai";
const LONGCAT_MODEL = "LongCat-Flash-Thinking-2601";

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

    // Build system prompt with SEO context
    const systemPrompt = `You are RankMeBaddy's AI SEO assistant. You're conversational, direct, and genuinely helpful — like a senior SEO consultant who actually knows their stuff. No corporate jargon, no fluff.

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

Your capabilities:
- Keyword research and gap analysis
- Content optimization suggestions (titles, meta descriptions, headers)
- Ranking strategy across Google, YouTube, Amazon, TikTok, and AI Search
- Competitor analysis
- Technical SEO recommendations
- Content strategy and calendar planning

Rules:
- Be specific, not generic. Use the site data above when relevant.
- When suggesting keywords, give actual keyword ideas with estimated search intent.
- When suggesting content, give actual title and outline ideas.
- Keep responses concise but thorough. Use bullet points and clear structure.
- If you don't have enough info, ask follow-up questions.
- Never say "As an AI" or "I'm here to help" — just help.
- Use the user's name naturally if you have it.`;

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
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't process that. Try again?";

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Chat API error:", message);
    return NextResponse.json(
      { error: `Failed to generate response: ${message}` },
      { status: 500 }
    );
  }
}
