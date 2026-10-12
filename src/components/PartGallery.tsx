"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import type { SiteImage } from "@/data/images";

/** Ürün görseli; birden fazla görsel varsa küçük resimlerle değiştirilir. */
export function PartGallery({ images, title, children }: { images: SiteImage[]; title: string; children?: ReactNode }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-ink/10 bg-white">
        <Image
          key={active}
          src={current.src}
          alt={current.alt}
          fill
          priority={active === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          placeholder="blur"
          className="object-cover"
        />
        {children}
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5" aria-label={`${title} görselleri`}>
          {images.map((image, index) => (
            <li key={`${image.source}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${index + 1}. görseli göster`}
                aria-current={index === active ? "true" : undefined}
                className={`relative block aspect-square w-full overflow-hidden rounded-xs border-2 bg-white transition-colors ${
                  index === active ? "border-accent" : "border-transparent hover:border-ink/30"
                }`}
              >
                <Image src={image.src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
