import Link from "next/link";

import { CountUp } from "@/components/CountUp";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { categoryIcons } from "@/components/partCategoryIcons";
import { SectionHeading } from "@/components/SectionHeading";
import { brands } from "@/data/brands";
import { ctaLabels, routes, sectionIds } from "@/data/navigation";
import { partsIntro } from "@/data/parts";
import { services } from "@/data/services";
import { categoryIndex, partCategoryHref } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";
import { delay } from "@/lib/cssVars";

export async function PartsTeaser() {
  const catalog = await getCatalog();
  const metrics = [
    { value: brands.length, label: "Araç ve motor markası" },
    { value: services.length, label: "Servis hizmeti" },
    { value: catalog.categories.length, label: "Parça kategorisi" },
  ];
  return (
    <section
      id={sectionIds.parts}
      aria-labelledby="yedek-parca-ozet-baslik"
      className="section-y relative overflow-hidden bg-bone-100 text-ink"
    >
      <div className="container-x relative">
        <SectionHeading
          tone="light"
          id="yedek-parca-ozet-baslik"
          index="03"
          eyebrow={partsIntro.eyebrow}
          title={partsIntro.teaserTitle}
          description={partsIntro.description}
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4" data-reveal>
            <p className="display text-[clamp(4rem,9vw,8rem)] leading-[0.85] text-accent">
              <CountUp value={partsIntro.stock.value} />
            </p>
            <p className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.14em] text-ink">
              {partsIntro.stock.caption}
            </p>
            <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-steel-500">
              {partsIntro.stock.detail}
            </p>

            <dl className="mt-8 grid grid-cols-3 border-y border-ink/12">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col-reverse justify-end border-r border-ink/12 py-5 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4"
                >
                  <dt className="label-mono mt-2 text-[0.62rem] leading-snug text-steel-500">{metric.label}</dt>
                  <dd className="display text-[clamp(1.9rem,3vw,2.5rem)] leading-none text-ink">
                    <CountUp value={String(metric.value)} />
                  </dd>
                </div>
              ))}
            </dl>

            <Link href={routes.parts} className="btn btn-primary mt-10">
              {ctaLabels.parts}
              <ArrowRight size={18} />
            </Link>
          </div>

          <ul className="border-t border-ink/12 lg:col-span-7 lg:col-start-6">
            {catalog.categories.map((category, index) => {
              const Icon = categoryIcons[category.icon];
              return (
                <li key={category.id} className="border-b border-ink/12" data-reveal style={delay(index)}>
                  <Link
                    href={partCategoryHref(category.id)}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 md:gap-8 md:py-7"
                  >
                    <span className="inline-flex size-12 items-center justify-center border border-ink/15 text-accent transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-white md:size-14">
                      <Icon size={26} />
                    </span>
                    <span>
                      <span className="flex items-baseline gap-4">
                        <span className="label-mono text-steel-500">{categoryIndex(catalog, category.id)}</span>
                        <span className="display text-[clamp(1.6rem,2.6vw,2.4rem)] text-ink transition-colors duration-500 group-hover:text-accent">
                          {category.title}
                        </span>
                      </span>
                      <span className="mt-2 block text-[0.95rem] text-steel-500">{category.summary}</span>
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="text-steel-500 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
