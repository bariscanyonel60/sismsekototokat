import type { MetadataRoute } from "next";

import { routes } from "@/data/navigation";
import { site } from "@/data/site";
import { catalogManufacturers, partManufacturerHref } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";
import { getGallery } from "@/lib/content/store";
import { allLandings, latestUpdate } from "@/lib/seo/catalog";

type Entry = MetadataRoute.Sitemap[number];

function entry(path: string, lastModified: Date | undefined, priority: number): Entry {
  return { url: `${site.url}${path}`, ...(lastModified ? { lastModified } : {}), priority };
}

/**
 * Sayfalar ve katalog açılış sayfaları. Yalnızca indekslenen (canonical, 200) adresler girer;
 * ürünler `/yedek-parca/sitemap/<n>.xml` dosyalarındadır. `lastModified` yalnızca panel kaydından
 * gelen gerçek tarihle yazılır.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  const { photos } = await getGallery();
  const landings = allLandings(catalog);
  const indexable = <T extends { indexable: boolean; href: string; lastModified?: Date }>(items: T[], priority: number) =>
    items.filter((item) => item.indexable).map((item) => entry(item.href, item.lastModified, priority));

  return [
    entry(routes.home, undefined, 1),
    entry(routes.parts, latestUpdate(catalog.parts), 0.9),
    ...indexable(landings.categories, 0.8),
    ...indexable(landings.brands, 0.8),
    ...indexable(landings.brandCategories, 0.7),
    ...indexable(landings.models, 0.7),
    ...indexable(landings.modelCategories, 0.6),
    ...catalogManufacturers(catalog).map((item) =>
      entry(
        partManufacturerHref(item.name),
        latestUpdate(catalog.parts.filter((part) => part.manufacturer === item.name)),
        0.6,
      ),
    ),
    ...(photos.length > 0 ? [entry(routes.gallery, new Date(Math.max(...photos.map((photo) => Date.parse(photo.createdAt)))), 0.5)] : []),
    entry(routes.privacy, undefined, 0.2),
  ];
}
