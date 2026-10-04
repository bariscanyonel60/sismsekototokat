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
      className="section-y noise relative overflow-hidden bg-graphite"
    >
      <div className="container-x relative">
        <SectionHeading
          id="surec-baslik"
          index="06"
          eyebrow={processIntro.eyebrow}
          title={processIntro.title}
          description={processIntro.description}
        />

        <ol className="relative mt-16 grid lg:mt-24 lg:grid-cols-5">
          <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-bone/12 lg:hidden">
            <span className="process-progress block h-full w-px bg-amber" />
          </span>
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-bone/12 lg:block">
            <span className="process-progress block h-px w-full bg-amber" />
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
                  <span className="relative block size-[15px] rotate-45 border-2 border-amber bg-graphite transition-colors duration-500 group-hover:bg-amber" />
                  {!last && (
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="ml-auto hidden text-bone/30 lg:absolute lg:right-6 lg:top-[-1px] lg:block"
                    />
                  )}
                </div>

                <span aria-hidden className="display outline-text mt-0 block text-[clamp(4.5rem,7vw,7rem)] leading-[0.8] [-webkit-text-stroke:1px_rgb(242_241_236/0.3)] transition-[color] duration-500 group-hover:text-bone/10 lg:mt-10">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-[1.55rem] font-bold uppercase leading-tight tracking-[0.03em] text-bone">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[22rem] text-[0.95rem] leading-relaxed text-steel-300">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
