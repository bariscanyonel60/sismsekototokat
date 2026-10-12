"use client";

import Link from "next/link";

import { routes } from "@/data/navigation";

export default function PartsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="icerik" className="grid min-h-[70vh] place-items-center bg-bone-100 px-[var(--gutter)] py-24 text-ink">
      <div className="w-full max-w-xl rounded-sm border border-ink/15 bg-white p-6 md:p-10">
        <p className="label-mono text-[0.62rem] text-accent-600">Yedek Parça Kataloğu</p>
        <h1 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold uppercase leading-[0.95]">
          <span className="block">Ürünler şu anda{" "}</span>
          <span className="block">
            yüklenemedi<span className="text-accent">.</span>
          </span>
        </h1>
        <p className="mt-4 text-steel-700">Bağlantınızı kontrol edip tekrar deneyebilirsiniz.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary btn-sm">
            Tekrar Dene
          </button>
          <Link href={routes.home} className="btn btn-ghost btn-sm">
            Ana Sayfa
          </Link>
        </div>
      </div>
    </main>
  );
}
