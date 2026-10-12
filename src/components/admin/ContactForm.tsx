"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";

import type { FormState } from "@/app/admin/actions";
import { saveContactAction } from "@/app/admin/contentActions";
import { Card, Field, inputClass, Notice } from "@/components/admin/ui";
import { CloseIcon, PlusIcon } from "@/components/icons";
import type { ContactInfo } from "@/data/site";
import { hoursToRows, MAX_HOURS_ROWS, weekDays, type HoursRow } from "@/lib/admin/contentValidation";

const INITIAL: FormState = {};
const emptyRow: HoursRow = { start: 0, end: 5, open: "08:30", close: "18:30" };

function formatPhone(international: string | null): string {
  if (!international) return "";
  const local = `0${international.slice(2)}`;
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7, 9)} ${local.slice(9)}`;
}

export function ContactForm({ contact }: { contact: ContactInfo }) {
  const [state, dispatch, pending] = useActionState(saveContactAction, INITIAL);
  const [rows, setRows] = useState<(HoursRow & { key: number })[]>(() =>
    hoursToRows(contact.hours).map((row, key) => ({ ...row, key })),
  );
  const [nextKey, setNextKey] = useState(rows.length);
  const errors = state.errors ?? {};

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  };

  const updateRow = (key: number, patch: Partial<HoursRow>) =>
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      {state.message && <Notice tone="error">{state.message}</Notice>}

      <Card className="grid gap-5">
        <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Telefon ve e-posta</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Telefon" htmlFor="phone" error={errors.phone} hint="Örn. 0 (532) 123 45 67. Boşsa “Ara” butonları gizlenir.">
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={contact.phone ?? ""}
              aria-invalid={Boolean(errors.phone)}
              className={inputClass}
            />
          </Field>
          <Field label="WhatsApp" htmlFor="whatsapp" error={errors.whatsapp} hint="Örn. 0553 001 89 42. Tüm WhatsApp butonları bu numaraya gider.">
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              defaultValue={formatPhone(contact.whatsapp)}
              aria-invalid={Boolean(errors.whatsapp)}
              className={inputClass}
            />
          </Field>
          <Field label="E-posta" htmlFor="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={contact.email ?? ""}
              aria-invalid={Boolean(errors.email)}
              className={inputClass}
            />
          </Field>
        </div>
      </Card>

      <Card className="grid gap-5">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Adres ve harita</h2>
          {errors.address && (
            <p className="mt-1.5 text-sm text-accent" role="alert">
              {errors.address}
            </p>
          )}
        </div>
        <Field label="Açık adres" htmlFor="street">
          <input id="street" name="street" defaultValue={contact.address?.street} maxLength={160} className={inputClass} />
        </Field>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="İlçe" htmlFor="district">
            <input id="district" name="district" defaultValue={contact.address?.district} maxLength={160} className={inputClass} />
          </Field>
          <Field label="İl" htmlFor="city">
            <input id="city" name="city" defaultValue={contact.address?.city} maxLength={160} className={inputClass} />
          </Field>
          <Field label="Posta kodu (isteğe bağlı)" htmlFor="postalCode">
            <input
              id="postalCode"
              name="postalCode"
              inputMode="numeric"
              defaultValue={contact.address?.postalCode}
              maxLength={5}
              className={inputClass}
            />
          </Field>
        </div>
        <Field
          label="Harita bağlantısı"
          htmlFor="mapUrl"
          error={errors.mapUrl}
          hint="Google Haritalar'da işletmenizi açıp Paylaş → Bağlantıyı kopyala. Doluysa “Yol Tarifi Al” butonu görünür."
        >
          <input
            id="mapUrl"
            name="mapUrl"
            type="url"
            defaultValue={contact.mapUrl ?? ""}
            placeholder="https://maps.app.goo.gl/…"
            aria-invalid={Boolean(errors.mapUrl)}
            className={inputClass}
          />
        </Field>
      </Card>

      <Card className="grid gap-4">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Çalışma saatleri</h2>
          <p className="mt-1 text-sm text-steel-700">Sitede ve Google işletme bilgisinde gösterilir. Kapalı günleri eklemeyin.</p>
          {errors.hours && (
            <p className="mt-1.5 text-sm text-accent" role="alert">
              {errors.hours}
            </p>
          )}
        </div>
        {rows.length > 0 && (
          <ul className="grid gap-3">
            {rows.map((row, i) => (
              <li key={row.key} className="grid grid-cols-2 items-end gap-3 rounded-sm border border-ink/10 p-3 sm:grid-cols-[1fr_1fr_8rem_8rem_auto]">
                {(["start", "end"] as const).map((name) => (
                  <label key={name} className="grid gap-1 text-xs font-semibold text-steel-700">
                    {name === "start" ? "İlk gün" : "Son gün"}
                    <select
                      name={`hours.${i}.${name}`}
                      value={row[name]}
                      onChange={(event) => updateRow(row.key, { [name]: Number(event.target.value) })}
                      className={inputClass}
                    >
                      {weekDays.map((day, index) => (
                        <option key={day.schema} value={index}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
                {(["open", "close"] as const).map((name) => (
                  <label key={name} className="grid gap-1 text-xs font-semibold text-steel-700">
                    {name === "open" ? "Açılış" : "Kapanış"}
                    <input
                      type="time"
                      name={`hours.${i}.${name}`}
                      value={row[name]}
                      onChange={(event) => updateRow(row.key, { [name]: event.target.value })}
                      className={inputClass}
                    />
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setRows((current) => current.filter((item) => item.key !== row.key))}
                  className="inline-flex size-11 items-center justify-center rounded-sm border border-ink/15 text-steel-700 hover:border-accent hover:text-accent"
                >
                  <CloseIcon size={18} />
                  <span className="sr-only">Satırı sil</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {rows.length < MAX_HOURS_ROWS && (
          <button
            type="button"
            onClick={() => {
              setRows((current) => [...current, { ...(current.length === 0 ? emptyRow : { start: 6, end: 6, open: "09:00", close: "14:00" }), key: nextKey }]);
              setNextKey((key) => key + 1);
            }}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent"
          >
            <PlusIcon size={16} />
            Saat aralığı ekle
          </button>
        )}
      </Card>

      <div>
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
