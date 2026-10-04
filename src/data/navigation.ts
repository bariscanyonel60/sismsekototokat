export interface NavItem {
  label: string;
  href: string;
}

export const sectionIds = {
  home: "anasayfa",
  about: "hakkimizda",
  services: "hizmetler",
  vehicles: "arac-gruplari",
  brands: "markalar",
  why: "neden-biz",
  process: "servis-sureci",
  contact: "iletisim",
} as const;

export const mainNav: NavItem[] = [
  { label: "Ana Sayfa", href: `#${sectionIds.home}` },
  { label: "Hakkımızda", href: `#${sectionIds.about}` },
  { label: "Hizmetler", href: `#${sectionIds.services}` },
  { label: "Araç Grupları", href: `#${sectionIds.vehicles}` },
  { label: "Markalar", href: `#${sectionIds.brands}` },
  { label: "Neden Biz?", href: `#${sectionIds.why}` },
  { label: "İletişim", href: `#${sectionIds.contact}` },
];

export const ctaLabels = {
  primary: "Randevu Al",
  primaryLong: "Servis Randevusu Al",
  secondary: "Hizmetleri İncele",
  appointment: "Servis Randevusu Oluştur",
  call: "Hemen Ara",
  whatsapp: "WhatsApp ile Yazın",
} as const;

export const corporateLinks: NavItem[] = [
  { label: "Hakkımızda", href: `/#${sectionIds.about}` },
  { label: "Araç Grupları", href: `/#${sectionIds.vehicles}` },
  { label: "Markalar", href: `/#${sectionIds.brands}` },
  { label: "Servis Süreci", href: `/#${sectionIds.process}` },
  { label: "Neden Şimşek Oto?", href: `/#${sectionIds.why}` },
];

export const legalLinks: NavItem[] = [
  { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
  { label: "Gizlilik Politikası", href: "/gizlilik" },
];
