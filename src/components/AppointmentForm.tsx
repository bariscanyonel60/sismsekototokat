"use client";

import { useState, type FormEvent } from "react";

import { ArrowRight } from "@/components/icons";
import { ctaLabels } from "@/data/navigation";
import { services } from "@/data/services";
import { telHref, whatsappHref } from "@/lib/contact";

type Status = { kind: "idle" } | { kind: "whatsapp" } | { kind: "phone" } | { kind: "unavailable" };

function statusMessage(status: Status): string {
  switch (status.kind) {
    case "idle":
      return "";
    case "whatsapp":
      return "Mesajınız hazırlandı. Gönderimi WhatsApp üzerinden tamamlayabilirsiniz.";
    case "phone":
      return "Servisimizi arayarak randevunuzu oluşturabilirsiniz.";
    case "unavailable":
      return "Telefon ve WhatsApp bilgilerimiz çok yakında bu sayfada yayınlanacak.";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

const fieldClass =
  "peer w-full border-0 border-b border-bone/20 bg-transparent px-0 pb-3 pt-6 text-base text-bone placeholder-transparent outline-none transition-colors focus:border-amber";
const labelClass =
  "label-mono pointer-events-none absolute left-0 top-0 text-[0.68rem] text-steel-400 transition-colors peer-focus:text-amber";

/**
 * Randevu talebini hazır WhatsApp mesajına dönüştürür. WhatsApp numarası
 * tanımlı değilse telefona, o da yoksa bilgilendirme mesajına düşer.
 */
export function AppointmentForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();

    const href = whatsappHref({
      kind: "appointment",
      name: field("name"),
      vehicle: field("vehicle"),
      service: field("service"),
      note: field("note"),
    });

    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
      setStatus({ kind: "whatsapp" });
      return;
    }
    const phone = telHref();
    if (phone) {
      window.location.href = phone;
      setStatus({ kind: "phone" });
      return;
    }
    setStatus({ kind: "unavailable" });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-x-8 gap-y-7 sm:grid-cols-2" noValidate>
      <div className="relative">
        <input id="randevu-ad" name="name" autoComplete="name" placeholder="Ad Soyad" className={fieldClass} />
        <label htmlFor="randevu-ad" className={labelClass}>
          Ad Soyad
        </label>
      </div>
      <div className="relative">
        <input
          id="randevu-arac"
          name="vehicle"
          placeholder="Araç marka / model"
          className={fieldClass}
        />
        <label htmlFor="randevu-arac" className={labelClass}>
          Araç Marka / Model
        </label>
      </div>
      <div className="relative sm:col-span-2">
        <select id="randevu-hizmet" name="service" defaultValue="" className={`${fieldClass} appearance-none`}>
          <option value="" className="bg-graphite">
            Seçiniz (isteğe bağlı)
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.title} className="bg-graphite">
              {service.title}
            </option>
          ))}
        </select>
        <label htmlFor="randevu-hizmet" className={labelClass}>
          İhtiyaç Duyulan Hizmet
        </label>
        <span aria-hidden className="pointer-events-none absolute bottom-4 right-1 size-2 rotate-45 border-b border-r border-bone/50" />
      </div>
      <div className="relative sm:col-span-2">
        <textarea
          id="randevu-not"
          name="note"
          rows={3}
          placeholder="Kısaca aracınızın durumu"
          className={`${fieldClass} resize-none`}
        />
        <label htmlFor="randevu-not" className={labelClass}>
          Kısaca Aracınızın Durumu
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          {ctaLabels.appointment}
          <ArrowRight size={18} />
        </button>
        <p className="text-xs leading-relaxed text-steel-400 sm:max-w-[16rem] sm:text-right">
          Bilgileriniz yalnızca WhatsApp mesajınızı hazırlamak için kullanılır, sitede saklanmaz.
        </p>
      </div>

      <p role="status" aria-live="polite" className="text-sm text-amber sm:col-span-2 empty:hidden">
        {statusMessage(status)}
      </p>
    </form>
  );
}
