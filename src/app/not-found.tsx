import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowRight } from "@/components/icons";
import { QuickLinks } from "@/components/QuickLinks";
import { SiteShell } from "@/components/SiteShell";
import { homeContactHref, routes } from "@/data/navigation";
import { cssVars } from "@/lib/cssVars";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  description: "Aradığınız sayfa taşınmış ya da kaldırılmış olabilir. Şimşek Oto hizmetleri, yedek parça kataloğu ve iletişim sayfalarına buradan ulaşın.",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <SiteShell currentPath="/404">
      <div className="container-x relative pb-24 pt-[calc(var(--header-h)+var(--topbar-h)+48px)] md:pb-32">
        <Breadcrumb items={[{ label: "Sayfa Bulunamadı" }]} withSchema={false} className="hero-fade" />

        <p className="label-mono hero-fade mt-14 text-accent" style={cssVars({ "--i": 1 })}>
          Hata 404
        </p>
        <h1 className="display mt-6 text-[clamp(3rem,9vw,7rem)] text-bone">
          <span className="hero-line" style={cssVars({ "--i": 0 })}>
            Bu yol{" "}
          </span>
          <span className="hero-line text-steel-500" style={cssVars({ "--i": 1 })}>
            kapalı<span className="text-accent">.</span>
          </span>
        </h1>
        <p className="lede hero-fade mt-7 max-w-xl text-steel-300" style={cssVars({ "--i": 2 })}>
          Aradığınız sayfa taşınmış ya da kaldırılmış olabilir. Aşağıdaki bağlantılarla devam edebilir ya da bize
          doğrudan ulaşabilirsiniz.
        </p>
        <div className="hero-fade mt-10 flex flex-col gap-3 sm:flex-row" style={cssVars({ "--i": 3 })}>
          <Link href={routes.home} className="btn btn-primary">
            Ana Sayfaya Dön
            <ArrowRight size={18} />
          </Link>
          <Link href={homeContactHref} className="btn btn-outline">
            İletişime Geç
          </Link>
        </div>

        <div className="mt-20">
          <QuickLinks />
        </div>
      </div>
    </SiteShell>
  );
}
