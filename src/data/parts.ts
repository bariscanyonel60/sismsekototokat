import { brands, type Brand, type VehicleSegment } from "@/data/brands";
import { images, type SiteImage } from "@/data/images";

export type PartCategoryId = "sandik-motor" | "motor-yaglari" | "filtre-setleri" | "on-takim";

export type PartQuality = "orijinal" | "muadil";

export interface PartCategory {
  id: PartCategoryId;
  index: string;
  title: string;
  summary: string;
  image: SiteImage;
  /** Parçanın montajı/bakımı için yönlendirilen hizmet (`services[].slug`). */
  serviceSlug: string;
}

export interface Part {
  slug: string;
  category: PartCategoryId;
  title: string;
  description: string;
  segments: VehicleSegment[];
  /** Yalnızca firmanın belirttiği seçenekler girilir; boşsa arayüz kalite etiketi göstermez. */
  qualities: PartQuality[];
  /** Aramada eşleşmesi için ek kelimeler. */
  keywords: string[];
  /** Boşsa kategorinin görseli kullanılır. */
  image?: SiteImage;
}

export const partsIntro = {
  eyebrow: "Yedek Parça",
  title: "450.000 Hazır Stok Yedek Parça",
  teaserTitle: "Aradığınız Parça Stokta.",
  description:
    "Komple sıfır sandık motordan motor yağı ve filtre setlerine, ön takımda orijinal ve muadil parçalara kadar; aracınız için gereken parçayı stoktan hızlıca temin ediyoruz.",
  stock: {
    value: "450.000",
    caption: "Hazır stok yedek parça",
  },
  catalogTitle: "Parça Kataloğu",
  catalogDescription:
    "Kategori, araç grubu, marka ve parça türüne göre filtreleyin; ihtiyacınız olan parça için stok ve fiyat bilgisini doğrudan sorun.",
  note: "Stok ve fiyat bilgisi araç marka, model ve şasi bilgisine göre verilir. Listede göremediğiniz parçalar için de bize ulaşabilirsiniz.",
};

export const qualityLabels: Record<PartQuality, string> = {
  orijinal: "Orijinal",
  muadil: "Muadil",
};

export const partCategories: PartCategory[] = [
  {
    id: "sandik-motor",
    index: "01",
    title: "Komple Sıfır Sandık Motor",
    summary: "Binek, hafif ticari ve ağır vasıta için komple sıfır sandık motor.",
    image: images.serviceEngine,
    serviceSlug: "motor-bakim-onarimi",
  },
  {
    id: "motor-yaglari",
    index: "02",
    title: "Motor Yağları",
    summary: "Binek araçtan ağır vasıtaya, motor tipine uygun yağlar.",
    image: images.serviceOil,
    serviceSlug: "periyodik-bakim",
  },
  {
    id: "filtre-setleri",
    index: "03",
    title: "Filtre Setleri",
    summary: "Yağ, hava, yakıt ve polen filtreleri; bakım için komple set.",
    image: images.servicePeriodic,
    serviceSlug: "periyodik-bakim",
  },
  {
    id: "on-takim",
    index: "04",
    title: "Ön Takım Parçaları",
    summary: "Orijinal ve muadil seçenekleriyle ön takım ve yürüyen aksam.",
    image: images.serviceSuspension,
    serviceSlug: "alt-takim-bakim-onarimi",
  },
];

const ALL_SEGMENTS: VehicleSegment[] = ["binek", "hafif-ticari", "agir-vasita"];
const LIGHT_SEGMENTS: VehicleSegment[] = ["binek", "hafif-ticari"];
const BOTH_QUALITIES: PartQuality[] = ["orijinal", "muadil"];

export const parts: Part[] = [
  {
    slug: "binek-dizel-sandik-motor",
    category: "sandik-motor",
    title: "Binek Dizel Sandık Motor",
    description: "Dizel binek otomobiller için komple sıfır sandık motor; montaj ve ilk çalıştırma kontrolüyle.",
    segments: ["binek"],
    qualities: [],
    keywords: ["motor", "sandık", "sıfır motor", "komple motor", "dizel", "motor değişimi"],
  },
  {
    slug: "binek-benzinli-sandik-motor",
    category: "sandik-motor",
    title: "Binek Benzinli Sandık Motor",
    description: "Benzinli binek otomobiller için komple sıfır sandık motor ve montajı.",
    segments: ["binek"],
    qualities: [],
    keywords: ["motor", "sandık", "sıfır motor", "komple motor", "benzinli", "motor değişimi"],
    image: images.breakEngine,
  },
  {
    slug: "hafif-ticari-sandik-motor",
    category: "sandik-motor",
    title: "Hafif Ticari Sandık Motor",
    description: "Ford Transit, Transit Connect ve benzeri hafif ticari araçlar için komple sıfır sandık motor.",
    segments: ["hafif-ticari"],
    qualities: [],
    keywords: ["motor", "sandık", "sıfır motor", "transit", "connect", "ford", "hafif ticari"],
    image: images.vehicleCommercialWorkshop,
  },
  {
    slug: "agir-vasita-sandik-motor",
    category: "sandik-motor",
    title: "Ağır Vasıta & Otobüs Sandık Motor",
    description: "Otobüs ve ağır vasıtalar için komple sıfır sandık motor; değişim öncesi arıza tespitiyle.",
    segments: ["agir-vasita"],
    qualities: [],
    keywords: ["motor", "sandık", "sıfır motor", "otobüs", "kamyon", "otokar", "iveco", "deutz", "cummins"],
    image: images.whyMechanic,
  },
  {
    slug: "motor-yagi-0w-20",
    category: "motor-yaglari",
    title: "0W-20 / 0W-30 Motor Yağı",
    description: "Yeni nesil benzinli ve hibrit motorlar için düşük viskoziteli tam sentetik motor yağı.",
    segments: ["binek"],
    qualities: [],
    keywords: ["yağ", "motor yağı", "0w20", "0w-20", "0w30", "0w-30", "sentetik", "hibrit", "toyota", "honda"],
    image: images.vehiclePassenger,
  },
  {
    slug: "motor-yagi-5w-30",
    category: "motor-yaglari",
    title: "5W-30 Motor Yağı",
    description: "Partikül filtreli (DPF) dizel ve benzinli motorlara uygun, üretici normlu tam sentetik yağ.",
    segments: LIGHT_SEGMENTS,
    qualities: [],
    keywords: ["yağ", "motor yağı", "5w30", "5w-30", "sentetik", "dpf", "dizel", "benzinli"],
  },
  {
    slug: "motor-yagi-5w-40",
    category: "motor-yaglari",
    title: "5W-40 Motor Yağı",
    description: "Benzinli ve dizel binek araçlar ile hafif ticariler için tam sentetik motor yağı.",
    segments: LIGHT_SEGMENTS,
    qualities: [],
    keywords: ["yağ", "motor yağı", "5w40", "5w-40", "sentetik", "dizel", "benzinli"],
  },
  {
    slug: "motor-yagi-10w-40",
    category: "motor-yaglari",
    title: "10W-40 Motor Yağı",
    description: "Yüksek kilometreli binek ve hafif ticari motorlar için yarı sentetik motor yağı.",
    segments: LIGHT_SEGMENTS,
    qualities: [],
    keywords: ["yağ", "motor yağı", "10w40", "10w-40", "yarı sentetik"],
  },
  {
    slug: "motor-yagi-15w-40",
    category: "motor-yaglari",
    title: "15W-40 Ağır Vasıta Motor Yağı",
    description: "Otobüs, kamyon ve ağır vasıta dizel motorları için yüksek performanslı motor yağı.",
    segments: ["agir-vasita"],
    qualities: [],
    keywords: ["yağ", "motor yağı", "15w40", "15w-40", "dizel", "otobüs", "kamyon", "iveco", "deutz", "cummins"],
    image: images.serviceHeavy,
  },
  {
    slug: "bakim-filtre-seti",
    category: "filtre-setleri",
    title: "Komple Bakım Filtre Seti",
    description: "Periyodik bakım için yağ, hava, yakıt ve polen filtresinden oluşan set.",
    segments: LIGHT_SEGMENTS,
    qualities: [],
    keywords: ["filtre", "set", "bakım seti", "periyodik bakım"],
  },
  {
    slug: "agir-vasita-filtre-seti",
    category: "filtre-setleri",
    title: "Ağır Vasıta Filtre Seti",
    description: "Otobüs ve ağır vasıtalar için yağ, hava, yakıt ve yakıt ön (separatör) filtre seti.",
    segments: ["agir-vasita"],
    qualities: [],
    keywords: ["filtre", "set", "separatör", "mazot filtresi", "otobüs", "kamyon", "iveco", "otokar"],
    image: images.vehicleBus,
  },
  {
    slug: "yag-filtresi",
    category: "filtre-setleri",
    title: "Yağ Filtresi",
    description: "Motor yağı değişiminde birlikte yenilenen yağ filtresi.",
    segments: ALL_SEGMENTS,
    qualities: [],
    keywords: ["filtre", "yağ filtresi"],
  },
  {
    slug: "hava-filtresi",
    category: "filtre-setleri",
    title: "Hava Filtresi",
    description: "Motorun temiz hava almasını sağlayan hava filtresi.",
    segments: ALL_SEGMENTS,
    qualities: [],
    keywords: ["filtre", "hava filtresi"],
  },
  {
    slug: "yakit-filtresi",
    category: "filtre-setleri",
    title: "Yakıt (Mazot) Filtresi",
    description: "Dizel ve benzinli motorlar için yakıt filtresi.",
    segments: ALL_SEGMENTS,
    qualities: [],
    keywords: ["filtre", "yakıt filtresi", "mazot filtresi", "dizel"],
  },
  {
    slug: "polen-filtresi",
    category: "filtre-setleri",
    title: "Polen (Kabin) Filtresi",
    description: "Kabin içine giren havayı süzen polen filtresi.",
    segments: ALL_SEGMENTS,
    qualities: [],
    keywords: ["filtre", "polen filtresi", "kabin filtresi", "klima filtresi"],
  },
  {
    slug: "amortisor",
    category: "on-takim",
    title: "Amortisör",
    description: "Ön amortisörler; yol tutuşu, fren mesafesi ve sürüş konforu için.",
    segments: ALL_SEGMENTS,
    qualities: BOTH_QUALITIES,
    keywords: ["amortisör", "süspansiyon", "ön takım"],
  },
  {
    slug: "amortisor-takozu",
    category: "on-takim",
    title: "Amortisör Takozu & Rulmanı",
    description: "Amortisör üst takozu, rulmanı ve toz körüğü.",
    segments: LIGHT_SEGMENTS,
    qualities: BOTH_QUALITIES,
    keywords: ["amortisör", "takoz", "rulman", "körük", "ön takım"],
  },
  {
    slug: "salincak",
    category: "on-takim",
    title: "Salıncak",
    description: "Ön salıncak ve salıncak burçları.",
    segments: ALL_SEGMENTS,
    qualities: BOTH_QUALITIES,
    keywords: ["salıncak", "burç", "ön takım", "alt takım"],
    image: images.serviceInspection,
  },
  {
    slug: "rotil",
    category: "on-takim",
    title: "Rotil",
    description: "Ön takım rotilleri; direksiyon ve süspansiyon bağlantısı.",
    segments: ALL_SEGMENTS,
    qualities: BOTH_QUALITIES,
    keywords: ["rotil", "ön takım", "alt takım"],
    image: images.serviceInspection,
  },
  {
    slug: "rot-basi-rot-mili",
    category: "on-takim",
    title: "Rot Başı & Rot Mili",
    description: "Direksiyon sistemi için rot başı ve rot milleri.",
    segments: ALL_SEGMENTS,
    qualities: BOTH_QUALITIES,
    keywords: ["rot", "rot başı", "rot mili", "direksiyon", "ön takım"],
  },
  {
    slug: "z-rot",
    category: "on-takim",
    title: "Z Rot (Viraj Demiri Askısı)",
    description: "Viraj demiri bağlantı çubukları ve lastikleri.",
    segments: LIGHT_SEGMENTS,
    qualities: BOTH_QUALITIES,
    keywords: ["z rot", "viraj demiri", "stabilizatör", "ön takım"],
  },
  {
    slug: "aks-kafasi",
    category: "on-takim",
    title: "Aks Kafası & Aks Körüğü",
    description: "Ön aks kafaları ve aks körükleri.",
    segments: LIGHT_SEGMENTS,
    qualities: BOTH_QUALITIES,
    keywords: ["aks", "aks kafası", "körük", "ön takım"],
  },
  {
    slug: "porya-rulmani",
    category: "on-takim",
    title: "Porya & Teker Rulmanı",
    description: "Ön teker poryaları ve rulmanları.",
    segments: ALL_SEGMENTS,
    qualities: BOTH_QUALITIES,
    keywords: ["porya", "rulman", "teker rulmanı", "ön takım"],
    image: images.serviceBrake,
  },
];

export function partCountByCategory(id: PartCategoryId): number {
  return parts.filter((part) => part.category === id).length;
}

export function partHref(slug: string): string {
  return `/yedek-parca/${slug}`;
}

export function getPart(slug: string): Part | undefined {
  return parts.find((part) => part.slug === slug);
}

export function getPartCategory(id: PartCategoryId): PartCategory {
  const category = partCategories.find((item) => item.id === id);
  if (!category) throw new Error(`Bilinmeyen parça kategorisi: ${id}`);
  return category;
}

export function partImage(part: Part): SiteImage {
  return part.image ?? getPartCategory(part.category).image;
}

/** Parçanın uygun olduğu araç gruplarındaki markalar. */
export function brandsForPart(part: Part): Brand[] {
  return brands.filter((brand) => part.segments.includes(brand.segment));
}

/** Önce aynı kategori, sonra ortak araç grubundaki parçalar. */
export function relatedParts(part: Part, limit = 3): Part[] {
  const others = parts.filter((item) => item.slug !== part.slug);
  const sameCategory = others.filter((item) => item.category === part.category);
  const sharedSegment = others.filter(
    (item) => item.category !== part.category && item.segments.some((segment) => part.segments.includes(segment)),
  );
  return [...sameCategory, ...sharedSegment].slice(0, limit);
}
