import { brandsByGroup, type BrandGroup } from "@/data/brands";
import { images, type SiteImage } from "@/data/images";

export interface VehicleType {
  id: BrandGroup;
  index: string;
  label: string;
  title: string;
  description: string;
  brandNames: string[];
  brandsSuffix: string;
  highlights: string[];
  image: SiteImage;
  insetImage?: SiteImage;
  insetCaption?: string;
}

export const vehicleTypesIntro = {
  eyebrow: "Araç Grupları",
  title: "Binek Araçtan Otobüse, Tek Servis Noktası.",
  description:
    "Şimşek Oto yalnızca otomobil servisi değil. Hafif ticari araçlardan ağır ticari araç ve otobüslere kadar geniş bir araç yelpazesine bakım ve mekanik servis veriyoruz.",
};

export const vehicleTypes: VehicleType[] = [
  {
    id: "passenger",
    index: "01",
    label: "Binek & Hafif Ticari",
    title: "Otomobil ve hafif ticari araç servisi",
    description:
      "Günlük kullanılan otomobillerden iş için çalışan hafif ticari araçlara; periyodik bakımdan motor ve yürüyen aksam işlemlerine kadar.",
    brandNames: brandsByGroup("passenger").map((brand) => brand.name),
    brandsSuffix: "ve diğer markalar",
    highlights: ["Periyodik bakım", "Motor & mekanik", "Fren & süspansiyon"],
    image: images.vehiclePassenger,
  },
  {
    id: "commercial",
    index: "02",
    label: "Ticari & Otobüs",
    title: "Ticari araç ve otobüs servis çözümleri",
    description:
      "IVECO ve ISUZU başta olmak üzere ticari araç ve otobüsler için bakım, motor servisi ve ağır bakım. Yolda kalmanın maliyetini bilen işletmeler için.",
    brandNames: brandsByGroup("commercial").map((brand) => brand.name),
    brandsSuffix: "başta olmak üzere ticari araç servis çözümleri",
    highlights: ["Ağır bakım", "Motor servisi", "Arıza tespiti"],
    image: images.vehicleBus,
    insetImage: images.vehicleCommercialWorkshop,
    insetCaption: "Atölye / Ağır Vasıta",
  },
];
