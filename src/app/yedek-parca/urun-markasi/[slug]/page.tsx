import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PartListing, type PartGroup } from "@/components/PartListing";
import { partsIntro } from "@/data/parts";
import { catalogManufacturers, findManufacturer, partManufacturerHref } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";
import { buildPageMetadata, fitDescription } from "@/lib/metadata";

interface ManufacturerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return catalogManufacturers(await getCatalog()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ManufacturerPageProps): Promise<Metadata> {
  const catalog = await getCatalog();
  const manufacturer = findManufacturer(catalog, (await params).slug);
  if (!manufacturer) return {};
  const parts = catalog.parts.filter((part) => part.manufacturer === manufacturer.name);
  const codes = parts.slice(0, 4).map((part) => part.code);

  return buildPageMetadata({
    title: `${manufacturer.name} Yedek Parça Ürünleri`,
    description: fitDescription(
      `${manufacturer.name} marka ${parts.length} yedek parça: ${codes.join(", ")}. Ürün kodu veya OEM numarasıyla stok ve fiyat sorun.`,
    ),
    socialTitle: `${manufacturer.name} Yedek Parça | Şimşek Oto`,
    path: partManufacturerHref(manufacturer.name),
    index: true,
  });
}

export default async function ManufacturerPage({ params }: ManufacturerPageProps) {
  const catalog = await getCatalog();
  const manufacturer = findManufacturer(catalog, (await params).slug);
  if (!manufacturer) notFound();

  const parts = catalog.parts.filter((part) => part.manufacturer === manufacturer.name);
  const groups: PartGroup[] = catalog.categories.map((category) => ({
    id: category.id,
    title: category.title,
    parts: parts.filter((part) => part.category === category.id),
  }));

  return (
    <PartListing
      catalog={catalog}
      path={partManufacturerHref(manufacturer.name)}
      heading={`${manufacturer.name} Yedek Parça Ürünleri`}
      eyebrow="Ürün Markası"
      intro={[
        `Kataloğumuzdaki ${manufacturer.name} marka parçalar. Aradığınız ürün listede yoksa ürün kodu veya OEM numarasıyla WhatsApp'tan sorun; ${partsIntro.stock.value} hazır stoktan kontrol edelim.`,
      ]}
      groups={groups}
      related={[
        {
          id: "diger-urun-markalari",
          title: "Diğer Ürün Markaları",
          links: catalogManufacturers(catalog)
            .filter((item) => item.slug !== manufacturer.slug)
            .map((item) => ({ href: partManufacturerHref(item.name), label: item.name, meta: `${item.count} ürün` })),
        },
      ]}
      contactContext={{ kind: "part", part: `${manufacturer.name} yedek parça` }}
    />
  );
}
