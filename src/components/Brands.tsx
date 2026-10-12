import { ArrowUpRight, BusIcon, CarIcon } from "@/components/icons";
import { SectionHeading } from "@/components/SectionHeading";
import { brandGroupLabels, brandsByGroup, brandsIntro, type Brand, type BrandGroup } from "@/data/brands";
import { sectionIds } from "@/data/navigation";
import { contactHref, isExternalHref } from "@/lib/contact";
import { delay } from "@/lib/cssVars";

const groupGrid: Record<BrandGroup, string> = {
  passenger: "grid-cols-2 sm:grid-cols-5",
  commercial: "grid-cols-2 sm:grid-cols-4",
};

function GroupIcon({ group }: { group: BrandGroup }) {
  switch (group) {
    case "passenger":
      return <CarIcon size={28} strokeWidth={1.3} className="text-accent" />;
    case "commercial":
      return <BusIcon size={28} strokeWidth={1.3} className="text-accent" />;
    default: {
      const exhaustive: never = group;
      return exhaustive;
    }
  }
}

function BrandTile({ brand, index }: { brand: Brand; index: number }) {
  const href = contactHref({ kind: "brand", brand: brand.plain });
  const external = isExternalHref(href);
  return (
    <li className="border-b border-r border-ink/12" data-reveal style={delay(index % 5)}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={`${brand.plain} servis ve yedek parça bilgisi alın`}
        className="group relative flex h-full min-h-[96px] flex-col justify-between gap-3 p-4 transition-colors duration-500 hover:bg-bone-100 sm:min-h-[132px] sm:p-3 md:min-h-[168px] md:p-6"
      >
        <span className="absolute left-0 top-0 h-0.5 w-0 bg-accent transition-[width] duration-700 ease-out-expo group-hover:w-full" />
        <ArrowUpRight
          size={16}
          className="self-end text-steel-400 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
        <span>
          <span className="display block break-words text-[clamp(1.2rem,6.2vw,1.6rem)] sm:text-[clamp(1.1rem,2.3vw,2.6rem)] text-steel-500 transition-colors duration-500 group-hover:text-accent">
            {brand.name}
          </span>
          {brand.note && <span className="label-mono mt-1.5 block text-[0.62rem] text-steel-500">{brand.note}</span>}
        </span>
      </a>
    </li>
  );
}

function BrandGroupBlock({ group, withOthers }: { group: BrandGroup; withOthers?: boolean }) {
  const list = brandsByGroup(group);
  const othersHref = contactHref({ kind: "general" });
  const othersExternal = isExternalHref(othersHref);
  return (
    <div>
      <div className="flex items-center gap-4 border-b border-ink/12 pb-4">
        <GroupIcon group={group} />
        <h3 className="font-display text-lg font-semibold uppercase tracking-[0.14em] text-ink md:text-xl">
          {brandGroupLabels[group]}
        </h3>
        <span className="label-mono ml-auto text-steel-500">{String(list.length).padStart(2, "0")} marka</span>
      </div>
      <ul className={`grid border-l border-ink/12 ${groupGrid[group]}`}>
        {list.map((brand, index) => (
          <BrandTile key={brand.name} brand={brand} index={index} />
        ))}
        {withOthers && (
          <li className="border-b border-r border-ink/12 bg-ink" data-reveal style={delay(list.length % 5)}>
            <a
              href={othersHref}
              target={othersExternal ? "_blank" : undefined}
              rel={othersExternal ? "noopener noreferrer" : undefined}
              className="group flex h-full min-h-[96px] flex-col justify-between gap-3 p-4 sm:min-h-[132px] md:min-h-[168px] md:p-6"
            >
              <ArrowUpRight
                size={16}
                className="self-end text-accent-300 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              <span className="font-display text-base font-semibold uppercase leading-tight tracking-[0.08em] text-bone md:text-lg">
                {brandsIntro.others}
                <span className="label-mono mt-1.5 block text-[0.62rem] tracking-[0.16em] text-steel-300">
                  Markanızı sorun
                </span>
              </span>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

export function Brands() {
  return (
    <section
      id={sectionIds.brands}
      aria-labelledby="markalar-baslik"
      className="section-y relative overflow-hidden bg-white text-ink"
    >
      <div className="container-x relative">
        <SectionHeading
          tone="light"
          id="markalar-baslik"
          index="05"
          eyebrow={brandsIntro.eyebrow}
          title={brandsIntro.title}
          description={brandsIntro.description}
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:gap-16">
          <BrandGroupBlock group="passenger" withOthers />
          <BrandGroupBlock group="commercial" />
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-steel-500" data-reveal>
          {brandsIntro.note}
        </p>
      </div>
    </section>
  );
}
