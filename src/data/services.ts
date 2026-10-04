import { images, type SiteImage } from "@/data/images";

export interface Service {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  image: SiteImage;
}

export const servicesIntro = {
  eyebrow: "Hizmetler",
  title: "Aracınızın İhtiyacı Olan Her Şey",
  description:
    "Her araç önce dinlenir, sonra kontrol edilir. Bakım ve onarım kararını tahmine değil tespite dayandırıyor; yapılacak işlemi başlamadan önce sizinle netleştiriyoruz.",
};

export const services: Service[] = [
  {
    slug: "periyodik-bakim",
    title: "Periyodik Bakım",
    summary: "Yağ, filtre ve üretici bakım periyotlarına uygun genel kontroller.",
    tags: ["Üretici periyodu", "Genel kontrol"],
    image: images.servicePeriodic,
  },
  {
    slug: "yag-filtre-bakimi",
    title: "Yağ & Filtre Bakımı",
    summary:
      "Motor yağı, yağ filtresi, hava filtresi ve gerekli filtrelerin kontrol ve değişimi.",
    tags: ["Motor yağı", "Filtreler"],
    image: images.serviceOil,
  },
  {
    slug: "motor-servisi",
    title: "Motor Servisi",
    summary: "Motor arızalarının kontrolü, mekanik bakım ve gerekli onarım işlemleri.",
    tags: ["Motor mekanik", "Revizyon"],
    image: images.serviceEngine,
  },
  {
    slug: "agir-bakim",
    title: "Ağır Bakım",
    summary: "Kilometre ve araç durumuna göre kapsamlı mekanik bakım işlemleri.",
    tags: ["Kapsamlı bakım", "Kilometre bazlı"],
    image: images.serviceHeavy,
  },
  {
    slug: "fren-sistemleri",
    title: "Fren Sistemleri",
    summary: "Balata, disk ve fren sistemi kontrolleri.",
    tags: ["Balata", "Disk"],
    image: images.serviceBrake,
  },
  {
    slug: "suspansiyon-yuruyen-aksam",
    title: "Süspansiyon & Yürüyen Aksam",
    summary: "Amortisör, salıncak ve yürüyen aksam kontrolleri.",
    tags: ["Amortisör", "Salıncak"],
    image: images.serviceSuspension,
  },
  {
    slug: "ariza-tespiti",
    title: "Arıza Tespiti",
    summary: "Araçtaki mevcut problemlerin sistematik şekilde kontrol edilmesi.",
    tags: ["Sistematik kontrol", "Teşhis"],
    image: images.serviceDiagnostics,
  },
  {
    slug: "muayene-oncesi-kontrol",
    title: "Muayene Öncesi Kontrol",
    summary: "Araç muayenesi öncesinde temel mekanik ve güvenlik kontrolleri.",
    tags: ["Güvenlik", "Mekanik kontrol"],
    image: images.serviceInspection,
  },
];
