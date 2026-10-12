"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";

import { ArrowRight, ArrowUpRight, ChevronRight, CloseIcon, FilterIcon, SearchIcon, WhatsAppIcon } from "@/components/icons";
import { PartCard } from "@/components/PartCard";
import { categoryIcons } from "@/components/partCategoryIcons";
import { brands, segmentLabels, type Brand } from "@/data/brands";
import { sectionIds } from "@/data/navigation";
import { partsIntro, qualityLabels } from "@/data/parts";
import {
  buildView,
  countWith,
  EMPTY_FILTERS,
  filterParts,
  matchesQuery,
  normalize,
  parseState,
  queryTerms,
  segments,
  serializeState,
  sortKeys,
  sortLabels,
  vehicleLabel,
  type CatalogState,
  type CatalogView,
  type Filters,
  type SortKey,
} from "@/lib/catalog/filters";
import { partHref, partImage, vehicleOptions } from "@/lib/catalog/helpers";
import { partQualities, type Catalog } from "@/lib/catalog/types";
import { useUrlSearch, writeUrlSearch } from "@/lib/catalog/useUrlSearch";
import { contactHref, isExternalHref } from "@/lib/contact";
import { cart } from "@/lib/partsCart";

const PAGE_SIZE = 12;
const RESULTS_ID = "parca-sonuclari";
const FINDER_ID = "arac-secici";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: "start" });
}

type UpdateMode = "push" | "replace";
type Update = (patch: Partial<Filters>, mode?: UpdateMode) => void;

/* ---------- Arama + öneriler ---------- */

interface Suggestion {
  id: string;
  label: string;
  meta: string;
  run: () => void;
}

function SearchBox({ view, filters, update }: { view: CatalogView; filters: Filters; update: Update }) {
  const router = useRouter();
  const inputId = useId();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const suggestions = useMemo<Suggestion[]>(() => {
    const terms = queryTerms(filters.query);
    if (terms.join("").length < 2) return [];
    const joined = terms.join(" ");
    const categories = view.catalog.categories
      .filter((category) => normalize(category.title).includes(joined))
      .slice(0, 2)
      .map((category) => ({
        id: `kategori-${category.id}`,
        label: category.title,
        meta: "Kategori",
        run: () => update({ category: category.id, subcategory: null, query: "" }),
      }));
    const vehicleBrands = brands
      .filter((brand) => normalize(brand.plain).startsWith(terms[0] ?? ""))
      .slice(0, 2)
      .map((brand) => ({
        id: `marka-${brand.plain}`,
        label: `${brand.name} yedek parça`,
        meta: "Araç markası",
        run: () => update({ brand, segment: brand.segment, model: "", engine: "", year: "", query: "" }),
      }));
    const parts = view.catalog.parts
      .filter((part) => matchesQuery(view, part, terms))
      .slice(0, 6)
      .map((part) => {
        const oem = part.oemCodes?.find((code) => terms.some((term) => normalize(code).replace(/[\s./-]/g, "").includes(term.replace(/[\s./-]/g, ""))));
        return {
          id: `urun-${part.slug}`,
          label: part.title,
          meta: oem ? `OEM: ${oem}` : `Ürün Kodu: ${part.code}`,
          run: () => router.push(partHref(part.slug)),
        };
      });
    return [...parts, ...categories, ...vehicleBrands];
  }, [filters.query, view, update, router]);

  const expanded = open && suggestions.length > 0;
  const choose = (index: number) => {
    suggestions[index]?.run();
    setOpen(false);
    setActive(-1);
  };

  return (
    <div className="relative">
      <label htmlFor={inputId} className="sr-only">
        Ürün adı, OEM kodu veya ürün kodu ara
      </label>
      <SearchIcon size={20} className="pointer-events-none absolute left-4 top-[1.75rem] -translate-y-1/2 text-steel-500" />
      <input
        id={inputId}
        type="search"
        role="combobox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
        value={filters.query}
        onChange={(event) => {
          update({ query: event.target.value }, "replace");
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && suggestions.length) {
            event.preventDefault();
            setOpen(true);
            setActive((current) => (current + 1) % suggestions.length);
          } else if (event.key === "ArrowUp" && suggestions.length) {
            event.preventDefault();
            setActive((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
          } else if (event.key === "Enter") {
            event.preventDefault();
            if (expanded && active >= 0) choose(active);
            else {
              setOpen(false);
              scrollToId(RESULTS_ID);
            }
          } else if (event.key === "Escape") {
            setOpen(false);
            setActive(-1);
          }
        }}
        placeholder="Ürün adı, OEM kodu veya ürün kodu ara..."
        autoComplete="off"
        className="h-14 w-full rounded-sm border-2 border-ink/15 bg-white pl-12 pr-4 text-base text-ink outline-none transition-colors placeholder:text-steel-500 focus:border-accent"
      />
      <ul
        id={listId}
        role="listbox"
        aria-label="Arama önerileri"
        hidden={!expanded}
        className="absolute inset-x-0 top-full z-30 mt-1 max-h-[22rem] overflow-y-auto rounded-sm border border-ink/15 bg-white py-1 shadow-[0_18px_40px_-24px_rgb(26_31_37/0.5)]"
      >
        {suggestions.map((item, index) => (
          <li
            key={item.id}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={index === active}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
            onMouseEnter={() => setActive(index)}
            className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5 ${
              index === active ? "bg-bone-100" : ""
            }`}
          >
            <span className="min-w-0 truncate font-semibold text-ink">{item.label}</span>
            <span className="label-mono shrink-0 text-[0.58rem] text-steel-500">{item.meta}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Araç seçici ---------- */

interface VehicleDraft {
  brand: string;
  model: string;
  engine: string;
  year: string;
}

const EMPTY_DRAFT: VehicleDraft = { brand: "", model: "", engine: "", year: "" };

const fieldClass =
  "h-12 w-full rounded-sm border border-ink/15 bg-white px-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-steel-500 focus:border-accent disabled:cursor-not-allowed disabled:bg-bone-100 disabled:text-steel-500";

function VehicleFinder({
  catalog,
  draft,
  setDraft,
  onApply,
  brandRef,
}: {
  catalog: Catalog;
  draft: VehicleDraft;
  setDraft: (draft: VehicleDraft) => void;
  onApply: (event: FormEvent<HTMLFormElement>) => void;
  brandRef: RefObject<HTMLSelectElement | null>;
}) {
  const titleId = useId();
  const ids = { model: useId(), engine: useId(), year: useId() };
  const options = draft.brand ? vehicleOptions(catalog, draft.brand, draft.model) : { models: [], engines: [], years: [] };
  const off = !draft.brand;

  return (
    <form
      id={FINDER_ID}
      onSubmit={onApply}
      aria-labelledby={titleId}
      className="mt-5 scroll-mt-[calc(var(--header-h)+1rem)] border-t border-ink/10 pt-5"
    >
      <h2 id={titleId} className="font-display text-[1.5rem] font-bold uppercase leading-[0.95] tracking-[0.02em] text-ink md:text-[1.75rem]">
        <span className="block">Aracına Uygun{" "}</span>
        <span className="block">
          Parçayı Bul<span className="text-accent">.</span>
        </span>
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto]">
        <label className="flex min-w-0 flex-col gap-1">
          <span className="label-mono text-[0.58rem] text-steel-500">1 · Marka</span>
          <select
            ref={brandRef}
            value={draft.brand}
            onChange={(event) => setDraft({ ...EMPTY_DRAFT, brand: event.target.value })}
            className={fieldClass}
          >
            <option value="">Marka seçin</option>
            {segments.map((segment) => (
              <optgroup key={segment} label={segmentLabels[segment]}>
                {brands
                  .filter((brand) => brand.segment === segment)
                  .map((brand) => (
                    <option key={brand.plain} value={brand.plain}>
                      {brand.name}
                      {brand.note ? ` (${brand.note})` : ""}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        <VehicleField
          id={ids.model}
          step="2 · Model"
          value={draft.model}
          disabled={off}
          options={options.models}
          placeholder={options.models.length ? "Model seçin veya yazın" : "Model yazın"}
          onChange={(model) => setDraft({ ...draft, model, engine: "", year: "" })}
        />
        <VehicleField
          id={ids.engine}
          step="3 · Motor"
          value={draft.engine}
          disabled={off}
          options={options.engines}
          placeholder="Motor (isteğe bağlı)"
          onChange={(engine) => setDraft({ ...draft, engine })}
        />
        <VehicleField
          id={ids.year}
          step="4 · Yıl"
          value={draft.year}
          disabled={off}
          options={options.years}
          placeholder="Yıl"
          inputMode="numeric"
          onChange={(year) => setDraft({ ...draft, year })}
        />
        <button type="submit" disabled={off} className="btn btn-primary h-12 self-end px-5 disabled:opacity-50">
          <span>Uyumlu Parçaları Göster</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}

function VehicleField({
  id,
  step,
  value,
  disabled,
  options,
  placeholder,
  inputMode,
  onChange,
}: {
  id: string;
  step: string;
  value: string;
  disabled: boolean;
  options: string[];
  placeholder: string;
  inputMode?: "numeric";
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="label-mono text-[0.58rem] text-steel-500">{step}</span>
      <input
        value={value}
        disabled={disabled}
        list={options.length ? `${id}-liste` : undefined}
        onChange={(event) => onChange(event.target.value.slice(0, 60))}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
        className={fieldClass}
      />
      {options.length > 0 && (
        <datalist id={`${id}-liste`}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      )}
    </label>
  );
}

function VehicleContext({
  filters,
  count,
  onChange,
  onClear,
}: {
  filters: Filters;
  count: number;
  onChange: () => void;
  onClear: () => void;
}) {
  const parts = filters.brand
    ? [filters.brand.name, filters.model, filters.engine, filters.year].filter(Boolean)
    : [filters.segment ? segmentLabels[filters.segment] : ""];
  return (
    <div className="mt-4 grid gap-4 rounded-sm bg-ink p-4 text-bone sm:grid-cols-[1fr_auto] sm:items-center md:p-5">
      <div>
        <p className="label-mono text-[0.58rem] text-accent-300">{filters.brand ? "Aracınız" : "Araç tipi"}</p>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-xl font-bold uppercase tracking-[0.04em] md:text-2xl">
          {parts.map((item, index) => (
            <span key={`${item}-${index}`} className={index === 0 ? "text-bone" : "text-steel-300"}>
              {item}
            </span>
          ))}
        </p>
        <p className="mt-2 text-sm text-steel-300" role="status" aria-live="polite">
          Aracınıza uygun <strong className="font-semibold text-bone">{count}</strong> ürün gösteriliyor.
          {filters.brand && (filters.model || filters.engine) && (
            <span className="block text-steel-400">
              Model ve motor uyumu sipariş öncesinde şasi numaranızla ayrıca kontrol edilir.
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onChange} className="btn btn-outline btn-sm">
          Aracı Değiştir
        </button>
        <button
          type="button"
          onClick={onClear}
          aria-label="Araç seçimini temizle"
          className="inline-flex size-11 items-center justify-center rounded-sm border border-bone/25 text-bone transition-colors hover:border-accent hover:text-accent-300"
        >
          <CloseIcon size={16} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Kategoriler ---------- */

function CategoryStrip({ view, filters, update }: { view: CatalogView; filters: Filters; update: Update }) {
  const items = [
    { id: null, icon: null, title: "Tüm Ürünler", count: countWith(view, filters, { category: null, subcategory: null }) },
    ...view.catalog.categories.map((category) => ({
      id: category.id,
      icon: category.icon,
      title: category.title,
      count: countWith(view, filters, { category: category.id, subcategory: null }),
    })),
  ];
  return (
    <section aria-labelledby="parca-kategorileri-baslik" className="mt-12">
      <h2 id="parca-kategorileri-baslik" className="font-display text-2xl font-bold uppercase tracking-[0.04em] text-ink md:text-3xl">
        Yedek Parça Kategorileri
      </h2>
      <ul className="-mx-[var(--gutter)] mt-5 flex snap-x scroll-px-[var(--gutter)] gap-2 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 xl:grid-cols-8 [&::-webkit-scrollbar]:hidden">
        {items.map(({ id, icon, title, count }) => {
          const Icon = icon ? categoryIcons[icon] : SearchIcon;
          const active = filters.category === id;
          return (
            <li key={title} className="w-[8.5rem] shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => {
                  update({ category: id, subcategory: null });
                  scrollToId(RESULTS_ID);
                }}
                className={`relative flex h-full w-full flex-col items-start gap-3 overflow-hidden rounded-sm border p-3.5 text-left transition-colors duration-300 ${
                  active ? "border-ink/25 bg-bone-300/60" : "border-ink/10 bg-white hover:border-ink/30"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-0.5 bg-accent transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  } origin-left`}
                />
                <Icon size={28} strokeWidth={1.5} className={active ? "text-accent" : "text-ink"} />
                <span className="font-display text-[0.95rem] font-bold uppercase leading-tight tracking-[0.03em] text-ink">
                  {title}
                </span>
                <span className="label-mono mt-auto text-[0.56rem] text-steel-500">{count} ürün</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------- Filtre paneli ---------- */

function FilterSection({ title, value, children }: { title: string; value?: string; children: ReactNode }) {
  return (
    <details open className="group/section border-b border-ink/10 last:border-b-0">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-2 [&::-webkit-details-marker]:hidden">
        <span className="label-mono text-[0.62rem] text-ink">{title}</span>
        <span className="flex min-w-0 items-center gap-2">
          {value && <span className="truncate text-xs text-accent-600">{value}</span>}
          <ChevronRight size={16} className="shrink-0 text-steel-500 transition-transform group-open/section:rotate-90" />
        </span>
      </summary>
      <fieldset className="pb-4">
        <legend className="sr-only">{title}</legend>
        <div className="grid gap-0.5">{children}</div>
      </fieldset>
    </details>
  );
}

function RadioOption({
  name,
  label,
  count,
  checked,
  onSelect,
  indent = false,
}: {
  name: string;
  label: string;
  count: number;
  checked: boolean;
  onSelect: () => void;
  indent?: boolean;
}) {
  const disabled = count === 0 && !checked;
  return (
    <label
      className={`flex min-h-9 cursor-pointer items-center gap-2.5 rounded-xs pr-1 text-[0.92rem] transition-colors has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40 ${
        indent ? "pl-5" : "pl-1"
      } ${checked ? "font-semibold text-ink" : "text-steel-700 hover:text-ink"}`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
        className="size-4 shrink-0 appearance-none rounded-full border border-ink/35 bg-white transition-[border] checked:border-[5px] checked:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      <span className="flex-1">{label}</span>
      <span className={`label-mono text-[0.6rem] ${checked ? "text-accent-600" : "text-steel-500"}`}>{count}</span>
    </label>
  );
}

function FilterPanel({ view, filters, update, name }: { view: CatalogView; filters: Filters; update: Update; name: string }) {
  const category = view.catalog.categories.find((item) => item.id === filters.category);
  const brandPatch = (brand: Brand | null): Partial<Filters> =>
    brand ? { brand, segment: brand.segment, model: "", engine: "", year: "" } : { brand: null, model: "", engine: "", year: "" };

  return (
    <div>
      <FilterSection title="Kategori" value={category?.title}>
        <RadioOption
          name={`${name}-kategori`}
          label="Tüm Kategoriler"
          count={countWith(view, filters, { category: null, subcategory: null })}
          checked={!filters.category}
          onSelect={() => update({ category: null, subcategory: null })}
        />
        {view.catalog.categories.map((item) => (
          <div key={item.id} className="grid gap-0.5">
            <RadioOption
              name={`${name}-kategori`}
              label={item.title}
              count={countWith(view, filters, { category: item.id, subcategory: null })}
              checked={filters.category === item.id}
              onSelect={() => update({ category: item.id, subcategory: null })}
            />
            {filters.category === item.id && item.subcategories.length > 0 && (
              <div role="radiogroup" aria-label={`${item.title} alt kategorileri`} className="grid gap-0.5">
                <RadioOption
                  name={`${name}-alt`}
                  indent
                  label="Tümü"
                  count={countWith(view, filters, { subcategory: null })}
                  checked={!filters.subcategory}
                  onSelect={() => update({ subcategory: null })}
                />
                {item.subcategories.map((sub) => (
                  <RadioOption
                    key={sub.id}
                    name={`${name}-alt`}
                    indent
                    label={sub.title}
                    count={countWith(view, filters, { subcategory: sub.id })}
                    checked={filters.subcategory === sub.id}
                    onSelect={() => update({ subcategory: sub.id })}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Araç Markası" value={filters.brand?.name}>
        <RadioOption
          name={`${name}-marka`}
          label="Tüm Markalar"
          count={countWith(view, filters, brandPatch(null))}
          checked={!filters.brand}
          onSelect={() => update(brandPatch(null))}
        />
        {segments.map((segment) => (
          <div key={segment} className="mt-1 grid gap-0.5">
            <span className="px-1 pt-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-steel-500">
              {segmentLabels[segment]}
            </span>
            {brands
              .filter((brand) => brand.segment === segment)
              .map((brand) => (
                <RadioOption
                  key={brand.plain}
                  name={`${name}-marka`}
                  indent
                  label={brand.note ? `${brand.name} (${brand.note})` : brand.name}
                  count={countWith(view, filters, brandPatch(brand))}
                  checked={filters.brand?.plain === brand.plain}
                  onSelect={() => update(brandPatch(brand))}
                />
              ))}
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Araç Tipi" value={filters.segment ? segmentLabels[filters.segment] : undefined}>
        <RadioOption
          name={`${name}-tip`}
          label="Tüm Araçlar"
          count={countWith(view, filters, { segment: null, ...brandPatch(null) })}
          checked={!filters.segment}
          onSelect={() => update({ segment: null, ...brandPatch(null) })}
        />
        {segments.map((segment) => {
          const keepBrand = filters.brand?.segment === segment;
          const patch: Partial<Filters> = keepBrand ? { segment } : { segment, ...brandPatch(null) };
          return (
            <RadioOption
              key={segment}
              name={`${name}-tip`}
              label={segmentLabels[segment]}
              count={countWith(view, filters, patch)}
              checked={filters.segment === segment}
              onSelect={() => update(patch)}
            />
          );
        })}
      </FilterSection>

      {view.manufacturers.length > 0 && (
        <FilterSection title="Ürün Markası" value={filters.manufacturer ?? undefined}>
          <RadioOption
            name={`${name}-uretici`}
            label="Tüm Ürün Markaları"
            count={countWith(view, filters, { manufacturer: null })}
            checked={!filters.manufacturer}
            onSelect={() => update({ manufacturer: null })}
          />
          {view.manufacturers.map((maker) => (
            <RadioOption
              key={maker}
              name={`${name}-uretici`}
              label={maker}
              count={countWith(view, filters, { manufacturer: maker })}
              checked={filters.manufacturer === maker}
              onSelect={() => update({ manufacturer: maker })}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="Parça Türü" value={filters.quality ? qualityLabels[filters.quality] : undefined}>
        <RadioOption
          name={`${name}-tur`}
          label="Tümü"
          count={countWith(view, filters, { quality: null })}
          checked={!filters.quality}
          onSelect={() => update({ quality: null })}
        />
        {partQualities.map((quality) => (
          <RadioOption
            key={quality}
            name={`${name}-tur`}
            label={qualityLabels[quality]}
            count={countWith(view, filters, { quality })}
            checked={filters.quality === quality}
            onSelect={() => update({ quality })}
          />
        ))}
      </FilterSection>
    </div>
  );
}

/* ---------- Sayfalama ---------- */

/** 1 … 4 5 6 … 9 biçiminde sayfa listesi; `null` üç noktadır. */
function pageList(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((page) => pages.add(page));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((page) => pages.add(page));
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  return sorted.flatMap((page, i) => (i > 0 && page - sorted[i - 1] > 1 ? [null, page] : [page]));
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  const navButton =
    "inline-flex h-11 items-center gap-2 rounded-sm border border-ink/15 bg-white px-4 font-display text-sm font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-40";
  return (
    <nav aria-label="Ürün sayfaları" className="mt-10 flex items-center justify-between gap-2 sm:justify-center">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} className={navButton}>
        <ArrowRight size={14} className="rotate-180" />
        Önceki
      </button>
      <p className="label-mono text-[0.65rem] text-steel-700 sm:hidden" aria-live="polite">
        {page} / {total}
      </p>
      <ul className="hidden items-center gap-1.5 sm:flex">
        {pageList(page, total).map((item, index) =>
          item === null ? (
            <li key={`bosluk-${index}`} aria-hidden className="px-1 text-steel-500">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onChange(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`${item}. sayfa`}
                className={`inline-flex size-11 items-center justify-center rounded-sm border font-display text-base font-bold transition-colors ${
                  item === page ? "border-ink bg-ink text-bone" : "border-ink/15 bg-white text-ink hover:border-ink"
                }`}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === total} className={navButton}>
        Sonraki
        <ArrowRight size={14} />
      </button>
    </nav>
  );
}

/* ---------- Mobil filtre paneli ---------- */

function useDialogFocus(open: boolean, panelRef: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select, summary, a[href]") ?? [],
      );
    focusables()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, panelRef, onClose]);
}

/* ---------- Katalog ---------- */

interface Chip {
  key: string;
  label: string;
  clear: () => void;
}

export function PartsCatalog({ catalog }: { catalog: Catalog }) {
  const view = useMemo(() => buildView(catalog), [catalog]);
  const search = useUrlSearch();
  const state = useMemo(() => parseState(view, search), [view, search]);
  const { filters, sort } = state;

  const [editedDraft, setDraft] = useState<VehicleDraft | null>(null);
  const draft: VehicleDraft = editedDraft ?? {
    brand: filters.brand?.plain ?? "",
    model: filters.model,
    engine: filters.engine,
    year: filters.year,
  };
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLSelectElement>(null);
  const sortId = useId();
  const sortMobileId = useId();

  const closeSheet = useMemo(() => () => setSheetOpen(false), []);
  useDialogFocus(sheetOpen, sheetRef, closeSheet);

  const commit = (next: CatalogState, mode: UpdateMode = "push") => writeUrlSearch(serializeState(next), mode);
  const update: Update = (patch, mode = "push") => commit({ ...state, filters: { ...filters, ...patch }, page: 1 }, mode);

  const results = useMemo(() => filterParts(view, filters, sort), [view, filters, sort]);
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(state.page, totalPages);
  const firstIndex = (page - 1) * PAGE_SIZE;
  const shown = results.slice(firstIndex, firstIndex + PAGE_SIZE);

  const goToPage = (next: number) => {
    commit({ ...state, page: Math.min(Math.max(next, 1), totalPages) });
    scrollToId(RESULTS_ID);
  };

  const applyVehicle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const brand = brands.find((item) => item.plain === draft.brand);
    if (!brand) return;
    const next = { brand, segment: brand.segment, model: draft.model.trim(), engine: draft.engine.trim(), year: draft.year.trim() };
    update(next);
    setDraft(null);
    cart.setVehicle(vehicleLabel({ ...filters, ...next }));
    scrollToId(RESULTS_ID);
  };

  const changeVehicle = () => {
    setDraft(null);
    scrollToId(FINDER_ID);
    brandRef.current?.focus({ preventScroll: true });
  };

  const clearVehicle = () => {
    update({ brand: null, segment: null, model: "", engine: "", year: "" });
    setDraft(null);
    cart.setVehicle("");
  };

  const clearFilters = () => update({ ...EMPTY_FILTERS, query: filters.query, brand: filters.brand, segment: filters.segment, model: filters.model, engine: filters.engine, year: filters.year });
  const clearAll = () => {
    update(EMPTY_FILTERS);
    setDraft(null);
  };

  const categoryTitle = filters.category ? view.categoryTitles.get(filters.category) : undefined;
  const subTitle = filters.category && filters.subcategory ? view.subcategoryTitles.get(`${filters.category}/${filters.subcategory}`) : undefined;

  const filterChips = [
    filters.brand && {
      key: "brand",
      label: vehicleLabel(filters),
      clear: clearVehicle,
    },
    !filters.brand && filters.segment && { key: "segment", label: segmentLabels[filters.segment], clear: () => update({ segment: null }) },
    categoryTitle && { key: "category", label: categoryTitle, clear: () => update({ category: null, subcategory: null }) },
    subTitle && { key: "subcategory", label: subTitle, clear: () => update({ subcategory: null }) },
    filters.quality && { key: "quality", label: qualityLabels[filters.quality], clear: () => update({ quality: null }) },
    filters.manufacturer && { key: "manufacturer", label: filters.manufacturer, clear: () => update({ manufacturer: null }) },
  ].filter((chip): chip is Chip => Boolean(chip));
  const queryChip: Chip | null = filters.query.trim()
    ? { key: "query", label: `“${filters.query.trim()}”`, clear: () => update({ query: "" }) }
    : null;
  const chips = queryChip ? [queryChip, ...filterChips] : filterChips;
  const filterCount = filterChips.length;

  const askHref = contactHref({ kind: "part", part: filters.query.trim() || "yedek parça", brand: filters.brand?.plain });
  const askExternal = isExternalHref(askHref);

  const sortSelect = (id: string, className: string) => (
    <select
      id={id}
      value={sort}
      onChange={(event) => commit({ ...state, sort: event.target.value as SortKey, page: 1 })}
      className={className}
    >
      {sortKeys.map((key) => (
        <option key={key} value={key}>
          {sortLabels[key]}
        </option>
      ))}
    </select>
  );

  return (
    <div>
      <div className="relative z-10 -mt-20 rounded-sm border border-ink/10 bg-white p-4 shadow-[0_30px_60px_-40px_rgb(26_31_37/0.45)] md:-mt-24 md:p-6">
        <SearchBox view={view} filters={filters} update={update} />
        <VehicleFinder catalog={catalog} draft={draft} setDraft={setDraft} onApply={applyVehicle} brandRef={brandRef} />
        {(filters.brand || filters.segment) && (
          <VehicleContext filters={filters} count={results.length} onChange={changeVehicle} onClear={clearVehicle} />
        )}
      </div>

      <CategoryStrip view={view} filters={filters} update={update} />

      <section id={RESULTS_ID} aria-labelledby="parca-sonuclari-baslik" className="mt-12 scroll-mt-[calc(var(--header-h)+1rem)]">
        <div className="flex items-end justify-between gap-4 border-b border-ink/10 pb-4">
          <div className="min-w-0">
            <h2 id="parca-sonuclari-baslik" className="font-display text-[1.75rem] font-bold uppercase leading-none tracking-[0.03em] text-ink md:text-[2.25rem]">
              {categoryTitle ?? "Tüm Ürünler"}
              {subTitle && <span className="text-steel-500"> / {subTitle}</span>}
            </h2>
            <p className="label-mono mt-2 text-[0.65rem] text-steel-700" role="status" aria-live="polite">
              <span className="text-ink">{results.length}</span> ürün
              {totalPages > 1 && <span className="text-steel-500"> · Sayfa {page} / {totalPages}</span>}
            </p>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <label htmlFor={sortId} className="label-mono text-[0.6rem] text-steel-500">
              Sırala
            </label>
            {sortSelect(
              sortId,
              "h-11 rounded-sm border border-ink/15 bg-white px-3 text-sm font-semibold text-ink outline-none transition-colors focus:border-accent",
            )}
          </div>
        </div>

        <div className="sticky top-[var(--header-h)] z-20 -mx-[var(--gutter)] grid grid-cols-2 gap-2 border-b border-ink/10 bg-bone-100 px-[var(--gutter)] py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-ink font-display text-sm font-bold uppercase tracking-[0.08em] text-bone"
          >
            <FilterIcon size={16} />
            Filtrele{filterCount > 0 && ` (${filterCount})`}
          </button>
          <label htmlFor={sortMobileId} className="relative">
            <span className="sr-only">Sırala</span>
            {sortSelect(
              sortMobileId,
              "h-11 w-full appearance-none rounded-sm border border-ink/15 bg-white pl-3 pr-8 font-display text-sm font-bold uppercase tracking-[0.06em] text-ink outline-none focus:border-accent",
            )}
            <ChevronRight size={14} aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-steel-500" />
          </label>
        </div>

        {chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Aktif filtreler">
            {chips.map((chip) => (
              <li key={chip.key}>
                <button
                  type="button"
                  onClick={chip.clear}
                  aria-label={`${chip.label} filtresini kaldır`}
                  className="inline-flex h-9 items-center gap-2 rounded-xs border border-ink/20 bg-white px-3 text-[0.8rem] font-semibold text-ink transition-colors hover:border-accent hover:text-accent-600"
                >
                  {chip.label}
                  <CloseIcon size={12} />
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={clearAll}
                className="label-mono h-9 px-2 text-[0.62rem] text-steel-700 underline underline-offset-4 transition-colors hover:text-accent-600"
              >
                Tümünü temizle
              </button>
            </li>
          </ul>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-[17rem_1fr]">
          <aside
            aria-label="Ürün filtreleri"
            className="hidden self-start rounded-sm border border-ink/10 bg-white px-5 pb-2 pt-4 lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:block lg:max-h-[calc(100vh-var(--header-h)-2rem)] lg:overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <p className="font-display text-lg font-bold uppercase tracking-[0.06em] text-ink">
                Filtreler{filterCount > 0 && <span className="text-accent"> ({filterCount})</span>}
              </p>
              {filterCount > 0 && (
                <button type="button" onClick={clearFilters} className="label-mono text-[0.6rem] text-steel-700 underline underline-offset-4 hover:text-accent-600">
                  Temizle
                </button>
              )}
            </div>
            <FilterPanel view={view} filters={filters} update={update} name="masaustu" />
          </aside>

          <div className="min-w-0">
            {results.length > 0 ? (
              <>
                <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                  {shown.map((part, index) => (
                    <li key={part.slug}>
                      <PartCard
                        part={part}
                        image={partImage(catalog, part)}
                        categoryLabel={
                          view.subcategoryTitles.get(`${part.category}/${part.subcategory}`) ??
                          view.categoryTitles.get(part.category) ??
                          ""
                        }
                        priority={index < 2 && page === 1}
                      />
                    </li>
                  ))}
                </ul>
                <p className="label-mono mt-8 text-center text-[0.6rem] text-steel-500">
                  {firstIndex + 1}–{firstIndex + shown.length} / {results.length} ürün
                </p>
                {totalPages > 1 && <Pagination page={page} total={totalPages} onChange={goToPage} />}
              </>
            ) : (
              <div className="rounded-sm border border-ink/15 bg-white p-6 md:p-10">
                <p className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold uppercase leading-[0.95] text-ink">
                  <span className="block">Bu filtrelere uygun{" "}</span>
                  <span className="block">
                    ürün bulunamadı<span className="text-accent">.</span>
                  </span>
                </p>
                <p className="mt-4 max-w-xl text-steel-700">
                  Filtreleri değiştirebilir veya aradığınız parçayı bize gönderebilirsiniz; listede olmayan parçalar da
                  stokta bulunabilir.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={clearAll} className="btn btn-ghost btn-sm">
                    Filtreleri Temizle
                  </button>
                  <a href={askHref} {...(askExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="btn btn-primary btn-sm">
                    {askExternal && <WhatsAppIcon size={16} />}
                    WhatsApp&apos;tan Parça Sor
                    {!askExternal && <ArrowUpRight size={16} />}
                  </a>
                </div>
                <a href={`#${sectionIds.partList}`} className="link-arrow mt-6 text-[0.8rem] text-ink hover:text-accent-600">
                  Parça listenizi gönderin
                  <ArrowRight size={14} />
                </a>
              </div>
            )}

            <p className="mt-8 text-sm leading-relaxed text-steel-700">{partsIntro.note}</p>
          </div>
        </div>
      </section>

      <div
        className={`fixed inset-0 z-[80] lg:hidden ${sheetOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!sheetOpen}
        inert={!sheetOpen}
      >
        <div
          onClick={closeSheet}
          className={`absolute inset-0 bg-ink/55 transition-opacity duration-300 ${sheetOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Ürün filtreleri"
          className={`absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-white transition-transform duration-300 ease-out-expo ${
            sheetOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink/10 px-5">
            <p className="font-display text-lg font-bold uppercase tracking-[0.06em] text-ink">
              Filtreler{filterCount > 0 && <span className="text-accent"> ({filterCount})</span>}
            </p>
            <button
              type="button"
              onClick={closeSheet}
              aria-label="Filtreleri kapat"
              className="inline-flex size-11 items-center justify-center rounded-sm border border-ink/15 text-ink hover:border-ink"
            >
              <CloseIcon size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pt-1">
            {sheetOpen && <FilterPanel view={view} filters={filters} update={update} name="mobil" />}
          </div>
          <div className="grid shrink-0 grid-cols-[auto_1fr] gap-3 border-t border-ink/10 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <button type="button" onClick={clearFilters} disabled={filterCount === 0} className="btn btn-ghost btn-sm disabled:opacity-40">
              Temizle
            </button>
            <button
              type="button"
              onClick={() => {
                closeSheet();
                scrollToId(RESULTS_ID);
              }}
              className="btn btn-primary btn-sm"
            >
              {results.length} Ürünü Göster
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
