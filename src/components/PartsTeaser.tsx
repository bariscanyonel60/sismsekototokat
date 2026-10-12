import type { ComponentType } from "react";
import Link from "next/link";

import { ArrowRight, ArrowUpRight, EngineIcon, FilterIcon, OilIcon, SuspensionIcon } from "@/components/icons";
import { SectionHeading } from "@/components/SectionHeading";
import { ctaLabels, routes, sectionIds } from "@/data/navigation";
import { partCategories, partsIntro, type PartCategoryId } from "@/data/parts";
import { delay } from "@/lib/cssVars";

const categoryIcons: Record<PartCategoryId, ComponentType<{ size?: number }>> = {
  "sandik-motor": EngineIcon,
  "motor-yaglari": OilIcon,
  "filtre-setleri": FilterIcon,
  "on-takim": SuspensionIcon,
};

export function PartsTeaser() {
  return (
    <section
      id={sectionIds.parts}
      aria-labelledby="yedek-parca-ozet-baslik"
      className="section-y noise relative overflow-hidden bg-ink"
    >
      <p
        aria-hidden
        className="display outline-text pointer-events-none absolute -right-[2vw] top-[8%] select-none whitespace-nowrap text-[22vw] leading-none"
      >
        {partsIntro.stock.value}
      </p>
      <div className="container-x relative">
        <SectionHeading
          id="yedek-parca-ozet-baslik"
          index="03"
          eyebrow={partsIntro.eyebrow}
          title={partsIntro.teaserTitle}
          description={partsIntro.description}
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4" data-reveal>
            <p className="display text-[clamp(4.5rem,9vw,8rem)] leading-[0.85] text-amber">{partsIntro.stock.value}</p>
            <p className="mt-4 font-display text-xl font-semibold uppercase tracking-[0.14em] text-bone">
              {partsIntro.stock.caption}
            </p>
            <Link href={routes.parts} className="btn btn-primary mt-10">
              {ctaLabels.parts}
              <ArrowRight size={18} />
            </Link>
          </div>

          <ul className="border-t border-bone/12 lg:col-span-7 lg:col-start-6">
            {partCategories.map((category, index) => {
              const Icon = categoryIcons[category.id];
              return (
                <li key={category.id} className="border-b border-bone/12" data-reveal style={delay(index)}>
                  <Link
                    href={`${routes.parts}#${sectionIds.catalog}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 md:gap-8 md:py-7"
                  >
                    <span className="inline-flex size-12 items-center justify-center border border-bone/15 text-amber transition-colors duration-500 group-hover:border-amber group-hover:bg-amber group-hover:text-ink md:size-14">
                      <Icon size={26} />
                    </span>
                    <span>
                      <span className="flex items-baseline gap-4">
                        <span className="label-mono text-steel-500">{category.index}</span>
                        <span className="display text-[clamp(1.6rem,2.6vw,2.4rem)] text-bone transition-colors duration-500 group-hover:text-amber">
                          {category.title}
                        </span>
                      </span>
                      <span className="mt-2 block text-[0.95rem] text-steel-400">{category.summary}</span>
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="text-steel-500 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber"
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
