import type { VehicleSegment } from "@/data/brands";
import type { ImageKey } from "@/data/images";

export const categoryIconKeys = ["engine", "oil", "filter", "suspension", "brake", "clutch", "spark"] as const;
export type CategoryIconKey = (typeof categoryIconKeys)[number];

export const partQualities = ["orijinal", "muadil"] as const;
export type PartQuality = (typeof partQualities)[number];

export interface PartSubcategory {
  id: string;
  title: string;
}

export interface PartCategory {
  /** URL ve filtrede kullanılan kalıcı kimlik; oluşturulduktan sonra değişmez. */
  id: string;
  /** Ürün kodu önerisinde kullanılan kısaltma, örn. FRN → SO-FRN-07. */
  code: string;
  title: string;
  summary: string;
  imageKey: ImageKey;
  icon: CategoryIconKey;
  /** Parçanın montajı/bakımı için yönlendirilen hizmet (`services[].slug`). */
  serviceSlug: string;
  subcategories: PartSubcategory[];
  /** Boşsa otomatik üretilir; yalnızca gerektiğinde panelden yazılır. */
  seoTitle?: string;
  seoDescription?: string;
}

export interface PartSpec {
  label: string;
  value: string;
}

/** Tek bir doğrulanmış araç uyumu satırı; yalnızca firmanın belirttiği bilgiler girilir. */
export interface PartCompatibility {
  /** `brands[].plain` */
  brand: string;
  model?: string;
  engine?: string;
  /** Örn. "2016–2022" */
  years?: string;
}

export interface Part {
  slug: string;
  /** Firma katalog kodu (WhatsApp siparişinde ürünü tanımlar). */
  code: string;
  /** Üretici / OEM parça numaraları; yalnızca firmanın doğruladığı numaralar girilir. */
  oemCodes?: string[];
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  segments: VehicleSegment[];
  /** Yalnızca belirli markalara özel ürünlerde (`brands[].plain`); boşsa araç grubundaki tüm markalara uygundur. */
  brands?: string[];
  /** Firmanın belirttiği araç/model/motor uyumu. Uydurma model veya yıl girilmez. */
  fitment?: string[];
  /** Yalnızca firmanın belirttiği seçenekler girilir. */
  qualities: PartQuality[];
  /** Aramada eşleşmesi için ek kelimeler. */
  keywords: string[];
  /** Ürünün üretici markası (örn. Bosch); yalnızca firmanın belirttiği marka girilir. */
  manufacturer?: string;
  /** Ürün özellikleri tablosu (örn. Viskozite: 5W-30); yalnızca doğrulanmış değerler girilir. */
  specs?: PartSpec[];
  /** Ürün sayfasındaki detaylı açıklama; paragraflar boş satırla ayrılır. */
  details?: string;
  /** Marka / model / motor / yıl bazında uyumluluk tablosu; araç seçicide öneri olarak da kullanılır. */
  compatibility?: PartCompatibility[];
  /** Boşsa kategorinin görseli kullanılır. */
  imageKey?: ImageKey;
  /** Ana görselin ardından gösterilen ek ürün görselleri. */
  gallery?: ImageKey[];
  /** Boşsa ürün adı + ürün kodundan otomatik üretilir; yalnızca gerektiğinde panelden yazılır. */
  seoTitle?: string;
  /** Boşsa ürün verilerinden otomatik üretilir. */
  seoDescription?: string;
  /** Panelden son kaydedilme zamanı (ISO 8601); sitemap `lastModified` için. */
  updatedAt?: string;
}

/** Sepet paneline giden asgari ürün bilgisi; tüm katalog her sayfada istemciye gönderilmez. */
export interface CartPart {
  slug: string;
  code: string;
  title: string;
  imageKey: ImageKey;
}

/** "Tüm Ürünler" menüsüne giden kategori özeti. */
export interface PartsMenuCategory {
  id: string;
  title: string;
  icon: CategoryIconKey;
  count: number;
  subcategories: PartSubcategory[];
}

/** Katalogda en az bir ürünü olan ürün (üretici) markası. */
export interface Manufacturer {
  name: string;
  slug: string;
  count: number;
}

export interface PartsMenuData {
  categories: PartsMenuCategory[];
  manufacturers: Manufacturer[];
}

export interface Catalog {
  categories: PartCategory[];
  parts: Part[];
}
