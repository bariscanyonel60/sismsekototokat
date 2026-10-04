import { sectionIds } from "@/data/navigation";
import { site } from "@/data/site";

export type ContactContext =
  | { kind: "general" }
  | { kind: "service"; service: string }
  | { kind: "brand"; brand: string }
  | { kind: "vehicleGroup"; group: string }
  | {
      kind: "appointment";
      name: string;
      vehicle: string;
      service: string;
      note: string;
    };

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
    case "appointment": {
      const lines = [
        `${greeting} servis randevusu oluşturmak istiyorum.`,
        context.name && `Ad Soyad: ${context.name}`,
        context.vehicle && `Araç: ${context.vehicle}`,
        context.service && `Hizmet: ${context.service}`,
        context.note && `Not: ${context.note}`,
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
