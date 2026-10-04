import type { ReactNode } from "react";
import Link from "next/link";

import { ArrowRight, ArrowUp, ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { capabilities } from "@/data/company";
import { corporateLinks, ctaLabels, legalLinks, sectionIds } from "@/data/navigation";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { contactHref, isExternalHref, telHref, whatsappHref } from "@/lib/contact";

const PENDING = "Yakında eklenecek";

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
    <a
      href={href}
      className="group inline-flex items-center text-[0.95rem] text-steel-300 transition-colors duration-300 hover:text-bone"
    >
      <span
        className="mr-0 h-px w-0 bg-amber transition-all duration-500 ease-out-expo group-hover:mr-3 group-hover:w-4"
        aria-hidden
      />
      {children}
    </a>
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

export function Footer() {
  const { contact } = site;
  const phone = telHref();
  const whatsapp = whatsappHref();
  const cta = contactHref({ kind: "general" });
  const ctaExternal = isExternalHref(cta);
  const [sloganLead, sloganRest] = splitSlogan(site.slogans.road);
  const wordmark = site.wordmark.split(" ")[0];

  return (
    <footer className="noise relative overflow-hidden bg-ink">
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-bone/10" aria-hidden>
        <span className="block h-px w-24 bg-amber md:w-40" />
      </div>

      <div className="container-x relative">
        <div className="grid gap-10 border-b border-bone/10 pb-14 pt-20 md:pt-28 lg:grid-cols-12 lg:items-end lg:pb-20">
          <div className="lg:col-span-8">
            <p className="eyebrow text-amber">{site.wordmark}</p>
            <p className="display mt-6 text-[clamp(2.75rem,7.4vw,7rem)] leading-[0.88] text-bone">
              {sloganLead}
              <br />
              <span className="text-steel-500">{sloganRest}</span>
              <span className="text-amber">.</span>
            </p>
          </div>
          <div className="lg:col-span-4 lg:pb-3">
            <p className="max-w-sm leading-relaxed text-steel-300">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={cta}
                className="btn btn-primary"
                {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {ctaLabels.primaryLong}
                <ArrowRight size={18} />
              </a>
              {phone && (
                <a href={phone} className="btn btn-outline">
                  <PhoneIcon size={18} />
                  {ctaLabels.call}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-14 border-b border-bone/10 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="col-span-2 lg:col-span-4">
            <a href={`/#${sectionIds.home}`} aria-label="Şimşek Oto ana sayfa" className="inline-block">
              <Logo />
            </a>
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

          <nav aria-label="Hizmetler" className="lg:col-span-3 lg:col-start-5">
            <FooterHeading>Hizmetler</FooterHeading>
            <ul className="space-y-3.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <FooterLink href={`/#${sectionIds.services}`}>{service.title}</FooterLink>
                </li>
              ))}
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
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-bone"
                  >
                    {ctaLabels.whatsapp}
                  </a>
                ) : (
                  PENDING
                )}
              </ContactLine>
              <ContactLine icon={<PinIcon size={16} />} label="Adres">
                {contact.address
                  ? `${contact.address.street}, ${contact.address.district} / ${contact.address.city}`
                  : PENDING}
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

        <div className="flex flex-col gap-6 py-8 text-sm text-steel-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Tüm hakları saklıdır.
          </p>
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
            <a
              href={`#${sectionIds.home}`}
              className="group label-mono inline-flex items-center gap-3 text-[0.7rem] text-bone"
            >
              Başa Dön
              <span className="grid size-9 place-items-center rounded-xs border border-bone/15 transition-colors duration-300 group-hover:border-amber group-hover:bg-amber group-hover:text-ink">
                <ArrowUp size={16} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>
        </div>
      </div>

      <p
        aria-hidden
        className="display pointer-events-none relative -mb-[3.5vw] select-none whitespace-nowrap text-center text-[24vw] leading-[0.8] text-bone/[0.05] [mask-image:linear-gradient(to_bottom,black_25%,transparent_95%)]"
      >
        {wordmark}
      </p>
    </footer>
  );
}
