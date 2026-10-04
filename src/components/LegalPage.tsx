import Link from "next/link";

import { ArrowRight } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { site } from "@/data/site";

interface LegalPageProps {
  title: string;
  intro: string;
}

/** KVKK / gizlilik gibi metinler hazırlanana kadar kullanılan yer tutucu sayfa. */
export function LegalPage({ title, intro }: LegalPageProps) {
  return (
    <main className="noise relative min-h-svh bg-ink">
      <div className="container-x flex min-h-svh flex-col py-10">
        <Link href="/" aria-label="Şimşek Oto ana sayfa" className="self-start">
          <Logo />
        </Link>
        <div className="my-auto max-w-3xl py-20">
          <p className="eyebrow text-bone">{site.name}</p>
          <h1 className="heading-xl mt-6">{title}</h1>
          <p className="lede mt-6 text-steel-300">{intro}</p>
          <p className="mt-4 text-steel-400">
            Bu metin hazırlanma aşamasındadır ve yakında bu sayfada yayınlanacaktır.
          </p>
          <Link href="/" className="btn btn-outline mt-10">
            Ana Sayfaya Dön
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
