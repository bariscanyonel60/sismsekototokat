import { site } from "@/data/site";
import { ogSize, renderOgImage } from "@/lib/ogImage";

export const alt = `${site.name} — araç bakım, onarım ve yedek parça`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "BAKIM • ONARIM • YEDEK PARÇA",
    lines: ["ARACINIZ İÇİN", "PROFESYONEL", "BAKIM"],
    footer: "BİNEK • HAFİF TİCARİ • AĞIR VASITA • OTOBÜS",
  });
}
