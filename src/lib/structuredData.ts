import { brands } from "@/data/brands";
import { images } from "@/data/images";
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
      "Otobüs ve ticari araç bakımı",
      "Motor mekanik",
      "Motor revizyon",
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
