import { brands, type Brand } from "@/data/brands";
import {
  findBrandBySlug,
  findCategory,
  findPart,
  partBrandCategoryHref,
  partBrandHref,
  partCategoryHref,
  partModelCategoryHref,
  partModelHref,
  partsForBrand,
  slugify,
} from "@/lib/catalog/helpers";
import type { Catalog, Part, PartCategory } from "@/lib/catalog/types";

/**
 * Programatik SEO sayfalarının veri katmanı. Her açılış sayfası yalnızca katalogdaki gerçek
 * ürünlerden türetilir; indekslenme kuralları da burada tek yerde tutulur:
 * - Marka: en az bir markaya özel ürün (`brands` veya uyumluluk satırı) varsa indekslenir.
 * - Kategori: en az bir ürün varsa indekslenir.
 * - Marka + kategori: hiç ürün yoksa 404; markaya özel ürün yoksa (yalnızca genel parça) noindex.
 * - Model ve model + kategori: yalnızca uyumluluk tablosundan doğar; ürün yoksa 404.
 */
export const MIN_EXCLUSIVE_PARTS = 1;

/** Ürün bu marka için doğrulanmış mı (markaya özel set ya da uyumluluk satırı)? */
export function isBrandExclusive(part: Part, brand: Brand): boolean {
  return Boolean(part.brands?.includes(brand.plain) || part.compatibility?.some((row) => row.brand === brand.plain));
}

/** Panel kaydından gelen en yeni gerçek tarih; hiç yoksa undefined (sahte lastmod basılmaz). */
export function latestUpdate(parts: Part[]): Date | undefined {
  const latest = parts.reduce<string | undefined>(
    (max, part) => (part.updatedAt && (!max || part.updatedAt > max) ? part.updatedAt : max),
    undefined,
  );
  return latest ? new Date(latest) : undefined;
}

export interface BrandCategoryLanding {
  brand: Brand;
  category: PartCategory;
  href: string;
  parts: Part[];
  exclusive: Part[];
  shared: Part[];
  indexable: boolean;
  lastModified?: Date;
}

export interface ModelLanding {
  brand: Brand;
  name: string;
  slug: string;
  href: string;
  parts: Part[];
  indexable: boolean;
  lastModified?: Date;
}

export interface ModelCategoryLanding {
  model: ModelLanding;
  category: PartCategory;
  href: string;
  parts: Part[];
  indexable: boolean;
  lastModified?: Date;
}

export interface BrandLanding {
  brand: Brand;
  href: string;
  parts: Part[];
  exclusive: Part[];
  shared: Part[];
  /** Markada en az bir ürünü olan kategoriler, katalog sırasıyla. */
  categories: BrandCategoryLanding[];
  models: ModelLanding[];
  indexable: boolean;
  lastModified?: Date;
}

export interface CategoryLanding {
  category: PartCategory;
  href: string;
  parts: Part[];
  /** Bu kategoride en az bir ürünü olan markalar. */
  brands: BrandCategoryLanding[];
  indexable: boolean;
  lastModified?: Date;
}

export function brandCategoryLanding(catalog: Catalog, brand: Brand, category: PartCategory): BrandCategoryLanding | null {
  const parts = partsForBrand(catalog, brand).filter((part) => part.category === category.id);
  if (parts.length === 0) return null;
  const exclusive = parts.filter((part) => isBrandExclusive(part, brand));
  return {
    brand,
    category,
    href: partBrandCategoryHref(brand, category.id),
    parts,
    exclusive,
    shared: parts.filter((part) => !isBrandExclusive(part, brand)),
    indexable: exclusive.length >= MIN_EXCLUSIVE_PARTS,
    lastModified: latestUpdate(parts),
  };
}

/** Uyumluluk tablosundaki modeller; slug'ı bir kategoriyle çakışan model sayfası üretilmez. */
export function brandModels(catalog: Catalog, brand: Brand): ModelLanding[] {
  const models = new Map<string, { name: string; parts: Part[] }>();
  for (const part of catalog.parts) {
    for (const row of part.compatibility ?? []) {
      if (row.brand !== brand.plain || !row.model) continue;
      const slug = slugify(row.model);
      if (!slug || catalog.categories.some((category) => category.id === slug)) continue;
      const entry = models.get(slug) ?? { name: row.model, parts: [] };
      if (!entry.parts.includes(part)) entry.parts.push(part);
      models.set(slug, entry);
    }
  }
  return [...models.entries()]
    .map(([slug, { name, parts }]) => ({
      brand,
      name,
      slug,
      href: partModelHref(brand, slug),
      parts,
      indexable: parts.length >= MIN_EXCLUSIVE_PARTS,
      lastModified: latestUpdate(parts),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "tr-TR"));
}

export function findBrandModel(catalog: Catalog, brand: Brand, slug: string): ModelLanding | undefined {
  return brandModels(catalog, brand).find((model) => model.slug === slug);
}

export function modelCategoryLanding(model: ModelLanding, category: PartCategory): ModelCategoryLanding | null {
  const parts = model.parts.filter((part) => part.category === category.id);
  if (parts.length === 0) return null;
  return {
    model,
    category,
    href: partModelCategoryHref(model.brand, model.slug, category.id),
    parts,
    indexable: parts.length >= MIN_EXCLUSIVE_PARTS,
    lastModified: latestUpdate(parts),
  };
}

export function modelCategories(catalog: Catalog, model: ModelLanding): ModelCategoryLanding[] {
  return catalog.categories
    .map((category) => modelCategoryLanding(model, category))
    .filter((entry): entry is ModelCategoryLanding => entry !== null);
}

export function brandLanding(catalog: Catalog, brand: Brand): BrandLanding {
  const parts = partsForBrand(catalog, brand);
  const exclusive = parts.filter((part) => isBrandExclusive(part, brand));
  return {
    brand,
    href: partBrandHref(brand),
    parts,
    exclusive,
    shared: parts.filter((part) => !isBrandExclusive(part, brand)),
    categories: catalog.categories
      .map((category) => brandCategoryLanding(catalog, brand, category))
      .filter((entry): entry is BrandCategoryLanding => entry !== null),
    models: brandModels(catalog, brand),
    indexable: exclusive.length >= MIN_EXCLUSIVE_PARTS,
    lastModified: latestUpdate(parts),
  };
}

export function categoryLanding(catalog: Catalog, category: PartCategory): CategoryLanding {
  const parts = catalog.parts.filter((part) => part.category === category.id);
  return {
    category,
    href: partCategoryHref(category.id),
    parts,
    brands: brands
      .map((brand) => brandCategoryLanding(catalog, brand, category))
      .filter((entry): entry is BrandCategoryLanding => entry !== null),
    indexable: parts.length > 0,
    lastModified: latestUpdate(parts),
  };
}

export type CatalogSlugRoute =
  | { kind: "brand"; brand: Brand }
  | { kind: "category"; category: PartCategory }
  | { kind: "part"; part: Part; category: PartCategory };

/** `/yedek-parca/<slug>`: önce marka, sonra kategori, sonra ürün. Hiçbiri değilse null (404). */
export function resolveCatalogSlug(catalog: Catalog, slug: string): CatalogSlugRoute | null {
  const brand = findBrandBySlug(slug);
  if (brand) return { kind: "brand", brand };
  const category = findCategory(catalog, slug);
  if (category) return { kind: "category", category };
  const part = findPart(catalog, slug);
  const partCategory = part && findCategory(catalog, part.category);
  if (part && partCategory) return { kind: "part", part, category: partCategory };
  return null;
}

export type BrandSubRoute =
  | { kind: "brand-category"; landing: BrandCategoryLanding }
  | { kind: "model"; model: ModelLanding };

/** `/yedek-parca/<marka>/<alt>`: önce kategori, sonra model. Ürünü olmayan kombinasyon null (404). */
export function resolveBrandSub(catalog: Catalog, brandSlugValue: string, sub: string): BrandSubRoute | null {
  const brand = findBrandBySlug(brandSlugValue);
  if (!brand) return null;
  const category = findCategory(catalog, sub);
  if (category) {
    const landing = brandCategoryLanding(catalog, brand, category);
    return landing ? { kind: "brand-category", landing } : null;
  }
  const model = findBrandModel(catalog, brand, sub);
  return model ? { kind: "model", model } : null;
}

export function resolveModelCategory(
  catalog: Catalog,
  brandSlugValue: string,
  modelSlug: string,
  categoryId: string,
): ModelCategoryLanding | null {
  const brand = findBrandBySlug(brandSlugValue);
  const category = findCategory(catalog, categoryId);
  const model = brand && findBrandModel(catalog, brand, modelSlug);
  return model && category ? modelCategoryLanding(model, category) : null;
}

/** Sitemap ve statik üretim için tüm açılış sayfaları. */
export function allLandings(catalog: Catalog) {
  const brandPages = brands.map((brand) => brandLanding(catalog, brand));
  const models = brandPages.flatMap((page) => page.models);
  return {
    brands: brandPages,
    categories: catalog.categories.map((category) => categoryLanding(catalog, category)),
    brandCategories: brandPages.flatMap((page) => page.categories),
    models,
    modelCategories: models.flatMap((model) => modelCategories(catalog, model)),
  };
}
