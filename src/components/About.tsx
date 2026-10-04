import { aboutContent, capabilities } from "@/data/company";
import { sectionIds } from "@/data/navigation";
import { site } from "@/data/site";
import { delay } from "@/lib/cssVars";

export function About() {
  return (
    <section
      id={sectionIds.about}
      aria-labelledby="hakkimizda-baslik"
      className="section-y relative overflow-hidden bg-bone text-ink"
    >
      <div className="tech-grid-light pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-x relative">
        <div className="flex items-center gap-5" data-reveal>
          <span className="label-mono text-ink">01</span>
          <span className="h-px flex-1 bg-ink/15" />
          <span className="eyebrow text-ink">{aboutContent.eyebrow}</span>
        </div>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <h2
            id="hakkimizda-baslik"
            className="display text-[clamp(2.5rem,6.2vw,5.75rem)] lg:col-span-8"
            data-reveal
            style={delay(1)}
          >
            {aboutContent.statement.lead} <span className="text-steel-500">{aboutContent.statement.accent}</span>{" "}
            {aboutContent.statement.rest}
            <span className="text-amber-600">.</span>
          </h2>

          <div className="space-y-5 self-end text-steel-700 lg:col-span-4" data-reveal style={delay(2)}>
            {aboutContent.paragraphs.map((paragraph) => (
              <p key={paragraph} className="lede">
                {paragraph}
              </p>
            ))}
            <p className="font-display text-lg font-bold uppercase tracking-[0.14em] text-ink">
              {site.slogans.primary}
            </p>
          </div>
        </div>

        <ul
          aria-label="Yetkinlikler"
          className="mt-16 grid grid-cols-2 border-t border-ink/15 lg:mt-24 lg:grid-cols-4"
        >
          {capabilities.map((item, index) => (
            <li
              key={item.label}
              className="group relative border-b border-ink/15 py-7 pr-4 max-lg:even:border-l max-lg:even:pl-5 sm:py-8 sm:pr-6 sm:max-lg:even:pl-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-10 lg:first:pl-0 lg:last:border-r-0"
              data-reveal
              style={delay(index)}
            >
              <span className="absolute left-0 top-[-1px] h-0.5 w-0 bg-amber transition-[width] duration-700 ease-out-expo group-hover:w-full" />
              <span className="label-mono text-steel-500">{String(index + 1).padStart(2, "0")} / {String(capabilities.length).padStart(2, "0")}</span>
              {item.value && (
                <span className="display mt-6 block text-6xl">
                  {item.value}
                  {item.valueCaption && (
                    <span className="ml-2 font-sans text-base normal-case text-steel-700">
                      {item.valueCaption}
                    </span>
                  )}
                </span>
              )}
              <h3 className="display mt-6 text-[clamp(1.6rem,3.1vw,2.9rem)]">{item.label}</h3>
              <p className="mt-3 text-sm text-steel-700 sm:text-[0.97rem]">{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
