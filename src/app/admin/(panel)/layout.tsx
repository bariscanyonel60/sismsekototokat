import Link from "next/link";
import type { ReactNode } from "react";

import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { ArrowUpRight } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { routes } from "@/data/navigation";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[16rem_minmax(0,1fr)]">
      <AdminNav
        brand={
          <Link href="/admin" aria-label="Yönetim paneli ana sayfa" className="inline-flex items-center gap-3">
            <Logo className="h-11" sizes="66px" />
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-steel-400">Yönetim</span>
          </Link>
        }
        footer={
          <div className="grid gap-3 text-sm">
            <Link
              href={routes.home}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-bone/80 transition-colors hover:text-bone"
            >
              Siteyi görüntüle
              <ArrowUpRight size={14} />
            </Link>
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-bone/70">{user}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="h-9 rounded-sm border border-bone/20 px-3 font-semibold transition-colors hover:border-bone"
                >
                  Çıkış
                </button>
              </form>
            </div>
          </div>
        }
      />
      <main className="min-w-0 px-4 py-6 sm:px-6 md:py-10 lg:px-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
