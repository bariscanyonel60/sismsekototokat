import Link from "next/link";
import type { ReactNode } from "react";

import { AddToCart } from "@/components/AddToCart";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CopyButton } from "@/components/CopyButton";
import { ArrowRight, ArrowUpRight, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PartCard } from "@/components/PartCard";
import { PartGallery } from "@/components/PartGallery";
import { PartsCart } from "@/components/PartsCart";
import { PartsMenu } from "@/components/PartsMenu";
import { SiteShell } from "@/components/SiteShell";
import { segmentLabels } from "@/data/brands";
import { ctaLabels, homeContactHref, routes } from "@/data/navigation";
import { installHeadlines, partsIntro, qualityLabels } from "@/data/parts";
import { services } from "@/data/services";
import { site } from "@/data/site";
import {
  brandsForPart,
  findCategory,
  partBrandHref,
  partCategoryHref,
  partGallery,
  partHref,
  partImage,
  partManufacturerHref,
  relatedParts,
  subcategoryTitle,
  toCartParts,
  toPartsMenu,
} from "@/lib/catalog/helpers";
import type { Catalog, Part, PartCategory, PartCompatibility } from "@/lib/catalog/types";
import { contactHref, isExternalHref, type ContactContext } from "@/lib/contact";
import { cssVars } from "@/lib/cssVars";
import { brandCategoryLanding } from "@/lib/seo/catalog";
import { brandCategoryHeading, categoryNoun } from "@/lib/seo/copy";
import { buildProductSchema } from "@/lib/structuredData";

function segmentList(part: Part): string {
  return part.segments.map((segment) => segmentLabels[segment]).join(", ");
}

function SpecRow({ label, mono, children }: { label: string; mono?: boolean; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3.5 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <dt className="text-steel-500">{label}</dt>
      <dd className={mono ? "font-mono text-ink" : "text-ink"}>{children}</dd>
    </div>
  );
}

function CodeRow({ label, codes }: { label: string; codes: string[] }) {
  return (
    <div className="grid gap-2 py-3 sm:grid-cols-[7.5rem_1fr] sm:items-start sm:gap-4">
      <dt className="label-mono pt-2.5 text-[0.6rem] text-steel-500">{label}</dt>
      <dd className="grid gap-2">
        {codes.map((code) => (
          <span key={code} className="flex items-center justify-between gap-3">
            <span className="min-w-0 break-all font-mono text-[1.05rem] font-semibold text-ink">{code}</span>
            <CopyButton value={code} label={label} />
          </span>
        ))}
      </dd>
    </div>
  );
}

const compatibilityColumns = [
  { key: "brand", label: "Marka" },
  { key: "model", label: "Model" },
  { key: "engine", label: "Motor" },
  { key: "years", label: "Yıl" },
] as const satisfies readonly { key: keyof PartCompatibility; label: string }[];

function CompatibilityTable({ rows }: { rows: PartCompatibility[] }) {
  const columns = compatibilityColumns.filter((column) => rows.some((row) => row[column.key]));
  return (
    <div className="overflow-x-auto rounded-sm border border-ink/10 bg-white">
      <table className="w-full min-w-[22rem] text-left text-[0.92rem]">
        <caption className="sr-only">Uyumlu araçlar</caption>
        <thead className="bg-bone-100">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="label-mono px-4 py-3 text-[0.6rem] font-normal text-steel-700">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3 ${column.key === "brand" ? "font-semibold text-ink" : "text-steel-700"}`}>
                  {row[column.key] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Ürün detay sayfası; `/yedek-parca/[slug]` slug'ı bir ürüne çözümlendiğinde gösterilir. */
export function PartDetail({ catalog, part, category }: { catalog: Catalog; part: Part; category: PartCategory }) {
  const subcategory = subcategoryTitle(catalog, part);
  const images = partGallery(catalog, part);
  const service = services.find((item) => item.slug === category.serviceSlug);
  const installHeadline =
    installHeadlines[category.id] ??
    (service && installHeadlines[service.slug]) ??
    (service ? `Montajı ${service.title.toLocaleLowerCase("tr-TR")} hizmetimizle yapalım.` : "");
  const compatibleBrands = brandsForPart(part);
  const brandPages = compatibleBrands
    .map((brand) => brandCategoryLanding(catalog, brand, category))
    .filter((entry) => entry?.indexable && entry.exclusive.includes(part))
    .map((entry) => ({ href: entry!.href, label: brandCategoryHeading(entry!) }));
  const related = relatedParts(catalog, part, 4);
  const url = `${site.url}${partHref(part.slug)}`;
  const context: ContactContext = { kind: "part", part: part.title, code: part.code, url };
  const inquiryHref = contactHref(context);
  const inquiryExternal = isExternalHref(inquiryHref);
  const checkHref = contactHref({ kind: "compatibility", part: part.title, code: part.code, url });
  const checkExternal = isExternalHref(checkHref);
  const paragraphs = part.details?.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean) ?? [];
  const categoryLabel = (item: Part) =>
    subcategoryTitle(catalog, item) ?? findCategory(catalog, item.category)?.title ?? "";

  return (
    <SiteShell currentPath={routes.parts} contactContext={context}>
      <div className="bg-ink pb-5 pt-[calc(var(--header-h)+var(--topbar-h)+20px)]">
        <div className="container-x flex flex-wrap items-center gap-x-6 gap-y-4">
          <PartsMenu menu={toPartsMenu(catalog)} />
          <Breadcrumb
            items={[
              { label: partsIntro.eyebrow, href: routes.parts },
              { label: categoryNoun(category), href: partCategoryHref(category.id) },
              { label: part.title },
            ]}
            className="hero-fade"
          />
        </div>
      </div>

      <div className="bg-bone-100 text-ink">
        <div className="container-x pb-20 pt-8 md:pb-28 lg:pt-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-10">
            <div className="hero-fade lg:col-span-6" style={cssVars({ "--i": 1 })}>
              <PartGallery images={images.length ? images : [partImage(catalog, part)]} title={part.title}>
                <span className="label-mono absolute bottom-3 left-3 rounded-xs bg-accent px-2.5 py-1.5 text-[0.62rem] text-white">
                  {partsIntro.stock.value} hazır stok
                </span>
              </PartGallery>
            </div>

            <div className="lg:col-span-6 lg:row-span-2 lg:pt-1">
              <p className="hero-fade label-mono flex flex-wrap items-center gap-x-2 text-[0.65rem] text-steel-700" style={cssVars({ "--i": 2 })}>
                <span aria-hidden className="h-px w-5 bg-accent" />
                <Link href={partCategoryHref(category.id)} className="hover:text-accent-600">
                  {category.title}
                </Link>
                {subcategory && <span className="text-steel-500">/ {subcategory}</span>}
              </p>
              <h1
                className="hero-fade mt-3 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold uppercase leading-[0.95] tracking-[0.01em] text-ink"
                style={cssVars({ "--i": 3 })}
              >
                {part.title}
              </h1>
              {(part.manufacturer || part.qualities.length > 0) && (
                <p className="hero-fade mt-4 flex flex-wrap items-center gap-2" style={cssVars({ "--i": 3 })}>
                  {part.manufacturer && (
                    <Link
                      href={partManufacturerHref(part.manufacturer)}
                      className="label-mono rounded-xs border border-ink/15 bg-white px-2.5 py-1 text-[0.62rem] text-steel-700 transition-colors hover:border-accent hover:text-accent-600"
                    >
                      Ürün markası: <span className="text-ink">{part.manufacturer}</span>
                    </Link>
                  )}
                  {part.qualities.map((quality) => (
                    <span
                      key={quality}
                      className={`label-mono rounded-xs px-2.5 py-1 text-[0.62rem] ${
                        quality === "orijinal" ? "bg-accent text-white" : "bg-ink text-bone"
                      }`}
                    >
                      {qualityLabels[quality]}
                    </span>
                  ))}
                </p>
              )}

              <dl className="hero-fade mt-5 divide-y divide-ink/10 border-y border-ink/10" style={cssVars({ "--i": 4 })}>
                <CodeRow label="Ürün Kodu" codes={[part.code]} />
                {part.oemCodes && part.oemCodes.length > 0 && <CodeRow label="OEM Kodu" codes={part.oemCodes} />}
              </dl>

              <p className="hero-fade mt-5 max-w-xl text-[1.02rem] leading-relaxed text-steel-700" style={cssVars({ "--i": 4 })}>
                {part.description}
              </p>

              <div className="hero-fade mt-6 rounded-sm border border-ink/10 bg-white p-4 sm:p-5" style={cssVars({ "--i": 5 })}>
                <p className="text-sm text-steel-700">Stok ve fiyat bilgisi aracınıza göre WhatsApp üzerinden iletilir.</p>
                <div className="mt-4">
                  <AddToCart slug={part.slug} title={part.title} variant="detail" />
                </div>
                <a
                  href={inquiryHref}
                  className="mt-3 flex min-h-12 w-full items-center justify-center gap-2.5 rounded-sm border border-[#1fa855] px-4 text-center text-[0.92rem] font-semibold text-[#168243] transition-colors hover:bg-[#1fa855] hover:text-white"
                  {...(inquiryExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {inquiryExternal && <WhatsAppIcon size={18} />}
                  {inquiryExternal ? "Bu ürünü WhatsApp'tan sor" : ctaLabels.partInquiry}
                </a>
              </div>

              <section aria-labelledby="uyumluluk-baslik" className="hero-fade mt-8" style={cssVars({ "--i": 6 })}>
                <h2 id="uyumluluk-baslik" className="font-display text-xl font-bold uppercase tracking-[0.06em] text-ink">
                  Uygun Araçlar
                </h2>
                {part.compatibility && part.compatibility.length > 0 && (
                  <div className="mt-3">
                    <CompatibilityTable rows={part.compatibility} />
                  </div>
                )}
                <dl className="mt-3 divide-y divide-ink/10 rounded-sm border border-ink/10 bg-white px-4 text-[0.92rem] sm:px-5">
                  <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-steel-500">Araç grubu</dt>
                    <dd className="text-ink">{segmentList(part)}</dd>
                  </div>
                  {part.fitment && (
                    <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                      <dt className="text-steel-500">Model / motor</dt>
                      <dd className="text-ink">{part.fitment.join(", ")}</dd>
                    </div>
                  )}
                  <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-steel-500">Markalar</dt>
                    <dd className="text-ink">
                      {compatibleBrands.map((brand, index) => (
                        <span key={brand.plain}>
                          {index > 0 && ", "}
                          <Link href={partBrandHref(brand)} className="underline-offset-4 hover:text-accent-600 hover:underline">
                            {brand.name}
                          </Link>
                        </span>
                      ))}
                    </dd>
                  </div>
                  {brandPages.length > 0 && (
                    <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                      <dt className="text-steel-500">Tüm ürünler</dt>
                      <dd className="text-ink">
                        {brandPages.map((page, index) => (
                          <span key={page.href}>
                            {index > 0 && ", "}
                            <Link href={page.href} className="underline-offset-4 hover:text-accent-600 hover:underline">
                              {page.label}
                            </Link>
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            </div>

            <section aria-labelledby="ozellikler-baslik" className="lg:col-span-6 lg:col-start-1 lg:self-start" data-reveal>
              <h2 id="ozellikler-baslik" className="font-display text-2xl font-bold uppercase tracking-[0.06em] text-ink">
                Ürün Özellikleri
              </h2>
              <dl className="mt-4 divide-y divide-ink/10 rounded-sm border border-ink/10 bg-white px-4 text-[0.92rem] sm:px-5">
                <SpecRow label="Ürün kodu" mono>
                  {part.code}
                </SpecRow>
                {part.manufacturer && (
                  <SpecRow label="Ürün markası">
                    <Link href={partManufacturerHref(part.manufacturer)} className="underline-offset-4 hover:text-accent-600 hover:underline">
                      {part.manufacturer}
                    </Link>
                  </SpecRow>
                )}
                {part.oemCodes && part.oemCodes.length > 0 && (
                  <SpecRow label="OEM numarası" mono>
                    {part.oemCodes.join(", ")}
                  </SpecRow>
                )}
                <SpecRow label="Kategori">
                  <Link href={partCategoryHref(category.id)} className="underline-offset-4 hover:text-accent-600 hover:underline">
                    {category.title}
                  </Link>
                  {subcategory && ` / ${subcategory}`}
                </SpecRow>
                {part.qualities.length > 0 && (
                  <SpecRow label="Parça türü">{part.qualities.map((quality) => qualityLabels[quality]).join(", ")}</SpecRow>
                )}
                {part.specs?.map((spec, index) => (
                  <SpecRow key={`${spec.label}-${index}`} label={spec.label}>
                    {spec.value}
                  </SpecRow>
                ))}
              </dl>
              <p className="mt-3 text-sm leading-relaxed text-steel-700">{partsIntro.note}</p>
            </section>
          </div>

          <section
            aria-labelledby="uyumluluk-kontrol-baslik"
            className="mt-16 grid grid-cols-1 gap-6 rounded-sm border-l-4 border-accent bg-white p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-9"
            data-reveal
          >
            <div>
              <p className="label-mono text-[0.62rem] text-accent-600">Uyumluluk Kontrolü</p>
              <h2 id="uyumluluk-kontrol-baslik" className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-bold uppercase leading-[0.98] text-ink">
                Bu parçanın aracınıza uyduğundan emin değil misiniz?
              </h2>
              <p className="mt-3 max-w-2xl text-steel-700">
                Şasi numaranızı gönderin, ekibimiz kontrol etsin. Mesajda ürün adı, kodu ve bağlantısı hazır gelir;
                yalnızca şasi numaranızı yazmanız yeterli.
              </p>
            </div>
            <a
              href={checkHref}
              {...(checkExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="btn btn-primary h-auto min-h-[var(--btn-h)] w-full shrink-0 whitespace-normal py-3 text-center leading-tight md:w-auto"
            >
              {checkExternal && <WhatsAppIcon size={18} className="shrink-0" />}
              WhatsApp&apos;tan Uyumluluk Sor
              <ArrowRight size={16} />
            </a>
          </section>

          {paragraphs.length > 0 && (
            <section aria-labelledby="aciklama-baslik" className="mt-16 max-w-4xl" data-reveal>
              <h2 id="aciklama-baslik" className="font-display text-2xl font-bold uppercase tracking-[0.06em] text-ink">
                Ürün Açıklaması
              </h2>
              <div className="mt-4 grid gap-4 rounded-sm border border-ink/10 bg-white p-5 text-[0.98rem] leading-relaxed text-steel-700 md:p-7">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}

          {service && (
            <section
              aria-labelledby="montaj-baslik"
              className="mt-16 grid grid-cols-1 gap-6 rounded-sm bg-ink p-5 text-bone sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-9"
              data-reveal
            >
              <div>
                <p className="label-mono text-[0.62rem] text-accent-300">Parça + Usta · {service.title}</p>
                <h2 id="montaj-baslik" className="display mt-3 text-[clamp(1.7rem,3vw,2.5rem)] text-bone">
                  {installHeadline}
                </h2>
                <p className="mt-3 max-w-2xl text-steel-300">{service.summary}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
                <Link href={`${routes.home}#${service.slug}`} className="btn btn-outline">
                  Servisi İncele
                  <ArrowUpRight size={18} />
                </Link>
                <Link href={homeContactHref} className="btn btn-primary">
                  Randevu Al
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section aria-labelledby="benzer-urunler-baslik" className="mt-20">
              <div className="flex items-end justify-between gap-6 border-b border-ink/10 pb-5">
                <h2 id="benzer-urunler-baslik" className="display text-[clamp(1.8rem,3vw,2.6rem)] text-ink">
                  Benzer Ürünler
                </h2>
                <Link href={partCategoryHref(category.id)} className="link-arrow shrink-0 text-[0.8rem] text-ink hover:text-steel-700">
                  Tümü
                  <ArrowRight size={14} />
                </Link>
              </div>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                {related.map((item) => (
                  <li key={item.slug}>
                    <PartCard part={item} image={partImage(catalog, item)} categoryLabel={categoryLabel(item)} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
      <PartsCart parts={toCartParts(catalog)} />
      <JsonLd data={buildProductSchema(catalog, part)} />
    </SiteShell>
  );
}
