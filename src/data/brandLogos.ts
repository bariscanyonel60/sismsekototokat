import type { StaticImageData } from "next/image";
import cumminsLogo from "@/assets/brands/cummins.svg";
import deutzLogo from "@/assets/brands/deutz.svg";
import fiatLogo from "@/assets/brands/fiat.svg";
import fordLogo from "@/assets/brands/ford.svg";
import hondaLogo from "@/assets/brands/honda.svg";
import ivecoLogo from "@/assets/brands/iveco.svg";
import nissanLogo from "@/assets/brands/nissan.svg";
import otokarLogo from "@/assets/brands/otokar.svg";
import renaultLogo from "@/assets/brands/renault.svg";
import seatLogo from "@/assets/brands/seat.svg";
import skodaLogo from "@/assets/brands/skoda.svg";
import toyotaLogo from "@/assets/brands/toyota.svg";
import volkswagenLogo from "@/assets/brands/volkswagen.svg";

export type BrandLogoLicense = "CC0 1.0 (Simple Icons)" | "Public domain (Wikimedia Commons)";

export interface BrandLogo {
  src: StaticImageData;
  source: string;
  license: BrandLogoLicense;
}

const simpleIcons = (slug: string) => `https://simpleicons.org/?q=${slug}`;

/** Tek renkli marka logoları; anahtar `brands[].plain`. Logolar yalnızca hizmet verilen markayı belirtir. */
export const brandLogos: Record<string, BrandLogo> = {
  Fiat: { src: fiatLogo, source: simpleIcons("fiat"), license: "CC0 1.0 (Simple Icons)" },
  Renault: { src: renaultLogo, source: simpleIcons("renault"), license: "CC0 1.0 (Simple Icons)" },
  Nissan: { src: nissanLogo, source: simpleIcons("nissan"), license: "CC0 1.0 (Simple Icons)" },
  Volkswagen: { src: volkswagenLogo, source: simpleIcons("volkswagen"), license: "CC0 1.0 (Simple Icons)" },
  Seat: { src: seatLogo, source: simpleIcons("seat"), license: "CC0 1.0 (Simple Icons)" },
  Skoda: { src: skodaLogo, source: simpleIcons("skoda"), license: "CC0 1.0 (Simple Icons)" },
  Toyota: { src: toyotaLogo, source: simpleIcons("toyota"), license: "CC0 1.0 (Simple Icons)" },
  Honda: { src: hondaLogo, source: simpleIcons("honda"), license: "CC0 1.0 (Simple Icons)" },
  Ford: { src: fordLogo, source: simpleIcons("ford"), license: "CC0 1.0 (Simple Icons)" },
  Iveco: { src: ivecoLogo, source: simpleIcons("iveco"), license: "CC0 1.0 (Simple Icons)" },
  Otokar: {
    src: otokarLogo,
    source: "https://commons.wikimedia.org/wiki/File:Otokar_logo.svg",
    license: "Public domain (Wikimedia Commons)",
  },
  Deutz: {
    src: deutzLogo,
    source: "https://commons.wikimedia.org/wiki/File:Deutz_Logo_2026.svg",
    license: "Public domain (Wikimedia Commons)",
  },
  Cummins: {
    src: cumminsLogo,
    source: "https://commons.wikimedia.org/wiki/File:Cummins_logo.svg",
    license: "Public domain (Wikimedia Commons)",
  },
};
