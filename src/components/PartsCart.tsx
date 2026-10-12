"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { QuantityStepper } from "@/components/AddToCart";
import { CartIcon, CheckIcon, CloseIcon, WhatsAppIcon } from "@/components/icons";
import { images } from "@/data/images";
import { partHref } from "@/lib/catalog/helpers";
import type { CartPart } from "@/lib/catalog/types";
import { contactHref, isExternalHref } from "@/lib/contact";
import { cart, cartCount, useCart } from "@/lib/partsCart";

interface OrderDetails {
  chassis: string;
  name: string;
  note: string;
}

const EMPTY_DETAILS: OrderDetails = { chassis: "", name: "", note: "" };
const ADDED_NOTICE_MS = 4000;

const fieldClass =
  "h-11 w-full rounded-sm border border-ink/15 bg-white px-3 text-[0.95rem] text-ink placeholder:text-steel-500 outline-none transition-colors focus:border-accent";

/**
 * WhatsApp sipariş sepeti: sağ alttaki sepet butonu ve sağdan açılan panel.
 * Sipariş, ürün kodu + adet + araç bilgisiyle tek WhatsApp mesajına dönüşür.
 */
export function PartsCart({ parts }: { parts: CartPart[] }) {
  const { lines, open, vehicle, added } = useCart();
  const [details, setDetails] = useState<OrderDetails>(EMPTY_DETAILS);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const formId = useId();

  const findPart = (slug: string) => parts.find((part) => part.slug === slug);
  const items = lines.flatMap((line) => {
    const part = findPart(line.slug);
    return part ? [{ part, quantity: line.quantity }] : [];
  });
  const count = cartCount(items.map(({ part, quantity }) => ({ slug: part.slug, quantity })));

  useEffect(() => {
    if (lines.length > 0) cart.retain(new Set(parts.map((part) => part.slug)));
  }, [parts, lines.length]);

  const orderHref = contactHref({
    kind: "order",
    items: items.map(({ part, quantity }) => ({ code: part.code, title: part.title, quantity })),
    vehicle: vehicle.trim(),
    chassis: details.chassis.trim(),
    name: details.name.trim(),
    note: details.note.trim(),
  });
  const orderExternal = isExternalHref(orderHref);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cart.close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), input, textarea",
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(cart.dismissAdded, ADDED_NOTICE_MS);
    return () => window.clearTimeout(timer);
  }, [added]);

  const addedPart = added && !open ? findPart(added.slug) : undefined;

  const update = (patch: Partial<OrderDetails>) => setDetails((current) => ({ ...current, ...patch }));

  return (
    <>
      {count > 0 && (
        <button
          type="button"
          onClick={cart.open}
          aria-label={`Teklif listesini aç, ${count} ürün`}
          className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)] right-4 z-40 inline-flex h-14 items-center gap-3 rounded-full bg-ink pl-5 pr-2 text-bone shadow-[0_14px_40px_-12px_rgb(0_0_0/0.55)] transition-colors hover:bg-graphite md:bottom-8 md:left-8 md:right-auto"
        >
          <CartIcon size={20} />
          <span className="font-display text-sm font-bold uppercase tracking-[0.1em]">Teklif Listesi</span>
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-accent font-display text-base font-bold text-white">
            {count}
          </span>
        </button>
      )}

      {addedPart && (
        <div
          role="status"
          className="fixed inset-x-4 top-[calc(var(--header-h)+0.75rem)] z-[55] mx-auto max-w-md rounded-md border border-ink/10 bg-white p-4 text-ink shadow-[0_24px_60px_-20px_rgb(26_31_37/0.45)] md:left-auto md:right-8 md:mx-0"
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1fa855] text-white">
              <CheckIcon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Ürün teklif listenize eklendi</p>
              <p className="mt-0.5 truncate text-sm text-steel-700">
                {addedPart.title} · Ürün Kodu: {addedPart.code}
              </p>
            </div>
            <button
              type="button"
              onClick={cart.dismissAdded}
              aria-label="Bildirimi kapat"
              className="text-steel-500 transition-colors hover:text-ink"
            >
              <CloseIcon size={16} />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={cart.open} className="h-10 rounded-sm bg-accent text-sm font-semibold text-white hover:bg-accent-600">
              Listeye Git
            </button>
            <button
              type="button"
              onClick={cart.dismissAdded}
              className="h-10 rounded-sm border border-ink/15 text-sm font-semibold text-ink hover:border-ink"
            >
              Alışverişe Devam Et
            </button>
          </div>
        </div>
      )}

      <div
        className={`fixed inset-0 z-[60] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={cart.close}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${formId}-baslik`}
          className={`absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-bone-100 text-ink shadow-2xl transition-transform duration-500 ease-out-expo ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-ink/10 bg-white px-5">
            <p id={`${formId}-baslik`} className="font-display text-xl font-bold uppercase tracking-[0.08em]">
              Teklif Listem <span className="text-steel-500">({count})</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={cart.close}
              aria-label="Teklif listesini kapat"
              className="inline-flex size-10 items-center justify-center rounded-sm border border-ink/15 transition-colors hover:border-accent hover:text-accent"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <span className="inline-flex size-16 items-center justify-center rounded-full bg-white text-steel-500">
                <CartIcon size={28} />
              </span>
              <p className="font-display text-2xl font-bold uppercase">Teklif listeniz boş</p>
              <p className="max-w-xs text-sm text-steel-700">
                Katalogdan ihtiyacınız olan parçaları ekleyin; siparişinizi tek mesajla WhatsApp&apos;tan gönderin.
              </p>
              <button type="button" onClick={cart.close} className="btn btn-dark btn-sm mt-2">
                Ürünlere Göz At
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <ul className="divide-y divide-ink/10 bg-white">
                  {items.map(({ part, quantity }) => (
                    <CartRow key={part.slug} part={part} quantity={quantity} />
                  ))}
                </ul>

                <form
                  id={formId}
                  className="space-y-3 p-5"
                  onSubmit={(event) => event.preventDefault()}
                  aria-label="Sipariş bilgileri"
                >
                  <p className="label-mono text-[0.65rem] text-steel-500">Araç bilgisi (doğru parça için)</p>
                  <label className="block">
                    <span className="sr-only">Araç marka, model ve yıl</span>
                    <input
                      value={vehicle}
                      onChange={(event) => cart.setVehicle(event.target.value)}
                      placeholder="Araç: marka, model, yıl (örn. Ford Transit 2019)"
                      autoComplete="off"
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">Şasi numarası</span>
                    <input
                      value={details.chassis}
                      onChange={(event) => update({ chassis: event.target.value })}
                      placeholder="Şasi no (isteğe bağlı)"
                      autoComplete="off"
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">Ad soyad</span>
                    <input
                      value={details.name}
                      onChange={(event) => update({ name: event.target.value })}
                      placeholder="Ad soyad (isteğe bağlı)"
                      autoComplete="name"
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">Not</span>
                    <textarea
                      value={details.note}
                      onChange={(event) => update({ note: event.target.value })}
                      placeholder="Not (isteğe bağlı)"
                      rows={2}
                      className={`${fieldClass} h-auto resize-none py-2.5`}
                    />
                  </label>
                </form>
              </div>

              <div className="shrink-0 space-y-3 border-t border-ink/10 bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                <a
                  href={orderHref}
                  {...(orderExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => {
                    if (!orderExternal) cart.close();
                  }}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#1fa855] font-display text-base font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#1a9049]"
                >
                  <WhatsAppIcon size={22} />
                  WhatsApp&apos;tan Teklif Al
                </a>
                <div className="flex items-center justify-between gap-4 text-xs text-steel-700">
                  <p>Stok, fiyat ve teslimat WhatsApp üzerinden bildirilir.</p>
                  <button
                    type="button"
                    onClick={cart.clear}
                    className="shrink-0 underline underline-offset-4 transition-colors hover:text-accent"
                  >
                    Listeyi boşalt
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function CartRow({ part, quantity }: { part: CartPart; quantity: number }) {
  const image = images[part.imageKey];
  return (
    <li className="flex gap-4 p-5">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-bone-300">
        <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="label-mono text-[0.6rem] text-steel-500">
          Ürün Kodu: <span className="text-ink">{part.code}</span>
        </p>
        <Link
          href={partHref(part.slug)}
          onClick={cart.close}
          className="mt-1 font-display text-lg font-semibold uppercase leading-tight tracking-[0.04em] text-ink hover:text-accent"
        >
          {part.title}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            value={quantity}
            onChange={(value) => cart.setQuantity(part.slug, value)}
            label={`${part.title} adedi`}
          />
          <button
            type="button"
            onClick={() => cart.remove(part.slug)}
            className="text-xs text-steel-700 underline underline-offset-4 transition-colors hover:text-accent"
          >
            Kaldır
          </button>
        </div>
      </div>
    </li>
  );
}
