import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/RevealObserver";
import { StickyContact } from "@/components/StickyContact";
import { homeContactHref } from "@/data/navigation";
import type { ContactContext } from "@/lib/contact";

interface SiteShellProps {
  currentPath: string;
  children: ReactNode;
  /** Sabit WhatsApp butonunun hazırlayacağı mesajın bağlamı. */
  contactContext?: ContactContext;
}

/** İletişim bölümü olmayan iç sayfalar (404, teşekkür, yasal metinler, ürün detayı) için ortak iskelet. */
export function SiteShell({ currentPath, children, contactContext }: SiteShellProps) {
  return (
    <>
      <a href="#icerik" className="skip-link">
        İçeriğe geç
      </a>
      <Header currentPath={currentPath} contactAnchor={homeContactHref} />
      <main id="icerik" className="noise relative bg-ink">
        {children}
      </main>
      <Footer contactAnchor={homeContactHref} />
      <StickyContact context={contactContext} contactAnchor={homeContactHref} />
      <RevealObserver />
    </>
  );
}
