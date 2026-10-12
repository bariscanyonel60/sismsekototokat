import Image from "next/image";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { images } from "@/data/images";
import { ctaLabels, routes, sectionIds } from "@/data/navigation";
import { partCategories, partsIntro } from "@/data/parts";
import { contactHref, isExternalHref } from "@/lib/contact";
import { cssVars } from "@/lib/cssVars";

export function PartsHero() {
  const inquiry = contactHref({ kind: "part", part: "yedek parça" });
  const external = isExternalHref(inquiry);

  return (
    <section aria-labelledby="yedek-parca-baslik" className="noise relative isolate overflow-hidden bg-ink">
      <div className="absolute inset-0 -z-10">
        <Image
          src={images.serviceEngine.src}
          alt={images.serviceEngine.alt}
          fill
          preload
          fetchPriority="high"
          placeholder="blur"
          sizes="100vw"
          className="hero-zoom object-cover object-[70%_50%] opacity-80"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(26_31_37/0.94)_0%,rgb(26_31_37/0.78)_40%,rgb(26_31_37/0.3)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />
        <div className="tech-grid absolute inset-0 opacity-70" />
      </div>

      <div className="container-x relative pb-14 pt-[calc(var(--header-h)+var(--topbar-h)+40px)] md:pb-20 md:pt-[calc(var(--header-h)+var(--topbar-h)+72px)]">
        <div className="hero-fade" style={cssVars({ "--i": 0 })}>
          <Breadcrumb items={[{ label: partsIntro.eyebrow, href: routes.parts }]} />
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <h1 id="yedek-parca-baslik" className="display text-[clamp(3.1rem,8.2vw,6.5rem)] text-bone">
              <span className="hero-line" style={cssVars({ "--i": 0 })}>
                Yedek Parça<span className="text-amber">.</span>
              </span>
              <span className="hero-line text-steel-500" style={cssVars({ "--i": 1 })}>
                Hazır Stokta.
              </span>
            </h1>
            <p className="lede hero-fade mt-7 max-w-[36rem] text-bone/78" style={cssVars({ "--i": 2 })}>
              {partsIntro.description}
            </p>
            <div
              className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
              style={cssVars({ "--i": 3 })}
            >
              <a href={`#${sectionIds.catalog}`} className="btn btn-primary">
                {ctaLabels.parts}
                <ArrowRight size={18} />
              </a>
              <a
                href={inquiry}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="btn btn-outline"
              >
                {ctaLabels.partInquiry}
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          <div className="hero-fade lg:col-span-5" style={cssVars({ "--i": 4 })}>
            <div className="corner-marks border border-bone/12 bg-ink/60 p-7 backdrop-blur-md md:p-9">
              <p className="label-mono text-amber">Stok Gücü</p>
              <p className="display mt-5 text-[clamp(4rem,9vw,7.5rem)] leading-[0.85] text-bone">
                {partsIntro.stock.value}
              </p>
              <p className="mt-3 font-display text-lg font-semibold uppercase tracking-[0.14em] text-steel-300">
                {partsIntro.stock.caption}
              </p>
              <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-bone/12 pt-6">
                {partCategories.map((category) => (
                  <li key={category.id} className="label-mono flex items-start gap-2 text-[0.65rem] text-bone/80">
                    <span className="mt-1 size-1 shrink-0 bg-amber" aria-hidden />
                    {category.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
