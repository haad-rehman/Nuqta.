import type { MetadataRoute } from "next";

const SITE = "https://nuqtaa.studio";

// Allow all crawlers — including AI crawlers (GPTBot, PerplexityBot, Google-
// Extended, ClaudeBot). These are what feed AI overviews; do not block them.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
