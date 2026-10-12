"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import { ArrowRight, CheckIcon } from "@/components/icons";
import { ctaLabels, routes } from "@/data/navigation";
import { services } from "@/data/services";
import { telHref, whatsappHref } from "@/lib/contact";

type Status = { kind: "idle" } | { kind: "whatsapp" } | { kind: "phone" } | { kind: "unavailable" };

type RequiredField = "name" | "phone" | "vehicle";
type Errors = Partial<Record<RequiredField, string>>;

const requiredFields: RequiredField[] = ["name", "phone", "vehicle"];

function statusMessage(status: Status): string {
  switch (status.kind) {
    case "idle":
      return "";
    case "whatsapp":
      return "Talebiniz hazırlandı. Gönderimi WhatsApp üzerinden tamamlayabilirsiniz.";
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

function validate(field: RequiredField, value: string): string | undefined {
  switch (field) {
    case "name":
      return value.length >= 2 ? undefined : "Lütfen adınızı ve soyadınızı yazın.";
    case "phone": {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 13 ? undefined : "Geçerli bir telefon numarası yazın (05xx xxx xx xx).";
    }
    case "vehicle":
      return value.length >= 2 ? undefined : "Araç marka ve modelini yazın (örn. Ford Transit).";
    default: {
      const exhaustive: never = field;
      return exhaustive;
    }
  }
}

const fieldClass =
  "peer w-full border-0 border-b border-bone/20 bg-transparent px-0 pb-3 pt-6 text-base text-bone placeholder-transparent outline-none transition-colors focus:border-accent aria-invalid:border-accent-300";
const labelClass =
  "label-mono pointer-events-none absolute left-0 top-0 text-[0.68rem] text-steel-400 transition-colors peer-focus:text-accent-300";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-xs text-accent-300">
      {message}
    </p>
  );
}

/**
 * Servis talebini hazır WhatsApp mesajına dönüştürür ve teşekkür sayfasına
 * geçer. WhatsApp numarası tanımlı değilse telefona, o da yoksa bilgilendirme
 * mesajına düşer.
 */
export function AppointmentForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function revalidate(field: RequiredField, value: string) {
    if (!errors[field]) return;
    setErrors((current) => ({ ...current, [field]: validate(field, value.trim()) }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();

    const nextErrors: Errors = {};
    for (const name of requiredFields) {
      const message = validate(name, field(name));
      if (message) nextErrors[name] = message;
    }
    setErrors(nextErrors);
    const firstInvalid = requiredFields.find((name) => nextErrors[name]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const href = whatsappHref({
      kind: "appointment",
      name: field("name"),
      phone: field("phone"),
      vehicle: field("vehicle"),
      service: field("service"),
      note: field("note"),
    });

    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
      setStatus({ kind: "whatsapp" });
      router.push(routes.thanks);
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

  const message = statusMessage(status);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-x-8 gap-y-7 sm:grid-cols-2" noValidate>
      <div className="relative">
        <input
          id="randevu-ad"
          name="name"
          autoComplete="name"
          placeholder="Ad Soyad"
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "randevu-ad-hata" : undefined}
          onChange={(event) => revalidate("name", event.target.value)}
          className={fieldClass}
        />
        <label htmlFor="randevu-ad" className={labelClass}>
          Ad Soyad *
        </label>
        <FieldError id="randevu-ad-hata" message={errors.name} />
      </div>
      <div className="relative">
        <input
          id="randevu-telefon"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Telefon"
          required
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "randevu-telefon-hata" : undefined}
          onChange={(event) => revalidate("phone", event.target.value)}
          className={fieldClass}
        />
        <label htmlFor="randevu-telefon" className={labelClass}>
          Telefon *
        </label>
        <FieldError id="randevu-telefon-hata" message={errors.phone} />
      </div>
      <div className="relative">
        <input
          id="randevu-arac"
          name="vehicle"
          placeholder="Araç marka / model"
          required
          aria-invalid={errors.vehicle ? true : undefined}
          aria-describedby={errors.vehicle ? "randevu-arac-hata" : undefined}
          onChange={(event) => revalidate("vehicle", event.target.value)}
          className={fieldClass}
        />
        <label htmlFor="randevu-arac" className={labelClass}>
          Araç Marka / Model *
        </label>
        <FieldError id="randevu-arac-hata" message={errors.vehicle} />
      </div>
      <div className="relative">
        <select id="randevu-hizmet" name="service" defaultValue="" className={`${fieldClass} appearance-none pr-6`}>
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
          Hizmet
        </label>
        <span aria-hidden className="pointer-events-none absolute bottom-4 right-1 size-2 rotate-45 border-b border-r border-bone/50" />
      </div>
      <div className="relative sm:col-span-2">
        <textarea
          id="randevu-not"
          name="note"
          rows={3}
          placeholder="Mesajınız"
          className={`${fieldClass} resize-none`}
        />
        <label htmlFor="randevu-not" className={labelClass}>
          Mesajınız (aracınızın durumu)
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-primary w-full sm:w-auto">
          {ctaLabels.serviceRequest}
          <ArrowRight size={18} />
        </button>
        <p className="text-xs leading-relaxed text-steel-400 sm:max-w-[16rem] sm:text-right">
          Bilgileriniz yalnızca WhatsApp mesajınızı hazırlamak için kullanılır, sitede saklanmaz.
        </p>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="flex items-start gap-2.5 text-sm text-bone sm:col-span-2 empty:hidden"
      >
        {message && (
          <>
            <CheckIcon size={18} className="mt-0.5 shrink-0 text-accent-300" />
            {message}
          </>
        )}
      </p>
    </form>
  );
}
