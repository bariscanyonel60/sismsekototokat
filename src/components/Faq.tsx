import Link from "next/link";

import { ArrowRight } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading } from "@/components/SectionHeading";
import { faqIntro, faqs } from "@/data/faq";
import { sectionIds } from "@/data/navigation";
import { delay } from "@/lib/cssVars";
import { buildFaqSchema } from "@/lib/structuredData";

export function Faq({ index }: { index: string }) {
  return (
    <section id={sectionIds.faq} aria-labelledby="sss-baslik" className="section-y relative bg-white text-ink">
      <div className="container-x relative">
        <SectionHeading
          tone="light"
          id="sss-baslik"
          index={index}
          eyebrow={faqIntro.eyebrow}
          title={faqIntro.title}
          description={faqIntro.description}
        />

        <ul className="mt-14 border-t border-ink/12 lg:mt-20">
          {faqs.map((faq, i) => (
            <li key={faq.question} className="border-b border-ink/12" data-reveal style={delay(i)}>
              <details className="faq group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start gap-4 py-6 md:gap-10 md:py-7 [&::-webkit-details-marker]:hidden">
                  <span aria-hidden className="label-mono mt-2.5 text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex-1 pt-1.5 font-display text-[clamp(1.2rem,2vw,1.75rem)] font-bold uppercase leading-tight tracking-[0.02em] text-ink transition-colors group-hover:text-accent">
                    {faq.question}
                  </h3>
                  <span
                    aria-hidden
                    className="relative mt-1 inline-flex size-11 shrink-0 items-center justify-center border border-ink/20 transition-colors duration-300 group-open:border-accent group-open:bg-accent"
                  >
                    <span className="absolute h-0.5 w-4 bg-ink transition-colors group-open:bg-white" />
                    <span className="absolute h-4 w-0.5 bg-ink transition-transform duration-300 group-open:rotate-90 group-open:bg-white" />
                  </span>
                </summary>
                <div className="pb-8 pl-0 md:pl-[4.6rem] md:pr-24">
                  <p className="max-w-3xl text-[1rem] leading-relaxed text-steel-700 md:text-[1.06rem]">{faq.answer}</p>
                  {faq.link && (
                    <Link href={faq.link.href} className="link-arrow mt-5 text-sm text-accent hover:text-ink">
                      {faq.link.label}
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
      <JsonLd data={buildFaqSchema()} />
    </section>
  );
}
