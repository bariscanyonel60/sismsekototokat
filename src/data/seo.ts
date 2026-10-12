export const seoKeywords = [
  "oto servis",
  "oto tamir",
  "araç bakım onarım",
  "yedek parça",
  "oto yedek parça",
  "sıfır sandık motor",
  "motor yağı",
  "filtre seti",
  "ön takım yedek parça",
  "mekanik arıza tespiti",
  "elektronik arıza tespiti",
  "alt takım bakım onarım",
  "şanzıman bakım onarım",
  "Fiat servis",
  "Renault servis",
  "Nissan servis",
  "Volkswagen servis",
  "Seat servis",
  "Skoda servis",
  "Toyota servis",
  "Honda servis",
  "Ford Transit servis",
  "Ford Connect servis",
  "Otokar otobüs servis",
  "Iveco servis",
  "Iveco yedek parça",
  "Deutz motor arıza tespiti",
  "Cummins motor arıza tespiti",
  "otobüs bakım servisi",
  "ağır vasıta servisi",
];

export const seoTitle = "Şimşek Oto | Araç Bakım, Onarım ve Yedek Parça";

export interface PageSeo {
  /** Tarayıcı sekmesinde `%s | Şimşek Oto` şablonuyla gösterilir. */
  title: string;
  /** Arama sonucu açıklaması: her sayfada benzersiz, ~150–160 karakter. */
  description: string;
  /** Sosyal medya paylaşım başlığı/açıklaması; boşsa title/description kullanılır. */
  socialTitle?: string;
  socialDescription?: string;
  path: string;
  index: boolean;
}

export const pageSeo = {
  home: {
    title: seoTitle,
    description:
      "Şimşek Oto: Fiat, Renault, Ford Transit'ten Otokar ve IVECO'ya her araca mekanik ve elektronik arıza tespiti, alt takım, şanzıman onarımı ve yedek parça.",
    socialTitle: "Şimşek Oto – Bakım, Onarım ve 450.000 Hazır Stok Yedek Parça",
    socialDescription:
      "Binek, hafif ticari, ağır vasıta ve otobüsler için arıza tespiti, bakım onarım ve hazır stok yedek parça. Randevu ve parça sorgusu WhatsApp ile.",
    path: "/",
    index: true,
  },
  parts: {
    title: "Oto Yedek Parça – 450.000 Hazır Stok",
    description:
      "Oto yedek parça: sandık motor, motor yağı, filtre seti, fren, debriyaj ve ön takım. Binek, hafif ticari ve ağır vasıta için 450.000 hazır stok.",
    socialTitle: "450.000 Hazır Stok Yedek Parça | Şimşek Oto",
    socialDescription:
      "Sandık motor, motor yağı, filtre seti ve orijinal / muadil ön takım parçaları. Kataloğu filtreleyin, stok ve fiyatı tek mesajla sorun.",
    path: "/yedek-parca",
    index: true,
  },
  gallery: {
    title: "Atölye Galerisi – Servisten Gerçek Kareler",
    description:
      "Şimşek Oto atölyesinden gerçek fotoğraflar: motor, alt takım ve şanzıman onarımı, arıza tespiti ve ağır vasıta bakımı çalışmalarımızdan kareler.",
    path: "/galeri",
    index: true,
  },
  privacy: {
    title: "Gizlilik Politikası",
    description:
      "Şimşek Oto web sitesinde hangi bilgilerin işlendiği, randevu formunun nasıl çalıştığı, çerez kullanımı ve haklarınız hakkında gizlilik politikamız.",
    path: "/gizlilik",
    index: true,
  },
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    description:
      "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Şimşek Oto tarafından kişisel verilerinizin işlenmesine ilişkin aydınlatma metni.",
    path: "/kvkk",
    index: false,
  },
  thanks: {
    title: "Talebiniz Alındı",
    description:
      "Randevu talebiniz WhatsApp mesajı olarak hazırlandı. Şimşek Oto ekibi en kısa sürede sizinle iletişime geçecek.",
    path: "/tesekkurler",
    index: false,
  },
} satisfies Record<string, PageSeo>;
