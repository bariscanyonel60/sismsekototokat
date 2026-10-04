export interface WorkingHours {
  /** Arayüzde görünen gün aralığı, örn. "Pazartesi – Cumartesi". */
  days: string;
  time: string;
  /** schema.org biçimi, örn. "Mo-Sa 08:30-18:30". */
  schema: string;
}

export interface ContactInfo {
  /** Örn. "0 (5xx) xxx xx xx". Boş bırakıldığında arayüz "yakında" durumunu gösterir. */
  phone: string | null;
  /** Ülke kodlu WhatsApp numarası, örn. "905xxxxxxxxx". */
  whatsapp: string | null;
  email: string | null;
  address: {
    street: string;
    district: string;
    city: string;
    postalCode?: string;
  } | null;
  mapUrl: string | null;
  hours: WorkingHours[] | null;
}

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  const netlify = process.env.URL;
  if (netlify) return netlify.replace(/\/$/, "");
  return "http://localhost:3000";
}

export const site = {
  name: "Şimşek Oto",
  wordmark: "ŞİMŞEK OTO",
  url: resolveSiteUrl(),
  locale: "tr_TR",
  tagline: "Otomobilden ticari araca, bakım ve mekanik servis çözümleri.",
  description:
    "Şimşek Oto; otomobil, hafif ticari araç ve otobüsler için periyodik bakım, motor servisi, ağır bakım, fren, süspansiyon ve arıza tespiti hizmetleri sunan oto servis merkezidir.",
  shortDescription:
    "Otomobil, hafif ticari ve otobüsler için profesyonel bakım ve mekanik servis çözümleri.",
  slogans: {
    primary: "Güvenli Sürüş, Güçlü Servis.",
    care: "Aracınız İçin Profesyonel Bakım.",
    range: "Otomobilden Ticari Araca Uzman Servis.",
    road: "Yola Güvenle Devam Edin.",
    craft: "İşçilikte Güven. Bakımda Titizlik.",
  },
  contact: {
    phone: null,
    whatsapp: null,
    email: null,
    address: null,
    mapUrl: null,
    hours: null,
  } satisfies ContactInfo as ContactInfo,
  whatsappDefaultMessage:
    "Merhaba Şimşek Oto, aracım için servis/bakım hakkında bilgi almak istiyorum.",
} as const;
