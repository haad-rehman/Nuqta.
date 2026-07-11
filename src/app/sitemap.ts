import type { MetadataRoute } from "next";

const SITE = "https://nuqtaa.studio";

// Static build → use a fixed lastModified (Date.now() would change every build
// and isn't meaningful for content that doesn't change per-deploy).
const LAST_MODIFIED = new Date("2026-07-11");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE}/about`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
