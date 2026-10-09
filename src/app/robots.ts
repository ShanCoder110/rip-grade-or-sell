import type { MetadataRoute } from "next";
import { publicEnv } from "@/env.public";

export default function robots(): MetadataRoute.Robots {
  const base = publicEnv.NEXT_PUBLIC_APP_URL;
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
