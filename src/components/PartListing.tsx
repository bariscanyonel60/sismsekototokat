import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowRight, ArrowUpRight, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PartLinkCard } from "@/components/PartLinkCard";
import { PartsCart } from "@/components/PartsCart";
import { PartsMenu } from "@/components/PartsMenu";
import { SiteShell } from "@/components/SiteShell";
import { ctaLabels, homeContactHref, routes } from "@/data/navigation";
import { partsIntro } from "@/data/parts";
import type { Service } from "@/data/services";
import { toCartParts, toPartsMenu } from "@/lib/catalog/helpers";
import type { Catalog, Part } from "@/lib/catalog/types";
import { contactHref, isExternalHref, type ContactContext } from "@/lib/contact";
import { cssVars } from "@/lib/cssVars";
import { buildFaqPageSchema, buildPartListSchema, type BreadcrumbItem, type FaqEntry } from "@/lib/structuredData";

export interface PartGroup {
  id: string;
  title: string;
  parts: Part[];
  /** Karttaki küçük etiket; boşsa grup başlığı yeterlidir. */
  label?: (part: Part) => string | undefined;
}

export interface ListingLink {
  href: string;
  label: string;
  /** Bağlantının altındaki kısa bilgi, örn. "5 ürün". */
  meta?: string;
}

export interface LinkSection {
  id: string;
  title: string;
  links: ListingLink[];
}

interface PartListingProps {
  catalog: Catalog;
  path: string;
  /** Sayfanın tek h1'i, örn. "Renault Fren Sistemi Parçaları". */
  heading: string;
  eyebrow: string;
  /** Veriden üretilen giriş paragrafları. */
  intro: string[];
  /** "Yedek Parça" ile bu sayfa arasındaki ara adımlar (örn. marka sayfası). */
  trail?: BreadcrumbItem[];
  groups: PartGroup[];
  /** Ürünlerden önce gösterilen alt sayfa bağlantıları (kategoriler, modeller). */
  shortcuts?: LinkSection[];
  related: LinkSection[];
  faqs?: FaqEntry[];
  service?: Service;
  contactContext: ContactContext;
}

function LinkGrid({ section, headingClass }: { section: LinkSection; headingClass: string }) {
  return (
    <section aria-labelledby={`${section.id}-baslik`}>
      <h2 id={`${section.id}-baslik`} className={headingClass}>
        {section.title}
      </h2>
      <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {section.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex min-h-14 items-center justify-between gap-4 rounded-sm border border-ink/10 bg-white px-4 py-3 transition-colors hover:border-accent"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-ink group-hover:text-accent-600">{link.label}</span>
                {link.meta && <span className="mt-0.5 block text-sm text-steel-700">{link.meta}</span>}
              </span>
              <ArrowRight size={14} className="shrink-0 text-steel-500 group-hover:text-accent" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Marka, kategori, marka + kategori ve model açılış sayfalarının ortak düzeni: tüm ürünler sunucuda,
 * taranabilir bağlantılarla listelenir; SSS sayfada görünür ve FAQPage verisiyle eşleşir.
 */
export function PartListing({
  catalog,
  path,
  heading,
  eyebrow,
  intro,
  trail = [],
  groups,
  shortcuts = [],
  related,
  faqs = [],
  service,
  contactContext,
}: PartListingProps) {
  const visible = groups.filter((group) => group.parts.length > 0);
  const allParts = visible.flatMap((group) => group.parts);
  const inquiryHref = contactHref(contactContext);
  const inquiryExternal = isExternalHref(inquiryHref);
  const relatedSections = related.filter((section) => section.links.length > 0);

  return (
    <SiteShell currentPath={routes.parts} contactContext={contactContext}>
      <div className="bg-ink pb-12 pt-[calc(var(--header-h)+var(--topbar-h)+20px)] text-bone md:pb-16">
        <div className="container-x">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <PartsMenu menu={toPartsMenu(catalog)} />
            <Breadcrumb
              items={[{ label: partsIntro.eyebrow, href: routes.parts }, ...trail, { label: heading }]}
              className="hero-fade"
            />
          </div>
          <p className="eyebrow hero-fade mt-10 text-accent-300" style={cssVars({ "--i": 1 })}>
            {eyebrow}
          </p>
          <h1
            className="hero-fade mt-4 max-w-4xl font-display text-[clamp(2.4rem,5vw,4.2rem)] font-bold uppercase leading-[0.95] tracking-[0.01em]"
            style={cssVars({ "--i": 2 })}
          >
            {heading}
          </h1>
          <div className="hero-fade mt-5 grid max-w-3xl gap-3 text-[1.05rem] leading-relaxed text-steel-300" style={cssVars({ "--i": 3 })}>
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="hero-fade mt-8 flex flex-wrap items-center gap-3" style={cssVars({ "--i": 4 })}>
            <span className="label-mono rounded-sm border border-bone/15 px-3 py-2 text-[0.65rem] text-bone">
              {allParts.length} ürün
            </span>
            <a
              href={inquiryHref}
              className="btn btn-primary btn-sm"
              {...(inquiryExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {inquiryExternal && <WhatsAppIcon size={16} />}
              {ctaLabels.partInquiry}
            </a>
          </div>
          {visible.length > 1 && (
            <nav aria-label="Bu sayfadaki gruplar" className="hero-fade mt-8" style={cssVars({ "--i": 5 })}>
              <ul className="flex flex-wrap gap-2">
                {visible.map((group) => (
                  <li key={group.id}>
                    <a
                      href={`#${group.id}`}
                      className="inline-flex rounded-full border border-bone/15 px-4 py-2 text-sm text-steel-300 transition-colors hover:border-accent hover:text-bone"
                    >
                      {group.title} ({group.parts.length})
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      <div className="bg-bone-100 text-ink">
        <div className="container-x grid gap-16 pb-20 pt-12 md:pb-28">
          {shortcuts
            .filter((section) => section.links.length > 0)
            .map((section) => (
              <LinkGrid
                key={section.id}
                section={section}
                headingClass="display border-b border-ink/10 pb-5 text-[clamp(1.7rem,2.8vw,2.4rem)] text-ink"
              />
            ))}

          {visible.map((group, groupIndex) => (
            <section key={group.id} id={group.id} aria-labelledby={`${group.id}-baslik`} className="scroll-mt-28">
              <h2
                id={`${group.id}-baslik`}
                className="display border-b border-ink/10 pb-5 text-[clamp(1.7rem,2.8vw,2.4rem)] text-ink"
              >
                {group.title}
              </h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
                {group.parts.map((part, index) => (
                  <li key={part.slug}>
                    <PartLinkCard
                      catalog={catalog}
                      part={part}
                      label={group.label?.(part)}
                      preload={groupIndex === 0 && index === 0}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {visible.length === 0 && (
            <p className="rounded-md border border-ink/10 bg-white p-6 text-steel-700">
              Bu grupta henüz listelenmiş ürün yok. Aradığınız parçayı WhatsApp&apos;tan sorabilirsiniz.
            </p>
          )}

          {service && (
            <section
              aria-labelledby="montaj-baslik"
              className="grid grid-cols-1 gap-6 rounded-sm bg-ink p-5 text-bone sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-9"
            >
              <div>
                <p className="label-mono text-[0.62rem] text-accent-300">Parça + Usta</p>
                <h2 id="montaj-baslik" className="display mt-3 text-[clamp(1.6rem,2.8vw,2.3rem)] text-bone">
                  {service.title}
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

          {faqs.length > 0 && (
            <section aria-labelledby="sss-baslik" className="max-w-4xl">
              <h2 id="sss-baslik" className="display border-b border-ink/10 pb-5 text-[clamp(1.7rem,2.8vw,2.4rem)] text-ink">
                Sık Sorulan Sorular
              </h2>
              <ul>
                {faqs.map((faq, index) => (
                  <li key={faq.question} className="border-b border-ink/10">
                    <details className="faq group" open={index === 0}>
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                        <h3 className="text-[1.05rem] leading-snug">{faq.question}</h3>
                        <span aria-hidden className="mt-0.5 text-xl leading-none text-accent transition-transform group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="pb-6 leading-relaxed text-steel-700">{faq.answer}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {relatedSections.length > 0 && (
            <div className="grid gap-12 rounded-md border border-ink/10 bg-white p-6 md:p-8">
              {relatedSections.map((section) => (
                <LinkGrid
                  key={section.id}
                  section={section}
                  headingClass="font-display text-xl font-bold uppercase tracking-[0.06em] text-ink"
                />
              ))}
              <Link href={routes.parts} className="link-arrow text-[0.8rem] text-ink hover:text-steel-700">
                Tüm Katalog
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
      <PartsCart parts={toCartParts(catalog)} />
      <JsonLd data={buildPartListSchema(heading, path, allParts)} />
      {faqs.length > 0 && <JsonLd data={buildFaqPageSchema(faqs)} />}
    </SiteShell>
  );
}
