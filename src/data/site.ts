import siteContent from "../../content/site.json";

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
  tagline: "Araç bakım, onarım ve yedek parça hizmeti.",
  description:
    "Şimşek Oto; otomobil, hafif ticari, ağır vasıta ve otobüsler için mekanik ve elektronik arıza tespiti, alt takım ve şanzıman bakım onarımı ile 450.000 hazır stok yedek parça hizmeti sunan oto servis merkezidir.",
  shortDescription:
    "Otomobil, hafif ticari, ağır vasıta ve otobüsler için bakım, onarım ve yedek parça hizmeti.",
  slogans: {
    primary: "Güvenli Sürüş, Güçlü Servis.",
    care: "Aracınız İçin Profesyonel Bakım.",
    range: "Otomobilden Ticari Araca Uzman Servis.",
    road: "Yola Güvenle Devam Edin.",
    craft: "İşçilikte Güven. Bakımda Titizlik.",
  },
  /** Panelden (`/admin/iletisim`) düzenlenir; `content/site.json`. */
  contact: siteContent.contact as ContactInfo,
  whatsappDefaultMessage:
    "Merhaba Şimşek Oto, aracım için servis/bakım hakkında bilgi almak istiyorum.",
  /** Footer ve mobil menüdeki medya ajansı imzası. */
  mediaCredit: {
    label: "Medya",
    name: "BCY DİJİTAL",
    href: "https://bariscanyonel.com",
  },
} as const;
