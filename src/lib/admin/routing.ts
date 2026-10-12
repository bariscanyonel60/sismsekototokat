import "server-only";

import { revalidatePath } from "next/cache";

import { ADMIN_HOME_PATH } from "@/lib/admin/auth";

export function refreshSite() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

export function formField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Yönlendirmeler yalnızca panel içine gider; form verisi yol parçası olarak kodlanır. */
export function adminHref(path: string, params?: Record<string, string>): string {
  if (!path.startsWith("/admin/") && path !== ADMIN_HOME_PATH) throw new Error(`Geçersiz panel yolu: ${path}`);
  const query = params ? new URLSearchParams(params).toString() : "";
  return query ? `${path}?${query}` : path;
}

/** Listeyi yerinde bir adım yukarı / aşağı kaydırır; sınırdaysa false döner. */
export function moveItem<T>(items: T[], index: number, direction: string): boolean {
  const target = index + (direction === "up" ? -1 : 1);
  if (index < 0 || target < 0 || target >= items.length) return false;
  [items[index], items[target]] = [items[target], items[index]];
  return true;
}
