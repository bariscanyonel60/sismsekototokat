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
import { partsIntro } from "@/data/parts";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { partBrandHref, partCategoryHref } from "@/lib/catalog/helpers";
import { brandHeading } from "@/lib/seo/copy";
import { getCatalog } from "@/lib/catalog/store";
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
    <p className="label-mono mb-7 flex items-center gap-3 text-bone">
      <span className="h-px w-5 bg-accent" aria-hidden />
      {children}
    </p>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center text-[0.95rem] text-steel-300 transition-colors duration-300 hover:text-bone"
    >
      <span
        className="mr-0 h-px w-0 bg-accent transition-all duration-500 ease-out-expo group-hover:mr-3 group-hover:w-4"
        aria-hidden
      />
      {children}
    </Link>
  );
}

function SeeAll({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="link-arrow mt-5 text-[0.8rem] text-accent-300 hover:text-bone">
      {children}
      <ArrowRight size={14} />
    </Link>
  );
}

function ContactLine({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xs border border-bone/12 text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="label-mono text-[0.65rem] text-steel-400">{label}</p>
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

export async function Footer({ contactAnchor = `#${sectionIds.contact}` }: FooterProps) {
  const { categories } = await getCatalog();
  const { contact } = site;
  const phone = telHref();
  const whatsapp = whatsappHref();
  const cta = whatsapp ?? contactAnchor;
  const ctaExternal = isExternalHref(cta);
  const [sloganLead, sloganRest] = splitSlogan(site.slogans.road);
  return (
    <footer className="relative overflow-hidden bg-ink">
      <div className="absolute inset-x-0 top-0 h-px bg-bone/10" aria-hidden>
        <span className="block h-px w-24 bg-accent md:w-40" />
      </div>

      <div className="container-x relative">
        <div className="grid gap-10 border-b border-bone/10 pb-14 pt-20 md:pt-28 lg:grid-cols-12 lg:items-end lg:pb-20">
          <div className="lg:col-span-7">
            <p className="eyebrow text-accent-300">{site.wordmark}</p>
            <p className="display mt-6 text-[clamp(2.75rem,7.4vw,7rem)] leading-[0.88] text-bone">
              {sloganLead}
              <br />
              <span className="text-steel-500">{sloganRest}</span>
              <span className="text-accent">.</span>
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
              <span className="mt-1 hidden text-accent sm:block">{item.icon}</span>
              <span>
                <span className="display block text-[clamp(1.5rem,2.4vw,2.2rem)] text-bone">{item.value}</span>
                <span className="mt-1 block text-sm text-steel-400">{item.label}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-b border-bone/10 py-16 sm:grid-cols-3 lg:grid-cols-5 lg:gap-10 lg:py-20">
          <nav aria-label="Kategoriler">
            <FooterHeading>Kategoriler</FooterHeading>
            <ul className="space-y-3.5">
              <li>
                <FooterLink href={`${routes.parts}#${sectionIds.catalog}`}>Oto Yedek Parça</FooterLink>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <FooterLink href={partCategoryHref(category.id)}>{category.title}</FooterLink>
                </li>
              ))}
            </ul>
            <SeeAll href={routes.parts}>Tüm Katalog</SeeAll>
          </nav>

          <nav aria-label="Markaya göre yedek parça">
            <FooterHeading>Markaya Göre Parça</FooterHeading>
            <ul className="space-y-3.5">
              {brands.map((brand) => (
                <li key={brand.plain}>
                  <FooterLink href={partBrandHref(brand)}>{brandHeading(brand)}</FooterLink>
                </li>
              ))}
            </ul>
            <SeeAll href={`${routes.home}#${sectionIds.brands}`}>Tümünü Görüntüle</SeeAll>
          </nav>

          <nav aria-label="Hizmetler">
            <FooterHeading>Hizmetler</FooterHeading>
            <ul className="space-y-3.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <FooterLink href={`${routes.home}#${service.slug}`}>{service.title}</FooterLink>
                </li>
              ))}
            </ul>
            <SeeAll href={`${routes.home}#${sectionIds.services}`}>Tüm Hizmetler</SeeAll>
          </nav>

          <div>
            <nav aria-label="Kurumsal">
              <FooterHeading>Kurumsal</FooterHeading>
              <ul className="space-y-3.5">
                {corporateLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Gizlilik ve kullanım" className="mt-12">
              <FooterHeading>Gizlilik ve Kullanım</FooterHeading>
              <ul className="space-y-3.5">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
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

        <div className="flex flex-col gap-6 border-b border-bone/10 py-10 lg:flex-row lg:items-center lg:gap-10">
          <Link href={routes.home} aria-label="Şimşek Oto ana sayfa" className="inline-block shrink-0">
            <Logo className="h-24 md:h-28" sizes="180px" />
          </Link>
          <p className="max-w-md leading-relaxed text-steel-300">{site.shortDescription}</p>
          <ul aria-label="Hizmet verilen araç grupları" className="flex flex-wrap gap-2 lg:ml-auto lg:max-w-md lg:justify-end">
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

        <div className="flex flex-col gap-6 py-8 text-sm text-steel-400 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <p>
              © {new Date().getFullYear()} {site.name}. Tüm hakları saklıdır.
            </p>
            <MediaCredit className="self-start sm:self-auto" />
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#icerik" className="group label-mono inline-flex items-center gap-3 text-[0.7rem] text-bone">
              Başa Dön
              <span className="grid size-9 place-items-center rounded-xs border border-bone/15 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                <ArrowUp size={16} className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
