import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { QuickLinks } from "@/components/QuickLinks";
import { SiteShell } from "@/components/SiteShell";
import { routes } from "@/data/navigation";
import { pageSeo } from "@/data/seo";
import { cssVars } from "@/lib/cssVars";
import { whatsappHref } from "@/lib/contact";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata(pageSeo.thanks);

const steps = [
  {
    title: "Mesajı gönderin",
    description: "Açılan WhatsApp penceresinde hazırlanan mesajı gönderin. Pencere açılmadıysa aşağıdaki butonu kullanın.",
  },
  {
    title: "Size dönüş yapalım",
    description: "Aracınızın bilgilerine göre uygun servis zamanını ve gerekiyorsa parça bilgisini netleştirelim.",
  },
  {
    title: "Aracınızı getirin",
    description: "Kararlaştırdığımız saatte aracınızı servise getirin; işlem öncesi yapılacakları birlikte konuşalım.",
  },
];

export default function ThanksPage() {
  const whatsapp = whatsappHref();

  return (
    <SiteShell currentPath={routes.thanks}>
      <div className="container-x pb-24 pt-[calc(var(--header-h)+var(--topbar-h)+48px)] md:pb-32">
        <Breadcrumb items={[{ label: "Talebiniz Alındı" }]} withSchema={false} className="hero-fade" />

        <p className="label-mono hero-fade mt-14 text-accent" style={cssVars({ "--i": 1 })}>
          Randevu Talebi
        </p>
        <h1 className="display mt-6 text-[clamp(3rem,8vw,6.5rem)] text-bone">
          <span className="hero-line" style={cssVars({ "--i": 0 })}>
            Teşekkürler<span className="text-accent">.</span>{" "}
          </span>
          <span className="hero-line text-steel-500" style={cssVars({ "--i": 1 })}>
            Talebiniz hazır.
          </span>
        </h1>
        <p className="lede hero-fade mt-7 max-w-2xl text-steel-300" style={cssVars({ "--i": 2 })}>
          {pageSeo.thanks.description}
        </p>

        <h2 className="sr-only">Sonraki adımlar</h2>
        <ol className="mt-14 grid gap-px border border-bone/10 bg-bone/10 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="bg-graphite p-7 md:p-9">
              <span className="display text-5xl text-accent">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="display mt-6 text-[1.8rem] text-bone">{step.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-steel-300">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsAppIcon size={18} />
              WhatsApp&apos;ı Tekrar Aç
            </a>
          )}
          <Link href={routes.home} className="btn btn-outline">
            Ana Sayfaya Dön
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-20">
          <QuickLinks title="Bu arada göz atabilirsiniz" />
        </div>
      </div>
    </SiteShell>
  );
}
