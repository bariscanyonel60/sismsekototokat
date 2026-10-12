import type { ReactNode } from "react";

import { Breadcrumb } from "@/components/Breadcrumb";
import { QuickLinks } from "@/components/QuickLinks";
import { SiteShell } from "@/components/SiteShell";
import { site } from "@/data/site";

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  intro: string;
  path: string;
  /** İndekslenmeyen sayfalarda breadcrumb yapılandırılmış verisi basılmaz. */
  indexable: boolean;
  updatedAt?: string;
  /** Boşsa metin hazırlanma aşamasında uyarısı gösterilir. */
  sections?: LegalSection[];
}

export function LegalPage({ title, intro, path, indexable, updatedAt, sections = [] }: LegalPageProps) {
  return (
    <SiteShell currentPath={path}>
      <div className="container-x relative pb-24 pt-[calc(var(--header-h)+var(--topbar-h)+48px)] md:pb-32">
        <Breadcrumb items={[{ label: title, href: path }]} withSchema={indexable} />

        <header className="mt-14 max-w-4xl">
          <p className="eyebrow text-bone">{site.name}</p>
          <h1 className="heading-xl mt-6">{title}</h1>
          <p className="lede mt-6 text-steel-300">{intro}</p>
          {updatedAt && <p className="label-mono mt-6 text-[0.68rem] text-steel-500">Son güncelleme: {updatedAt}</p>}
        </header>

        {sections.length > 0 ? (
          <div className="mt-16 grid gap-12 border-t border-bone/10 pt-12 lg:grid-cols-12 lg:gap-10">
            <nav aria-label="İçindekiler" className="lg:col-span-3">
              <ol className="space-y-3 lg:sticky lg:top-[calc(var(--header-h)+32px)]">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-3 text-sm text-steel-400 transition-colors hover:text-bone"
                    >
                      <span className="label-mono text-amber">{String(index + 1).padStart(2, "0")}</span>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="space-y-12 lg:col-span-8 lg:col-start-5">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-baslik`}>
                  <h2 id={`${section.id}-baslik`} className="display flex items-baseline gap-4 text-[clamp(1.6rem,2.4vw,2.2rem)]">
                    <span className="label-mono text-amber">{String(index + 1).padStart(2, "0")}</span>
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-4 text-[1rem] leading-relaxed text-steel-300">
                    {section.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-10 max-w-3xl text-steel-400">
            Bu metin hazırlanma aşamasındadır ve yakında bu sayfada yayınlanacaktır.
          </p>
        )}

        <div className="mt-24">
          <QuickLinks />
        </div>
      </div>
    </SiteShell>
  );
}
