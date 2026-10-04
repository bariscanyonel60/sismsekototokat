import Image from "next/image";

import { ArrowUpRight } from "@/components/icons";
import { SectionHeading } from "@/components/SectionHeading";
import { sectionIds } from "@/data/navigation";
import { services, servicesIntro, type Service } from "@/data/services";
import { contactHref, isExternalHref } from "@/lib/contact";
import { delay } from "@/lib/cssVars";

const layout = [
  { span: "md:col-span-2 lg:col-span-7", aspect: "aspect-[4/3.4] md:aspect-[16/9] lg:aspect-auto lg:h-[600px]", sizes: "(min-width:1024px) 58vw, 100vw", featured: true },
  { span: "lg:col-span-5", aspect: "aspect-[4/3.4] md:aspect-[4/4.6] lg:aspect-auto lg:h-[600px]", sizes: "(min-width:1024px) 42vw, (min-width:768px) 50vw, 100vw", featured: true },
];
const standard = {
  span: "lg:col-span-4",
  aspect: "aspect-[4/3.4] md:aspect-[4/4.6] lg:aspect-[4/4.3]",
  sizes: "(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw",
  featured: false,
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const isLastOdd = index === services.length - 1 && (services.length - 1) % 2 === 1;
  const config =
    layout[index] ??
    (isLastOdd
      ? {
          ...standard,
          span: "md:col-span-2 lg:col-span-4",
          aspect: "aspect-[4/3.4] md:aspect-[16/8] lg:aspect-[4/4.3]",
          sizes: "(min-width:1024px) 33vw, 100vw",
        }
      : standard);
  const href = contactHref({ kind: "service", service: service.title });
  const external = isExternalHref(href);

  return (
    <li className={`${config.span}`} data-reveal style={delay(index % 3)}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={`${service.title}: ${service.summary} Bilgi almak için iletişime geçin.`}
        className={`group relative isolate block overflow-hidden bg-anthracite ${config.aspect}`}
      >
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes={config.sizes}
          placeholder="blur"
          className="-z-10 object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(13_15_17/0.35)_0%,rgb(13_15_17/0.05)_35%,rgb(13_15_17/0.72)_70%,rgb(13_15_17/0.95)_100%)] transition-opacity duration-700 group-hover:opacity-90" />
        <div className="absolute inset-0 -z-10 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/20" />

        <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-amber transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
        <span className="pointer-events-none absolute inset-3 border border-bone/0 transition-colors duration-700 group-hover:border-bone/15" />

        <div className="flex h-full flex-col justify-between p-6 md:p-8">
          <div className="flex items-start justify-between">
            <span className="label-mono text-bone/80">
              <span className="text-amber">{String(index + 1).padStart(2, "0")}</span>
              <span className="mx-2 text-bone/30">/</span>
              {String(services.length).padStart(2, "0")}
            </span>
            <span className="inline-flex size-11 items-center justify-center border border-bone/25 text-bone transition-all duration-500 ease-out-expo group-hover:border-amber group-hover:bg-amber group-hover:text-ink">
              <ArrowUpRight size={18} className="transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
            </span>
          </div>

          <div>
            <ul className="mb-4 flex flex-wrap gap-2" aria-hidden>
              {service.tags.map((tag) => (
                <li
                  key={tag}
                  className="label-mono border border-bone/20 bg-ink/30 px-2.5 py-1 text-[0.65rem] text-bone/75 backdrop-blur-sm"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <h3
              className={`display text-bone ${
                config.featured ? "text-[clamp(2.2rem,3.6vw,3.6rem)]" : "text-[clamp(1.9rem,2.4vw,2.4rem)]"
              }`}
            >
              {service.title}
            </h3>
            <p className="mt-3 max-w-[30rem] text-[0.97rem] leading-relaxed text-bone/72 transition-colors duration-500 group-hover:text-bone/90">
              {service.summary}
            </p>
          </div>
        </div>
      </a>
    </li>
  );
}

export function Services() {
  return (
    <section
      id={sectionIds.services}
      aria-labelledby="hizmetler-baslik"
      className="section-y noise relative overflow-hidden bg-graphite"
    >
      <div className="container-x relative">
        <SectionHeading
          id="hizmetler-baslik"
          index="02"
          eyebrow={servicesIntro.eyebrow}
          title={servicesIntro.title}
          description={servicesIntro.description}
        />

        <ul className="mt-14 grid gap-4 md:grid-cols-2 md:gap-5 lg:mt-20 lg:grid-cols-12">
          {services.map((service, index) => (
            <ServiceCard key={service.slug} service={service} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
