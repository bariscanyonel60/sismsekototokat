import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandCategoryLandingPage, ModelLandingPage } from "@/components/CatalogLandings";
import { brandSlug } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";
import { buildPageMetadata } from "@/lib/metadata";
import { allLandings, modelCategories, resolveBrandSub } from "@/lib/seo/catalog";
import { brandCategorySeo, modelSeo } from "@/lib/seo/copy";

interface BrandSubPageProps {
  params: Promise<{ slug: string; sub: string }>;
}

/** Marka + kategori ve marka + model sayfaları; ürünü olmayan kombinasyon 404 döner. */
export async function generateStaticParams() {
  const landings = allLandings(await getCatalog());
  return [
    ...landings.brandCategories.map((entry) => ({ slug: brandSlug(entry.brand), sub: entry.category.id })),
    ...landings.models.map((model) => ({ slug: brandSlug(model.brand), sub: model.slug })),
  ];
}

export async function generateMetadata({ params }: BrandSubPageProps): Promise<Metadata> {
  const { slug, sub } = await params;
  const route = resolveBrandSub(await getCatalog(), slug, sub);
  if (!route) return {};

  switch (route.kind) {
    case "brand-category":
      return buildPageMetadata(brandCategorySeo(route.landing));
    case "model":
      return buildPageMetadata(modelSeo(route.model));
    default: {
      const unreachable: never = route;
      return unreachable;
    }
  }
}

export default async function BrandSubPage({ params }: BrandSubPageProps) {
  const { slug, sub } = await params;
  const catalog = await getCatalog();
  const route = resolveBrandSub(catalog, slug, sub);
  if (!route) notFound();

  switch (route.kind) {
    case "brand-category":
      return <BrandCategoryLandingPage catalog={catalog} landing={route.landing} />;
    case "model":
      return <ModelLandingPage catalog={catalog} model={route.model} categories={modelCategories(catalog, route.model)} />;
    default: {
      const unreachable: never = route;
      return unreachable;
    }
  }
}
