import { brands, segmentLabels, type Brand, type VehicleSegment } from "@/data/brands";
import { brandSlug, partFitsBrand, partFitsModel, slugify } from "@/lib/catalog/helpers";
import { partQualities, type Catalog, type Part, type PartQuality } from "@/lib/catalog/types";

export const segments = Object.keys(segmentLabels) as VehicleSegment[];

export interface Filters {
  query: string;
  category: string | null;
  subcategory: string | null;
  segment: VehicleSegment | null;
  brand: Brand | null;
  model: string;
  engine: string;
  year: string;
  quality: PartQuality | null;
  manufacturer: string | null;
}

export const EMPTY_FILTERS: Filters = {
  query: "",
  category: null,
  subcategory: null,
  segment: null,
  brand: null,
  model: "",
  engine: "",
  year: "",
  quality: null,
  manufacturer: null,
};

export type SortKey = "recommended" | "az" | "za" | "newest" | "code";

export const sortLabels: Record<SortKey, string> = {
  recommended: "Önerilen",
  az: "Ürün adı (A–Z)",
  za: "Ürün adı (Z–A)",
  newest: "En yeni",
  code: "Ürün kodu",
};

export const sortKeys = Object.keys(sortLabels) as SortKey[];

export interface CatalogState {
  filters: Filters;
  sort: SortKey;
  page: number;
}

const TR_FOLD: Record<string, string> = { ı: "i", ş: "s", ğ: "g", ü: "u", ö: "o", ç: "c" };

export function normalize(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/[ışğüöç]/g, (char) => TR_FOLD[char] ?? char)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** Tire, nokta, boşluk ve eğik çizgi olmadan da eşleşsin diye kodların sade hali. */
function compact(value: string): string {
  return value.replace(/[\s./-]/g, "");
}

export interface CatalogView {
  catalog: Catalog;
  categoryTitles: Map<string, string>;
  subcategoryTitles: Map<string, string>;
  searchIndex: Map<string, string>;
  manufacturers: string[];
  order: Map<string, number>;
}

export function buildView(catalog: Catalog): CatalogView {
  const categoryTitles = new Map(catalog.categories.map((category) => [category.id, category.title]));
  const subcategoryTitles = new Map(
    catalog.categories.flatMap((category) =>
      category.subcategories.map((sub) => [`${category.id}/${sub.id}`, sub.title] as const),
    ),
  );
  const searchIndex = new Map(
    catalog.parts.map((part) => [
      part.slug,
      normalize(
        [
          part.code,
          compact(part.code),
          ...(part.oemCodes ?? []),
          ...(part.oemCodes ?? []).map(compact),
          part.title,
          part.description,
          categoryTitles.get(part.category) ?? "",
          subcategoryTitles.get(`${part.category}/${part.subcategory}`) ?? "",
          ...(part.fitment ?? []),
          ...(part.brands ?? []),
          ...(part.compatibility ?? []).flatMap((row) => [row.brand, row.model ?? "", row.engine ?? "", row.years ?? ""]),
          part.manufacturer ?? "",
          ...(part.specs ?? []).map((spec) => spec.value),
          ...part.keywords,
        ].join(" "),
      ),
    ]),
  );
  const manufacturers = [...new Set(catalog.parts.flatMap((part) => (part.manufacturer ? [part.manufacturer] : [])))].sort(
    (a, b) => a.localeCompare(b, "tr-TR"),
  );
  const order = new Map(catalog.parts.map((part, index) => [part.slug, index]));
  return { catalog, categoryTitles, subcategoryTitles, searchIndex, manufacturers, order };
}

export function queryTerms(query: string): string[] {
  return normalize(query).split(/\s+/).filter(Boolean);
}

export function matchesQuery(view: CatalogView, part: Part, terms: string[]): boolean {
  if (terms.length === 0) return true;
  const haystack = view.searchIndex.get(part.slug) ?? "";
  return terms.every((term) => haystack.includes(term) || haystack.includes(compact(term)));
}

export function matches(view: CatalogView, part: Part, filters: Filters): boolean {
  if (filters.category && part.category !== filters.category) return false;
  if (filters.subcategory && part.subcategory !== filters.subcategory) return false;
  if (filters.brand && !partFitsBrand(part, filters.brand)) return false;
  if (filters.brand && !partFitsModel(part, filters.brand.plain, filters.model)) return false;
  if (filters.segment && !part.segments.includes(filters.segment)) return false;
  if (filters.quality && !part.qualities.includes(filters.quality)) return false;
  if (filters.manufacturer && part.manufacturer !== filters.manufacturer) return false;
  return matchesQuery(view, part, queryTerms(filters.query));
}

export function countWith(view: CatalogView, filters: Filters, patch: Partial<Filters>): number {
  const next = { ...filters, ...patch };
  return view.catalog.parts.reduce((total, part) => (matches(view, part, next) ? total + 1 : total), 0);
}

export function sortParts(view: CatalogView, list: Part[], sort: SortKey): Part[] {
  switch (sort) {
    case "recommended":
      return list;
    case "az":
      return [...list].sort((a, b) => a.title.localeCompare(b.title, "tr-TR"));
    case "za":
      return [...list].sort((a, b) => b.title.localeCompare(a.title, "tr-TR"));
    case "newest":
      return [...list].sort(
        (a, b) =>
          (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") ||
          (view.order.get(b.slug) ?? 0) - (view.order.get(a.slug) ?? 0),
      );
    case "code":
      return [...list].sort((a, b) => a.code.localeCompare(b.code, "tr-TR"));
    default: {
      const exhaustive: never = sort;
      return exhaustive;
    }
  }
}

/** Seçili markaya özel ürünler önce gelir. */
export function filterParts(view: CatalogView, filters: Filters, sort: SortKey): Part[] {
  const filtered = view.catalog.parts.filter((part) => matches(view, part, filters));
  const ordered = filters.brand
    ? [...filtered.filter((part) => part.brands?.length), ...filtered.filter((part) => !part.brands?.length)]
    : filtered;
  return sortParts(view, ordered, sort);
}

/* ---------- URL ↔ durum ---------- */

const PARAM = {
  query: "q",
  category: "category",
  subcategory: "sub",
  segment: "segment",
  brand: "brand",
  model: "model",
  engine: "engine",
  year: "year",
  quality: "quality",
  manufacturer: "maker",
  sort: "sort",
  page: "page",
} as const;

function short(value: string | null, max = 80): string {
  return (value ?? "").trim().slice(0, max);
}

export function parseState(view: CatalogView, search: string): CatalogState {
  const params = new URLSearchParams(search);
  const categoryId = params.get(PARAM.category);
  const category = view.catalog.categories.find((item) => item.id === categoryId) ?? null;
  const subId = params.get(PARAM.subcategory);
  const subcategory = category?.subcategories.find((sub) => sub.id === subId)?.id ?? null;
  const brand = brands.find((item) => brandSlug(item) === params.get(PARAM.brand)) ?? null;
  const segmentParam = params.get(PARAM.segment);
  const segment = brand?.segment ?? segments.find((item) => item === segmentParam) ?? null;
  const qualityParam = params.get(PARAM.quality);
  const makerParam = params.get(PARAM.manufacturer);
  const sortParam = params.get(PARAM.sort);
  const page = Number.parseInt(params.get(PARAM.page) ?? "1", 10);
  return {
    filters: {
      query: (params.get(PARAM.query) ?? "").trimStart().slice(0, 100),
      category: category?.id ?? null,
      subcategory,
      segment,
      brand,
      model: brand ? short(params.get(PARAM.model), 60) : "",
      engine: brand ? short(params.get(PARAM.engine), 60) : "",
      year: brand ? short(params.get(PARAM.year), 20) : "",
      quality: partQualities.find((item) => item === qualityParam) ?? null,
      manufacturer: view.manufacturers.find((name) => slugify(name) === makerParam) ?? null,
    },
    sort: sortKeys.find((key) => key === sortParam) ?? "recommended",
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

export function serializeState({ filters, sort, page }: CatalogState): string {
  const params = new URLSearchParams();
  const set = (key: string, value: string | null | undefined) => {
    if (value) params.set(key, value);
  };
  set(PARAM.query, filters.query.trim() ? filters.query.trimStart() : null);
  set(PARAM.category, filters.category);
  set(PARAM.subcategory, filters.category ? filters.subcategory : null);
  set(PARAM.brand, filters.brand ? brandSlug(filters.brand) : null);
  set(PARAM.segment, filters.brand ? null : filters.segment);
  set(PARAM.model, filters.brand ? filters.model.trim() : null);
  set(PARAM.engine, filters.brand ? filters.engine.trim() : null);
  set(PARAM.year, filters.brand ? filters.year.trim() : null);
  set(PARAM.quality, filters.quality);
  set(PARAM.manufacturer, filters.manufacturer ? slugify(filters.manufacturer) : null);
  set(PARAM.sort, sort === "recommended" ? null : sort);
  set(PARAM.page, page > 1 ? String(page) : null);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function vehicleLabel(filters: Filters): string {
  return [filters.brand?.name, filters.model, filters.engine, filters.year].filter(Boolean).join(" ");
}
