import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/data/site";

export const ogSize = { width: 1200, height: 630 };

interface OgImageOptions {
  eyebrow: string;
  /** Son satırın sonuna sarı nokta eklenir. */
  lines: string[];
  footer: string;
}

/** Sosyal medya paylaşım görseli (1200×630); sayfalar yalnızca metni değiştirir. */
export async function renderOgImage({ eyebrow, lines, footer }: OgImageOptions): Promise<ImageResponse> {
  const assets = join(process.cwd(), "src/assets");
  const [font, background] = await Promise.all([
    readFile(join(assets, "fonts/BarlowCondensed-Bold.ttf")),
    readFile(join(assets, "og/og-background.jpg")),
  ]);
  const backgroundSrc = `data:image/jpeg;base64,${background.toString("base64")}`;
  const last = lines.length - 1;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Barlow" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (Satori) yalnızca <img> destekler */}
        <img src={backgroundSrc} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0 }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "linear-gradient(90deg, rgba(13,15,17,0.96) 0%, rgba(13,15,17,0.82) 45%, rgba(13,15,17,0.2) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#f2f1ec", fontSize: 24, letterSpacing: 5 }}>
            <div style={{ width: 36, height: 3, background: "#ffc21a" }} />
            {`${site.wordmark} • ${eyebrow}`}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28, color: "#f2f1ec", fontSize: 104, lineHeight: 0.9 }}>
            {lines.map((line, index) =>
              index === last ? (
                <span key={line} style={{ display: "flex" }}>
                  {line}
                  <span style={{ color: "#ffc21a" }}>.</span>
                </span>
              ) : (
                <span key={line}>{line}</span>
              ),
            )}
          </div>
          <div style={{ marginTop: 32, color: "#cdd1d5", fontSize: 30, letterSpacing: 2 }}>{footer}</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [{ name: "Barlow", data: font, weight: 700, style: "normal" }],
    },
  );
}
