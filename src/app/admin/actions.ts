"use server";

import { redirect } from "next/navigation";

import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH, login, logout, requireAdmin } from "@/lib/admin/auth";
import { adminHref, formField as field, moveItem, refreshSite } from "@/lib/admin/routing";
import {
  validateCategory,
  validatePart,
  validateSubcategoryTitle,
  type FieldErrors,
} from "@/lib/admin/validation";
import { slugify } from "@/lib/catalog/helpers";
import { catalogStore } from "@/lib/catalog/store";
import type { Catalog } from "@/lib/catalog/types";

export interface FormState {
  message?: string;
  errors?: FieldErrors;
}

type SaveOutcome = { saved: string } | { failed: FormState };

/** `categoryId` katalogdan gelir; formdaki ham değer yönlendirmeye hiç girmez. */
type SubcategoryOutcome = { categoryId: string; params?: Record<string, string>; changed?: boolean };

let queue: Promise<unknown> = Promise.resolve();

/** Yazmaları sıraya koyar; aynı anda iki kayıt birbirini ezmez. */
function mutate<T>(change: (catalog: Catalog) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const catalog = await catalogStore.read();
    const result = await change(catalog);
    await catalogStore.write(catalog);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

function categoryHref(id: string, params?: Record<string, string>): string {
  return adminHref(`/admin/kategoriler/${encodeURIComponent(id)}`, params);
}

export async function loginAction(_state: FormState, form: FormData): Promise<FormState> {
  const result = await login(field(form, "username"), String(form.get("password") ?? ""));
  switch (result) {
    case "ok":
      redirect(ADMIN_HOME_PATH);
    case "invalid":
      return { message: "Kullanıcı adı veya şifre hatalı." };
    case "locked":
      return { message: "Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin." };
    case "unconfigured":
      return { message: "Admin girişi henüz yapılandırılmadı (ADMIN_* ortam değişkenleri)." };
    default: {
      const exhaustive: never = result;
      return exhaustive;
    }
  }
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect(ADMIN_LOGIN_PATH);
}

export async function savePartAction(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const originalSlug = field(form, "originalSlug");

  const outcome = await mutate((catalog): SaveOutcome => {
    const index = originalSlug ? catalog.parts.findIndex((part) => part.slug === originalSlug) : -1;
    if (originalSlug && index === -1) return { failed: { message: "Ürün bulunamadı; silinmiş olabilir." } };
    const result = validatePart(form, catalog, index >= 0 ? catalog.parts[index] : undefined);
    if (!result.ok) return { failed: { errors: result.errors, message: "Lütfen işaretli alanları düzeltin." } };
    if (index >= 0) catalog.parts[index] = result.value;
    else catalog.parts.push(result.value);
    return { saved: result.value.slug };
  });

  if ("failed" in outcome) return outcome.failed;
  refreshSite();
  redirect(adminHref("/admin/urunler", { kaydedildi: outcome.saved }));
}

export async function deletePartAction(form: FormData): Promise<void> {
  await requireAdmin();
  const slug = field(form, "slug");
  const removed = await mutate((catalog) => {
    const part = catalog.parts.find((item) => item.slug === slug);
    if (!part) return null;
    catalog.parts = catalog.parts.filter((item) => item !== part);
    return part.slug;
  });
  if (!removed) redirect(adminHref("/admin/urunler", { hata: "Ürün bulunamadı; zaten silinmiş olabilir." }));
  refreshSite();
  redirect(adminHref("/admin/urunler", { silindi: removed }));
}

/** Ürün listesindeki toplu işlemler: seçili ürünleri sil veya başka kategoriye taşı. */
export async function bulkPartsAction(form: FormData): Promise<void> {
  await requireAdmin();
  const slugs = new Set(form.getAll("slugs").filter((value): value is string => typeof value === "string"));
  const operation = field(form, "op");
  const targetId = field(form, "category");
  const back = Object.fromEntries(
    [...new URLSearchParams(field(form, "back"))].filter(([key]) => ["q", "kategori", "alt"].includes(key)),
  );
  const done = (params: Record<string, string>) => redirect(adminHref("/admin/urunler", { ...back, ...params }));

  if (slugs.size === 0) done({ hata: "Önce ürün seçin." });
  if (operation !== "delete" && operation !== "move") done({ hata: "İşlem seçin." });

  const count = await mutate((catalog) => {
    const selected = catalog.parts.filter((part) => slugs.has(part.slug));
    if (operation === "delete") {
      catalog.parts = catalog.parts.filter((part) => !slugs.has(part.slug));
      return selected.length;
    }
    const target = catalog.categories.find((category) => category.id === targetId);
    if (!target) return -1;
    const now = new Date().toISOString();
    for (const part of selected) {
      if (part.category === target.id) continue;
      part.category = target.id;
      delete part.subcategory;
      part.updatedAt = now;
    }
    return selected.length;
  });

  if (count === -1) done({ hata: "Taşınacak kategoriyi seçin." });
  refreshSite();
  done({ mesaj: operation === "delete" ? `${count} ürün silindi.` : `${count} ürün taşındı.` });
}

export async function saveCategoryAction(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const originalId = field(form, "originalId");

  const outcome = await mutate((catalog): SaveOutcome => {
    const index = originalId ? catalog.categories.findIndex((category) => category.id === originalId) : -1;
    if (originalId && index === -1) return { failed: { message: "Kategori bulunamadı; silinmiş olabilir." } };
    const result = validateCategory(form, catalog, index >= 0 ? catalog.categories[index] : undefined);
    if (!result.ok) return { failed: { errors: result.errors, message: "Lütfen işaretli alanları düzeltin." } };
    if (index >= 0) catalog.categories[index] = result.value;
    else catalog.categories.push(result.value);
    return { saved: result.value.id };
  });

  if ("failed" in outcome) return outcome.failed;
  refreshSite();
  redirect(categoryHref(outcome.saved, { mesaj: "Kategori kaydedildi." }));
}

export async function deleteCategoryAction(form: FormData): Promise<void> {
  await requireAdmin();
  const id = field(form, "id");
  const blocked = await mutate((catalog) => {
    const count = catalog.parts.filter((part) => part.category === id).length;
    if (count > 0) return count;
    catalog.categories = catalog.categories.filter((category) => category.id !== id);
    return 0;
  });
  if (blocked > 0) {
    redirect(
      adminHref("/admin/kategoriler", {
        hata: `Bu kategoride ${blocked} ürün var. Önce ürünleri başka kategoriye taşıyın veya silin.`,
      }),
    );
  }
  refreshSite();
  redirect(adminHref("/admin/kategoriler", { mesaj: "Kategori silindi." }));
}

export async function moveCategoryAction(form: FormData): Promise<void> {
  await requireAdmin();
  const id = field(form, "id");
  await mutate((catalog) => {
    moveItem(
      catalog.categories,
      catalog.categories.findIndex((category) => category.id === id),
      field(form, "direction"),
    );
  });
  refreshSite();
  redirect("/admin/kategoriler");
}

export async function saveSubcategoryAction(form: FormData): Promise<void> {
  await requireAdmin();
  const categoryId = field(form, "categoryId");
  const subId = field(form, "subId");
  const title = field(form, "title");

  const outcome = await mutate((catalog): SubcategoryOutcome | null => {
    const category = catalog.categories.find((item) => item.id === categoryId);
    if (!category) return null;
    const error = validateSubcategoryTitle(title);
    if (error) return { categoryId: category.id, params: { hata: error } };
    if (subId) {
      const sub = category.subcategories.find((item) => item.id === subId);
      if (!sub) return { categoryId: category.id, params: { hata: "Alt kategori bulunamadı." } };
      sub.title = title;
      return { categoryId: category.id, params: { mesaj: "Alt kategori güncellendi." }, changed: true };
    }
    const id = slugify(title);
    if (category.subcategories.some((item) => item.id === id)) {
      return { categoryId: category.id, params: { hata: "Bu adla bir alt kategori zaten var." } };
    }
    category.subcategories.push({ id, title });
    return { categoryId: category.id, params: { mesaj: "Alt kategori eklendi." }, changed: true };
  });
  finishSubcategory(outcome);
}

export async function deleteSubcategoryAction(form: FormData): Promise<void> {
  await requireAdmin();
  const categoryId = field(form, "categoryId");
  const subId = field(form, "subId");
  const outcome = await mutate((catalog): SubcategoryOutcome | null => {
    const category = catalog.categories.find((item) => item.id === categoryId);
    if (!category) return null;
    category.subcategories = category.subcategories.filter((item) => item.id !== subId);
    for (const part of catalog.parts) {
      if (part.category === category.id && part.subcategory === subId) delete part.subcategory;
    }
    return { categoryId: category.id, params: { mesaj: "Alt kategori silindi." }, changed: true };
  });
  finishSubcategory(outcome);
}

export async function moveSubcategoryAction(form: FormData): Promise<void> {
  await requireAdmin();
  const categoryId = field(form, "categoryId");
  const subId = field(form, "subId");
  const outcome = await mutate((catalog): SubcategoryOutcome | null => {
    const category = catalog.categories.find((item) => item.id === categoryId);
    if (!category) return null;
    const subs = category.subcategories;
    const changed = moveItem(subs, subs.findIndex((item) => item.id === subId), field(form, "direction"));
    return { categoryId: category.id, changed };
  });
  finishSubcategory(outcome);
}

function finishSubcategory(outcome: SubcategoryOutcome | null): never {
  if (!outcome) redirect(adminHref("/admin/kategoriler", { hata: "Kategori bulunamadı." }));
  if (outcome.changed) refreshSite();
  redirect(categoryHref(outcome.categoryId, outcome.params));
}
