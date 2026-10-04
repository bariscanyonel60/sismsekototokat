"use client";

import { useCallback, useEffect, useState } from "react";

import { ArrowRight, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";
import { ctaLabels, mainNav, sectionIds } from "@/data/navigation";

const SCROLL_THRESHOLD = 24;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>(mainNav[0].href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = mainNav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        setActiveHref(`#${top.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <a href={`#${sectionIds.home}`} className="shrink-0" aria-label="Şimşek Oto ana sayfa">
          <Logo />
        </a>

        <nav aria-label="Ana menü" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = activeHref === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={active ? "true" : undefined}
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
          <a href={`#${sectionIds.contact}`} className="btn btn-primary btn-sm hidden sm:inline-flex">
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
    <MobileMenu open={menuOpen} onClose={closeMenu} activeHref={activeHref} />
    </>
  );
}
