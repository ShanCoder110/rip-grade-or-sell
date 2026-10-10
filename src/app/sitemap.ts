import type { MetadataRoute } from "next";
import { publicEnv } from "@/env.public";
import { getAllSetSlugs } from "@/lib/data/sets";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.NEXT_PUBLIC_APP_URL;
  const slugs = await getAllSetSlugs();
  const setUrls = slugs.map((slug) => ({
    url: `${base}/sets/${slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sets`, changeFrequency: "daily", priority: 0.9 },
    ...setUrls,
    { url: `${base}/tools/grade-or-sell`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/fee-calculator`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tools/pack-simulator`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/methodology`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
