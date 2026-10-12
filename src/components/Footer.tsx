import type { ReactNode } from "react";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUp,
  ClockIcon,
  EngineIcon,
  FilterIcon,
  PhoneIcon,
  PinIcon,
  SearchIcon,
  SuspensionIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { Logo } from "@/components/Logo";
import { MediaCredit } from "@/components/MediaCredit";
import { brands } from "@/data/brands";
import { capabilities } from "@/data/company";
import { corporateLinks, ctaLabels, legalLinks, routes, sectionIds } from "@/data/navigation";
import { partCategories, partsIntro } from "@/data/parts";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { isExternalHref, telHref, whatsappHref } from "@/lib/contact";

const PENDING = "Yakında eklenecek";

const highlights = [
  { icon: <SearchIcon size={20} />, value: partsIntro.stock.value, label: "Hazır stok yedek parça" },
  { icon: <EngineIcon size={20} />, value: "Orijinal", label: "Otokar · Deutz · Cummins arıza tespit cihazı" },
  { icon: <SuspensionIcon size={20} />, value: "Orijinal & Muadil", label: "Ön takım parça seçenekleri" },
  { icon: <FilterIcon size={20} />, value: "Her Araç", label: "Binekten otobüse bakım ve onarım" },
];

function FooterHeading({ children }: { children: string }) {
  return (
    <h2 className="label-mono mb-7 flex items-center gap-3 text-bone">
      <span className="h-px w-5 bg-amber" aria-hidden />
      {children}
    </h2>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center text-[0.95rem] text-steel-300 transition-colors duration-300 hover:text-bone"
    >
      <span
        className="mr-0 h-px w-0 bg-amber transition-all duration-500 ease-out-expo group-hover:mr-3 group-hover:w-4"
        aria-hidden
      />
      {children}
    </Link>
  );
}

function ContactLine({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xs border border-bone/12 text-amber">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="label-mono text-[0.65rem] text-steel-500">{label}</p>
        <div className="mt-1 text-[0.95rem] text-steel-300">{children}</div>
      </div>
    </li>
  );
}

function splitSlogan(slogan: string): [string, string] {
  const words = slogan.replace(/\.$/, "").split(" ");
  return [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
}

interface FooterProps {
  /** Sayfada iletişim bölümü yoksa ana sayfadaki bölüme yönlendirilir. */
  contactAnchor?: string;
}

export function Footer({ contactAnchor = `#${sectionIds.contact}` }: FooterProps) {
  const { contact } = site;
  const phone = telHref();
  const whatsapp = whatsappHref();
  const cta = whatsapp ?? contactAnchor;
  const ctaExternal = isExternalHref(cta);
  const [sloganLead, sloganRest] = splitSlogan(site.slogans.road);
  return (
    <footer className="noise relative overflow-hidden bg-ink">
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-bone/10" aria-hidden>
        <span className="block h-px w-24 bg-amber md:w-40" />
      </div>

      <div className="container-x relative">
        <div className="grid gap-10 border-b border-bone/10 pb-14 pt-20 md:pt-28 lg:grid-cols-12 lg:items-end lg:pb-20">
          <div className="lg:col-span-7">
            <p className="eyebrow text-amber">{site.wordmark}</p>
            <p className="display mt-6 text-[clamp(2.75rem,7.4vw,7rem)] leading-[0.88] text-bone">
              {sloganLead}
              <br />
              <span className="text-steel-500">{sloganRest}</span>
              <span className="text-amber">.</span>
            </p>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <p className="max-w-md leading-relaxed text-steel-300">{site.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={cta}
                className="btn btn-primary"
                {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {ctaLabels.primaryLong}
                <ArrowRight size={18} />
              </a>
              <Link href={routes.parts} className="btn btn-outline">
                {ctaLabels.parts}
              </Link>
              {phone && (
                <a href={phone} className="btn btn-outline">
                  <PhoneIcon size={18} />
                  {ctaLabels.call}
                </a>
              )}
            </div>
          </div>
        </div>

        <ul
          aria-label="Öne çıkanlar"
          className="grid grid-cols-2 gap-px border-b border-bone/10 bg-bone/10 lg:grid-cols-4"
        >
          {highlights.map((item) => (
            <li key={item.label} className="flex items-start gap-4 bg-ink px-4 py-8 lg:px-6">
              <span className="mt-1 hidden text-amber sm:block">{item.icon}</span>
              <span>
                <span className="display block text-[clamp(1.5rem,2.4vw,2.2rem)] text-bone">{item.value}</span>
                <span className="mt-1 block text-sm text-steel-400">{item.label}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-x-6 gap-y-14 border-b border-bone/10 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="col-span-2 lg:col-span-3">
            <Link href={routes.home} aria-label="Şimşek Oto ana sayfa" className="inline-block">
              <Logo className="h-32 md:h-36" sizes="220px" />
            </Link>
            <p className="mt-6 max-w-sm leading-relaxed text-steel-300">{site.shortDescription}</p>
            <ul aria-label="Hizmet verilen araç grupları" className="mt-8 flex max-w-sm flex-wrap gap-2">
              {capabilities.map((item) => (
                <li
                  key={item.label}
                  className="label-mono rounded-xs border border-bone/12 px-3 py-2 text-[0.65rem] text-steel-300"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Hizmetler" className="lg:col-span-2">
            <FooterHeading>Hizmetler</FooterHeading>
            <ul className="space-y-3.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <FooterLink href={`${routes.home}#${service.slug}`}>{service.title}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Yedek parça" className="lg:col-span-2">
            <FooterHeading>Yedek Parça</FooterHeading>
            <ul className="space-y-3.5">
              {partCategories.map((category) => (
                <li key={category.id}>
                  <FooterLink href={`${routes.parts}#${sectionIds.catalog}`}>{category.title}</FooterLink>
                </li>
              ))}
              <li>
                <Link
                  href={routes.parts}
                  className="link-arrow mt-2 text-[0.8rem] text-amber hover:text-bone"
                >
                  Tüm Katalog
                  <ArrowRight size={14} />
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Kurumsal" className="lg:col-span-2">
            <FooterHeading>Kurumsal</FooterHeading>
            <ul className="space-y-3.5">
              {corporateLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-3">
            <FooterHeading>İletişim</FooterHeading>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              <ContactLine icon={<PhoneIcon size={16} />} label="Telefon">
                {phone && contact.phone ? (
                  <a href={phone} className="transition-colors hover:text-bone">
                    {contact.phone}
                  </a>
                ) : (
                  PENDING
                )}
              </ContactLine>
              <ContactLine icon={<WhatsAppIcon size={16} />} label="WhatsApp">
                {whatsapp ? (
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-bone">
                    {ctaLabels.whatsapp}
                  </a>
                ) : (
                  PENDING
                )}
              </ContactLine>
              <ContactLine icon={<PinIcon size={16} />} label="Adres">
                {contact.address ? (
                  <address className="not-italic">
                    {contact.address.street}, {contact.address.district} / {contact.address.city}
                  </address>
                ) : (
                  PENDING
                )}
              </ContactLine>
              <ContactLine icon={<ClockIcon size={16} />} label="Çalışma Saatleri">
                {contact.hours
                  ? contact.hours.map((slot) => (
                      <span key={slot.schema} className="block">
                        {slot.days}: {slot.time}
                      </span>
                    ))
                  : PENDING}
              </ContactLine>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b border-bone/10 py-8 lg:flex-row lg:items-center lg:gap-10">
          <p className="label-mono shrink-0 text-[0.65rem] text-steel-500">Hizmet verdiğimiz markalar</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {brands.map((brand) => (
              <li key={brand.plain}>
                <Link
                  href={`${routes.home}#${sectionIds.brands}`}
                  className="font-display text-base font-semibold uppercase tracking-[0.1em] text-steel-400 transition-colors hover:text-amber"
                >
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6 py-8 text-sm text-steel-400 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <p>
              © {new Date().getFullYear()} {site.name}. Tüm hakları saklıdır.
            </p>
            <MediaCredit className="self-start sm:self-auto" />
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-bone">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a href="#icerik" className="group label-mono inline-flex items-center gap-3 text-[0.7rem] text-bone">
              Başa Dön
              <span className="grid size-9 place-items-center rounded-xs border border-bone/15 transition-colors duration-300 group-hover:border-amber group-hover:bg-amber group-hover:text-ink">
                <ArrowUp size={16} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
