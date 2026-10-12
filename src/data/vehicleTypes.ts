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
    "Şimşek Oto yalnızca otomobil servisi değil. Hafif ticari araçlardan ağır vasıta ve otobüslere kadar her türlü araca bakım, onarım ve yedek parça hizmeti veriyoruz.",
};

export const vehicleTypes: VehicleType[] = [
  {
    id: "passenger",
    index: "01",
    label: "Binek & Hafif Ticari",
    title: "Otomobil ve hafif ticari araç servisi",
    description:
      "Fiat, Renault, Nissan, Volkswagen, Seat, Škoda, Toyota ve Honda başta olmak üzere her türlü binek araç; Ford Transit ve Connect gibi hafif ticari araçlar için bakım ve onarım.",
    brandNames: brandsByGroup("passenger").map((brand) => brand.name),
    brandsSuffix: "ve her türlü araç",
    highlights: ["Mekanik & elektronik arıza tespiti", "Alt takım", "Şanzıman"],
    image: images.vehiclePassenger,
  },
  {
    id: "commercial",
    index: "02",
    label: "Ağır Vasıta & Otobüs",
    title: "Ağır vasıta ve otobüs servis çözümleri",
    description:
      "Otokar otobüsler ile Deutz ve Cummins motorlu araçlara orijinal arıza tespit cihazıyla teşhis; IVECO araçlara uygun bakım, onarım ve yedek parça hizmeti.",
    brandNames: brandsByGroup("commercial").map((brand) => brand.name),
    brandsSuffix: "araçlarına orijinal arıza tespit cihazı",
    highlights: ["Orijinal arıza tespit cihazı", "Bakım & onarım", "Yedek parça"],
    image: images.vehicleBus,
    insetImage: images.vehicleCommercialWorkshop,
    insetCaption: "Atölye / Ağır Vasıta",
  },
];
