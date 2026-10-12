"use client";

import { useSyncExternalStore } from "react";

const CHANGE_EVENT = "simsek:url-search";

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

/** Adres çubuğundaki `?…` kısmı; sunucuda boş (varsayılan liste) render edilir. */
export function useUrlSearch(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
}

/** Filtre değişiminde yeni geçmiş kaydı (`push`), yazarken mevcut kaydı günceller (`replace`). */
export function writeUrlSearch(search: string, mode: "push" | "replace") {
  if (search === window.location.search) return;
  const url = `${window.location.pathname}${search}`;
  if (mode === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
