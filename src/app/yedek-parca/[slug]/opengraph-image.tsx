import { notFound } from "next/navigation";

import { brands } from "@/data/brands";
import { site } from "@/data/site";
import { brandSlug } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";
import { ogSize, renderOgImage } from "@/lib/ogImage";
import { resolveCatalogSlug } from "@/lib/seo/catalog";
import { brandHeading, categoryNoun } from "@/lib/seo/copy";

export const alt = `${site.name} yedek parça`;
export const size = ogSize;
export const contentType = "image/png";

const MAX_LINE_LENGTH = 16;
const FOOTER = "450.000 HAZIR STOK • STOK VE FİYAT İÇİN WHATSAPP";

export async function generateStaticParams() {
  const { categories, parts } = await getCatalog();
  return [
    ...brands.map((brand) => ({ slug: brandSlug(brand) })),
    ...categories.map((category) => ({ slug: category.id })),
    ...parts.map((part) => ({ slug: part.slug })),
  ];
}

function wrapTitle(title: string): string[] {
  const lines: string[] = [];
  for (const word of title.toLocaleUpperCase("tr-TR").split(" ")) {
    const current = lines.at(-1);
    if (current && `${current} ${word}`.length <= MAX_LINE_LENGTH) lines[lines.length - 1] = `${current} ${word}`;
    else lines.push(word);
  }
  return lines.slice(0, 3);
}

export default async function CatalogOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const catalog = await getCatalog();
  const route = resolveCatalogSlug(catalog, (await params).slug);
  if (!route) notFound();

  switch (route.kind) {
    case "brand":
      return renderOgImage({ eyebrow: "MARKA", lines: wrapTitle(brandHeading(route.brand)), footer: FOOTER });
    case "category":
      return renderOgImage({ eyebrow: "OTO YEDEK PARÇA", lines: wrapTitle(categoryNoun(route.category)), footer: FOOTER });
    case "part":
      return renderOgImage({
        eyebrow: route.category.title.toLocaleUpperCase("tr-TR"),
        lines: wrapTitle(route.part.title),
        footer: FOOTER,
      });
    default: {
      const unreachable: never = route;
      return unreachable;
    }
  }
}
