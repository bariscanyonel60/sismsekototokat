import type { PartQuality } from "@/lib/catalog/types";

export const partsIntro = {
  eyebrow: "Yedek Parça",
  title: "450.000 Hazır Stok Yedek Parça",
  teaserTitle: "Aradığınız Parça Stokta.",
  description:
    "Komple sıfır sandık motordan motor yağı ve filtre setlerine, ön takımda orijinal ve muadil parçalara kadar; aracınız için gereken parçayı stoktan hızlıca temin ediyoruz.",
  stock: {
    value: "450.000",
    caption: "Hazır stok yedek parça",
    detail:
      "Binek, hafif ticari ve ağır vasıta için orijinal ve muadil seçenekler. Stok ve fiyat bilgisi için parça kodunu ya da aracınızı iletmeniz yeterli.",
  },
  catalogTitle: "Parça Kataloğu",
  catalogDescription:
    "Aracınıza uygun parçayı marka, model, araç bilgisi, ürün adı veya OEM / ürün kodu ile bulun; teklif listenizi tek mesajla WhatsApp'tan gönderin.",
  note: "Stok ve fiyat bilgisi araç marka, model ve şasi bilgisine göre verilir. Listede göremediğiniz parçalar için de bize ulaşabilirsiniz.",
};

/**
 * Ürün sayfasındaki "Parça + Usta" başlığı. Önce kategori `id`'si, yoksa kategorinin `serviceSlug`'ı aranır;
 * ikisi de yoksa hizmet adından genel başlık üretilir.
 */
export const installHeadlines: Record<string, string> = {
  "triger-atesleme": "Triger seti değişimi için randevu alın.",
  "sandik-motor": "Motor değişimini uzman ekibimize bırakın.",
  "periyodik-bakim": "Yağ & filtre değişimini servisimizde yaptırın.",
  "fren-sistemleri": "Fren parçası montajını uzman ekibimize bırakın.",
  "motor-bakim-onarimi": "Motor ve triger işçiliğini servisimizde yaptırın.",
  "alt-takim-bakim-onarimi": "Ön takım montajı ve kontrolü servisimizde.",
  "sanziman-bakim-onarimi": "Debriyaj ve şanzıman işçiliği için randevu alın.",
};

/** Yedek parça sayfasındaki güven şeridi; yalnızca firmanın sunduğu hizmetler yazılır. */
export const partsPerks = [
  { title: "450.000 Hazır Stok", text: "Binek araçtan otobüse geniş parça stoğu." },
  { title: "Orijinal & Muadil", text: "Ön takımda iki seçenekle bütçenize uygun parça." },
  { title: "Parça + Usta", text: "Aldığınız parçanın montajı aynı serviste." },
  { title: "WhatsApp'tan Teklif", text: "Stok ve fiyat bilgisini mesajla hızlıca iletiyoruz." },
] as const;

export const qualityLabels: Record<PartQuality, string> = {
  orijinal: "Orijinal",
  muadil: "Muadil",
};
