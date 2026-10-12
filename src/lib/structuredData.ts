import { brands, segmentLabels } from "@/data/brands";
import { faqs } from "@/data/faq";
import { images } from "@/data/images";
import { routes } from "@/data/navigation";
import { services } from "@/data/services";
import { site } from "@/data/site";
import {
  brandsForPart,
  findCategory,
  partCategoryHref,
  partHref,
  partImage,
  subcategoryTitle,
} from "@/lib/catalog/helpers";
import type { Catalog, Part } from "@/lib/catalog/types";
import { toInternationalTr } from "@/lib/contact";

/**
 * schema.org AutoRepair verisi. Telefon, adres ve çalışma saatleri yalnızca
 * `site.contact` içinde gerçek değer girildiğinde çıktıya eklenir.
 */
export function buildAutoRepairSchema() {
  const { contact } = site;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${site.url}/#isletme`,
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}${images.heroWorkshop.src.src}`,
    slogan: site.slogans.primary,
    knowsAbout: [
      "Otomobil bakım ve onarım",
      "Hafif ticari araç servisi",
      "Otobüs ve ağır vasıta bakımı",
      "Mekanik arıza tespiti",
      "Elektronik arıza tespiti",
      "Alt takım bakım onarımı",
      "Şanzıman bakım onarımı",
      "Yedek parça",
      ...brands.map((brand) => `${brand.plain} servis`),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servis Hizmetleri",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.summary,
        },
      })),
    },
  };

  if (contact.phone) schema.telephone = `+${toInternationalTr(contact.phone)}`;
  if (contact.email) schema.email = contact.email;
  if (contact.mapUrl) schema.hasMap = contact.mapUrl;
  if (contact.address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.district,
      addressRegion: contact.address.city,
      postalCode: contact.address.postalCode,
      addressCountry: "TR",
    };
  }
  if (contact.hours) {
    schema.openingHours = contact.hours.map((slot) => slot.schema);
  }
  return schema;
}

/** Ana sayfa için WebSite verisi; site adı ve dili arama motorlarına bildirilir. */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "tr-TR",
    publisher: { "@id": `${site.url}/#isletme` },
  };
}

/**
 * Ürün detay sayfası için Product verisi; fiyat/stok adedi bilinmediğinden `offers` verilmez.
 * Firma kodu `sku`/`productID`, ilk OEM numarası `mpn` olur; tüm kodlar `additionalProperty` ile
 * listelenir ki kodla yapılan aramalar ürünle eşleşsin.
 */
export function buildProductSchema(catalog: Catalog, part: Part) {
  const subcategory = subcategoryTitle(catalog, part);
  const category = findCategory(catalog, part.category)?.title;
  const oemCodes = part.oemCodes ?? [];
  const vehicles = part.compatibility?.length
    ? part.compatibility.map((row) => {
        const brandName = brands.find((brand) => brand.plain === row.brand)?.name ?? row.brand;
        return {
          "@type": "Vehicle",
          name: [brandName, row.model, row.engine, row.years].filter(Boolean).join(" "),
          brand: { "@type": "Brand", name: brandName },
          ...(row.model ? { model: row.model } : {}),
          ...(row.engine ? { vehicleEngine: { "@type": "EngineSpecification", name: row.engine } } : {}),
        };
      })
    : part.fitment?.length
      ? part.fitment.map((name) => ({ "@type": "Vehicle", name }))
      : brandsForPart(part).map((brand) => ({
          "@type": "Vehicle",
          name: brand.note ? `${brand.name} ${brand.note}` : brand.name,
          brand: { "@type": "Brand", name: brand.name },
        }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${site.url}${partHref(part.slug)}#urun`,
    name: part.title,
    sku: part.code,
    productID: part.code,
    ...(oemCodes.length ? { mpn: oemCodes[0] } : {}),
    ...(part.manufacturer ? { brand: { "@type": "Brand", name: part.manufacturer } } : {}),
    description: part.details ? `${part.description}\n\n${part.details}` : part.description,
    category: subcategory ? `${category} > ${subcategory}` : category,
    image: `${site.url}${partImage(catalog, part).src.src}`,
    url: `${site.url}${partHref(part.slug)}`,
    keywords: [part.code, ...oemCodes, ...(part.manufacturer ? [part.manufacturer] : []), ...part.keywords].join(", "),
    additionalProperty: [
      { "@type": "PropertyValue", name: "Ürün kodu", value: part.code },
      ...oemCodes.map((value) => ({ "@type": "PropertyValue", name: "OEM numarası", value })),
      {
        "@type": "PropertyValue",
        name: "Araç grubu",
        value: part.segments.map((segment) => segmentLabels[segment]).join(", "),
      },
      ...(part.specs ?? []).map((spec) => ({ "@type": "PropertyValue", name: spec.label, value: spec.value })),
    ],
    isAccessoryOrSparePartFor: vehicles,
  };
}

/** Kategori ve marka sayfalarındaki ürün listesi. */
export function buildPartListSchema(name: string, path: string, parts: Part[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: `${site.url}${path}`,
    numberOfItems: parts.length,
    itemListElement: parts.map((part, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${part.title} (${part.code})`,
      url: `${site.url}${partHref(part.slug)}`,
    })),
  };
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href === "/" ? "" : item.href}` } : {}),
    })),
  };
}

export function buildFaqSchema() {
  return buildFaqPageSchema(faqs);
}

/**
 * Yedek parça ana sayfası: kategori açılış sayfalarının listesi. Fiyat bilinmediğinden Offer /
 * OfferCatalog kullanılmaz (fiyatsız Offer arama motorunda hata üretir).
 */
export function buildPartsCatalogSchema({ categories, parts }: Catalog) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${site.name} Yedek Parça Kategorileri`,
    url: `${site.url}${routes.parts}`,
    numberOfItems: categories.length,
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${category.title} (${parts.filter((part) => part.category === category.id).length} ürün)`,
      url: `${site.url}${partCategoryHref(category.id)}`,
    })),
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/** Sayfada görünür olarak basılan soru-cevaplar için FAQPage verisi. */
export function buildFaqPageSchema(items: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
