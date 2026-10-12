import { routes, sectionIds } from "@/data/navigation";

export interface FaqItem {
  question: string;
  answer: string;
  link?: { label: string; href: string };
}

export const faqIntro = {
  eyebrow: "Sıkça Sorulan Sorular",
  title: "Aklınızdaki Sorular",
  description: "Servis, arıza tespiti ve yedek parça hakkında en çok sorulanlar. Cevabını bulamadığınız soru için bize yazın.",
};

export const faqs: FaqItem[] = [
  {
    question: "Hangi marka ve araçlara servis veriyorsunuz?",
    answer:
      "Fiat, Renault, Nissan, Volkswagen, Seat, Škoda, Toyota ve Honda başta olmak üzere her türlü binek araca; Ford Transit ve Connect gibi hafif ticari araçlara; Otokar otobüsler, IVECO ve Deutz / Cummins motorlu ağır vasıtalara bakım ve onarım hizmeti veriyoruz.",
    link: { label: "Araç gruplarını inceleyin", href: `${routes.home}#${sectionIds.vehicles}` },
  },
  {
    question: "Arıza tespitinde orijinal cihaz kullanıyor musunuz?",
    answer:
      "Evet. Otokar otobüsler ile Deutz ve Cummins motorlu araçlarda orijinal arıza tespit cihazı kullanıyoruz. Diğer araçlarda mekanik ve elektronik arıza tespitini, parça değiştirmeden önce sorunun kaynağını netleştirecek şekilde yapıyoruz.",
    link: { label: "Arıza tespiti hizmeti", href: `${routes.home}#elektronik-ariza-tespiti` },
  },
  {
    question: "Yedek parça stoğunuzda neler var?",
    answer:
      "450.000 hazır stok yedek parçamız var. Komple sıfır sandık motor, motor yağları, filtre setleri ve ön takım parçaları bunların başında geliyor; aracınıza uygun parçayı stoktan hızlıca temin ediyoruz.",
    link: { label: "Yedek parça kataloğu", href: routes.parts },
  },
  {
    question: "Orijinal ve muadil parça arasında seçim yapabilir miyim?",
    answer:
      "Ön takım parçalarında orijinal ve muadil seçenek sunuyoruz. Aracınızın durumuna ve kullanımına göre seçenekleri önceden konuşuyor, onayınız olmadan işlem yapmıyoruz.",
    link: { label: "Ön takım parçaları", href: `${routes.parts}#${sectionIds.catalog}` },
  },
  {
    question: "Randevu ve parça fiyatı için nasıl ulaşabilirim?",
    answer:
      "Randevu formunu doldurduğunuzda talebiniz hazır bir WhatsApp mesajına dönüşür. Parça stok ve fiyat bilgisi ise aracınızın marka, model ve şasi bilgisine göre verilir; katalogdaki her parçanın yanındaki “Stok & Fiyat Sor” bağlantısını kullanabilirsiniz.",
    link: { label: "Randevu formu", href: `${routes.home}#${sectionIds.contact}` },
  },
];
