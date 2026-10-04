import type { Metadata } from "next";

import Link from "next/link";

import { ArrowRight } from "@/components/icons";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="noise relative min-h-svh bg-ink">
      <div className="container-x flex min-h-svh flex-col py-10">
        <Link href="/" aria-label="Şimşek Oto ana sayfa" className="self-start">
          <Logo />
        </Link>
        <div className="my-auto py-20">
          <p className="label-mono text-amber">Hata 404</p>
          <h1 className="display mt-6 text-[clamp(3rem,9vw,7rem)]">
            Bu yol <span className="text-steel-500">kapalı.</span>
          </h1>
          <p className="lede mt-6 max-w-xl text-steel-300">
            Aradığınız sayfa taşınmış ya da kaldırılmış olabilir.
          </p>
          <Link href="/" className="btn btn-primary mt-10">
            Ana Sayfaya Dön
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
