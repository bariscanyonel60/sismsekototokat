import { ArrowRight } from "@/components/icons";
import { SectionHeading } from "@/components/SectionHeading";
import { processIntro, processSteps } from "@/data/company";
import { sectionIds } from "@/data/navigation";
import { delay } from "@/lib/cssVars";

export function ServiceProcess() {
  return (
    <section
      id={sectionIds.process}
      aria-labelledby="surec-baslik"
      className="section-y relative overflow-hidden bg-white text-ink"
    >
      <div className="container-x relative">
        <SectionHeading
          tone="light"
          id="surec-baslik"
          index="07"
          eyebrow={processIntro.eyebrow}
          title={processIntro.title}
          description={processIntro.description}
        />

        <ol className="relative mt-16 grid lg:mt-24 lg:grid-cols-5">
          <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-ink/12 lg:hidden">
            <span className="process-progress block h-full w-px bg-accent" />
          </span>
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-ink/12 lg:block">
            <span className="process-progress block h-px w-full bg-accent" />
          </span>

          {processSteps.map((step, index) => {
            const last = index === processSteps.length - 1;
            return (
              <li
                key={step.title}
                className="group relative pb-12 pl-12 last:pb-0 lg:pb-0 lg:pl-0 lg:pr-8"
                data-reveal
                style={delay(index)}
              >
                <div className="absolute left-0 top-0 flex items-center lg:relative">
                  <span className="relative block size-[15px] rotate-45 border-2 border-accent bg-white transition-colors duration-500 group-hover:bg-accent" />
                  {!last && (
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="ml-auto hidden text-ink/30 lg:absolute lg:right-6 lg:top-[-1px] lg:block"
                    />
                  )}
                </div>

                <span
                  aria-hidden
                  className="display -mt-2 block text-[clamp(3.25rem,5.4vw,5rem)] leading-[0.85] text-accent transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 lg:mt-8"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-[1.55rem] font-bold uppercase leading-tight tracking-[0.03em] text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[22rem] text-[0.95rem] leading-relaxed text-steel-700">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
