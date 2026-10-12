"use client";

import { useSyncExternalStore } from "react";

export interface CartLine {
  slug: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  /** Araç seçiciden gelen "marka · model · yıl"; sipariş mesajına eklenir. */
  vehicle: string;
  /** Son eklenen ürün; "sepete eklendi" bildirimi için. */
  added: { slug: string; at: number } | null;
}

const STORAGE_KEY = "simsek-oto-parca-sepeti";
const VEHICLE_KEY = "simsek-oto-arac";
const MAX_QUANTITY = 99;
const SERVER_STATE: CartState = { lines: [], open: false, vehicle: "", added: null };

let state: CartState = SERVER_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function clampQuantity(value: number): number {
  return Math.min(MAX_QUANTITY, Math.max(1, Math.round(value)));
}

function readStorage(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item: unknown) => {
      if (typeof item !== "object" || item === null) return [];
      const { slug, quantity } = item as Record<string, unknown>;
      if (typeof slug !== "string" || typeof quantity !== "number") return [];
      return [{ slug, quantity: clampQuantity(quantity) }];
    });
  } catch {
    return [];
  }
}

function emit(next: CartState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function persist(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Gizli sekme vb. durumlarda veri yalnızca bu oturumda tutulur.
  }
}

function readVehicle(): string {
  try {
    return window.localStorage.getItem(VEHICLE_KEY) ?? "";
  } catch {
    return "";
  }
}

function setLines(lines: CartLine[], patch: Partial<CartState> = {}) {
  persist(STORAGE_KEY, JSON.stringify(lines));
  emit({ ...state, ...patch, lines });
}

function onStorage(event: StorageEvent) {
  if (event.key === STORAGE_KEY) emit({ ...state, lines: readStorage() });
  if (event.key === VEHICLE_KEY) emit({ ...state, vehicle: readVehicle() });
}

function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    state = { ...SERVER_STATE, lines: readStorage(), vehicle: readVehicle() };
  }
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export const cart = {
  add(slug: string, quantity = 1) {
    const existing = state.lines.find((line) => line.slug === slug);
    const lines = existing
      ? state.lines.map((line) =>
          line.slug === slug ? { ...line, quantity: clampQuantity(line.quantity + quantity) } : line,
        )
      : [...state.lines, { slug, quantity: clampQuantity(quantity) }];
    setLines(lines, { added: { slug, at: Date.now() } });
  },
  setQuantity(slug: string, quantity: number) {
    setLines(state.lines.map((line) => (line.slug === slug ? { ...line, quantity: clampQuantity(quantity) } : line)));
  },
  remove(slug: string) {
    setLines(state.lines.filter((line) => line.slug !== slug));
  },
  clear() {
    setLines([]);
  },
  /** Katalogdan kaldırılmış ürünleri sepetten düşürür. */
  retain(slugs: ReadonlySet<string>) {
    const lines = state.lines.filter((line) => slugs.has(line.slug));
    if (lines.length !== state.lines.length) setLines(lines);
  },
  dismissAdded() {
    emit({ ...state, added: null });
  },
  setVehicle(vehicle: string) {
    persist(VEHICLE_KEY, vehicle);
    emit({ ...state, vehicle });
  },
  open() {
    emit({ ...state, open: true, added: null });
  },
  close() {
    emit({ ...state, open: false });
  },
};

export function useCart(): CartState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
