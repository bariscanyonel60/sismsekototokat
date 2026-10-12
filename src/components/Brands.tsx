import { ArrowUpRight } from "@/components/icons";
import { SectionHeading } from "@/components/SectionHeading";
import { brandGroupLabels, brands, brandsIntro } from "@/data/brands";
import { sectionIds } from "@/data/navigation";
import { contactHref, isExternalHref } from "@/lib/contact";
import { delay } from "@/lib/cssVars";

export function Brands() {
  return (
    <section
      id={sectionIds.brands}
      aria-labelledby="markalar-baslik"
      className="section-y noise relative overflow-hidden bg-ink"
    >
      <div className="container-x relative">
        <SectionHeading
          id="markalar-baslik"
          index="05"
          eyebrow={brandsIntro.eyebrow}
          title={brandsIntro.title}
          description={brandsIntro.description}
        />

        <ul className="mt-14 grid grid-cols-2 border-l border-t border-bone/12 md:grid-cols-4 lg:mt-20">
          {brands.map((brand, index) => {
            const href = contactHref({ kind: "brand", brand: brand.plain });
            const external = isExternalHref(href);
            const commercial = brand.group === "commercial";
            return (
              <li key={brand.name} className="border-b border-r border-bone/12" data-reveal style={delay(index % 4)}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="group relative flex h-full min-h-[150px] flex-col justify-between gap-8 p-5 transition-colors duration-500 hover:bg-anthracite md:min-h-[210px] md:p-7"
                >
                  <span className="absolute left-0 top-0 h-0.5 w-0 bg-amber transition-[width] duration-700 ease-out-expo group-hover:w-full" />
                  <span className="flex items-start justify-between gap-3">
                    <span className={`label-mono text-[0.65rem] ${commercial ? "text-amber" : "text-steel-400"}`}>
                      {brandGroupLabels[brand.group]}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-steel-500 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber"
                    />
                  </span>
                  <span>
                    <span className="display block text-[clamp(2.1rem,4.4vw,4rem)] text-steel-500 transition-colors duration-500 group-hover:text-bone">
                      {brand.name}
                    </span>
                    {brand.note && (
                      <span className="label-mono mt-2 block text-[0.65rem] text-steel-400">{brand.note}</span>
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between" data-reveal>
          <p className="font-display text-xl font-semibold uppercase tracking-[0.12em] text-bone">
            {brandsIntro.others}
            <span className="text-amber">.</span>
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-steel-400">{brandsIntro.note}</p>
        </div>
      </div>
    </section>
  );
}
