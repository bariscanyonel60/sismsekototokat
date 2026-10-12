import { brands, segmentLabels, type Brand } from "@/data/brands";
import { images, type ImageKey, type SiteImage } from "@/data/images";
import type { CartPart, Catalog, Manufacturer, Part, PartCategory, PartsMenuData } from "@/lib/catalog/types";

const TR_FOLD: Record<string, string> = { ı: "i", ş: "s", ğ: "g", ü: "u", ö: "o", ç: "c" };

export function partHref(slug: string): string {
  return `/yedek-parca/${slug}`;
}

/**
 * Ürün, marka ve kategori adresleri aynı düzeyi (`/yedek-parca/<slug>`) paylaşır. Bu yol parçaları
 * (eski yönlendirmeler, ürün markası sayfaları, ürün sitemap'i ve marka adları) ürün adresi olamaz;
 * kategori kimlikleri ayrıca `isReservedPartSlug` ile kontrol edilir.
 */
export const reservedPartSlugs = ["kategori", "marka", "urun-markasi", "sitemap", ...brands.map((brand) => slugify(brand.plain))];

export function isReservedPartSlug(catalog: Catalog, slug: string): boolean {
  return reservedPartSlugs.includes(slug) || catalog.categories.some((category) => category.id === slug);
}

export function partCategoryHref(id: string): string {
  return `/yedek-parca/${id}`;
}

export function brandSlug(brand: Brand): string {
  return slugify(brand.plain);
}

export function partBrandHref(brand: Brand): string {
  return `/yedek-parca/${brandSlug(brand)}`;
}

/** Marka + kategori açılış sayfası, örn. /yedek-parca/renault/fren-sistemi */
export function partBrandCategoryHref(brand: Brand, categoryId: string): string {
  return `${partBrandHref(brand)}/${categoryId}`;
}

/** Marka + model açılış sayfası, örn. /yedek-parca/renault/megane */
export function partModelHref(brand: Brand, modelSlug: string): string {
  return `${partBrandHref(brand)}/${modelSlug}`;
}

export function partModelCategoryHref(brand: Brand, modelSlug: string, categoryId: string): string {
  return `${partModelHref(brand, modelSlug)}/${categoryId}`;
}

/** Ürün (üretici) markası sayfası, örn. /yedek-parca/urun-markasi/bosch */
export function partManufacturerHref(name: string): string {
  return `/yedek-parca/urun-markasi/${slugify(name)}`;
}

export function findBrandBySlug(slug: string): Brand | undefined {
  return brands.find((brand) => brandSlug(brand) === slug);
}

/** Markaya özel ürünler önce, ardından araç grubu üzerinden uyan ürünler. */
export function partsForBrand(catalog: Catalog, brand: Brand): Part[] {
  const fitting = catalog.parts.filter((part) => partFitsBrand(part, brand));
  return [...fitting.filter((part) => part.brands?.length), ...fitting.filter((part) => !part.brands?.length)];
}

export function findPart(catalog: Catalog, slug: string): Part | undefined {
  return catalog.parts.find((part) => part.slug === slug);
}

export function findCategory(catalog: Catalog, id: string): PartCategory | undefined {
  return catalog.categories.find((category) => category.id === id);
}

/** Kategori sırası, "01" biçiminde. */
export function categoryIndex(catalog: Catalog, id: string): string {
  return String(catalog.categories.findIndex((category) => category.id === id) + 1).padStart(2, "0");
}

export function subcategoryTitle(catalog: Catalog, part: Part): string | undefined {
  if (!part.subcategory) return undefined;
  return findCategory(catalog, part.category)?.subcategories.find((sub) => sub.id === part.subcategory)?.title;
}

function partImageKey(catalog: Catalog, part: Part): ImageKey {
  return part.imageKey ?? findCategory(catalog, part.category)?.imageKey ?? "servicePeriodic";
}

export function partImage(catalog: Catalog, part: Part): SiteImage {
  return images[partImageKey(catalog, part)];
}

/** Ana görsel + ek görseller (tekrarsız). */
export function partGallery(catalog: Catalog, part: Part): SiteImage[] {
  const keys = [...new Set([partImageKey(catalog, part), ...(part.gallery ?? [])])];
  return keys.map((key) => images[key]);
}

/** Uyumluluk tablosundaki model / motor / yıl önerileri; yalnızca girilmiş gerçek kayıtlardan. */
export interface VehicleOptions {
  models: string[];
  engines: string[];
  years: string[];
}

export function vehicleOptions(catalog: Catalog, brandPlain: string, model = ""): VehicleOptions {
  const rows = catalog.parts.flatMap((part) => part.compatibility ?? []).filter((row) => row.brand === brandPlain);
  const sameModel = model ? rows.filter((row) => slugify(row.model ?? "") === slugify(model)) : rows;
  const unique = (values: (string | undefined)[]) =>
    [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b, "tr-TR"));
  return {
    models: unique(rows.map((row) => row.model)),
    engines: unique(sameModel.map((row) => row.engine)),
    years: unique(sameModel.map((row) => row.years)),
  };
}

/**
 * Model seçildiğinde: o marka için uyumluluk tablosu girilmiş ürünlerde model eşleşmesi aranır;
 * tablo girilmemiş ürünler marka/araç grubu uyumuna göre listede kalır.
 */
export function partFitsModel(part: Part, brandPlain: string, model: string): boolean {
  if (!model) return true;
  const rows = part.compatibility?.filter((row) => row.brand === brandPlain && row.model);
  if (!rows?.length) return true;
  const wanted = slugify(model);
  return rows.some((row) => {
    const known = slugify(row.model ?? "");
    return known.includes(wanted) || wanted.includes(known);
  });
}

export function toCartParts(catalog: Catalog): CartPart[] {
  return catalog.parts.map((part) => ({
    slug: part.slug,
    code: part.code,
    title: part.title,
    imageKey: partImageKey(catalog, part),
  }));
}

export function partCountByCategory(catalog: Catalog, id: string): number {
  return catalog.parts.filter((part) => part.category === id).length;
}

/** Uyum hesabında kullanılan alanlar; admin formundaki kaydedilmemiş ürün için de çalışır. */
export type PartFit = Pick<Part, "brands" | "segments" | "fitment">;

export function partFitsBrand(part: PartFit, brand: Brand): boolean {
  return part.brands?.length ? part.brands.includes(brand.plain) : part.segments.includes(brand.segment);
}

/** Parçanın uygun olduğu markalar: markaya özel üründe yalnızca o marka, değilse araç grubundaki tüm markalar. */
export function brandsForPart(part: PartFit): Brand[] {
  return brands.filter((brand) => partFitsBrand(part, brand));
}

/** Karttaki "uygun araçlar": model/motor uyumu, yoksa araç markaları (motor üreticileri hariç). */
export function fitmentItems(part: PartFit): string[] {
  if (part.fitment?.length) return part.fitment;
  const fitting = brandsForPart(part);
  const vehicleBrands = part.brands?.length ? fitting : fitting.filter((brand) => !brand.engineMaker);
  if (vehicleBrands.length) return vehicleBrands.map((brand) => brand.name);
  return part.segments.map((segment) => segmentLabels[segment]);
}

/** Meta açıklamalarındaki kısa "uygun araçlar" metni. */
export function fitmentLabel(part: Part): string {
  return fitmentItems(part).join(", ");
}

/** Ürünlere girilmiş ürün (üretici) markaları, ada göre sıralı. */
export function catalogManufacturers(catalog: Catalog): Manufacturer[] {
  const counts = new Map<string, Manufacturer>();
  for (const part of catalog.parts) {
    if (!part.manufacturer) continue;
    const slug = slugify(part.manufacturer);
    const entry = counts.get(slug);
    if (entry) entry.count += 1;
    else counts.set(slug, { name: part.manufacturer, slug, count: 1 });
  }
  return [...counts.values()].sort((a, b) => a.name.localeCompare(b.name, "tr-TR"));
}

export function findManufacturer(catalog: Catalog, slug: string): Manufacturer | undefined {
  return catalogManufacturers(catalog).find((item) => item.slug === slug);
}

export function toPartsMenu(catalog: Catalog): PartsMenuData {
  return {
    categories: catalog.categories.map((category) => ({
      id: category.id,
      title: category.title,
      icon: category.icon,
      count: partCountByCategory(catalog, category.id),
      subcategories: category.subcategories,
    })),
    manufacturers: catalogManufacturers(catalog),
  };
}

/**
 * Puanlı benzerlik: aynı alt kategori / kategori, ortak araç markası ve araç grubu, aynı ürün markası
 * ve ortak özellik değerleri. Eşitlikte katalog sırası korunur.
 */
export function relatedParts(catalog: Catalog, part: Part, limit = 4): Part[] {
  const specValues = new Set((part.specs ?? []).map((spec) => slugify(`${spec.label}-${spec.value}`)));
  const fitting = new Set(brandsForPart(part).map((brand) => brand.plain));
  const score = (item: Part) => {
    let total = 0;
    if (item.category === part.category) total += 6;
    if (part.subcategory && item.subcategory === part.subcategory) total += 3;
    if (part.brands?.length && item.brands?.some((brand) => part.brands?.includes(brand))) total += 4;
    else if (brandsForPart(item).some((brand) => fitting.has(brand.plain))) total += 1;
    if (item.segments.some((segment) => part.segments.includes(segment))) total += 1;
    if (part.manufacturer && item.manufacturer === part.manufacturer) total += 2;
    total += (item.specs ?? []).filter((spec) => specValues.has(slugify(`${spec.label}-${spec.value}`))).length;
    return total;
  };
  return catalog.parts
    .filter((item) => item.slug !== part.slug)
    .map((item, index) => ({ item, index, score: score(item) }))
    .filter((entry) => entry.score > 1)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.item);
}

/** Türkçe karakterleri sadeleştirip URL'ye uygun kimlik üretir. */
export function slugify(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/[ışğüöç]/g, (char) => TR_FOLD[char] ?? char)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " ve ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Kategorideki en büyük `SO-<KOD>-NN` numarasının bir fazlası. */
export function suggestPartCode(catalog: Catalog, category: PartCategory): string {
  const prefix = `SO-${category.code}-`;
  const max = catalog.parts.reduce((highest, part) => {
    if (!part.code.startsWith(prefix)) return highest;
    const number = Number.parseInt(part.code.slice(prefix.length), 10);
    return Number.isNaN(number) ? highest : Math.max(highest, number);
  }, 0);
  return `${prefix}${String(max + 1).padStart(2, "0")}`;
}
