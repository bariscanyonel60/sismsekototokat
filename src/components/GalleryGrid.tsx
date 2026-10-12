"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";

import { ArrowRight, CloseIcon } from "@/components/icons";
import { delay } from "@/lib/cssVars";

export interface GalleryView {
  id: string;
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  caption: string;
}

/** Masonry fotoğraf ızgarası; fotoğrafa tıklanınca tam ekran görünüm (ok tuşları, kaydırma, Esc). */
export function GalleryGrid({ photos }: { photos: GalleryView[] }) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const count = photos.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active !== null && !dialog.open) dialog.showModal();
    if (active === null && dialog.open) dialog.close();
    document.documentElement.style.overflow = active === null ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [active]);

  const step = (offset: number) => setActive((index) => (index === null ? null : (index + offset + count) % count));
  const photo = active === null ? undefined : photos[active];

  const onTouchEnd = (event: TouchEvent) => {
    const start = touchX.current;
    touchX.current = null;
    if (start === null) return;
    const dx = event.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  return (
    <>
      <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3 lg:gap-5">
        {photos.map((item, i) => (
          <li key={item.id} className="mb-3 break-inside-avoid sm:mb-4 lg:mb-5" data-reveal style={delay(i % 3)}>
            <figure>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${item.caption} – büyüt`}
                className="group relative block w-full overflow-hidden bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  width={item.width}
                  height={item.height}
                  placeholder="blur"
                  blurDataURL={item.blurDataURL}
                  sizes="(min-width:1024px) 33vw, 50vw"
                  className="h-auto w-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]"
                />
                <figcaption className="label-mono absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgb(26_31_37/0.85))] px-4 pb-3 pt-10 text-left text-[0.65rem] text-bone md:px-5 md:pb-4">
                  {item.caption}
                </figcaption>
              </button>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Fotoğraf görüntüleyici"
        onClose={() => setActive(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
          if (event.key === "Escape") {
            event.preventDefault();
            setActive(null);
          }
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none bg-ink/95 p-0 text-bone backdrop:bg-ink/80"
      >
        {photo && (
          <div
            className="flex h-full flex-col"
            onClick={(event) => {
              if (event.target === event.currentTarget) setActive(null);
            }}
            onTouchStart={(event) => {
              touchX.current = event.touches[0].clientX;
            }}
            onTouchEnd={onTouchEnd}
          >
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
              <span className="label-mono text-[0.68rem] text-steel-400" aria-live="polite">
                {(active ?? 0) + 1} / {count}
              </span>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Kapat"
                className="inline-flex size-11 items-center justify-center rounded-full text-bone transition-colors hover:bg-white/10"
              >
                <CloseIcon size={22} />
              </button>
            </div>
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20"
              onClick={(event) => {
                if (event.target === event.currentTarget) setActive(null);
              }}
            >
              <Image
                key={photo.id}
                src={photo.src}
                alt={photo.caption}
                width={photo.width}
                height={photo.height}
                placeholder="blur"
                blurDataURL={photo.blurDataURL}
                sizes="100vw"
                className="h-auto max-h-full w-auto max-w-full object-contain"
              />
              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Önceki fotoğraf"
                    className="absolute left-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-bone transition-colors hover:bg-accent md:left-5"
                  >
                    <ArrowRight size={20} className="rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Sonraki fotoğraf"
                    className="absolute right-2 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-bone transition-colors hover:bg-accent md:right-5"
                  >
                    <ArrowRight size={20} />
                  </button>
                </>
              )}
            </div>
            <p className="px-4 py-4 text-center text-sm text-bone/90 md:px-6 md:py-5">{photo.caption}</p>
          </div>
        )}
      </dialog>
    </>
  );
}
