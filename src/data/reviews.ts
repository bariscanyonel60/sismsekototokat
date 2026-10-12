export interface CustomerReview {
  /** Müşterinin izin verdiği görünen ad, örn. "Ahmet Y." */
  author: string;
  /** 1–5 arası puan. */
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  /** ISO tarih, örn. "2026-09-14". */
  date: string;
  /** Örn. "Ford Transit", "Otokar otobüs". */
  vehicle?: string;
  /** Yorumun alındığı yer, örn. "Google". */
  source?: string;
}

export const reviewsIntro = {
  eyebrow: "Müşteri Yorumları",
  title: "Müşterilerimiz Ne Diyor?",
  description: "Servisimize araç getiren müşterilerimizin kendi sözleriyle deneyimleri.",
};

/**
 * Yalnızca gerçek ve izinli müşteri yorumları girilir (sahte yorum/puan eklenmez).
 * Liste boşken yorum bölümü ve puan yapılandırılmış verisi sayfada gösterilmez.
 */
export const reviews: CustomerReview[] = [];
