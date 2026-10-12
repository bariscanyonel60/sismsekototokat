import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/Breadcrumb";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ArrowRight } from "@/components/icons";
import { SiteShell } from "@/components/SiteShell";
import { toGalleryView } from "@/components/WorkshopGallery";
import { galleryIntro } from "@/data/gallery";
import { ctaLabels, homeContactHref } from "@/data/navigation";
import { pageSeo } from "@/data/seo";
import { getGallery } from "@/lib/content/store";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata(pageSeo.gallery);

/** Panelden yüklenen tüm atölye fotoğrafları; fotoğraf yokken sayfa yoktur (404). */
export default async function GalleryPage() {
  const { photos } = await getGallery();
  if (photos.length === 0) notFound();

  return (
    <SiteShell currentPath={pageSeo.gallery.path}>
      <div className="container-x relative pb-14 pt-[calc(var(--header-h)+var(--topbar-h)+48px)] md:pb-20">
        <Breadcrumb items={[{ label: "Galeri", href: pageSeo.gallery.path }]} />
        <header className="mt-14 max-w-4xl">
          <p className="eyebrow text-bone">{galleryIntro.eyebrow}</p>
          <h1 className="heading-xl mt-6">{galleryIntro.title}</h1>
          <p className="lede mt-6 text-steel-300">{galleryIntro.description}</p>
          <p className="label-mono mt-6 text-[0.68rem] text-steel-400">{photos.length} fotoğraf</p>
        </header>
      </div>

      <section aria-label="Atölye fotoğrafları" className="bg-white py-14 text-ink md:py-20">
        <div className="container-x">
          <GalleryGrid photos={photos.map(toGalleryView)} />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link href={homeContactHref} className="btn btn-primary">
              {ctaLabels.primaryLong}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
