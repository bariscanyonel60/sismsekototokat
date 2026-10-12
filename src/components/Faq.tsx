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
    <section id={sectionIds.faq} aria-labelledby="sss-baslik" className="section-y noise relative bg-graphite">
      <div className="container-x relative">
        <SectionHeading
          id="sss-baslik"
          index={index}
          eyebrow={faqIntro.eyebrow}
          title={faqIntro.title}
          description={faqIntro.description}
        />

        <ul className="mt-14 border-t border-bone/12 lg:mt-20">
          {faqs.map((faq, i) => (
            <li key={faq.question} className="border-b border-bone/12" data-reveal style={delay(i)}>
              <details className="faq group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start gap-5 py-7 md:gap-10 md:py-9 [&::-webkit-details-marker]:hidden">
                  <span className="label-mono mt-2 text-amber">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display flex-1 text-[clamp(1.5rem,2.6vw,2.4rem)] text-bone transition-colors group-hover:text-amber">
                    {faq.question}
                  </h3>
                  <span
                    aria-hidden
                    className="relative mt-1 inline-flex size-11 shrink-0 items-center justify-center border border-bone/20 transition-colors duration-300 group-open:border-amber group-open:bg-amber"
                  >
                    <span className="absolute h-0.5 w-4 bg-bone transition-colors group-open:bg-ink" />
                    <span className="absolute h-4 w-0.5 bg-bone transition-transform duration-300 group-open:rotate-90 group-open:bg-ink" />
                  </span>
                </summary>
                <div className="pb-9 pl-0 md:pl-[4.6rem] md:pr-24">
                  <p className="lede max-w-3xl text-steel-300">{faq.answer}</p>
                  {faq.link && (
                    <Link href={faq.link.href} className="link-arrow mt-5 text-sm text-amber hover:text-bone">
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
