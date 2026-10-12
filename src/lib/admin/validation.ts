import { brands, segmentLabels, type VehicleSegment } from "@/data/brands";
import { imageKeys, type ImageKey } from "@/data/images";
import { services } from "@/data/services";
import { isReservedPartSlug, reservedPartSlugs, slugify } from "@/lib/catalog/helpers";
import {
  categoryIconKeys,
  partQualities,
  type Catalog,
  type CategoryIconKey,
  type Part,
  type PartCategory,
  type PartCompatibility,
  type PartQuality,
  type PartSpec,
} from "@/lib/catalog/types";

export type FieldErrors = Record<string, string>;

export type Validated<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CODE_PATTERN = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
const OEM_PATTERN = /^[A-Z0-9][A-Z0-9 ./-]{1,38}[A-Z0-9]$/;
const segments = Object.keys(segmentLabels) as VehicleSegment[];
const brandNames = new Set(brands.map((brand) => brand.plain));

function text(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function list(form: FormData, name: string): string[] {
  return form.getAll(name).filter((value): value is string => typeof value === "string");
}

/** Virgül veya satır sonuyla ayrılmış listeyi temizler. */
export function splitList(value: string, max: number): string[] {
  return [...new Set(value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean))].slice(0, max);
}

/** Her satırı "Özellik: Değer" olan metni ayrıştırır; hata varsa mesajı döner. */
export function parseSpecs(value: string): PartSpec[] | string {
  const lines = value.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length > 30) return "En fazla 30 özellik girilebilir.";
  const specs: PartSpec[] = [];
  for (const line of lines) {
    const separator = line.indexOf(":");
    const label = line.slice(0, separator).trim();
    const specValue = line.slice(separator + 1).trim();
    if (separator < 1 || !label || !specValue) return `"${line}" satırı "Özellik: Değer" biçiminde olmalı.`;
    if (label.length > 40) return `"${label}" özellik adı en fazla 40 karakter olabilir.`;
    if (specValue.length > 160) return `"${label}" değeri en fazla 160 karakter olabilir.`;
    specs.push({ label, value: specValue });
  }
  return specs;
}

/** Her satırı "Marka | Model | Motor | Yıl" olan metni ayrıştırır; marka zorunlu, diğerleri isteğe bağlı. */
function parseCompatibility(value: string): PartCompatibility[] | string {
  const lines = value.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length > 60) return "En fazla 60 uyumluluk satırı girilebilir.";
  const rows: PartCompatibility[] = [];
  for (const line of lines) {
    const [brandInput = "", model = "", engine = "", years = ""] = line.split("|").map((cell) => cell.trim());
    const brand = brands.find((item) => slugify(item.plain) === slugify(brandInput) || slugify(item.name) === slugify(brandInput));
    if (!brand) return `"${line}" satırındaki marka listede yok (${brands.map((item) => item.plain).join(", ")}).`;
    if ([model, engine, years].some((cell) => cell.length > 60)) return `"${line}" satırındaki alanlar en fazla 60 karakter olabilir.`;
    rows.push({
      brand: brand.plain,
      ...(model ? { model } : {}),
      ...(engine ? { engine } : {}),
      ...(years ? { years } : {}),
    });
  }
  return rows;
}

function checkLength(errors: FieldErrors, field: string, value: string, min: number, max: number, label: string) {
  if (value.length < min) errors[field] = min === 1 ? `${label} zorunlu.` : `${label} en az ${min} karakter olmalı.`;
  else if (value.length > max) errors[field] = `${label} en fazla ${max} karakter olabilir.`;
}

function isOneOf<T extends string>(values: readonly T[], value: string): value is T {
  return (values as readonly string[]).includes(value);
}

export function validatePart(form: FormData, catalog: Catalog, original?: Part): Validated<Part> {
  const errors: FieldErrors = {};

  const title = text(form, "title");
  checkLength(errors, "title", title, 3, 120, "Ürün adı");

  const slug = original?.slug ?? (text(form, "slug") || slugify(title));
  if (!original) {
    if (!SLUG_PATTERN.test(slug)) errors.slug = "Adres yalnızca küçük harf, rakam ve tire içerebilir.";
    else if (isReservedPartSlug(catalog, slug))
      errors.slug = "Bu adres bir kategori veya marka sayfasına ayrılmış; başka bir adres yazın.";
    else if (catalog.parts.some((part) => part.slug === slug)) errors.slug = "Bu adresle bir ürün zaten var.";
  }

  const code = text(form, "code").toUpperCase();
  if (!CODE_PATTERN.test(code) || code.length > 30) errors.code = "Ürün kodu harf, rakam ve tireden oluşmalı (örn. SO-FRN-07).";
  else if (catalog.parts.some((part) => part.code === code && part.slug !== original?.slug))
    errors.code = "Bu ürün kodu başka bir üründe kullanılıyor.";

  const oemCodes = splitList(text(form, "oemCodes").toUpperCase(), 20).map((item) => item.replace(/\s+/g, " "));
  if (oemCodes.some((item) => !OEM_PATTERN.test(item)))
    errors.oemCodes = "OEM numaraları 3–40 karakter; harf, rakam, boşluk, nokta, tire veya eğik çizgi içerebilir.";

  const categoryId = text(form, "category");
  const category = catalog.categories.find((item) => item.id === categoryId);
  if (!category) errors.category = "Kategori seçin.";

  const subcategory = text(form, "subcategory");
  if (subcategory && !category?.subcategories.some((sub) => sub.id === subcategory))
    errors.subcategory = "Alt kategori seçilen kategoriye ait değil.";

  const description = text(form, "description");
  checkLength(errors, "description", description, 10, 600, "Açıklama");

  const partSegments = list(form, "segments").filter((value): value is VehicleSegment => isOneOf(segments, value));
  if (partSegments.length === 0) errors.segments = "En az bir araç grubu seçin.";

  const partBrands = list(form, "brands").filter((value) => brandNames.has(value));
  const qualities = list(form, "qualities").filter((value): value is PartQuality => isOneOf(partQualities, value));
  const fitment = splitList(text(form, "fitment"), 20);
  if (fitment.some((item) => item.length > 80)) errors.fitment = "Her uyum satırı en fazla 80 karakter olabilir.";
  const keywords = splitList(text(form, "keywords"), 30);

  const manufacturerInput = text(form, "manufacturer").replace(/\s+/g, " ");
  const manufacturer =
    catalog.parts.find(
      (part) =>
        part.manufacturer && part.slug !== original?.slug && slugify(part.manufacturer) === slugify(manufacturerInput),
    )?.manufacturer ?? manufacturerInput;
  if (manufacturer && (manufacturer.length > 60 || !slugify(manufacturer)))
    errors.manufacturer = "Ürün markası en fazla 60 karakter olmalı ve harf veya rakam içermeli.";

  const specs = parseSpecs(text(form, "specs"));
  if (typeof specs === "string") errors.specs = specs;

  const details = text(form, "details").replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  if (details.length > 4000) errors.details = "Detaylı açıklama en fazla 4000 karakter olabilir.";

  const compatibility = parseCompatibility(text(form, "compatibility"));
  if (typeof compatibility === "string") errors.compatibility = compatibility;

  const imageKey = text(form, "imageKey");
  if (imageKey && !isOneOf(imageKeys, imageKey)) errors.imageKey = "Geçersiz görsel.";
  const gallery = [...new Set(list(form, "gallery"))].filter(
    (value): value is ImageKey => isOneOf(imageKeys, value) && value !== imageKey,
  );
  if (gallery.length > 8) errors.gallery = "En fazla 8 ek görsel seçilebilir.";

  if (Object.keys(errors).length > 0 || !category || typeof specs === "string" || typeof compatibility === "string")
    return { ok: false, errors };

  return {
    ok: true,
    value: {
      slug,
      code,
      ...(oemCodes.length ? { oemCodes } : {}),
      category: category.id,
      ...(subcategory ? { subcategory } : {}),
      title,
      description,
      segments: segments.filter((segment) => partSegments.includes(segment)),
      ...(partBrands.length ? { brands: partBrands } : {}),
      ...(fitment.length ? { fitment } : {}),
      qualities: partQualities.filter((quality) => qualities.includes(quality)),
      keywords,
      ...(manufacturer ? { manufacturer } : {}),
      ...(specs.length ? { specs } : {}),
      ...(details ? { details } : {}),
      ...(compatibility.length ? { compatibility } : {}),
      ...(imageKey ? { imageKey: imageKey as ImageKey } : {}),
      ...(gallery.length ? { gallery } : {}),
      updatedAt: new Date().toISOString(),
    },
  };
}

export function validateCategory(form: FormData, catalog: Catalog, original?: PartCategory): Validated<PartCategory> {
  const errors: FieldErrors = {};

  const title = text(form, "title");
  checkLength(errors, "title", title, 2, 60, "Kategori adı");

  const id = original?.id ?? slugify(title);
  if (!original) {
    if (!SLUG_PATTERN.test(id) || catalog.categories.some((item) => item.id === id))
      errors.title = "Bu adla bir kategori zaten var.";
    else if (reservedPartSlugs.includes(id) || catalog.parts.some((part) => part.slug === id))
      errors.title = "Bu ad bir marka veya ürün adresiyle çakışıyor; farklı bir kategori adı yazın.";
  }

  const code = text(form, "code").toUpperCase();
  if (!/^[A-Z]{2,5}$/.test(code)) errors.code = "Kod 2–5 büyük harf olmalı (örn. FRN).";
  else if (catalog.categories.some((item) => item.code === code && item.id !== original?.id))
    errors.code = "Bu kod başka bir kategoride kullanılıyor.";

  const summary = text(form, "summary");
  checkLength(errors, "summary", summary, 10, 200, "Kısa açıklama");

  const icon = text(form, "icon");
  if (!isOneOf(categoryIconKeys, icon)) errors.icon = "İkon seçin.";

  const imageKey = text(form, "imageKey");
  if (!isOneOf(imageKeys, imageKey)) errors.imageKey = "Görsel seçin.";

  const serviceSlug = text(form, "serviceSlug");
  if (!services.some((service) => service.slug === serviceSlug)) errors.serviceSlug = "İlgili hizmeti seçin.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      id,
      code,
      title,
      summary,
      imageKey: imageKey as ImageKey,
      icon: icon as CategoryIconKey,
      serviceSlug,
      subcategories: original?.subcategories ?? [],
    },
  };
}

export function validateSubcategoryTitle(title: string): string | null {
  if (title.length < 2) return "Alt kategori adı en az 2 karakter olmalı.";
  if (title.length > 60) return "Alt kategori adı en fazla 60 karakter olabilir.";
  if (!slugify(title)) return "Alt kategori adı harf veya rakam içermeli.";
  return null;
}
