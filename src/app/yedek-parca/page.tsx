import type { Metadata } from "next";
import Link from "next/link";

import { AppointmentCTA } from "@/components/AppointmentCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CheckIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PartList } from "@/components/PartList";
import { PartsCart } from "@/components/PartsCart";
import { PartsCatalog } from "@/components/PartsCatalog";
import { PartsHero } from "@/components/PartsHero";
import { RevealObserver } from "@/components/RevealObserver";
import { StickyContact } from "@/components/StickyContact";
import { brands } from "@/data/brands";
import { routes, sectionIds } from "@/data/navigation";
import { partsIntro, partsPerks } from "@/data/parts";
import { pageSeo } from "@/data/seo";
import {
  partBrandHref,
  partCategoryHref,
  partManufacturerHref,
  toCartParts,
  toPartsMenu,
} from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";
import { buildPageMetadata } from "@/lib/metadata";
import { brandHeading, categoryNoun } from "@/lib/seo/copy";
import { buildPartsCatalogSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata(pageSeo.parts, { ownOgImage: true });

export default async function PartsPage() {
  const catalog = await getCatalog();
  const menu = toPartsMenu(catalog);
  const { manufacturers } = menu;
  return (
    <>
      <a href="#icerik" className="skip-link">
        İçeriğe geç
      </a>
      <Header currentPath={routes.parts} />
      <main id="icerik">
        <PartsHero menu={menu} />
        <section
          id={sectionIds.catalog}
          aria-label={partsIntro.catalogTitle}
          className="scroll-mt-[var(--header-h)] bg-bone-100 pb-14 text-ink md:pb-20"
        >
          <div className="container-x">
            <PartsCatalog catalog={catalog} />
          </div>
        </section>
        <section aria-labelledby="parca-rehberi-baslik" className="bg-bone-100 pb-14 text-ink md:pb-20">
          <div className="container-x grid gap-10 rounded-sm border border-ink/10 bg-white p-6 md:grid-cols-2 md:p-10">
            <h2 id="parca-rehberi-baslik" className="sr-only">
              Kategoriye ve markaya göre yedek parça
            </h2>
            <nav aria-labelledby="kategori-rehberi-baslik">
              <h3 id="kategori-rehberi-baslik" className="font-display text-xl font-bold uppercase tracking-[0.06em]">
                Kategoriye Göre Yedek Parça
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {catalog.categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={partCategoryHref(category.id)}
                      className="inline-flex min-h-10 items-center rounded-xs border border-ink/15 px-3.5 text-sm transition-colors hover:border-accent hover:text-accent-600"
                    >
                      {categoryNoun(category)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-labelledby="marka-rehberi-baslik">
              <h3 id="marka-rehberi-baslik" className="font-display text-xl font-bold uppercase tracking-[0.06em]">
                Markaya Göre Yedek Parça
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <li key={brand.plain}>
                    <Link
                      href={partBrandHref(brand)}
                      className="inline-flex min-h-10 items-center rounded-xs border border-ink/15 px-3.5 text-sm transition-colors hover:border-accent hover:text-accent-600"
                    >
                      {brandHeading(brand)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {manufacturers.length > 0 && (
              <nav aria-labelledby="urun-markasi-rehberi-baslik" className="md:col-span-2">
                <h3 id="urun-markasi-rehberi-baslik" className="font-display text-xl font-bold uppercase tracking-[0.06em]">
                  Ürün Markasına Göre
                </h3>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {manufacturers.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={partManufacturerHref(item.name)}
                        className="inline-flex min-h-10 items-center rounded-xs border border-ink/15 px-3.5 text-sm transition-colors hover:border-accent hover:text-accent-600"
                      >
                        {item.name} ({item.count})
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </section>
        <section aria-label="Neden Şimşek Oto yedek parça" className="border-y border-ink/10 bg-bone-100 text-ink">
          <ul className="container-x grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
            {partsPerks.map((perk) => (
              <li key={perk.title} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <CheckIcon size={18} />
                </span>
                <span>
                  <span className="block font-display text-lg font-bold uppercase tracking-[0.04em]">{perk.title}</span>
                  <span className="mt-0.5 block text-sm text-steel-700">{perk.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <PartList />
        <AppointmentCTA index="02" />
      </main>
      <Footer />
      <StickyContact context={{ kind: "general" }} />
      <PartsCart parts={toCartParts(catalog)} />
      <RevealObserver />
      <JsonLd data={buildPartsCatalogSchema(catalog)} />
    </>
  );
}
