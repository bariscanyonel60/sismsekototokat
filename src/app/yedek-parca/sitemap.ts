import type { MetadataRoute } from "next";

import { images } from "@/data/images";
import { site } from "@/data/site";
import { partHref } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";
import { PRODUCTS_PER_SITEMAP, productSitemapCount } from "@/lib/seo/sitemaps";

/** Ürün sitemap'leri: /yedek-parca/sitemap/0.xml, 1.xml… (her biri en fazla 10.000 ürün). */
export async function generateSitemaps() {
  const count = productSitemapCount((await getCatalog()).parts.length);
  return Array.from({ length: count }, (_, id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const { parts } = await getCatalog();
  return parts.slice(id * PRODUCTS_PER_SITEMAP, (id + 1) * PRODUCTS_PER_SITEMAP).map((part) => {
    const ownImages = [...new Set([part.imageKey, ...(part.gallery ?? [])].filter((key) => key !== undefined))];
    return {
      url: `${site.url}${partHref(part.slug)}`,
      ...(part.updatedAt ? { lastModified: new Date(part.updatedAt) } : {}),
      priority: 0.6,
      ...(ownImages.length ? { images: ownImages.map((key) => `${site.url}${images[key].src.src}`) } : {}),
    };
  });
}
