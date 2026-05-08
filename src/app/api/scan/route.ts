import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Normalize URL
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith("http")) {
    normalizedUrl = "https://" + normalizedUrl;
  }

  try {
    // Fetch the page HTML
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; RankMeBaddy/1.0; +https://rankmebaddy.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Extract metadata with regex (no cheerio dependency needed)
    const extract = (pattern: RegExp): string | null => {
      const match = html.match(pattern);
      return match ? match[1] || match[2] : null;
    };

    const title =
      extract(/<title[^>]*>([^<]+)<\/title>/i) ||
      extract(/og:title["\s]+content="([^"]+)"/i) ||
      extract(/og:title['\s]+content='([^']+)'/i);

    const description =
      extract(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
      extract(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i) ||
      extract(/og:description["\s]+content="([^"]+)"/i) ||
      extract(/og:description['\s]+content='([^']+)'/i);

    const ogImage =
      extract(/og:image["\s]+content="([^"]+)"/i) ||
      extract(/og:image['\s]+content='([^']+)'/i) ||
      extract(/twitter:image["\s]+content="([^"]+)"/i) ||
      null;

    const favicon =
      extract(/<link[^>]*rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["']/i) ||
      extract(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'][^"']*icon[^"']*["']/i) ||
      "/favicon.ico";

    const lang = extract(/<html[^>]*lang=["']([^"']+)["']/i);

    const h1 =
      extract(/<h1[^>]*>([^<]+)<\/h1>/i);

    const canonical =
      extract(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
      extract(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);

    const siteName =
      extract(/og:site_name["\s]+content="([^"]+)"/i) ||
      extract(/og:site_name['\s]+content='([^']+)'/i);

    const themeColor =
      extract(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i) ||
      extract(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']theme-color["']/i);

    // Resolve relative URLs
    const domain = new URL(normalizedUrl).hostname;
    const origin = new URL(normalizedUrl).origin;

    const resolveUrl = (u: string | null): string | null => {
      if (!u) return null;
      if (u.startsWith("http")) return u;
      if (u.startsWith("//")) return "https:" + u;
      if (u.startsWith("/")) return origin + u;
      return origin + "/" + u;
    };

    // Screenshot via thum.io
    const screenshotUrl = `https://image.thum.io/get/width/600/crop/400/${normalizedUrl}`;

    return NextResponse.json({
      url: normalizedUrl,
      domain,
      title: title?.trim() || null,
      description: description?.trim() || null,
      ogImage: resolveUrl(ogImage),
      favicon: resolveUrl(favicon),
      lang,
      h1: h1?.trim() || null,
      canonical: resolveUrl(canonical),
      siteName: siteName?.trim() || null,
      themeColor,
      screenshot: screenshotUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not scan: ${message}` },
      { status: 500 }
    );
  }
}
