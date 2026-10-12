"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useRef, useState, type ComponentType } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  CloseIcon,
  EngineIcon,
  FilterIcon,
  OilIcon,
  SearchIcon,
  SuspensionIcon,
} from "@/components/icons";
import { brands, segmentLabels, type Brand, type VehicleSegment } from "@/data/brands";
import { ctaLabels } from "@/data/navigation";
import {
  partCategories,
  partHref,
  parts,
  partsIntro,
  qualityLabels,
  type Part,
  type PartCategory,
  type PartCategoryId,
  type PartQuality,
} from "@/data/parts";
import { contactHref, isExternalHref } from "@/lib/contact";
import { cssVars } from "@/lib/cssVars";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

const categoryIcons: Record<PartCategoryId, IconComponent> = {
  "sandik-motor": EngineIcon,
  "motor-yaglari": OilIcon,
  "filtre-setleri": FilterIcon,
  "on-takim": SuspensionIcon,
};

const categoryById = Object.fromEntries(partCategories.map((c) => [c.id, c])) as Record<
  PartCategoryId,
  PartCategory
>;

const categoryTitles = Object.fromEntries(partCategories.map((c) => [c.id, c.title])) as Record<
  PartCategoryId,
  string
>;

const segments = Object.keys(segmentLabels) as VehicleSegment[];
const qualities = Object.keys(qualityLabels) as PartQuality[];

interface Filters {
  query: string;
  category: PartCategoryId | null;
  segment: VehicleSegment | null;
  brand: Brand | null;
  quality: PartQuality | null;
}

const EMPTY_FILTERS: Filters = { query: "", category: null, segment: null, brand: null, quality: null };

const TR_FOLD: Record<string, string> = { ı: "i", ş: "s", ğ: "g", ü: "u", ö: "o", ç: "c" };

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/[ışğüöç]/g, (char) => TR_FOLD[char] ?? char)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const searchIndex = new Map(
  parts.map((part) => [
    part.slug,
    normalize([part.title, part.description, categoryTitles[part.category], ...part.keywords].join(" ")),
  ]),
);

function matches(part: Part, filters: Filters, ignoreCategory = false): boolean {
  if (!ignoreCategory && filters.category && part.category !== filters.category) return false;
  if (filters.segment && !part.segments.includes(filters.segment)) return false;
  if (filters.quality && !part.qualities.includes(filters.quality)) return false;
  const terms = normalize(filters.query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = searchIndex.get(part.slug) ?? "";
  return terms.every((term) => haystack.includes(term));
}

const chipBase = "border transition-colors duration-300";
const chipIdle = "border-ink/15 bg-white text-steel-700 hover:border-ink/40 hover:text-ink";
const chipActive = "border-amber bg-amber text-ink";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`label-mono h-10 whitespace-nowrap px-3.5 text-[0.68rem] ${chipBase} ${active ? chipActive : chipIdle}`}
    >
      {children}
    </button>
  );
}

function PartCard({ part, brand, index }: { part: Part; brand: Brand | null; index: number }) {
  const href = contactHref({ kind: "part", part: part.title, brand: brand?.plain });
  const external = isExternalHref(href);
  const category = categoryById[part.category];
  const image = part.image ?? category.image;

  return (
    <li className="part-card" style={cssVars({ "--i": Math.min(index, 8) })}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-md border border-ink/10 bg-white shadow-[0_1px_2px_rgb(26_31_37/0.05)] transition-[box-shadow,border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_48px_-24px_rgb(26_31_37/0.35)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-bone-300">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            placeholder="blur"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
          />
          <span className="label-mono absolute left-3 top-3 rounded-sm bg-white/90 px-2.5 py-1 text-[0.6rem] text-ink shadow-sm backdrop-blur md:left-4 md:top-4">
            {category.title}
          </span>
          {part.qualities.length > 0 && (
            <ul className="absolute right-3 top-3 flex gap-1.5 md:right-4 md:top-4" aria-label="Parça seçenekleri">
              {part.qualities.map((quality) => (
                <li
                  key={quality}
                  className={`label-mono rounded-sm px-2 py-1 text-[0.6rem] shadow-sm ${
                    quality === "orijinal" ? "bg-amber text-ink" : "bg-ink/85 text-bone backdrop-blur"
                  }`}
                >
                  {qualityLabels[quality]}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <h3 className="display text-[clamp(1.5rem,2vw,1.9rem)] text-ink">
            <Link
              href={partHref(part.slug)}
              className="after:absolute after:inset-0 after:z-[1] decoration-amber decoration-2 underline-offset-4 group-hover:underline"
            >
              {part.title}
            </Link>
          </h3>
          <p className="mt-2.5 flex-1 text-[0.93rem] leading-relaxed text-steel-700">{part.description}</p>

          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Uygun araç grupları">
            {part.segments.map((segment) => (
              <li key={segment} className="label-mono rounded-sm bg-bone-300/70 px-2 py-1 text-[0.58rem] text-steel-700">
                {segmentLabels[segment]}
              </li>
            ))}
          </ul>

          <div className="relative z-[2] mt-5 grid grid-cols-2 gap-2">
            <Link
              href={partHref(part.slug)}
              className="link-arrow justify-between rounded-sm border border-ink/15 px-4 py-3 text-[0.8rem] text-ink transition-colors duration-300 hover:border-ink"
            >
              İncele
              <ArrowRight size={16} />
            </Link>
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              aria-label={`${part.title}${brand ? ` (${brand.plain})` : ""} için stok ve fiyat sor`}
              className="link-arrow justify-between rounded-sm bg-amber px-4 py-3 text-[0.8rem] text-ink transition-colors duration-300 hover:bg-ink hover:text-bone"
            >
              Fiyat Sor
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </article>
    </li>
  );
}

export function PartsCatalog() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const searchId = useId();
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => parts.filter((part) => matches(part, filters)), [filters]);
  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        partCategories.map((category) => [
          category.id,
          parts.filter((part) => part.category === category.id && matches(part, filters, true)).length,
        ]),
      ) as Record<PartCategoryId, number>,
    [filters],
  );

  const update = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }));

  const setSegment = (segment: VehicleSegment | null) =>
    setFilters((current) => ({
      ...current,
      segment,
      brand: current.brand && segment && current.brand.segment !== segment ? null : current.brand,
    }));

  const setBrand = (brand: Brand | null) =>
    setFilters((current) => ({ ...current, brand, segment: brand ? brand.segment : current.segment }));

  const revealResults = () => {
    const el = resultsRef.current;
    if (!el) return;
    const { top } = el.getBoundingClientRect();
    if (top > window.innerHeight * 0.55 || top < 0) el.scrollIntoView({ block: "start" });
  };

  const activeChips = [
    filters.query.trim() && { key: "query", label: `“${filters.query.trim()}”`, clear: () => update({ query: "" }) },
    filters.category && {
      key: "category",
      label: categoryTitles[filters.category],
      clear: () => update({ category: null }),
    },
    filters.brand && { key: "brand", label: filters.brand.name, clear: () => update({ brand: null }) },
    filters.segment && {
      key: "segment",
      label: segmentLabels[filters.segment],
      clear: () => setSegment(null),
    },
    filters.quality && {
      key: "quality",
      label: qualityLabels[filters.quality],
      clear: () => update({ quality: null }),
    },
  ].filter((chip): chip is { key: string; label: string; clear: () => void } => Boolean(chip));

  const fallbackHref = contactHref({
    kind: "part",
    part: filters.query.trim() || "yedek parça",
    brand: filters.brand?.plain,
  });

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Parça kategorileri">
        {partCategories.map((category) => {
          const Icon = categoryIcons[category.id];
          const active = filters.category === category.id;
          return (
            <li key={category.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => {
                  update({ category: active ? null : category.id });
                  revealResults();
                }}
                className={`group relative flex h-full w-full items-center gap-3 overflow-hidden rounded-md border p-3.5 text-left transition-[border-color,box-shadow] duration-500 md:gap-4 md:p-5 ${
                  active
                    ? "border-ink bg-white shadow-[0_12px_32px_-18px_rgb(26_31_37/0.4)]"
                    : "border-ink/10 bg-white hover:border-ink/30"
                }`}
              >
                <span
                  className={`absolute left-0 top-0 h-1 bg-amber transition-[width] duration-700 ease-out-expo ${
                    active ? "w-full" : "w-0 group-hover:w-1/3"
                  }`}
                />
                <span
                  className={`inline-flex size-10 shrink-0 items-center justify-center rounded-sm transition-colors duration-500 md:size-12 ${
                    active ? "bg-amber text-ink" : "bg-bone-300/70 text-ink group-hover:bg-amber"
                  }`}
                >
                  <Icon size={22} />
                </span>
                <span className="min-w-0">
                  <span className="display block text-[clamp(1rem,1.6vw,1.45rem)] leading-tight text-ink">{category.title}</span>
                  <span className="label-mono mt-1 block text-[0.6rem] text-steel-500">
                    {categoryCounts[category.id]} ürün
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-md border border-ink/10 bg-white p-4 md:p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="label-mono text-[0.65rem] text-ink">Markanızı seçin</p>
          {filters.brand && (
            <button
              type="button"
              onClick={() => update({ brand: null })}
              className="label-mono text-[0.6rem] text-steel-700 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Tüm Markalar
            </button>
          )}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_auto_1.6fr] lg:gap-6">
          {segments.map((segment) => (
            <fieldset key={segment} className="min-w-0">
              <legend className="label-mono mb-2.5 text-[0.6rem] text-steel-500">{segmentLabels[segment]}</legend>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
                {brands
                  .filter((brand) => brand.segment === segment)
                  .map((brand) => {
                    const active = filters.brand?.plain === brand.plain;
                    return (
                      <button
                        key={brand.plain}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setBrand(active ? null : brand);
                          revealResults();
                        }}
                        className={`h-10 shrink-0 whitespace-nowrap rounded-sm px-3.5 font-display text-[0.95rem] font-semibold uppercase tracking-[0.08em] ${chipBase} ${
                          active ? chipActive : chipIdle
                        }`}
                      >
                        {brand.name}
                        {brand.note && (
                          <span
                            className={`ml-2 font-sans text-[0.68rem] font-normal normal-case tracking-normal ${
                              active ? "text-ink/70" : "text-steel-500"
                            }`}
                          >
                            {brand.note}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      <div className="z-30 -mx-[var(--gutter)] mt-6 border-y border-ink/10 bg-bone-100/90 px-[var(--gutter)] py-4 backdrop-blur-xl backdrop-saturate-150 lg:sticky lg:top-[var(--header-h)] lg:mx-0 lg:rounded-md lg:border-x lg:px-5">
        <div className="relative">
          <label htmlFor={searchId} className="sr-only">
            Parça ara
          </label>
          <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-500" />
          <input
            id={searchId}
            type="search"
            value={filters.query}
            onChange={(event) => update({ query: event.target.value })}
            placeholder="Parça ara: rotil, yağ filtresi, 5W-30, sandık motor…"
            autoComplete="off"
            className="h-11 w-full rounded-sm border border-ink/15 bg-white pl-10 pr-3 text-[0.95rem] text-ink placeholder:text-steel-500 outline-none transition-colors focus:border-amber"
          />
        </div>

        <div className="mt-3 flex gap-6 overflow-x-auto [scrollbar-width:none] md:mt-4">
          <fieldset className="flex shrink-0 items-center gap-2">
            <legend className="sr-only">Araç grubu</legend>
            <span aria-hidden className="label-mono mr-2 hidden text-[0.62rem] text-steel-500 lg:inline">
              Araç Grubu
            </span>
            <Chip active={filters.segment === null} onClick={() => setSegment(null)}>
              Tüm Araçlar
            </Chip>
            {segments.map((segment) => (
              <Chip key={segment} active={filters.segment === segment} onClick={() => setSegment(segment)}>
                {segmentLabels[segment]}
              </Chip>
            ))}
          </fieldset>

          <span className="w-px shrink-0 self-stretch bg-ink/10" aria-hidden />

          <fieldset className="flex shrink-0 items-center gap-2">
            <legend className="sr-only">Parça türü</legend>
            <span aria-hidden className="label-mono mr-2 hidden text-[0.62rem] text-steel-500 lg:inline">
              Parça Türü
            </span>
            {qualities.map((quality) => (
              <Chip
                key={quality}
                active={filters.quality === quality}
                onClick={() => update({ quality: filters.quality === quality ? null : quality })}
              >
                {qualityLabels[quality]}
              </Chip>
            ))}
          </fieldset>
        </div>
      </div>

      <div
        ref={resultsRef}
        className="mt-8 flex scroll-mt-[calc(var(--header-h)+1rem)] flex-col gap-4 md:flex-row md:items-center md:justify-between lg:scroll-mt-[calc(var(--header-h)+10rem)]"
      >
        <p className="label-mono text-steel-700" role="status" aria-live="polite">
          <span className="text-ink">{String(results.length).padStart(2, "0")}</span>
          <span className="mx-2 text-steel-500">/</span>
          {String(parts.length).padStart(2, "0")} ürün listeleniyor
        </p>
        {activeChips.length > 0 && (
          <ul className="flex flex-wrap items-center gap-2" aria-label="Aktif filtreler">
            {activeChips.map((chip) => (
              <li key={chip.key}>
                <button
                  type="button"
                  onClick={chip.clear}
                  aria-label={`${chip.label} filtresini kaldır`}
                  className="label-mono inline-flex h-8 items-center gap-2 rounded-sm border border-ink/20 bg-white px-2.5 text-[0.62rem] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone"
                >
                  {chip.label}
                  <CloseIcon size={12} />
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="label-mono h-8 px-2 text-[0.62rem] text-steel-700 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Tümünü Temizle
              </button>
            </li>
          </ul>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((part, index) => (
            <PartCard key={part.slug} part={part} brand={filters.brand} index={index} />
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col items-start gap-6 rounded-md border border-dashed border-ink/20 bg-white p-8 md:p-12">
          <p className="display text-[clamp(1.8rem,3vw,2.6rem)] text-ink">
            Bu filtrelerle eşleşen ürün yok<span className="text-amber">.</span>
          </p>
          <p className="max-w-xl text-steel-700">
            Aradığınız parça listede olmayabilir ama stokta bulunabilir. Filtreleri temizleyin ya da parçayı doğrudan
            sorun.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="btn btn-dark btn-sm">
              Filtreleri Temizle
            </button>
            <a
              href={fallbackHref}
              {...(isExternalHref(fallbackHref) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="btn btn-primary btn-sm"
            >
              {ctaLabels.partInquiry}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}

      <p className="mt-10 max-w-3xl text-sm leading-relaxed text-steel-700">{partsIntro.note}</p>
    </div>
  );
}
