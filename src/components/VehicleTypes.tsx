import Image from "next/image";

import { ArrowRight, BusIcon, CarIcon } from "@/components/icons";
import { SectionHeading } from "@/components/SectionHeading";
import { sectionIds } from "@/data/navigation";
import { vehicleTypes, vehicleTypesIntro, type VehicleType } from "@/data/vehicleTypes";
import { contactHref, isExternalHref } from "@/lib/contact";
import { delay } from "@/lib/cssVars";

function BrandLine({ vehicle }: { vehicle: VehicleType }) {
  if (vehicle.id === "commercial") {
    return (
      <div>
        <p className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          {vehicle.brandNames.map((name) => (
            <span key={name} className="display text-[clamp(2.4rem,4.4vw,4.25rem)] text-bone">
              {name}
            </span>
          ))}
        </p>
        <p className="label-mono mt-2 text-accent-300">{vehicle.brandsSuffix}</p>
      </div>
    );
  }
  return (
    <div>
      <ul className="flex flex-wrap gap-2" aria-label={`${vehicle.label} markaları`}>
        {vehicle.brandNames.map((name) => (
          <li
            key={name}
            className="border border-bone/25 bg-ink/55 px-3 py-1.5 font-display text-base font-semibold uppercase tracking-[0.12em] text-bone"
          >
            {name}
          </li>
        ))}
      </ul>
      <p className="label-mono mt-3 text-bone/60">{vehicle.brandsSuffix}</p>
    </div>
  );
}

function VehiclePanel({ vehicle, index }: { vehicle: VehicleType; index: number }) {
  const commercial = vehicle.id === "commercial";
  const href = contactHref({ kind: "vehicleGroup", group: vehicle.label });
  const external = isExternalHref(href);

  return (
    <article
      aria-labelledby={`arac-${vehicle.id}`}
      className={`group relative isolate flex min-h-[620px] flex-col justify-end overflow-hidden bg-ink text-bone md:min-h-[680px] lg:min-h-[760px] ${
        commercial ? "lg:col-span-7" : "lg:col-span-5"
      }`}
      data-reveal
      style={delay(index)}
    >
      <Image
        src={vehicle.image.src}
        alt={vehicle.image.alt}
        fill
        placeholder="blur"
        sizes={commercial ? "(min-width:1024px) 58vw, 100vw" : "(min-width:1024px) 42vw, 100vw"}
        className={`-z-10 object-cover transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.03] ${
          commercial ? "object-[30%_60%]" : "object-[50%_40%]"
        }`}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(26_31_37/0.5)_0%,rgb(26_31_37/0.1)_30%,rgb(26_31_37/0.78)_62%,rgb(26_31_37/0.97)_100%)]" />

      <div className="absolute left-6 top-6 flex items-center gap-4 md:left-10 md:top-10">
        <span className="display text-5xl text-accent md:text-6xl">{vehicle.index}</span>
        <span className="h-px w-10 bg-bone/40" />
        {commercial ? (
          <BusIcon size={30} strokeWidth={1.3} className="text-bone/85" />
        ) : (
          <CarIcon size={30} strokeWidth={1.3} className="text-bone/85" />
        )}
        <span className="label-mono text-bone/85">{vehicle.label}</span>
      </div>

      {vehicle.insetImage && (
        <div className="absolute right-6 top-6 hidden aspect-[4/3] w-[34%] max-w-[280px] overflow-hidden border border-bone/20 md:right-10 md:top-10 md:block">
          <Image
            src={vehicle.insetImage.src}
            alt={vehicle.insetImage.alt}
            fill
            placeholder="blur"
            sizes="280px"
            className="object-cover"
          />
          <span className="label-mono absolute bottom-0 left-0 bg-ink/80 px-3 py-1.5 text-[0.62rem] text-bone/85">
            {vehicle.insetCaption}
          </span>
        </div>
      )}

      <div className="relative p-6 md:p-10">
        <BrandLine vehicle={vehicle} />
        <h3 id={`arac-${vehicle.id}`} className="display mt-8 text-[clamp(1.9rem,2.8vw,2.6rem)]">
          {vehicle.title}
        </h3>
        <p className="mt-4 max-w-[36rem] text-[0.98rem] leading-relaxed text-bone/75">{vehicle.description}</p>

        <div className="mt-8 flex flex-col gap-6 border-t border-bone/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Öne çıkan işlemler">
            {vehicle.highlights.map((item) => (
              <li key={item} className="label-mono flex items-center gap-2 text-bone/70">
                <span className="size-1 bg-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="link-arrow min-h-11 shrink-0 text-sm text-accent-300 hover:text-bone"
          >
            Servis Bilgisi Al
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

export function VehicleTypes() {
  return (
    <section
      id={sectionIds.vehicles}
      aria-labelledby="arac-gruplari-baslik"
      className="section-y relative overflow-hidden bg-bone text-ink"
    >
      <div className="container-x relative">
        <SectionHeading
          id="arac-gruplari-baslik"
          index="04"
          eyebrow={vehicleTypesIntro.eyebrow}
          title={vehicleTypesIntro.title}
          description={vehicleTypesIntro.description}
          tone="light"
        />
        <div className="mt-14 grid gap-4 md:gap-5 lg:mt-20 lg:grid-cols-12">
          {vehicleTypes.map((vehicle, index) => (
            <VehiclePanel key={vehicle.id} vehicle={vehicle} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
