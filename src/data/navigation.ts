export interface NavItem {
  label: string;
  href: string;
}

export const sectionIds = {
  home: "anasayfa",
  about: "hakkimizda",
  services: "hizmetler",
  parts: "yedek-parca",
  vehicles: "arac-gruplari",
  brands: "markalar",
  why: "neden-biz",
  process: "servis-sureci",
  gallery: "atolye",
  faq: "sss",
  contact: "iletisim",
  catalog: "parca-katalogu",
  partList: "parca-listesi",
} as const;

export const routes = {
  home: "/",
  parts: "/yedek-parca",
  gallery: "/galeri",
  privacy: "/gizlilik",
  kvkk: "/kvkk",
  thanks: "/tesekkurler",
} as const;

export interface QuickLink extends NavItem {
  description: string;
}

/** 404, teşekkür ve yasal sayfalardaki iç bağlantı kartları. */
export const quickLinks: QuickLink[] = [
  {
    label: "Yedek Parça Kataloğu",
    description: "450.000 hazır stok; sandık motor, yağ, filtre ve ön takım.",
    href: `${routes.parts}#${sectionIds.catalog}`,
  },
  {
    label: "Hizmetlerimiz",
    description: "Mekanik ve elektronik arıza tespiti, alt takım, şanzıman.",
    href: `${routes.home}#${sectionIds.services}`,
  },
  {
    label: "Araç Grupları",
    description: "Binek, hafif ticari, ağır vasıta ve otobüs servisi.",
    href: `${routes.home}#${sectionIds.vehicles}`,
  },
  {
    label: "Sıkça Sorulan Sorular",
    description: "Servis, arıza tespiti ve yedek parça hakkında cevaplar.",
    href: `${routes.home}#${sectionIds.faq}`,
  },
];

/** İletişim bölümü olmayan sayfalarda (404, teşekkür) kullanılır. */
export const homeContactHref = `${routes.home}#${sectionIds.contact}`;

export const mainNav: NavItem[] = [
  { label: "Yedek Parça", href: routes.parts },
  { label: "Hizmetler", href: `#${sectionIds.services}` },
  { label: "Araç Grupları", href: `#${sectionIds.vehicles}` },
  { label: "Markalar", href: `#${sectionIds.brands}` },
  { label: "İletişim", href: `#${sectionIds.contact}` },
];

export const ctaLabels = {
  primary: "Randevu Al",
  primaryLong: "Servis Randevusu Al",
  secondary: "Hizmetleri İncele",
  parts: "Yedek Parça Kataloğu",
  partInquiry: "Stok & Fiyat Sor",
  appointment: "Servis Randevusu Oluştur",
  call: "Hemen Ara",
  whatsapp: "WhatsApp ile Yazın",
  whatsappReach: "WhatsApp'tan Ulaş",
  serviceRequest: "Servis Talebi Oluştur",
  directions: "Yol Tarifi Al",
} as const;

/** Header üstündeki duyuru şeridi. */
export const topBar = {
  message: "450.000 hazır stok yedek parça",
  detail: "Otokar, Deutz ve Cummins için orijinal arıza tespit cihazı",
  cta: "Stok & Fiyat Sor",
} as const;

export const corporateLinks: NavItem[] = [
  { label: "Hakkımızda", href: `/#${sectionIds.about}` },
  { label: "Neden Şimşek Oto?", href: `/#${sectionIds.why}` },
  { label: "Servis Süreci", href: `/#${sectionIds.process}` },
  { label: "Araç Grupları", href: `/#${sectionIds.vehicles}` },
  { label: "Toplu Parça Teklifi", href: `${routes.parts}#${sectionIds.partList}` },
  { label: "Yardım & SSS", href: `/#${sectionIds.faq}` },
  { label: "İletişim Bilgileri", href: `/#${sectionIds.contact}` },
];

export const legalLinks: NavItem[] = [
  { label: "KVKK Aydınlatma Metni", href: routes.kvkk },
  { label: "Gizlilik Politikası", href: routes.privacy },
];

/** Ana sayfa dışındaki sayfalarda bölüm bağlantılarını ana sayfaya yönlendirir. */
export function resolveNavHref(href: string, currentPath: string): string {
  if (!href.startsWith("#") || currentPath === routes.home) return href;
  return `${routes.home}${href}`;
}
