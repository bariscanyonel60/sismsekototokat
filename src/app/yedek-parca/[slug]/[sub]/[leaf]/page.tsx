import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ModelCategoryLandingPage } from "@/components/CatalogLandings";
import { brandSlug } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";
import { buildPageMetadata } from "@/lib/metadata";
import { allLandings, resolveModelCategory } from "@/lib/seo/catalog";
import { modelCategorySeo } from "@/lib/seo/copy";

interface ModelCategoryPageProps {
  params: Promise<{ slug: string; sub: string; leaf: string }>;
}

/** Marka + model + kategori; yalnızca uyumluluk tablosunda kaydı olan kombinasyonlar. */
export async function generateStaticParams() {
  const params = allLandings(await getCatalog()).modelCategories.map((entry) => ({
    slug: brandSlug(entry.model.brand),
    sub: entry.model.slug,
    leaf: entry.category.id,
  }));
  return params;
}

export async function generateMetadata({ params }: ModelCategoryPageProps): Promise<Metadata> {
  const { slug, sub, leaf } = await params;
  const landing = resolveModelCategory(await getCatalog(), slug, sub, leaf);
  return landing ? buildPageMetadata(modelCategorySeo(landing)) : {};
}

export default async function ModelCategoryPage({ params }: ModelCategoryPageProps) {
  const { slug, sub, leaf } = await params;
  const catalog = await getCatalog();
  const landing = resolveModelCategory(catalog, slug, sub, leaf);
  if (!landing) notFound();
  return <ModelCategoryLandingPage catalog={catalog} landing={landing} />;
}
