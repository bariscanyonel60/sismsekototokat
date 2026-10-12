import { brands } from "@/data/brands";
import { faqs } from "@/data/faq";
import { images } from "@/data/images";
import { routes } from "@/data/navigation";
import { partCategories, partHref, parts } from "@/data/parts";
import { reviews } from "@/data/reviews";
import { services } from "@/data/services";
import { site } from "@/data/site";
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
  if (reviews.length > 0) {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (total / reviews.length).toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
    schema.review = reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      datePublished: review.date,
      reviewBody: review.body,
      reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5, worstRating: 1 },
    }));
  }

  return schema;
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
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Yedek parça sayfası için kategori bazlı OfferCatalog; fiyat bilgisi verilmez. */
export function buildPartsCatalogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `${site.name} Yedek Parça`,
    url: `${site.url}${routes.parts}`,
    provider: { "@id": `${site.url}/#isletme` },
    itemListElement: partCategories.map((category) => ({
      "@type": "OfferCatalog",
      name: category.title,
      description: category.summary,
      itemListElement: parts
        .filter((part) => part.category === category.id)
        .map((part) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: part.title,
            description: part.description,
            url: `${site.url}${partHref(part.slug)}`,
          },
        })),
    })),
  };
}
