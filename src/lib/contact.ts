import { sectionIds } from "@/data/navigation";
import { site } from "@/data/site";

export type ContactContext =
  | { kind: "general" }
  | { kind: "service"; service: string }
  | { kind: "brand"; brand: string }
  | { kind: "vehicleGroup"; group: string }
  | { kind: "part"; part: string; code?: string; brand?: string; url?: string }
  | { kind: "compatibility"; part: string; code: string; url: string }
  | { kind: "partList"; list: string; vehicle: string }
  | { kind: "order"; items: OrderItem[]; vehicle: string; chassis: string; name: string; note: string }
  | {
      kind: "appointment";
      name: string;
      phone: string;
      vehicle: string;
      service: string;
      note: string;
    };

export interface OrderItem {
  code: string;
  title: string;
  quantity: number;
}

const CONTACT_ANCHOR = `#${sectionIds.contact}`;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Yerel yazımları (0 5xx…) uluslararası biçime (90 5xx…) çevirir. */
export function toInternationalTr(raw: string): string {
  const digits = digitsOnly(raw);
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  return `90${digits}`;
}

export function telHref(phone: string | null = site.contact.phone): string | null {
  if (!phone) return null;
  return `tel:+${toInternationalTr(phone)}`;
}

export function buildWhatsAppMessage(context: ContactContext = { kind: "general" }): string {
  const greeting = "Merhaba Şimşek Oto,";
  switch (context.kind) {
    case "general":
      return site.whatsappDefaultMessage;
    case "service":
      return `${greeting} aracım için ${context.service} hakkında bilgi almak istiyorum.`;
    case "brand":
      return `${greeting} ${context.brand} aracım için servis/bakım hakkında bilgi almak istiyorum.`;
    case "vehicleGroup":
      return `${greeting} ${context.group} aracım için servis/bakım hakkında bilgi almak istiyorum.`;
    case "part": {
      if (context.url) {
        return [
          `${greeting} web sitenizde bulunan`,
          context.part,
          context.code ? `Ürün Kodu: ${context.code}` : null,
          "ürünü hakkında stok ve fiyat bilgisi almak istiyorum.",
          "",
          context.url,
        ]
          .filter((line) => line !== null)
          .join("\n");
      }
      const product = context.code ? `${context.code} kodlu ${context.part}` : context.part;
      return context.brand
        ? `${greeting} ${context.brand} aracım için ${product} stok ve fiyat bilgisi almak istiyorum.`
        : `${greeting} ${product} için stok ve fiyat bilgisi almak istiyorum.`;
    }
    case "compatibility":
      return [
        `${greeting} aşağıdaki ürünün aracıma uyumluluğunu kontrol ettirmek istiyorum:`,
        "",
        `Ürün: ${context.part}`,
        `Ürün Kodu: ${context.code}`,
        `Ürün URL: ${context.url}`,
        "",
        "Şasi No: ",
      ].join("\n");
    case "partList": {
      if (!context.list) {
        return [
          `${greeting} sitenizde bulamadığım bir parçayı sormak istiyorum.`,
          "",
          "Parça / OEM kodu: ",
          `Araç: ${context.vehicle}`,
        ].join("\n");
      }
      const lines = [
        `${greeting} aşağıdaki parça listesi için fiyat teklifi almak istiyorum:`,
        "",
        context.list,
        "",
        context.vehicle ? `Araç: ${context.vehicle}` : null,
      ].filter((line) => line !== null);
      return lines.join("\n");
    }
    case "order": {
      const lines = [
        `${greeting} aşağıdaki parçaları sipariş etmek istiyorum:`,
        "",
        ...context.items.map((item, i) => `${i + 1}) ${item.title} (Ürün kodu: ${item.code}) – ${item.quantity} adet`),
        "",
        context.vehicle ? `Araç: ${context.vehicle}` : null,
        context.chassis ? `Şasi No: ${context.chassis}` : null,
        context.name ? `Ad Soyad: ${context.name}` : null,
        context.note ? `Not: ${context.note}` : null,
        "Stok, fiyat ve teslimat bilgisini paylaşır mısınız?",
      ].filter((line) => line !== null);
      return lines.join("\n");
    }
    case "appointment": {
      const lines = [
        `${greeting} servis randevusu oluşturmak istiyorum.`,
        context.name && `Ad Soyad: ${context.name}`,
        context.phone && `Telefon: ${context.phone}`,
        context.vehicle && `Araç: ${context.vehicle}`,
        context.service && `Hizmet: ${context.service}`,
        context.note ? `Not: ${context.note}` : null,
      ].filter(Boolean);
      return lines.join("\n");
    }
    default: {
      const exhaustive: never = context;
      return exhaustive;
    }
  }
}

export function whatsappHref(
  context: ContactContext = { kind: "general" },
  number: string | null = site.contact.whatsapp,
): string | null {
  if (!number) return null;
  const text = encodeURIComponent(buildWhatsAppMessage(context));
  return `https://wa.me/${toInternationalTr(number)}?text=${text}`;
}

/**
 * Bir CTA için en doğrudan iletişim yolu: WhatsApp tanımlıysa hazır mesajlı
 * WhatsApp linki, değilse sayfadaki iletişim bölümü.
 */
export function contactHref(context: ContactContext = { kind: "general" }): string {
  return whatsappHref(context) ?? CONTACT_ANCHOR;
}

export function isExternalHref(href: string): boolean {
  return href.startsWith("http");
}

export const hasDirectContact = Boolean(site.contact.phone || site.contact.whatsapp);
