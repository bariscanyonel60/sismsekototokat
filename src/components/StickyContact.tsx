import { ArrowRight, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { ctaLabels, sectionIds } from "@/data/navigation";
import { telHref, whatsappHref, type ContactContext } from "@/lib/contact";

interface StickyContactProps {
  context?: ContactContext;
  /** Sayfada iletişim bölümü yoksa ana sayfadaki bölüme yönlendirilir. */
  contactAnchor?: string;
}

const floatingClass =
  "group inline-flex h-14 items-center overflow-hidden rounded-[4px] px-4 shadow-[0_14px_40px_-12px_rgb(0_0_0/0.6)] transition-colors duration-500";
const floatingLabelClass =
  "max-w-0 whitespace-nowrap font-display text-[0.95rem] font-bold uppercase tracking-[0.1em] opacity-0 transition-[max-width,opacity,margin] duration-500 ease-out-expo group-hover:ml-3 group-hover:max-w-[160px] group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:max-w-[160px] group-focus-visible:opacity-100";

/**
 * Sabit iletişim: mobilde ekranın altında Ara / WhatsApp / Randevu çubuğu,
 * masaüstünde sağ altta telefon ve WhatsApp butonları. Numara tanımlı
 * değilken iletişim bölümüne yönlendirir.
 */
export function StickyContact({ context, contactAnchor = `#${sectionIds.contact}` }: StickyContactProps) {
  const phone = telHref();
  const whatsapp = whatsappHref(context);
  const whatsappProps = whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40 hidden flex-col items-end gap-3 md:flex">
        <a
          href={phone ?? contactAnchor}
          aria-label={phone ? ctaLabels.call : "İletişim bilgilerine git"}
          className={`${floatingClass} bg-accent text-white hover:bg-accent-600`}
        >
          <PhoneIcon size={22} />
          <span className={floatingLabelClass}>{phone ? ctaLabels.call : "İletişim"}</span>
        </a>
        <a
          href={whatsapp ?? contactAnchor}
          {...whatsappProps}
          aria-label={whatsapp ? "WhatsApp üzerinden yazın" : "İletişim bilgilerine git"}
          className={`${floatingClass} bg-[#1fa855] text-white hover:bg-[#1a9049]`}
        >
          <WhatsAppIcon size={24} />
          <span className={floatingLabelClass}>WhatsApp</span>
        </a>
      </div>

      <nav
        aria-label="Hızlı iletişim"
        className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 flex h-[52px] overflow-hidden rounded-sm border border-bone/12 bg-ink shadow-[0_12px_32px_-14px_rgb(0_0_0/0.7)] md:hidden"
      >
        {phone && (
          <a
            href={phone}
            aria-label={ctaLabels.call}
            className="flex w-[52px] shrink-0 items-center justify-center border-r border-bone/12 text-bone"
          >
            <PhoneIcon size={20} />
          </a>
        )}
        {whatsapp && (
          <a
            href={whatsapp}
            {...whatsappProps}
            className="flex flex-1 items-center justify-center gap-2 font-display text-[0.8rem] font-bold uppercase tracking-[0.1em] text-bone"
          >
            <WhatsAppIcon size={18} className="text-[#25d366]" />
            WhatsApp
          </a>
        )}
        <a
          href={contactAnchor}
          className="flex flex-1 items-center justify-center gap-2 bg-accent font-display text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white"
        >
          {ctaLabels.primary}
          <ArrowRight size={16} />
        </a>
      </nav>
      <div aria-hidden className="h-[calc(4.5rem+env(safe-area-inset-bottom))] bg-ink md:hidden" />
    </>
  );
}
