import Image from "next/image";
import Link from "next/link";

import { FitmentChips } from "@/components/FitmentChips";
import { ArrowUpRight } from "@/components/icons";
import { partHref, partImage } from "@/lib/catalog/helpers";
import type { Catalog, Part } from "@/lib/catalog/types";

interface PartLinkCardProps {
  catalog: Catalog;
  part: Part;
  /** Kartın üstündeki küçük etiket (kategori veya alt kategori adı). */
  label?: string;
  /** İlk ekranda görünen kart; görsel LCP adayı olduğu için tembel yüklenmez. */
  preload?: boolean;
}

/** Sunucuda render edilen, taranabilir ürün kartı; kod ve ad bağlantı metninde yer alır. */
export function PartLinkCard({ catalog, part, label, preload = false }: PartLinkCardProps) {
  const image = partImage(catalog, part);
  return (
    <Link
      href={partHref(part.slug)}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-ink/10 bg-white transition-[box-shadow,border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_48px_-24px_rgb(26_31_37/0.35)]"
    >
      <span className="relative block aspect-square overflow-hidden bg-bone-300 sm:aspect-[4/3]">
        <Image
          src={image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          placeholder="blur"
          preload={preload}
          loading={preload ? "eager" : undefined}
          fetchPriority={preload ? "high" : undefined}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
      </span>
      <div className="flex flex-1 flex-col p-5">
        <span className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6rem] text-steel-500">
          <span>
            Ürün Kodu: <span className="text-ink">{part.code}</span>
          </span>
          {part.manufacturer && <span>{part.manufacturer}</span>}
          {label && <span>{label}</span>}
        </span>
        <h3 className="display mt-2 text-[1.5rem] leading-tight text-ink">{part.title}</h3>
        <FitmentChips part={part} className="mt-3 border-t border-ink/10 pt-3" />
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-ink group-hover:text-accent">
          Ürünü İncele
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
