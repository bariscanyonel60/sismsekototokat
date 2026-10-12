import { notFound } from "next/navigation";

import { getPart, getPartCategory, parts } from "@/data/parts";
import { site } from "@/data/site";
import { ogSize, renderOgImage } from "@/lib/ogImage";

export const alt = `${site.name} yedek parça`;
export const size = ogSize;
export const contentType = "image/png";

const MAX_LINE_LENGTH = 16;

export function generateStaticParams() {
  return parts.map((part) => ({ slug: part.slug }));
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

export default async function PartOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const part = getPart(slug);
  if (!part) notFound();

  return renderOgImage({
    eyebrow: getPartCategory(part.category).title.toLocaleUpperCase("tr-TR"),
    lines: wrapTitle(part.title),
    footer: "450.000 HAZIR STOK • STOK VE FİYAT İÇİN WHATSAPP",
  });
}
