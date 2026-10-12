import type { ContactInfo, WorkingHours } from "@/data/site";
import type { FieldErrors, Validated } from "@/lib/admin/validation";
import { toInternationalTr } from "@/lib/contact";

function text(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().replace(/[ \t]+/g, " ") : "";
}

export function validateCaption(caption: string): string | null {
  if (caption.length < 3) return "Açıklama en az 3 karakter olmalı.";
  if (caption.length > 120) return "Açıklama en fazla 120 karakter olabilir.";
  return null;
}

export const weekDays = [
  { label: "Pazartesi", schema: "Mo" },
  { label: "Salı", schema: "Tu" },
  { label: "Çarşamba", schema: "We" },
  { label: "Perşembe", schema: "Th" },
  { label: "Cuma", schema: "Fr" },
  { label: "Cumartesi", schema: "Sa" },
  { label: "Pazar", schema: "Su" },
] as const;

export const MAX_HOURS_ROWS = 4;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function parseHours(form: FormData, errors: FieldErrors): WorkingHours[] {
  const rows: WorkingHours[] = [];
  for (let i = 0; i < MAX_HOURS_ROWS; i++) {
    const start = Number(text(form, `hours.${i}.start`));
    const end = Number(text(form, `hours.${i}.end`));
    const open = text(form, `hours.${i}.open`);
    const close = text(form, `hours.${i}.close`);
    if (!text(form, `hours.${i}.start`) && !open && !close) continue;
    const startDay = weekDays[start];
    const endDay = weekDays[end];
    if (!startDay || !endDay || end < start) {
      errors.hours = "Gün aralığı geçersiz (başlangıç günü bitişten sonra olamaz).";
      continue;
    }
    if (!TIME.test(open) || !TIME.test(close) || open >= close) {
      errors.hours = "Açılış ve kapanış saatini girin; kapanış açılıştan sonra olmalı.";
      continue;
    }
    rows.push({
      days: start === end ? startDay.label : `${startDay.label} – ${endDay.label}`,
      time: `${open} – ${close}`,
      schema: `${start === end ? startDay.schema : `${startDay.schema}-${endDay.schema}`} ${open}-${close}`,
    });
  }
  return rows;
}

export interface HoursRow {
  start: number;
  end: number;
  open: string;
  close: string;
}

/** Kayıtlı `schema` değerini ("Mo-Sa 08:30-18:30") formdaki satıra geri çevirir. */
export function hoursToRows(hours: WorkingHours[] | null): HoursRow[] {
  return (hours ?? []).flatMap((slot) => {
    const match = /^([A-Z][a-z])(?:-([A-Z][a-z]))? (\d{2}:\d{2})-(\d{2}:\d{2})$/.exec(slot.schema);
    if (!match) return [];
    const start = weekDays.findIndex((day) => day.schema === match[1]);
    const end = match[2] ? weekDays.findIndex((day) => day.schema === match[2]) : start;
    return start < 0 || end < 0 ? [] : [{ start, end, open: match[3], close: match[4] }];
  });
}

export function validateContact(form: FormData): Validated<ContactInfo> {
  const errors: FieldErrors = {};

  const phone = text(form, "phone");
  const phoneDigits = phone.replace(/\D/g, "");
  if (phone && (phoneDigits.length < 10 || phoneDigits.length > 13 || /[^\d\s()+-]/.test(phone)))
    errors.phone = "Telefonu 0 (5xx) xxx xx xx biçiminde yazın.";

  const whatsappInput = text(form, "whatsapp");
  const whatsapp = whatsappInput ? toInternationalTr(whatsappInput) : "";
  if (whatsappInput && (!/^90\d{10}$/.test(whatsapp) || /[^\d\s()+-]/.test(whatsappInput)))
    errors.whatsapp = "WhatsApp numarasını 0 5xx xxx xx xx biçiminde yazın.";

  const email = text(form, "email");
  if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120)) errors.email = "Geçerli bir e-posta yazın.";

  const street = text(form, "street");
  const district = text(form, "district");
  const city = text(form, "city");
  const postalCode = text(form, "postalCode");
  const anyAddress = Boolean(street || district || city || postalCode);
  if (anyAddress && (!street || !district || !city)) errors.address = "Adres için açık adres, ilçe ve il birlikte girilmeli.";
  if ([street, district, city].some((value) => value.length > 160)) errors.address = "Adres alanları en fazla 160 karakter olabilir.";
  if (postalCode && !/^\d{5}$/.test(postalCode)) errors.address = "Posta kodu 5 haneli olmalı.";

  const mapUrl = text(form, "mapUrl");
  if (mapUrl) {
    try {
      if (new URL(mapUrl).protocol !== "https:") errors.mapUrl = "Bağlantı https:// ile başlamalı.";
    } catch {
      errors.mapUrl = "Geçerli bir bağlantı yapıştırın (örn. Google Haritalar paylaş bağlantısı).";
    }
  }

  const hours = parseHours(form, errors);

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      phone: phone || null,
      whatsapp: whatsapp || null,
      email: email || null,
      address: anyAddress ? { street, district, city, ...(postalCode ? { postalCode } : {}) } : null,
      mapUrl: mapUrl || null,
      hours: hours.length > 0 ? hours : null,
    },
  };
}
