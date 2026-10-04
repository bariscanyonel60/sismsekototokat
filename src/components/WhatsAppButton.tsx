import { WhatsAppIcon } from "@/components/icons";
import { sectionIds } from "@/data/navigation";
import { whatsappHref, type ContactContext } from "@/lib/contact";

interface WhatsAppButtonProps {
  context?: ContactContext;
}

/**
 * Sabit WhatsApp butonu. Numara tanımlı değilken iletişim bölümüne yönlendirir;
 * `context` ile sayfaya özel hazır mesaj gönderilebilir.
 */
export function WhatsAppButton({ context }: WhatsAppButtonProps) {
  const href = whatsappHref(context);

  return (
    <a
      href={href ?? `#${sectionIds.contact}`}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      aria-label={href ? "WhatsApp üzerinden yazın" : "İletişim bilgilerine git"}
      className="group fixed bottom-5 right-5 z-40 inline-flex h-14 items-center gap-0 overflow-hidden rounded-[4px] bg-[#1fa855] pl-4 pr-4 text-white shadow-[0_14px_40px_-12px_rgb(0_0_0/0.6)] transition-[background-color,padding] duration-500 hover:bg-[#1a9049] md:bottom-8 md:right-8"
    >
      <WhatsAppIcon size={24} />
      <span className="max-w-0 whitespace-nowrap font-display text-[0.95rem] font-bold uppercase tracking-[0.1em] opacity-0 transition-[max-width,opacity,margin] duration-500 ease-out-expo group-hover:ml-3 group-hover:max-w-[160px] group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:max-w-[160px] group-focus-visible:opacity-100">
        WhatsApp
      </span>
    </a>
  );
}
