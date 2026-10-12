"use client";

import { useEffect, useRef } from "react";

import { ArrowRight, CloseIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { MediaCredit } from "@/components/MediaCredit";
import { ctaLabels, type NavItem } from "@/data/navigation";
import { site } from "@/data/site";
import { telHref, whatsappHref } from "@/lib/contact";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  activeHref: string;
  items: NavItem[];
  contactAnchor: string;
}

export function MobileMenu({ open, onClose, activeHref, items, contactAnchor }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const phone = telHref();
  const whatsapp = whatsappHref();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] xl:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div
        className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        id="mobil-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobil menü"
        className={`noise absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col overflow-y-auto bg-graphite transition-transform duration-700 ease-out-expo ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-bone/10 px-[var(--gutter)]">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center border border-bone/20 text-bone transition-colors hover:border-amber hover:text-amber"
            aria-label="Menüyü kapat"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <nav aria-label="Mobil ana menü" className="flex-1 px-[var(--gutter)] py-6">
          <ul>
            {items.map((item, index) => {
              const active = activeHref === item.href;
              return (
                <li
                  key={item.href}
                  className={`border-b border-bone/10 transition-[opacity,transform] duration-700 ease-out-expo ${
                    open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${120 + index * 45}ms` : "0ms" }}
                >
                  <a
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "true" : undefined}
                    className="group flex items-baseline gap-5 py-4"
                  >
                    <span className={`label-mono ${active ? "text-amber" : "text-steel-500"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-[2rem] font-bold uppercase leading-none tracking-[0.02em] transition-colors ${
                        active ? "text-bone" : "text-bone/75 group-hover:text-bone"
                      }`}
                    >
                      {item.label}
                    </span>
                    <ArrowRight
                      size={20}
                      className="ml-auto self-center text-amber opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 space-y-3 border-t border-bone/10 px-[var(--gutter)] py-6">
          <a href={contactAnchor} onClick={onClose} className="btn btn-primary w-full">
            {ctaLabels.primaryLong}
            <ArrowRight size={18} />
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={phone ?? contactAnchor}
              onClick={onClose}
              className="btn btn-outline btn-sm"
            >
              <PhoneIcon size={16} />
              {phone ? ctaLabels.call : "Telefon"}
            </a>
            <a
              href={whatsapp ?? contactAnchor}
              onClick={onClose}
              target={whatsapp ? "_blank" : undefined}
              rel={whatsapp ? "noopener noreferrer" : undefined}
              className="btn btn-outline btn-sm"
            >
              <WhatsAppIcon size={16} />
              WhatsApp
            </a>
          </div>
          <p className="pt-2 text-sm text-steel-400">{site.slogans.primary}</p>
          <MediaCredit className="w-full justify-center" />
        </div>
      </div>
    </div>
  );
}
