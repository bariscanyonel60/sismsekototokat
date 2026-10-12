import type { Metadata } from "next";
import Link from "next/link";

import { AppointmentCTA } from "@/components/AppointmentCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ArrowUpRight } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PartsCatalog } from "@/components/PartsCatalog";
import { PartsHero } from "@/components/PartsHero";
import { RevealObserver } from "@/components/RevealObserver";
import { SectionHeading } from "@/components/SectionHeading";
import { StickyContact } from "@/components/StickyContact";
import { routes, sectionIds } from "@/data/navigation";
import { partCategories, partsIntro } from "@/data/parts";
import { pageSeo } from "@/data/seo";
import { services } from "@/data/services";
import { buildPageMetadata } from "@/lib/metadata";
import { buildPartsCatalogSchema } from "@/lib/structuredData";

export const metadata: Metadata = buildPageMetadata(pageSeo.parts, { ownOgImage: true });

function RelatedServices() {
  return (
    <section aria-labelledby="ilgili-hizmetler-baslik" className="section-y relative bg-ink">
      <div className="container-x">
        <SectionHeading
          id="ilgili-hizmetler-baslik"
          index="02"
          eyebrow="Parça + Usta"
          title="Parçayı Alın, Montajı Bize Bırakın"
          description="Stoktan temin ettiğimiz parçaların montajını ve ilgili bakım onarımı aynı serviste yapıyoruz."
        />
        <ul className="mt-14 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {partCategories.map((category) => {
            const service = services.find((item) => item.slug === category.serviceSlug);
            if (!service) return null;
            return (
              <li key={category.id} className="bg-ink" data-reveal>
                <Link
                  href={`${routes.home}#${service.slug}`}
                  className="group flex h-full flex-col gap-6 p-6 transition-colors duration-300 hover:bg-anthracite md:p-8"
                >
                  <span className="label-mono text-[0.65rem] text-steel-500">
                    {category.index} · {category.title}
                  </span>
                  <span className="font-display text-2xl font-semibold uppercase leading-tight tracking-[0.04em] text-bone">
                    {service.title}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm text-amber">
                    Hizmeti İncele
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default function PartsPage() {
  return (
    <>
      <a href="#icerik" className="skip-link">
        İçeriğe geç
      </a>
      <Header currentPath={routes.parts} />
      <main id="icerik">
        <PartsHero />
        <section
          id={sectionIds.catalog}
          aria-labelledby="parca-katalogu-baslik"
          className="section-y relative bg-bone-100 text-ink"
        >
          <div className="container-x relative">
            <SectionHeading
              id="parca-katalogu-baslik"
              index="01"
              tone="light"
              eyebrow={partsIntro.catalogTitle}
              title={partsIntro.title}
              description={partsIntro.catalogDescription}
            />
            <div className="mt-14 lg:mt-20">
              <PartsCatalog />
            </div>
          </div>
        </section>
        <RelatedServices />
        <AppointmentCTA index="03" />
      </main>
      <Footer />
      <StickyContact context={{ kind: "general" }} />
      <RevealObserver />
      <JsonLd data={buildPartsCatalogSchema()} />
    </>
  );
}
