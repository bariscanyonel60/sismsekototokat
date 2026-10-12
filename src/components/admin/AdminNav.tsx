"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType, type ReactNode, type SVGProps } from "react";

import { BoxIcon, ContactIcon, DashboardIcon, ImageIcon, LayersIcon } from "@/components/admin/adminIcons";
import { CloseIcon, MenuIcon } from "@/components/icons";

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const groups: { label: string; links: { href: string; label: string; icon: Icon }[] }[] = [
  {
    label: "Katalog",
    links: [
      { href: "/admin", label: "Panel", icon: DashboardIcon },
      { href: "/admin/urunler", label: "Ürünler", icon: BoxIcon },
      { href: "/admin/kategoriler", label: "Kategoriler", icon: LayersIcon },
    ],
  },
  {
    label: "Site içeriği",
    links: [
      { href: "/admin/galeri", label: "Galeri", icon: ImageIcon },
      { href: "/admin/iletisim", label: "İletişim Bilgileri", icon: ContactIcon },
    ],
  },
];

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Yönetim menüsü" className="grid gap-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-steel-400">{group.label}</p>
          <ul className="mt-2 grid gap-0.5">
            {group.links.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-10 items-center gap-3 rounded-sm px-3 text-sm font-semibold transition-colors ${
                      active ? "bg-accent text-white" : "text-bone/85 hover:bg-white/8 hover:text-bone"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Masaüstünde sabit yan menü, mobilde üst çubuk + soldan açılan panel. */
export function AdminNav({ brand, footer }: { brand: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  /** Menü yalnızca açıldığı sayfada açık sayılır; bağlantıya tıklanınca kendiliğinden kapanır. */
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const close = () => setOpenPath(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between bg-ink px-4 py-2 text-bone lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setOpenPath(pathname)}
          aria-expanded={open}
          aria-controls="admin-menu"
          className="inline-flex size-11 items-center justify-center rounded-sm hover:bg-white/10"
        >
          <MenuIcon size={22} />
          <span className="sr-only">Menüyü aç</span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink/60 lg:hidden" onClick={close} aria-hidden />
      )}

      <aside
        id="admin-menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-ink text-bone transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:w-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          {brand}
          <button
            type="button"
            onClick={close}
            className="inline-flex size-10 items-center justify-center rounded-sm hover:bg-white/10 lg:hidden"
          >
            <CloseIcon size={20} />
            <span className="sr-only">Menüyü kapat</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavLinks pathname={pathname} />
        </div>
        <div className="border-t border-white/10 px-5 py-4">{footer}</div>
      </aside>
    </>
  );
}
