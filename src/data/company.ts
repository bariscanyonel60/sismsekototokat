import { images } from "@/data/images";

export interface Capability {
  label: string;
  detail: string;
  /**
   * Firma doğrulanmış bir rakam paylaştığında doldurulur (örn. "20+").
   * Boş bırakıldığında arayüz sayı göstermez, yalnızca yetkinliği gösterir.
   */
  value?: string;
  valueCaption?: string;
}

export const aboutContent = {
  eyebrow: "Hakkımızda",
  statement: {
    lead: "Otomobilden",
    accent: "ticari araca,",
    rest: "bakım ve mekanik servis çözümleri",
  },
  paragraphs: [
    "Şimşek Oto; binek otomobil, hafif ticari araç ve otobüsler için bakım ve mekanik servis hizmeti veren bir oto servis işletmesidir.",
    "Periyodik bakım, motor servisi, ağır bakım, fren ve yürüyen aksam işlemlerini aynı çatı altında topluyor; her aracı kendi kullanım koşulları ve bakım geçmişiyle birlikte değerlendiriyoruz.",
  ],
};

export const capabilities: Capability[] = [
  { label: "Binek Araç", detail: "Otomobil bakım ve onarımı" },
  { label: "Hafif Ticari", detail: "İş araçları için servis" },
  { label: "Otobüs", detail: "Ticari araç ve otobüs bakımı" },
  { label: "Motor & Mekanik", detail: "Motor servisi ve revizyon" },
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
      "Binek araçtan hafif ticariye, IVECO ve ISUZU gibi ticari araç ve otobüslere kadar tek servis noktası.",
  },
  {
    title: "Kapsamlı Bakım Çözümleri",
    description:
      "Periyodik bakımdan ağır bakıma, fren ve süspansiyondan motor servisine kadar ihtiyaç duyulan işlemler.",
  },
  {
    title: "Arıza Tespit ve Kontrol",
    description:
      "Parça değiştirmeden önce sorunun kaynağını sistematik kontrollerle tespit etmeye odaklanıyoruz.",
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
  formTitle: "Randevu Talebi",
};
