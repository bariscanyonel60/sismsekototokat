"use client";

import { useId, useState } from "react";

import { ArrowRight, WhatsAppIcon } from "@/components/icons";
import { sectionIds } from "@/data/navigation";
import { contactHref, isExternalHref } from "@/lib/contact";
import { cart, useCart } from "@/lib/partsCart";

const fieldClass =
  "w-full rounded-sm border border-ink/15 bg-white px-4 text-[0.95rem] text-ink placeholder:text-steel-500 outline-none transition-colors focus:border-accent";

const sendClass =
  "mt-2 flex h-14 w-full items-center justify-center gap-3 rounded-sm font-display text-base font-bold uppercase tracking-[0.1em] text-white transition-colors disabled:cursor-not-allowed";

/** Toplu parça listesi: müşteri listesini yazar, tek WhatsApp mesajıyla teklif ister. */
export function PartList() {
  const { vehicle } = useCart();
  const [list, setList] = useState("");
  const listId = useId();
  const vehicleId = useId();

  const href = contactHref({ kind: "partList", list: list.trim(), vehicle: vehicle.trim() });
  const external = isExternalHref(href);
  const askHref = contactHref({ kind: "partList", list: "", vehicle: vehicle.trim() });
  const askExternal = isExternalHref(askHref);
  const ready = list.trim().length > 0;

  return (
    <section id={sectionIds.partList} aria-labelledby="parca-listesi-baslik" className="scroll-mt-[var(--header-h)] bg-white py-14 text-ink md:py-20">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="min-w-0 lg:col-span-5">
          <p className="eyebrow text-ink">Parça Sorgulama</p>
          <h2 id="parca-listesi-baslik" className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-bold uppercase leading-[0.95] text-ink">
            <span className="block">Aradığınız Parçayı{" "}</span>
            <span className="block">
              Bulamadınız mı<span className="text-accent">?</span>
            </span>
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-steel-700">
            OEM kodunu, parça listesini veya araç bilgilerinizi gönderin. Ekibimiz uygun parçayı kontrol etsin.
          </p>
          <ul className="mt-6 grid gap-2 text-sm text-steel-700">
            {["OEM / orijinal parça numarası", "Her satıra bir parça ve adet", "Marka, model, yıl ve motor"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span aria-hidden className="h-px w-4 bg-accent" />
                {item}
              </li>
            ))}
          </ul>
          <a
            href={askHref}
            {...(askExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="btn btn-ghost mt-8 w-full sm:w-auto"
          >
            <WhatsAppIcon size={18} />
            WhatsApp&apos;tan Parça Sor
            <ArrowRight size={16} className="max-sm:hidden" />
          </a>
        </div>

        <form className="min-w-0 space-y-3 rounded-sm border border-ink/10 bg-bone-100 p-5 md:p-6 lg:col-span-7" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor={listId} className="label-mono block text-[0.62rem] text-steel-500">
            Parça listesi
          </label>
          <textarea
            id={listId}
            value={list}
            onChange={(event) => setList(event.target.value)}
            rows={5}
            placeholder={"Her satıra bir parça yazın, örn.\n2 adet ön amortisör\n1 adet yağ filtresi\nSO-ONT-03 salıncak"}
            className={`${fieldClass} resize-y py-3`}
          />
          <label htmlFor={vehicleId} className="label-mono block pt-1 text-[0.62rem] text-steel-500">
            Araç bilgisi
          </label>
          <input
            id={vehicleId}
            value={vehicle}
            onChange={(event) => cart.setVehicle(event.target.value)}
            placeholder="Marka, model, yıl (örn. Fiat Doblo 2018 1.3)"
            autoComplete="off"
            className={`${fieldClass} h-12`}
          />
          {ready ? (
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`${sendClass} bg-[#1fa855] hover:bg-[#1a9049]`}
            >
              <WhatsAppIcon size={22} />
              Listeyi WhatsApp&apos;tan Gönder
            </a>
          ) : (
            <button type="button" disabled className={`${sendClass} bg-steel-400`}>
              <WhatsAppIcon size={22} />
              Listeyi WhatsApp&apos;tan Gönder
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
