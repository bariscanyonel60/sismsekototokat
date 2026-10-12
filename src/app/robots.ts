import type { MetadataRoute } from "next";

import { routes } from "@/data/navigation";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [routes.thanks] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
