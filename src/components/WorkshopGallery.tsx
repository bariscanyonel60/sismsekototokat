import Link from "next/link";

import { DevPreviewNote, isDevPreview } from "@/components/DevPreviewNote";
import { GalleryGrid, type GalleryView } from "@/components/GalleryGrid";
import { ArrowRight } from "@/components/icons";
import { SectionHeading } from "@/components/SectionHeading";
import { galleryIntro, galleryPlaceholders } from "@/data/gallery";
import { routes, sectionIds } from "@/data/navigation";
import { GALLERY_HOME_LIMIT, galleryPhotoSrc } from "@/lib/content/gallery";
import type { GalleryPhoto } from "@/lib/content/types";
import { delay } from "@/lib/cssVars";

const aspects = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[4/3]", "aspect-[4/5]", "aspect-square"];

export function toGalleryView(photo: GalleryPhoto): GalleryView {
  return {
    id: photo.id,
    src: galleryPhotoSrc(photo.file),
    width: photo.width,
    height: photo.height,
    blurDataURL: photo.blurDataURL,
    caption: photo.caption,
  };
}

export function hasGallery(photos: GalleryPhoto[]): boolean {
  return photos.length > 0 || isDevPreview;
}

/** Fotoğraf yüklenene kadar canlı sitede hiçbir şey göstermez. */
export function WorkshopGallery({ index, photos }: { index: string; photos: GalleryPhoto[] }) {
  if (!hasGallery(photos)) return null;
  const preview = photos.length === 0;

  return (
    <section id={sectionIds.gallery} aria-labelledby="galeri-baslik" className="section-y relative bg-white text-ink">
      <div className="container-x relative">
        <SectionHeading
          tone="light"
          id="galeri-baslik"
          index={index}
          eyebrow={galleryIntro.eyebrow}
          title={galleryIntro.title}
          description={galleryIntro.description}
        />

        {preview && <DevPreviewNote>Canlı sitede gizli; fotoğraflar yönetim panelinden (Galeri) yüklenince görünür.</DevPreviewNote>}

        <div className="mt-12 lg:mt-16">
          {preview ? (
            <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3 lg:gap-5">
              {galleryPlaceholders.map((caption, i) => (
                <li key={caption} className="mb-3 break-inside-avoid sm:mb-4 lg:mb-5" data-reveal style={delay(i % 3)}>
                  <div
                    className={`relative flex items-end border border-dashed border-ink/20 bg-bone-100 p-4 md:p-5 ${aspects[i % aspects.length]}`}
                  >
                    <span className="label-mono absolute right-4 top-4 text-steel-400 md:right-5 md:top-5" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-sm font-semibold uppercase tracking-[0.12em] text-steel-500 md:text-base">
                      {caption}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <GalleryGrid photos={photos.slice(0, GALLERY_HOME_LIMIT).map(toGalleryView)} />
          )}
        </div>

        {!preview && (
          <div className="mt-10 flex justify-center">
            <Link href={routes.gallery} className="btn btn-ghost">
              Tüm Galeri ({photos.length} fotoğraf)
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
