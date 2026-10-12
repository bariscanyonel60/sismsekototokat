import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { pageSeo, seoKeywords, seoTitle } from "@/data/seo";
import { site } from "@/data/site";
import { buildPageMetadata } from "@/lib/metadata";

import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const homeMetadata = buildPageMetadata(pageSeo.home, { ownOgImage: true });

export const metadata: Metadata = {
  ...homeMetadata,
  metadataBase: new URL(site.url),
  title: {
    default: seoTitle,
    template: `%s | ${site.name}`,
  },
  keywords: seoKeywords,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: "Otomotiv Servis",
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#1a1f25",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tr" className={`${barlow.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
