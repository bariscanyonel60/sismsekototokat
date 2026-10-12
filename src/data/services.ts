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
  title: "Bakım, Onarım ve Yedek Parça",
  description:
    "Her araç önce dinlenir, sonra kontrol edilir. Bakım ve onarım kararını tahmine değil tespite dayandırıyor; yapılacak işlemi başlamadan önce sizinle netleştiriyoruz.",
};

export const services: Service[] = [
  {
    slug: "mekanik-ariza-tespiti",
    title: "Mekanik Arıza Tespiti",
    summary: "Motor ve mekanik aksamdaki sorunların kaynağını parça değiştirmeden önce netleştiriyoruz.",
    tags: ["Motor mekanik", "Teşhis"],
    image: images.servicePeriodic,
  },
  {
    slug: "elektronik-ariza-tespiti",
    title: "Elektronik Arıza Tespiti",
    summary:
      "Arıza tespit cihazıyla elektronik sistem kontrolü; Otokar, Deutz ve Cummins motorlu araçlara orijinal cihaz.",
    tags: ["Orijinal cihaz", "Elektronik sistem"],
    image: images.serviceDiagnostics,
  },
  {
    slug: "motor-bakim-onarimi",
    title: "Motor Bakım Onarımı",
    summary: "Motor arızalarının onarımı, revizyon ve komple sıfır sandık motor değişimi.",
    tags: ["Revizyon", "Sandık motor"],
    image: images.serviceEngine,
  },
  {
    slug: "alt-takim-bakim-onarimi",
    title: "Alt Takım Bakım Onarımı",
    summary: "Ön takım, amortisör, salıncak, rotil ve yürüyen aksam bakım ve onarımı.",
    tags: ["Ön takım", "Yürüyen aksam"],
    image: images.serviceInspection,
  },
  {
    slug: "sanziman-bakim-onarimi",
    title: "Şanzıman Bakım Onarımı",
    summary: "Şanzıman kontrolü, bakımı ve onarımı; vites geçişi ve ses şikâyetlerinin tespiti.",
    tags: ["Şanzıman", "Vites"],
    image: images.serviceSuspension,
  },
  {
    slug: "periyodik-bakim",
    title: "Periyodik Bakım",
    summary: "Motor yağı, filtre setleri ve üretici bakım periyotlarına uygun genel kontroller.",
    tags: ["Motor yağı", "Filtre seti"],
    image: images.serviceOil,
  },
  {
    slug: "fren-sistemleri",
    title: "Fren Sistemleri",
    summary: "Balata, disk ve fren sistemi kontrolleri.",
    tags: ["Balata", "Disk"],
    image: images.serviceBrake,
  },
  {
    slug: "agir-vasita-otobus",
    title: "Ağır Vasıta & Otobüs",
    summary: "Otobüs, IVECO ve ağır vasıtalar için bakım, onarım ve yedek parça hizmeti.",
    tags: ["Otokar", "IVECO"],
    image: images.serviceHeavy,
  },
];
