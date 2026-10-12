import { Breadcrumb } from "@/components/Breadcrumb";
import { PartsMenu } from "@/components/PartsMenu";
import { routes } from "@/data/navigation";
import { partsIntro } from "@/data/parts";
import type { PartsMenuData } from "@/lib/catalog/types";
import { cssVars } from "@/lib/cssVars";

export function PartsHero({ menu }: { menu: PartsMenuData }) {
  return (
    <section aria-labelledby="yedek-parca-baslik" className="bg-ink text-bone">
      <div className="container-x pb-36 pt-[calc(var(--header-h)+var(--topbar-h)+28px)] md:pb-40 md:pt-[calc(var(--header-h)+var(--topbar-h)+44px)]">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <PartsMenu menu={menu} />
          <div className="hero-fade" style={cssVars({ "--i": 0 })}>
            <Breadcrumb items={[{ label: partsIntro.eyebrow, href: routes.parts }]} />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h1 id="yedek-parca-baslik" className="display hero-fade text-[clamp(2.6rem,6vw,4.6rem)] text-bone" style={cssVars({ "--i": 1 })}>
            Oto Yedek Parça<span className="text-accent">.</span>
          </h1>
          <p className="hero-fade max-w-[34rem] text-[1.02rem] leading-relaxed text-bone/75 lg:text-right" style={cssVars({ "--i": 2 })}>
            {partsIntro.catalogDescription}
          </p>
        </div>
      </div>
    </section>
  );
}
