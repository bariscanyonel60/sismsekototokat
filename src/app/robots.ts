import type { MetadataRoute } from "next";

import { routes } from "@/data/navigation";
import { site } from "@/data/site";
import { getCatalog } from "@/lib/catalog/store";
import { sitemapUrls } from "@/lib/seo/sitemaps";

/**
 * Katalog filtre/arama adresleri (`/yedek-parca?brand=…&q=…`) taranmaz; temiz SEO adresleri
 * (`/yedek-parca/renault/fren-sistemi`) etkilenmez. Filtreli sayfanın canonical'ı zaten `/yedek-parca`.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const { parts } = await getCatalog();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [routes.thanks, "/admin", `${routes.parts}?`] }],
    sitemap: sitemapUrls(parts.length),
    host: site.url,
  };
}
