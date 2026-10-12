import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandLandingPage, CategoryLandingPage } from "@/components/CatalogLandings";
import { PartDetail } from "@/components/PartDetail";
import { brands } from "@/data/brands";
import { brandSlug } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";
import { buildPageMetadata } from "@/lib/metadata";
import { brandLanding, categoryLanding, resolveCatalogSlug } from "@/lib/seo/catalog";
import { brandSeo, categorySeo, partSeo } from "@/lib/seo/copy";

interface CatalogSlugPageProps {
  params: Promise<{ slug: string }>;
}

/** Marka, kategori ve ürün adresleri aynı düzeyde; panelden sonradan eklenen ürünler ilk istekte üretilir. */
export async function generateStaticParams() {
  const { categories, parts } = await getCatalog();
  return [
    ...brands.map((brand) => ({ slug: brandSlug(brand) })),
    ...categories.map((category) => ({ slug: category.id })),
    ...parts.map((part) => ({ slug: part.slug })),
  ];
}

export async function generateMetadata({ params }: CatalogSlugPageProps): Promise<Metadata> {
  const catalog = await getCatalog();
  const route = resolveCatalogSlug(catalog, (await params).slug);
  if (!route) return {};

  switch (route.kind) {
    case "brand":
      return buildPageMetadata(brandSeo(brandLanding(catalog, route.brand)), { ownOgImage: true });
    case "category":
      return buildPageMetadata(categorySeo(categoryLanding(catalog, route.category)), { ownOgImage: true });
    case "part":
      return buildPageMetadata(partSeo(route.part), { ownOgImage: true });
    default: {
      const unreachable: never = route;
      return unreachable;
    }
  }
}

export default async function CatalogSlugPage({ params }: CatalogSlugPageProps) {
  const catalog = await getCatalog();
  const route = resolveCatalogSlug(catalog, (await params).slug);
  if (!route) notFound();

  switch (route.kind) {
    case "brand":
      return <BrandLandingPage catalog={catalog} landing={brandLanding(catalog, route.brand)} />;
    case "category":
      return <CategoryLandingPage catalog={catalog} landing={categoryLanding(catalog, route.category)} />;
    case "part":
      return <PartDetail catalog={catalog} part={route.part} category={route.category} />;
    default: {
      const unreachable: never = route;
      return unreachable;
    }
  }
}
