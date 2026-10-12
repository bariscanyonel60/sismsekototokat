import Image from "next/image";
import Link from "next/link";

import { AddToCart } from "@/components/AddToCart";
import { FitmentChips } from "@/components/FitmentChips";
import { ArrowRight } from "@/components/icons";
import { qualityLabels } from "@/data/parts";
import type { SiteImage } from "@/data/images";
import { partHref } from "@/lib/catalog/helpers";
import type { Part } from "@/lib/catalog/types";

interface PartCardProps {
  part: Part;
  image: SiteImage;
  categoryLabel: string;
  /** İlk satırdaki kartlar için görsel önceliği. */
  priority?: boolean;
}

/** Katalog kartı: görsel → kategori → ad → ürün / OEM kodu → uygun araçlar → teklif listesi. */
export function PartCard({ part, image, categoryLabel, priority = false }: PartCardProps) {
  const [firstOem, ...otherOems] = part.oemCodes ?? [];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-ink/10 bg-white transition-colors duration-300 hover:border-ink/30">
      <Link
        href={partHref(part.slug)}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-square overflow-hidden bg-bone-300 sm:aspect-[4/3]"
      >
        <Image
          src={image.src}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 26vw, (min-width: 640px) 45vw, 100vw"
          placeholder="blur"
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
        />
        {part.qualities.length > 0 && (
          <span className="absolute right-3 top-3 flex gap-1">
            {part.qualities.map((quality) => (
              <span
                key={quality}
                className={`label-mono rounded-xs px-1.5 py-1 text-[0.55rem] ${
                  quality === "orijinal" ? "bg-accent text-white" : "bg-ink text-bone"
                }`}
              >
                {qualityLabels[quality]}
              </span>
            ))}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="label-mono flex items-center gap-2 text-[0.6rem] text-steel-500">
          <span className="h-px w-4 bg-accent" aria-hidden />
          <span className="truncate">{categoryLabel}</span>
          {part.manufacturer && <span className="ml-auto shrink-0 text-ink">{part.manufacturer}</span>}
        </p>
        <h3 className="mt-2 font-display text-[1.25rem] font-bold uppercase leading-tight tracking-[0.03em] text-ink sm:text-[1.3rem]">
          <Link href={partHref(part.slug)} className="transition-colors hover:text-accent">
            {part.title}
          </Link>
        </h3>
        <dl className="mt-2 grid gap-0.5 text-[0.8rem]">
          <div className="flex gap-1.5">
            <dt className="text-steel-500">Ürün Kodu:</dt>
            <dd className="font-mono font-semibold text-ink">{part.code}</dd>
          </div>
          {firstOem && (
            <div className="flex min-w-0 gap-1.5">
              <dt className="shrink-0 text-steel-500">OEM:</dt>
              <dd className="truncate font-mono text-ink">
                {firstOem}
                {otherOems.length > 0 && <span className="text-steel-500"> +{otherOems.length}</span>}
              </dd>
            </div>
          )}
        </dl>

        <FitmentChips part={part} className="mt-4 border-t border-ink/10 pt-3" />

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-4">
          <AddToCart slug={part.slug} title={part.title} />
          <Link
            href={partHref(part.slug)}
            aria-label={`Detay: ${part.title}`}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-sm border border-ink/15 px-3.5 text-[0.8rem] font-semibold text-ink transition-colors hover:border-ink"
          >
            Detay
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
