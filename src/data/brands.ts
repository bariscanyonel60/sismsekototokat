export type BrandGroup = "passenger" | "commercial";

export interface Brand {
  name: string;
  /** Arama ve WhatsApp mesajlarında kullanılan sade yazım. */
  plain: string;
  group: BrandGroup;
}

export const brandsIntro = {
  eyebrow: "Markalar",
  title: "Birçok Markada Servis Deneyimi",
  description:
    "Binek araçtan otobüse, farklı markaların mekanik yapısına hâkim bir servis anlayışı. Listede yer almayan markalar için de bizimle iletişime geçebilirsiniz.",
  others: "ve diğer markalar",
  note: "Marka adları yalnızca hizmet verilen araçları belirtmek içindir; ilgili markaların yetkili servisi olduğumuz anlamına gelmez.",
};

export const brandGroupLabels: Record<BrandGroup, string> = {
  passenger: "Binek & Hafif Ticari",
  commercial: "Ticari & Otobüs",
};

export const brands: Brand[] = [
  { name: "Renault", plain: "Renault", group: "passenger" },
  { name: "Fiat", plain: "Fiat", group: "passenger" },
  { name: "Opel", plain: "Opel", group: "passenger" },
  { name: "Volkswagen", plain: "Volkswagen", group: "passenger" },
  { name: "BMW", plain: "BMW", group: "passenger" },
  { name: "Škoda", plain: "Skoda", group: "passenger" },
  { name: "IVECO", plain: "Iveco", group: "commercial" },
  { name: "ISUZU", plain: "Isuzu", group: "commercial" },
];

export function brandsByGroup(group: BrandGroup): Brand[] {
  return brands.filter((brand) => brand.group === group);
}
