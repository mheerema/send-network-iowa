import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sendnetworkiowa.com";
  const now = new Date();

  const articleEntries: MetadataRoute.Sitemap = getAllArticles().map(
    (article) => ({
      url: `${base}/articles/${article.slug}`,
      lastModified: new Date(`${article.date}T12:00:00Z`),
      changeFrequency: "yearly",
      priority: 0.6,
    })
  );

  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/plant`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/partner`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/events/one-day`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/iowa`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...articleEntries,
  ];
}
