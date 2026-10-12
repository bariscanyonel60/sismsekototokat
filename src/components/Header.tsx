"use client";

import { useCallback, useEffect, useState } from "react";

import { ArrowRight, MenuIcon, PhoneIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";
import { ctaLabels, mainNav, resolveNavHref, routes, sectionIds, topBar } from "@/data/navigation";
import { site } from "@/data/site";
import { isExternalHref, telHref, whatsappHref } from "@/lib/contact";

const SCROLL_THRESHOLD = 24;

interface HeaderProps {
  /** Ana sayfa dışında bölüm bağlantıları `/#bolum` biçimine çevrilir. */
  currentPath?: string;
  /** Sayfada iletişim bölümü yoksa ana sayfadaki bölüme yönlendirilir. */
  contactAnchor?: string;
}

export function Header({ currentPath = routes.home, contactAnchor = `#${sectionIds.contact}` }: HeaderProps) {
  const isHome = currentPath === routes.home;
  const phone = telHref();
  const inquiryHref =
    currentPath === routes.parts
      ? (whatsappHref({ kind: "part", part: "yedek parça" }) ?? contactAnchor)
      : `${routes.parts}#${sectionIds.catalog}`;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>(isHome ? "" : currentPath);
  const navItems = mainNav.map((item) => ({ ...item, href: resolveNavHref(item.href, currentPath) }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const unlisted = new Set<string>([sectionIds.home, sectionIds.about]);
    const sections = [...mainNav.map((item) => item.href), ...[...unlisted, sectionIds.parts].map((id) => `#${id}`)]
      .filter((href) => href.startsWith("#"))
      .map((href) => document.querySelector<HTMLElement>(href))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        const id = top.target.id;
        setActiveHref(unlisted.has(id) ? "" : id === sectionIds.parts ? routes.parts : `#${id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const solid = scrolled || menuOpen;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid
          ? "border-b border-bone/10 bg-ink/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${
          solid ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
        inert={solid}
      >
        <div className="overflow-hidden">
          <div className="border-b border-bone/10 bg-amber text-ink">
            <div className="container-x flex h-[var(--topbar-h)] items-center justify-between gap-4">
              <p className="label-mono flex min-w-0 items-center gap-3 text-[0.66rem]">
                <span className="size-1.5 shrink-0 bg-ink" aria-hidden />
                <span className="truncate">
                  {topBar.message}
                  <span className="hidden text-ink/70 lg:inline"> · {topBar.detail}</span>
                </span>
              </p>
              <div className="flex shrink-0 items-center gap-5">
                {phone && site.contact.phone && (
                  <a href={phone} className="label-mono hidden items-center gap-2 text-[0.66rem] hover:underline md:inline-flex">
                    <PhoneIcon size={13} />
                    {site.contact.phone}
                  </a>
                )}
                <a
                  href={inquiryHref}
                  {...(isExternalHref(inquiryHref) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="label-mono inline-flex items-center gap-2 text-[0.66rem] underline-offset-4 hover:underline"
                >
                  {topBar.cta}
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <a
          href={resolveNavHref(`#${sectionIds.home}`, currentPath)}
          className="shrink-0"
          aria-label="Şimşek Oto ana sayfa"
        >
          <Logo preload />
        </a>

        <nav aria-label="Ana menü" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = activeHref === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={active ? (isHome ? "true" : "page") : undefined}
                    className={`group relative block px-3.5 py-2 font-display text-[0.95rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
                      active ? "text-bone" : "text-bone/65 hover:text-bone"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left bg-amber transition-transform duration-500 ease-out-expo ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href={contactAnchor} className="btn btn-primary btn-sm hidden sm:inline-flex">
            {ctaLabels.primary}
            <ArrowRight size={16} />
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center border border-bone/20 text-bone transition-colors hover:border-amber hover:text-amber xl:hidden"
            aria-label="Menüyü aç"
            aria-expanded={menuOpen}
            aria-controls="mobil-menu"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon size={22} />
          </button>
        </div>
      </div>
    </header>
    <MobileMenu
      open={menuOpen}
      onClose={closeMenu}
      activeHref={activeHref}
      items={navItems}
      contactAnchor={contactAnchor}
    />
    </>
  );
}
