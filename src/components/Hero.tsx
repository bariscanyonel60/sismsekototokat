import Image from "next/image";

import { capabilityIcons } from "@/components/capabilityIcons";
import { ArrowRight, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { capabilities, heroContent } from "@/data/company";
import { images } from "@/data/images";
import { ctaLabels, routes, sectionIds } from "@/data/navigation";
import { site } from "@/data/site";
import { telHref, whatsappHref } from "@/lib/contact";
import { cssVars } from "@/lib/cssVars";

export function Hero() {
  const phone = telHref();
  const whatsapp = whatsappHref();

  return (
    <section
      id={sectionIds.home}
      aria-labelledby="hero-baslik"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(26_31_37/0.9)_0%,rgb(26_31_37/0.72)_30%,rgb(26_31_37/0.3)_62%,rgb(26_31_37/0.2)_100%)] max-md:bg-[linear-gradient(180deg,rgb(26_31_37/0.55)_0%,rgb(26_31_37/0.35)_30%,rgb(26_31_37/0.86)_62%,rgb(26_31_37/0.97)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="container-x relative flex flex-1 flex-col justify-end pb-10 pt-[calc(var(--header-h)+var(--topbar-h)+40px)] md:justify-center md:pb-16">
        <div className="max-w-[860px]">
          <p className="eyebrow hero-fade text-bone/90" style={cssVars({ "--i": 0 })}>
            <span>
              {site.wordmark} <span className="text-accent-300">•</span> Profesyonel Servis
            </span>
          </p>

          <h1 id="hero-baslik" className="display mt-6 text-[clamp(2.6rem,8.2vw,6.25rem)] leading-[0.92] text-bone md:mt-7">
            {heroContent.headlineLines.map((line, index) => (
              <span key={line} className="hero-line" style={cssVars({ "--i": index })}>
                {index === heroContent.headlineLines.length - 1 ? (
                  <>
                    {line.slice(0, -1)}
                    <span className="text-accent">.</span>
                  </>
                ) : (
                  line
                )}{" "}
              </span>
            ))}
            <span className="sr-only">– {site.name}: oto bakım, onarım ve yedek parça</span>
          </h1>

          <p
            className="lede hero-fade mt-6 max-w-[36rem] text-bone/80 md:mt-8"
            style={cssVars({ "--i": 2 })}
          >
            {heroContent.description}
          </p>

          <div
            className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:mt-9"
            style={cssVars({ "--i": 3 })}
          >
            <a href={`#${sectionIds.contact}`} className="btn btn-primary">
              {ctaLabels.primaryLong}
              <ArrowRight size={18} />
            </a>
            {whatsapp ? (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <WhatsAppIcon size={18} />
                {ctaLabels.whatsappReach}
              </a>
            ) : (
              <a href={routes.parts} className="btn btn-outline">
                {ctaLabels.parts}
              </a>
            )}
            {phone && (
              <a
                href={phone}
                className="link-arrow px-2 py-3 text-[0.95rem] text-bone/85 hover:text-accent sm:ml-3"
              >
                <PhoneIcon size={18} className="text-accent" />
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
        <span className="size-1.5 bg-accent" />
      </aside>

      <div className="container-x relative pb-8 md:pb-10">
        <ul
          aria-label="Hizmet verilen araç grupları"
          className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-x-10"
        >
          {capabilities.map((item, index) => {
            const Icon = capabilityIcons[item.icon];
            return (
              <li key={item.label} className="hero-fade" style={cssVars({ "--i": 4 + index })}>
                <span className="hero-rule block h-px bg-bone/25" style={cssVars({ "--i": index })}>
                  <span className="block h-px w-8 bg-accent" />
                </span>
                <div className="mt-4 flex items-center gap-3">
                  <Icon size={26} strokeWidth={1.3} className="shrink-0 text-accent-300" />
                  <span className="font-display text-base font-semibold uppercase tracking-[0.1em] text-bone sm:text-lg md:text-xl">
                    {item.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
