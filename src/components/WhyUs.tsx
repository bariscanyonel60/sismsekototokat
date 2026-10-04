import Image from "next/image";

import { advantages, whyUsContent } from "@/data/company";
import { sectionIds } from "@/data/navigation";
import { delay } from "@/lib/cssVars";

export function WhyUs() {
  const total = String(advantages.length).padStart(2, "0");

  return (
    <section
      id={sectionIds.why}
      aria-labelledby="neden-biz-baslik"
      className="section-y relative overflow-hidden bg-bone text-ink"
    >
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 xl:col-span-6">
          <figure className="relative lg:sticky lg:top-[calc(var(--header-h)+32px)]" data-reveal="mask">
            <div data-mask>
            <div className="chamfer relative aspect-[4/4.6] overflow-hidden bg-ink sm:aspect-[4/3.6] lg:aspect-[4/5]">
              <Image
                src={whyUsContent.image.src}
                alt={whyUsContent.image.alt}
                fill
                placeholder="blur"
                sizes="(min-width:1024px) 48vw, 100vw"
                className="object-cover object-[62%_50%]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(13_15_17/0.85)_100%)]" />
              <span className="display outline-text pointer-events-none absolute -bottom-6 -left-2 text-[clamp(7rem,16vw,15rem)] leading-none [-webkit-text-stroke:1px_rgb(242_241_236/0.28)]">
                {total}
              </span>
            </div>
            </div>
            <figcaption className="absolute bottom-6 right-6 flex items-center gap-3 md:bottom-8 md:right-8">
              <span className="size-1.5 bg-amber" aria-hidden />
              <span className="label-mono text-bone/85">{whyUsContent.imageCaption}</span>
            </figcaption>
          </figure>
        </div>

        <div className="lg:col-span-6 lg:pl-6 xl:col-span-5 xl:col-start-8 xl:pl-0">
          <div className="flex items-center gap-5" data-reveal>
            <span className="label-mono text-ink">05</span>
            <span className="h-px flex-1 bg-ink/15" />
            <span className="eyebrow text-ink">{whyUsContent.eyebrow}</span>
          </div>

          <h2 id="neden-biz-baslik" className="heading-xl mt-10" data-reveal style={delay(1)}>
            {whyUsContent.titleLines.map((line, index) => (
              <span key={line} className={`block ${index === 1 ? "text-steel-500" : ""}`}>
                {line}
              </span>
            ))}
          </h2>
          <p className="lede mt-7 text-steel-700" data-reveal style={delay(2)}>
            {whyUsContent.description}
          </p>

          <ol className="mt-12 border-t border-ink/15">
            {advantages.map((item, index) => (
              <li
                key={item.title}
                className="group relative grid grid-cols-[auto_1fr] gap-x-6 border-b border-ink/15 py-7 md:gap-x-10 md:py-8"
                data-reveal
                style={delay(index % 3)}
              >
                <span className="absolute left-0 top-[-1px] h-0.5 w-0 bg-amber transition-[width] duration-700 ease-out-expo group-hover:w-full" />
                <span
                  aria-hidden
                  className="display text-[clamp(2.6rem,4vw,3.5rem)] leading-[0.85] text-steel-400 transition-colors duration-500 group-hover:text-amber-600"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[1.45rem] font-bold uppercase leading-tight tracking-[0.03em] md:text-[1.65rem]">
                      {item.title}
                    </h3>
                    <span className="label-mono hidden shrink-0 text-steel-500 sm:inline">
                      {String(index + 1).padStart(2, "0")} / {total}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.97rem] leading-relaxed text-steel-700">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
