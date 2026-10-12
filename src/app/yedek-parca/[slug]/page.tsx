import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowRight, ArrowUpRight, WhatsAppIcon } from "@/components/icons";
import { SiteShell } from "@/components/SiteShell";
import { segmentLabels } from "@/data/brands";
import { ctaLabels, routes } from "@/data/navigation";
import {
  brandsForPart,
  getPart,
  getPartCategory,
  partHref,
  partImage,
  parts,
  partsIntro,
  qualityLabels,
  relatedParts,
  type Part,
} from "@/data/parts";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { contactHref, isExternalHref, type ContactContext } from "@/lib/contact";
import { cssVars } from "@/lib/cssVars";
import { buildPageMetadata } from "@/lib/metadata";

interface PartPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return parts.map((part) => ({ slug: part.slug }));
}

function segmentList(part: Part): string {
  return part.segments.map((segment) => segmentLabels[segment]).join(", ");
}

export async function generateMetadata({ params }: PartPageProps): Promise<Metadata> {
  const { slug } = await params;
  const part = getPart(slug);
  if (!part) return {};

  const qualities = part.qualities.length
    ? ` ${part.qualities.map((quality) => qualityLabels[quality]).join(" ve ")} seçenekleri mevcut.`
    : "";

  return buildPageMetadata(
    {
      title: `${part.title} – Yedek Parça`,
      description: `${part.description} Araç grubu: ${segmentList(part)}.${qualities} Stok ve fiyat için WhatsApp'tan yazın.`,
      socialTitle: `${part.title} | ${site.name} Yedek Parça`,
      socialDescription: `${part.description} 450.000 hazır stoktan; stok ve fiyat için tek mesaj yeterli.`,
      path: partHref(part.slug),
      index: true,
    },
    { ownOgImage: true },
  );
}

export default async function PartPage({ params }: PartPageProps) {
  const { slug } = await params;
  const part = getPart(slug);
  if (!part) notFound();

  const category = getPartCategory(part.category);
  const image = partImage(part);
  const service = services.find((item) => item.slug === category.serviceSlug);
  const compatibleBrands = brandsForPart(part);
  const related = relatedParts(part);
  const context: ContactContext = { kind: "part", part: part.title };
  const inquiryHref = contactHref(context);
  const inquiryExternal = isExternalHref(inquiryHref);

  return (
    <SiteShell currentPath={routes.parts} contactContext={context}>
      <div className="bg-ink pb-5 pt-[calc(var(--header-h)+var(--topbar-h)+20px)]">
        <div className="container-x">
          <Breadcrumb
            items={[{ label: partsIntro.eyebrow, href: routes.parts }, { label: part.title }]}
            className="hero-fade"
          />
        </div>
      </div>

      <div className="bg-bone-100 text-ink">
        <div className="container-x pb-20 pt-10 md:pb-28 lg:pt-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="hero-fade lg:col-span-6" style={cssVars({ "--i": 1 })}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-ink/10 bg-white shadow-[0_30px_60px_-36px_rgb(26_31_37/0.45)]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
                <span className="label-mono absolute left-4 top-4 rounded-sm bg-white/90 px-3 py-1.5 text-[0.62rem] text-ink shadow-sm backdrop-blur">
                  {category.index} · {category.title}
                </span>
                <span className="label-mono absolute bottom-4 left-4 rounded-sm bg-amber px-3 py-2 text-[0.68rem] text-ink shadow-sm">
                  {partsIntro.stock.value} hazır stok
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 lg:pt-2">
              <p className="eyebrow hero-fade text-ink" style={cssVars({ "--i": 2 })}>
                {category.title}
              </p>
              <h1 className="display hero-fade mt-5 text-[clamp(2.6rem,5.6vw,4.8rem)] leading-[0.92] text-ink" style={cssVars({ "--i": 3 })}>
                {part.title}
                <span className="text-amber">.</span>
              </h1>
              <p className="lede hero-fade mt-6 max-w-xl text-steel-700" style={cssVars({ "--i": 4 })}>
                {part.description}
              </p>

              <dl
                className="hero-fade mt-9 divide-y divide-ink/10 rounded-md border border-ink/10 bg-white px-5"
                style={cssVars({ "--i": 5 })}
              >
                <div className="grid gap-2 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="label-mono text-[0.65rem] text-steel-500">Araç Grubu</dt>
                  <dd className="flex flex-wrap gap-2">
                    {part.segments.map((segment) => (
                      <span key={segment} className="label-mono rounded-sm bg-bone-300/70 px-2.5 py-1 text-[0.62rem] text-ink">
                        {segmentLabels[segment]}
                      </span>
                    ))}
                  </dd>
                </div>
                {part.qualities.length > 0 && (
                  <div className="grid gap-2 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="label-mono text-[0.65rem] text-steel-500">Parça Seçeneği</dt>
                    <dd className="flex flex-wrap gap-2">
                      {part.qualities.map((quality) => (
                        <span
                          key={quality}
                          className={`label-mono rounded-sm px-2.5 py-1 text-[0.62rem] ${
                            quality === "orijinal" ? "bg-amber text-ink" : "bg-ink text-bone"
                          }`}
                        >
                          {qualityLabels[quality]}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                <div className="grid gap-2 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="label-mono text-[0.65rem] text-steel-500">Uygun Markalar</dt>
                  <dd className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {compatibleBrands.map((brand) => (
                      <span key={brand.plain} className="font-display text-base font-semibold uppercase tracking-[0.08em] text-steel-700">
                        {brand.name}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row" style={cssVars({ "--i": 6 })}>
                <a
                  href={inquiryHref}
                  className="btn btn-primary"
                  {...(inquiryExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {inquiryExternal && <WhatsAppIcon size={18} />}
                  {ctaLabels.partInquiry}
                </a>
                <Link href={routes.parts} className="btn border border-ink/20 text-ink hover:border-ink">
                  Kataloğa Dön
                  <ArrowRight size={18} />
                </Link>
              </div>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-steel-700">{partsIntro.note}</p>
            </div>
          </div>

          {service && (
            <section
              aria-labelledby="montaj-baslik"
              className="mt-20 grid gap-6 rounded-md bg-ink p-6 text-bone md:grid-cols-[1fr_auto] md:items-center md:p-9"
              data-reveal
            >
              <div>
                <p className="label-mono text-[0.65rem] text-amber">Parça + Usta</p>
                <h2 id="montaj-baslik" className="display mt-3 text-[clamp(1.8rem,3vw,2.6rem)] text-bone">
                  Montajı da {service.title.toLocaleLowerCase("tr-TR")} hizmetimizle yapalım
                </h2>
                <p className="mt-3 max-w-2xl text-steel-300">{service.summary}</p>
              </div>
              <Link href={`${routes.home}#${service.slug}`} className="btn btn-outline shrink-0">
                Hizmeti İncele
                <ArrowUpRight size={18} />
              </Link>
            </section>
          )}

          {related.length > 0 && (
            <section aria-labelledby="benzer-urunler-baslik" className="mt-20">
              <div className="flex items-end justify-between gap-6 border-b border-ink/10 pb-6">
                <h2 id="benzer-urunler-baslik" className="display text-[clamp(1.8rem,3vw,2.6rem)] text-ink">
                  Benzer Ürünler
                </h2>
                <Link href={routes.parts} className="link-arrow shrink-0 text-[0.8rem] text-ink hover:text-steel-700">
                  Tüm Katalog
                  <ArrowRight size={14} />
                </Link>
              </div>
              <ul className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
                {related.map((item) => {
                  const itemImage = partImage(item);
                  return (
                    <li key={item.slug} data-reveal>
                      <Link
                        href={partHref(item.slug)}
                        className="group flex h-full flex-col overflow-hidden rounded-md border border-ink/10 bg-white transition-[box-shadow,border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_48px_-24px_rgb(26_31_37/0.35)]"
                      >
                        <span className="relative block aspect-[16/10] overflow-hidden bg-bone-300">
                          <Image
                            src={itemImage.src}
                            alt={itemImage.alt}
                            fill
                            sizes="(min-width: 768px) 30vw, 100vw"
                            placeholder="blur"
                            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                          />
                        </span>
                        <span className="flex flex-1 flex-col p-5">
                          <span className="label-mono text-[0.6rem] text-steel-500">{getPartCategory(item.category).title}</span>
                          <span className="display mt-2 text-[1.6rem] leading-tight text-ink">{item.title}</span>
                          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-ink">
                            Ürünü İncele
                            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
