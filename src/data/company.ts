import { images } from "@/data/images";

export type CapabilityIcon = "car" | "van" | "bus" | "engine";

export interface Capability {
  label: string;
  detail: string;
  icon: CapabilityIcon;
  /**
   * Firma doğrulanmış bir rakam paylaştığında doldurulur (örn. "20+").
   * Boş bırakıldığında arayüz sayı göstermez, yalnızca yetkinliği gösterir.
   */
  value?: string;
  valueCaption?: string;
}

export const heroContent = {
  headlineLines: ["Binek Araçtan", "Ağır Vasıtaya", "Uzman Servis."],
  description:
    "Fiat, Renault, Volkswagen, Ford, Otokar ve IVECO başta olmak üzere her türlü araca bakım, onarım, arıza tespiti ve 450.000 hazır stok yedek parça.",
};

export const aboutContent = {
  eyebrow: "Hakkımızda",
  statement: {
    lead: "Otomobilden",
    accent: "ticari araca,",
    rest: "bakım, onarım ve yedek parça",
  },
  paragraphs: [
    "Şimşek Oto; binek otomobil, hafif ticari araç, ağır vasıta ve otobüsler için bakım, onarım ve yedek parça hizmeti veren bir oto servis işletmesidir.",
    "Mekanik ve elektronik arıza tespiti, alt takım ve şanzıman bakım onarımını aynı çatı altında topluyor; 450.000 hazır stok yedek parçayla aracınızı gereksiz beklemeden yola çıkarıyoruz.",
  ],
};

export const capabilities: Capability[] = [
  { label: "Binek Araç", detail: "Her türlü otomobile bakım ve onarım", icon: "car" },
  { label: "Hafif Ticari", detail: "Ford Transit, Connect ve iş araçları", icon: "van" },
  { label: "Ağır Vasıta", detail: "Otobüs, IVECO, Deutz ve Cummins", icon: "bus" },
  { label: "Yedek Parça", detail: "450.000 hazır stok, orijinal ve muadil", icon: "engine" },
];

export const whyUsContent = {
  eyebrow: "Neden Şimşek Oto?",
  titleLines: ["İşçilikte Güven.", "Bakımda Titizlik."],
  description:
    "İyi bir servis, aracınızı teslim ettiğiniz anda değil; geri aldığınızda ne yapıldığını tam olarak bildiğinizde anlaşılır.",
  image: images.whyMechanic,
  imageCaption: "Atölye / Mekanik Servis",
};

export interface Advantage {
  title: string;
  description: string;
}

export const advantages: Advantage[] = [
  {
    title: "Deneyimli Mekanik Servis",
    description:
      "Motor ve mekanik işlemlerde aracın yapısını bilen, işini usulüne göre yapan bir servis yaklaşımı.",
  },
  {
    title: "Otomobil & Ticari Araç Desteği",
    description:
      "Binek araçtan hafif ticariye, Otokar otobüslerden IVECO araçlara kadar her türlü araç için tek servis noktası.",
  },
  {
    title: "450.000 Hazır Stok Yedek Parça",
    description:
      "Komple sıfır sandık motordan motor yağı ve filtre setlerine, ön takımda orijinal ve muadil parçalara kadar hazır stok.",
  },
  {
    title: "Orijinal Arıza Tespit Cihazı",
    description:
      "Otokar, Deutz ve Cummins motorlu araçlarda orijinal cihazla; parça değiştirmeden önce sorunun kaynağını tespit ediyoruz.",
  },
  {
    title: "Şeffaf Servis Süreci",
    description:
      "Yapılacak işlem başlamadan önce konuşulur; teslimde yapılan işler ve değişen parçalar size açıklanır.",
  },
];

export interface ProcessStep {
  title: string;
  description: string;
}

export const processIntro = {
  eyebrow: "Servis Süreci",
  title: "Servis Sürecimiz",
  description: "Aracınız servise girdiği andan teslim edilene kadar her adım belli.",
};

export const processSteps: ProcessStep[] = [
  {
    title: "Aracınızı Dinliyoruz",
    description: "Şikâyeti, kullanım koşullarını ve bakım geçmişini sizden dinliyoruz.",
  },
  {
    title: "Kontrol & Arıza Tespiti",
    description: "Sorunun kaynağını kontrol ve testlerle netleştiriyoruz.",
  },
  {
    title: "Bakım / Onarım",
    description: "Onayınızla birlikte gerekli bakım ve onarım işlemlerini yapıyoruz.",
  },
  {
    title: "Son Kontroller",
    description: "İşlem sonrası aracı kontrol edip çalışmasını doğruluyoruz.",
  },
  {
    title: "Teslim",
    description: "Yapılan işleri açıklayarak aracınızı teslim ediyoruz.",
  },
];

export const imageBreakContent = {
  title: "Bakım sadece parça değiştirmek değildir.",
  description: "Doğru kontrol, doğru teşhis ve doğru işçilik aracınızın ömrünü uzatır.",
  cta: "Servis ile İletişime Geç",
  image: images.breakEngine,
};

export const appointmentContent = {
  eyebrow: "İletişim & Randevu",
  title: "Aracınız Bakıma mı İhtiyaç Duyuyor?",
  description:
    "Aracınızın markasını, modelini ve ihtiyacını kısaca paylaşın; size uygun servis zamanını birlikte planlayalım.",
  formTitle: "Servis Talebi",
};
