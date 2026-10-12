import { fitmentItems, type PartFit } from "@/lib/catalog/helpers";
import type { Part } from "@/lib/catalog/types";
import { fitDescription } from "@/lib/text";

const SEO_TITLE_MAX = 60;
const SEO_DESCRIPTION_MAX = 160;

/** Otomatik SEO metni için gereken ürün alanları. */
export type PartSeoSource = PartFit &
  Pick<Part, "title" | "code" | "description" | "specs" | "oemCodes" | "manufacturer">;

/** "[Ürün adı] [Ürün kodu]"; 60 karakteri aşarsa yalnızca ürün adı. */
export function autoPartSeoTitle(part: PartSeoSource): string {
  const full = [part.title, part.code].filter(Boolean).join(" ").trim();
  return full.length <= SEO_TITLE_MAX ? full : part.title.slice(0, SEO_TITLE_MAX).trim();
}

/**
 * Ürün kodu + ad, uygun araçlar, özellikler, OEM numaraları ve ürün açıklaması; kısa ve öz bilgiler
 * önce gelir, 160 karakteri aşan kısım kelime sınırında kesilir.
 */
export function autoPartSeoDescription(part: PartSeoSource): string {
  const sentence = (text: string) => (text && !/[.!?…]$/.test(text) ? `${text}.` : text);
  const fit = fitmentItems(part);
  const specs = part.specs ?? [];
  const oem = part.oemCodes ?? [];
  return fitDescription(
    [
      sentence([part.code, part.manufacturer, part.title].filter(Boolean).join(" ")),
      fit.length ? `Uygun araçlar: ${fit.join(", ")}.` : "",
      specs.length ? sentence(specs.map((spec) => `${spec.label}: ${spec.value}`).join(", ")) : "",
      oem.length ? `OEM: ${oem.join(", ")}.` : "",
      sentence(part.description.trim()),
      "Stok ve fiyat için WhatsApp'tan yazın.",
    ]
      .filter(Boolean)
      .join(" "),
    SEO_DESCRIPTION_MAX - 2,
  );
}
