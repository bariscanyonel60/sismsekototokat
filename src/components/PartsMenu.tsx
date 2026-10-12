"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { ArrowRight, ChevronRight, CloseIcon, MenuIcon } from "@/components/icons";
import { categoryIcons } from "@/components/partCategoryIcons";
import { brands, segmentLabels, type VehicleSegment } from "@/data/brands";
import { routes, sectionIds } from "@/data/navigation";
import { partBrandHref, partCategoryHref, partManufacturerHref } from "@/lib/catalog/helpers";
import type { Manufacturer, PartsMenuCategory, PartsMenuData } from "@/lib/catalog/types";

type Submenu = "categories" | "brands" | "manufacturers";

const submenuLabels: Record<Submenu, string> = {
  categories: "Kategoriler",
  brands: "Otomobil Markaları",
  manufacturers: "Ürün Markaları",
};

const links = [
  { label: "Oto Yedek Parça", href: `${routes.parts}#${sectionIds.catalog}` },
  { label: "Toplu Parça Teklifi", href: `${routes.parts}#${sectionIds.partList}` },
  { label: "Yardım & Destek", href: `${routes.home}#${sectionIds.faq}` },
  { label: "Adres & İletişim", href: `${routes.home}#${sectionIds.contact}` },
];

const segments = Object.keys(segmentLabels) as VehicleSegment[];

const DESKTOP_QUERY = "(min-width: 1024px)";

/** Yedek parça sayfalarındaki "Tüm Ürünler" menüsü: mobilde soldan panel, masaüstünde açılır menü. */
export function PartsMenu({ menu }: { menu: PartsMenuData }) {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<Submenu | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = () => {
    setOpen(false);
    setSubmenu(null);
  };

  useEffect(() => {
    if (!open) return;
    const button = buttonRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setSubmenu(null);
      button?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || button?.contains(target)) return;
      setOpen(false);
      setSubmenu(null);
    };
    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    const { overflow } = document.body.style;
    if (!desktop) document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const active: Submenu = submenu ?? "categories";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex h-11 items-center gap-3 rounded-sm bg-white px-4 font-display text-[0.95rem] font-bold uppercase tracking-[0.08em] text-ink shadow-sm transition-colors hover:bg-bone-100"
      >
        {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
        Tüm Ürünler
      </button>

      {open && (
        <>
          <div aria-hidden className="fixed inset-0 z-[70] bg-ink/55 lg:hidden" />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label="Tüm ürünler menüsü"
            className="fixed inset-y-0 left-0 z-[71] flex w-[min(88vw,380px)] flex-col bg-white text-ink shadow-2xl lg:absolute lg:inset-y-auto lg:top-[calc(100%+0.5rem)] lg:grid lg:w-[min(860px,calc(100vw_-_2*var(--gutter)))] lg:grid-cols-[15rem_1fr] lg:rounded-md lg:border lg:border-ink/10"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink/10 px-5 lg:hidden">
              {submenu ? (
                <button
                  type="button"
                  onClick={() => setSubmenu(null)}
                  className="inline-flex items-center gap-2 font-display text-lg font-bold uppercase tracking-[0.06em]"
                >
                  <ChevronRight size={18} className="rotate-180" />
                  {submenuLabels[submenu]}
                </button>
              ) : (
                <p className="inline-flex items-center gap-2 font-display text-lg font-bold uppercase tracking-[0.06em]">
                  <MenuIcon size={20} />
                  Tüm Ürünler
                </p>
              )}
              <button
                type="button"
                onClick={close}
                aria-label="Menüyü kapat"
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-bone-100"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <nav
              aria-label="Yedek parça menüsü"
              className={`${submenu ? "hidden lg:block" : "block"} flex-1 overflow-y-auto py-2 lg:border-r lg:border-ink/10 lg:py-3`}
            >
              <ul>
                {(Object.keys(submenuLabels) as Submenu[]).map((key) => (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => setSubmenu(key)}
                      onMouseEnter={() => setSubmenu(key)}
                      aria-expanded={submenu === key}
                      className={`flex w-full items-center justify-between px-5 py-3.5 text-left text-[1.02rem] font-semibold transition-colors hover:bg-bone-100 lg:py-3 ${
                        active === key ? "lg:bg-bone-100 lg:text-accent" : ""
                      }`}
                    >
                      {submenuLabels[key]}
                      <ChevronRight size={18} />
                    </button>
                  </li>
                ))}
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      className="block px-5 py-3.5 text-[1.02rem] font-semibold transition-colors hover:bg-bone-100 hover:text-accent lg:py-3"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div
              className={`${submenu ? "block" : "hidden lg:block"} flex-1 overflow-y-auto p-5 lg:max-h-[min(70vh,560px)] lg:p-6`}
            >
              <SubmenuPanel submenu={active} menu={menu} onNavigate={close} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SubmenuPanel({ submenu, menu, onNavigate }: { submenu: Submenu; menu: PartsMenuData; onNavigate: () => void }) {
  switch (submenu) {
    case "categories":
      return <CategoryList categories={menu.categories} onNavigate={onNavigate} />;
    case "brands":
      return <BrandList onNavigate={onNavigate} />;
    case "manufacturers":
      return <ManufacturerList manufacturers={menu.manufacturers} onNavigate={onNavigate} />;
    default: {
      const unhandled: never = submenu;
      return unhandled;
    }
  }
}

function ManufacturerList({ manufacturers, onNavigate }: { manufacturers: Manufacturer[]; onNavigate: () => void }) {
  if (manufacturers.length === 0) {
    return <p className="text-sm leading-relaxed text-steel-700">Ürün markaları yakında eklenecek.</p>;
  }
  return (
    <ul className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
      {manufacturers.map((item) => (
        <li key={item.slug}>
          <Link
            href={partManufacturerHref(item.name)}
            onClick={onNavigate}
            className="flex items-baseline justify-between gap-3 rounded-sm py-2 font-semibold transition-colors hover:text-accent"
          >
            {item.name}
            <span className="text-xs font-normal text-steel-700">{item.count} ürün</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function CategoryList({ categories, onNavigate }: { categories: PartsMenuCategory[]; onNavigate: () => void }) {
  return (
    <ul className="grid gap-5 lg:grid-cols-2 lg:gap-x-8">
      {categories.map((category) => {
        const Icon = categoryIcons[category.icon];
        const href = partCategoryHref(category.id);
        return (
          <li key={category.id}>
            <Link href={href} onClick={onNavigate} className="group flex items-center gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-bone-100 text-ink transition-colors group-hover:bg-accent group-hover:text-white">
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[1.05rem] font-bold uppercase leading-tight tracking-[0.03em] group-hover:text-accent">
                  {category.title}
                </span>
                <span className="text-xs text-steel-700">{category.count} ürün</span>
              </span>
            </Link>
            {category.subcategories.length > 0 && (
              <ul className="ml-12 mt-2 grid gap-1">
                {category.subcategories.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      href={`${href}#${sub.id}`}
                      onClick={onNavigate}
                      className="text-sm text-steel-700 transition-colors hover:text-accent"
                    >
                      {sub.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
      <li className="lg:col-span-2">
        <Link
          href={`${routes.parts}#${sectionIds.catalog}`}
          onClick={onNavigate}
          className="link-arrow text-[0.85rem] text-ink hover:text-accent"
        >
          Tüm Ürünleri Gör
          <ArrowRight size={16} />
        </Link>
      </li>
    </ul>
  );
}

function BrandList({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {segments.map((segment) => (
        <div key={segment}>
          <p className="label-mono text-[0.62rem] text-steel-500">{segmentLabels[segment]}</p>
          <ul className="mt-2 grid gap-0.5">
            {brands
              .filter((brand) => brand.segment === segment)
              .map((brand) => (
                <li key={brand.plain}>
                  <Link
                    href={partBrandHref(brand)}
                    onClick={onNavigate}
                    className="flex items-baseline justify-between gap-3 rounded-sm py-2 font-semibold transition-colors hover:text-accent"
                  >
                    {brand.name}
                    {brand.note && <span className="text-xs font-normal text-steel-700">{brand.note}</span>}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
