export type BrandGroup = "passenger" | "commercial";

/** Yedek parça filtrelerinde kullanılan araç sınıfı. */
export type VehicleSegment = "binek" | "hafif-ticari" | "agir-vasita";

export interface Brand {
  name: string;
  /** Arama ve WhatsApp mesajlarında kullanılan sade yazım. */
  plain: string;
  group: BrandGroup;
  segment: VehicleSegment;
  /** Öne çıkan model ya da motor bilgisi, örn. "Transit · Connect". */
  note?: string;
  /** Ürün kodlarında kullanılan kısaltma, örn. SO-FIA-BKM. */
  code: string;
  /** Araç değil motor üreticisi; ürün kartındaki "Uygun Araçlar" listesine yazılmaz. */
  engineMaker?: boolean;
}

export const brandsIntro = {
  eyebrow: "Markalar",
  title: "Her Türlü Araca Uygun Servis",
  description:
    "Binek araçtan hafif ticariye, ağır vasıtadan otobüse; farklı markaların mekanik ve elektronik yapısına hâkim bir servis anlayışı. Listede yer almayan markalar için de bizimle iletişime geçebilirsiniz.",
  others: "ve her türlü araç",
  note: "Marka adları yalnızca hizmet verilen araçları belirtmek içindir; ilgili markaların yetkili servisi olduğumuz anlamına gelmez.",
};

export const brandGroupLabels: Record<BrandGroup, string> = {
  passenger: "Binek & Hafif Ticari",
  commercial: "Ağır Vasıta & Otobüs",
};

export const segmentLabels: Record<VehicleSegment, string> = {
  binek: "Binek",
  "hafif-ticari": "Hafif Ticari",
  "agir-vasita": "Ağır Vasıta & Otobüs",
};

export const brands: Brand[] = [
  { name: "Fiat", plain: "Fiat", group: "passenger", segment: "binek", code: "FIA" },
  { name: "Renault", plain: "Renault", group: "passenger", segment: "binek", code: "REN" },
  { name: "Nissan", plain: "Nissan", group: "passenger", segment: "binek", code: "NIS" },
  { name: "Volkswagen", plain: "Volkswagen", group: "passenger", segment: "binek", code: "VWG" },
  { name: "Seat", plain: "Seat", group: "passenger", segment: "binek", code: "SEA" },
  { name: "Škoda", plain: "Skoda", group: "passenger", segment: "binek", code: "SKO" },
  { name: "Toyota", plain: "Toyota", group: "passenger", segment: "binek", code: "TOY" },
  { name: "Honda", plain: "Honda", group: "passenger", segment: "binek", code: "HON" },
  { name: "Ford", plain: "Ford", group: "passenger", segment: "hafif-ticari", note: "Transit · Connect", code: "FRD" },
  { name: "Otokar", plain: "Otokar", group: "commercial", segment: "agir-vasita", note: "Otobüs", code: "OTK" },
  { name: "IVECO", plain: "Iveco", group: "commercial", segment: "agir-vasita", code: "IVE" },
  { name: "Deutz", plain: "Deutz", group: "commercial", segment: "agir-vasita", note: "Motor", code: "DEU", engineMaker: true },
  { name: "Cummins", plain: "Cummins", group: "commercial", segment: "agir-vasita", note: "Motor", code: "CUM", engineMaker: true },
];

export function brandsByGroup(group: BrandGroup): Brand[] {
  return brands.filter((brand) => brand.group === group);
}
