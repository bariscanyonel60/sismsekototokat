import Image from "next/image";

import { ArrowRight, PhoneIcon } from "@/components/icons";
import { capabilities } from "@/data/company";
import { images } from "@/data/images";
import { ctaLabels, routes, sectionIds } from "@/data/navigation";
import { site } from "@/data/site";
import { telHref } from "@/lib/contact";
import { cssVars } from "@/lib/cssVars";

const headlineLines = ["Aracınız İçin", "Profesyonel", "Bakım."];

export function Hero() {
  const phone = telHref();

  return (
    <section
      id={sectionIds.home}
      aria-labelledby="hero-baslik"
      className="noise relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={images.heroWorkshop.src}
          alt={images.heroWorkshop.alt}
          fill
          preload
          fetchPriority="high"
          placeholder="blur"
          sizes="100vw"
          className="hero-zoom object-cover object-[74%_50%] md:object-[62%_50%] xl:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(13_15_17/0.96)_0%,rgb(13_15_17/0.86)_30%,rgb(13_15_17/0.45)_62%,rgb(13_15_17/0.42)_100%)] max-md:bg-[linear-gradient(180deg,rgb(13_15_17/0.55)_0%,rgb(13_15_17/0.35)_30%,rgb(13_15_17/0.86)_62%,rgb(13_15_17/0.97)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent" />
        <div className="tech-grid absolute inset-0 opacity-70" />
      </div>

      <div className="container-x relative flex flex-1 flex-col justify-end pb-10 pt-[calc(var(--header-h)+var(--topbar-h)+40px)] md:justify-center md:pb-16">
        <div className="max-w-[860px]">
          <p className="eyebrow hero-fade text-bone/90" style={cssVars({ "--i": 0 })}>
            {site.wordmark} <span className="text-amber">•</span> Profesyonel Servis
          </p>

          <h1 id="hero-baslik" className="display mt-7 text-[clamp(3.1rem,8.6vw,6rem)] text-bone">
            {headlineLines.map((line, index) => (
              <span key={line} className="hero-line" style={cssVars({ "--i": index })}>
                {index === headlineLines.length - 1 ? (
                  <>
                    {line.slice(0, -1)}
                    <span className="text-amber">.</span>
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          <p
            className="lede hero-fade mt-7 max-w-[34rem] text-bone/78 md:mt-8"
            style={cssVars({ "--i": 2 })}
          >
            Otomobil, hafif ticari, ağır vasıta ve otobüsler için mekanik ve elektronik arıza tespiti,
            bakım onarım ve 450.000 hazır stok yedek parça.
          </p>

          <div
            className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            style={cssVars({ "--i": 3 })}
          >
            <a href={`#${sectionIds.contact}`} className="btn btn-primary">
              {ctaLabels.primaryLong}
              <ArrowRight size={18} />
            </a>
            <a href={routes.parts} className="btn btn-outline">
              {ctaLabels.parts}
            </a>
            {phone && (
              <a
                href={phone}
                className="link-arrow px-2 py-3 text-[0.95rem] text-bone/85 hover:text-amber sm:ml-3"
              >
                <PhoneIcon size={18} className="text-amber" />
                {site.contact.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      <aside
        aria-hidden
        className="pointer-events-none absolute right-[var(--gutter)] top-1/2 hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex"
      >
        <span className="label-mono text-bone/50">N° 01</span>
        <span className="h-24 w-px bg-bone/25" />
        <span className="label-mono text-bone/60 [writing-mode:vertical-rl]">{site.slogans.range}</span>
        <span className="h-24 w-px bg-bone/25" />
        <span className="size-1.5 bg-amber" />
      </aside>

      <div className="container-x relative pb-8 md:pb-10">
        <ul
          aria-label="Hizmet verilen araç grupları"
          className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-x-10"
        >
          {capabilities.map((item, index) => (
            <li key={item.label} className="hero-fade" style={cssVars({ "--i": 4 + index })}>
              <span className="hero-rule block h-px bg-bone/25" style={cssVars({ "--i": index })}>
                <span className="block h-px w-8 bg-amber" />
              </span>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="label-mono text-amber">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-display text-lg font-semibold uppercase tracking-[0.1em] text-bone md:text-xl">
                  {item.label}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
