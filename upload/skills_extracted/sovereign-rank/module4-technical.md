# Module 4 — Technical Blueprint Reference

## Full Technical Audit Checklist

Run this checklist on every site at launch and every 90 days.

---

## Core Web Vitals Optimization

### LCP (Largest Contentful Paint) — Target: < 2.5s
The LCP element is usually the hero image or the H1 text.

**If LCP is an image:**
- Preload it: `<link rel="preload" as="image" href="hero.webp">`
- Use WebP format — 25–35% smaller than JPEG with same quality
- Set explicit width and height attributes — prevents CLS during load
- Host on CDN — never load from origin for above-the-fold images
- Do NOT lazy load the LCP image — it defeats the purpose

**If LCP is text:**
- Ensure the font is preloaded: `<link rel="preload" as="font">`
- Use system fonts for above-the-fold text if speed is critical
- Avoid web fonts that block rendering

**Server optimization for LCP:**
- TTFB target < 600ms — if higher, the problem is server response, not frontend
- Enable HTTP/2 or HTTP/3 on server
- Use a CDN with edge nodes close to your primary audience
- Enable Gzip or Brotli compression

### INP (Interaction to Next Paint) — Target: < 200ms
Replaces FID (First Input Delay) as the interactivity metric.

- Defer non-critical JavaScript: `<script defer src="...">`
- Split large JavaScript bundles — load only what the current page needs
- Avoid long tasks (> 50ms) in the main thread
- Use Web Workers for heavy computations
- Minimize third-party scripts — every third-party script adds INP risk

### CLS (Cumulative Layout Shift) — Target: < 0.1
Layout shifts happen when elements move after initial render.

**Common CLS causes and fixes:**
- Images without dimensions: always set `width` and `height` attributes
- Ads without reserved space: always set a min-height container for ad slots
- Web fonts causing text reflow: use `font-display: swap` or `optional`
- Dynamic content injected above existing content: inject below or reserve space
- Iframes without dimensions: always set explicit dimensions

---

## Schema Markup Templates

### Organization Schema (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Brand Name]",
  "url": "[https://domain.com]",
  "logo": "[https://domain.com/logo.png]",
  "sameAs": [
    "[https://twitter.com/brand]",
    "[https://linkedin.com/company/brand]",
    "[https://youtube.com/brand]"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "[contact@domain.com]"
  }
}
```

### Article Schema (All Content Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Article Title]",
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "author": {
    "@type": "Person",
    "name": "[Author Name]",
    "url": "[https://domain.com/author/name]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "[Brand Name]",
    "logo": {
      "@type": "ImageObject",
      "url": "[https://domain.com/logo.png]"
    }
  },
  "image": "[https://domain.com/article-image.jpg]",
  "description": "[Meta description text]"
}
```

### FAQPage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question 1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 1]"
      }
    },
    {
      "@type": "Question",
      "name": "[Question 2]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer 2]"
      }
    }
  ]
}
```

### Person Schema (Author Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[Author Name]",
  "url": "[https://domain.com/author/name]",
  "image": "[https://domain.com/author-photo.jpg]",
  "jobTitle": "[Job Title]",
  "worksFor": {
    "@type": "Organization",
    "name": "[Brand Name]"
  },
  "sameAs": [
    "[https://linkedin.com/in/authorname]",
    "[https://twitter.com/authorname]"
  ],
  "description": "[Author bio — 2–3 sentences]"
}
```

---

## Crawl Architecture Rules

### URL structure
- Short: /category/page-name/ not /category/subcategory/sub-subcategory/page-name/
- Lowercase only
- Hyphens not underscores
- No parameters in indexable URLs (use canonicals to consolidate parameterized variants)

### Crawl budget management
For sites with 100+ pages:
- Submit XML sitemap to Google Search Console immediately
- Monitor "Crawl stats" in GSC — if Googlebot is spending crawl budget on non-valuable pages (tag pages, filtered URLs, search results pages), block them via robots.txt
- Use `noindex` on thin pages rather than blocking — noindex tells Google the page exists but isn't worth indexing; blocking prevents Google from even seeing it

### Internal link architecture
The "3-click rule": every page on the site reachable within 3 clicks from the homepage.
- Homepage → Category page → Individual page = 2 clicks (ideal)
- Orphan pages (0 internal links pointing to them) are invisible to Google's crawl

**PageRank flow via internal links:**
Authority flows from high-DR pages to pages they link to.
- Homepage has the most PageRank — link from homepage to your most important pages
- Category pages are the second tier — they distribute authority to individual content
- Build "pillar" pages (comprehensive topic hubs) and link all subtopic content to them
- This creates topical clusters that Google's NLP recognizes as topical authority

---

## Robots.txt Template
```
User-agent: *
Allow: /

Disallow: /wp-admin/
Disallow: /search/
Disallow: /?s=
Disallow: /tag/
Disallow: /cart/
Disallow: /checkout/
Disallow: /my-account/

Sitemap: https://domain.com/sitemap.xml
```

## .htaccess Performance Rules (Apache)
```apache
# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove trailing slash
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)/$ /$1 [L,R=301]
```
