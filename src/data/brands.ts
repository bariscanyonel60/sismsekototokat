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
  { name: "Fiat", plain: "Fiat", group: "passenger", segment: "binek" },
  { name: "Renault", plain: "Renault", group: "passenger", segment: "binek" },
  { name: "Nissan", plain: "Nissan", group: "passenger", segment: "binek" },
  { name: "Volkswagen", plain: "Volkswagen", group: "passenger", segment: "binek" },
  { name: "Seat", plain: "Seat", group: "passenger", segment: "binek" },
  { name: "Škoda", plain: "Skoda", group: "passenger", segment: "binek" },
  { name: "Toyota", plain: "Toyota", group: "passenger", segment: "binek" },
  { name: "Honda", plain: "Honda", group: "passenger", segment: "binek" },
  { name: "Ford", plain: "Ford", group: "passenger", segment: "hafif-ticari", note: "Transit · Connect" },
  { name: "Otokar", plain: "Otokar", group: "commercial", segment: "agir-vasita", note: "Otobüs" },
  { name: "IVECO", plain: "Iveco", group: "commercial", segment: "agir-vasita" },
  { name: "Deutz", plain: "Deutz", group: "commercial", segment: "agir-vasita", note: "Motor" },
  { name: "Cummins", plain: "Cummins", group: "commercial", segment: "agir-vasita", note: "Motor" },
];

export function brandsByGroup(group: BrandGroup): Brand[] {
  return brands.filter((brand) => brand.group === group);
}
