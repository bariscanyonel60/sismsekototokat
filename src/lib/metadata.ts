import type { Metadata } from "next";

import type { PageSeo } from "@/data/seo";
import { site } from "@/data/site";

const DEFAULT_OG_IMAGE = "/opengraph-image";

interface PageMetadataOptions {
  absoluteTitle?: boolean;
  /** Segmentin kendi `opengraph-image` dosyası varsa true; aksi halde metadata görseli dosyayı ezer. */
  ownOgImage?: boolean;
}

/**
 * Sayfa metadata'sı: benzersiz açıklama, canonical ve Open Graph / X kartı.
 * Next.js `openGraph` nesnesini üst seviyeyle birleştirmediği için site
 * genelindeki alanlar (siteName, locale, type) her sayfada yeniden verilir.
 */
export function buildPageMetadata(page: PageSeo, options: PageMetadataOptions = {}): Metadata {
  const socialTitle = page.socialTitle ?? `${page.title} | ${site.name}`;
  const socialDescription = page.socialDescription ?? page.description;
  const images = options.ownOgImage ? {} : { images: [DEFAULT_OG_IMAGE] };

  return {
    title: options.absoluteTitle ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: page.path },
    robots: page.index
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
      : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url: page.path,
      title: socialTitle,
      description: socialDescription,
      ...images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      ...images,
    },
  };
}
