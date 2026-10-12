import { site } from "@/data/site";

/** Google sınırı 50.000 URL; dosyalar küçük tutulur. */
export const PRODUCTS_PER_SITEMAP = 10_000;

export function productSitemapCount(partCount: number): number {
  return Math.max(1, Math.ceil(partCount / PRODUCTS_PER_SITEMAP));
}

/** robots.txt'de listelenen tüm sitemap adresleri. */
export function sitemapUrls(partCount: number): string[] {
  return [
    `${site.url}/sitemap.xml`,
    ...Array.from({ length: productSitemapCount(partCount) }, (_, id) => `${site.url}/yedek-parca/sitemap/${id}.xml`),
  ];
}
