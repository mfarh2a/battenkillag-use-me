import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllArticles } from "@/lib/articles";
import { states } from "@/lib/states";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/services", "/how-h2a-works", "/resources", "/why-battenkill", "/contact", "/partners", "/h-2a", "/privacy", "/terms"];
  const articles = await getAllArticles();
  return [
    ...pages.map((p) => ({
      url: `${site.url}${p}`,
      lastModified: site.lastReviewed,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : p === "/privacy" || p === "/terms" ? 0.3 : 0.8,
    })),
    ...states.map((st) => ({
      url: `${site.url}/h-2a/${st.slug}`,
      lastModified: site.lastReviewed,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${site.url}/resources/${a.slug}`,
      lastModified: a.updated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
