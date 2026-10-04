import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/data/site";

export const alt = `${site.name} — ${site.slogans.care}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const assets = join(process.cwd(), "src/assets");
  const [font, background] = await Promise.all([
    readFile(join(assets, "fonts/BarlowCondensed-Bold.ttf")),
    readFile(join(assets, "og/og-background.jpg")),
  ]);
  const backgroundSrc = `data:image/jpeg;base64,${background.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "Barlow" }}>
        <img src={backgroundSrc} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(13,15,17,0.96) 0%, rgba(13,15,17,0.82) 45%, rgba(13,15,17,0.2) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#f2f1ec", fontSize: 24, letterSpacing: 5 }}>
            <div style={{ width: 36, height: 3, background: "#ffc21a" }} />
            {`${site.wordmark} • PROFESYONEL SERVİS`}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28, color: "#f2f1ec", fontSize: 104, lineHeight: 0.9 }}>
            <span>ARACINIZ İÇİN</span>
            <span>PROFESYONEL</span>
            <span style={{ display: "flex" }}>
              BAKIM<span style={{ color: "#ffc21a" }}>.</span>
            </span>
          </div>
          <div style={{ marginTop: 32, color: "#cdd1d5", fontSize: 30, letterSpacing: 2 }}>
            OTOMOBİL • HAFİF TİCARİ • OTOBÜS • MOTOR & MEKANİK
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Barlow", data: font, weight: 700, style: "normal" }],
    },
  );
}
