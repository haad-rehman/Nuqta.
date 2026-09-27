import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const SITE = "https://nuqtaa.studio";

// Static build → use a fixed lastModified (Date.now() would change every build
// and isn't meaningful for content that doesn't change per-deploy). Bump this
// by hand whenever page content actually changes, so crawlers see a fresh date
// and prioritise a re-crawl. Last content change: Works case studies.
const LAST_MODIFIED = new Date("2026-09-27");

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
    {
      url: `${SITE}/work`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: `${SITE}/work/${project.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
