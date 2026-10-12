import { site } from "@/data/site";
import { ogSize, renderOgImage } from "@/lib/ogImage";

export const alt = `${site.name} — 450.000 hazır stok yedek parça`;
export const size = ogSize;
export const contentType = "image/png";

export default function PartsOpengraphImage() {
  return renderOgImage({
    eyebrow: "YEDEK PARÇA",
    lines: ["450.000", "HAZIR STOK", "YEDEK PARÇA"],
    footer: "SANDIK MOTOR • MOTOR YAĞI • FİLTRE SETİ • ÖN TAKIM",
  });
}
