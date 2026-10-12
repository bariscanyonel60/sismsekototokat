import type { Metadata } from "next";
import Link from "next/link";

import { PartsTable } from "@/components/admin/PartsTable";
import { inputClass, Notice, PageTitle } from "@/components/admin/ui";
import { segmentLabels } from "@/data/brands";
import { requireAdmin } from "@/lib/admin/auth";
import { param, type SearchParams } from "@/lib/admin/searchParams";
import { findCategory, partHref, slugify, subcategoryTitle } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";

export const metadata: Metadata = { title: "Ürünler" };

export default async function AdminPartsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const catalog = await getCatalog();

  const query = param(params, "q");
  const categoryId = param(params, "kategori");
  const subId = param(params, "alt");
  const saved = param(params, "kaydedildi");
  const deleted = param(params, "silindi");
  const error = param(params, "hata");
  const message = param(params, "mesaj");
  const category = categoryId ? findCategory(catalog, categoryId) : undefined;

  const terms = slugify(query).split("-").filter(Boolean);
  const rows = catalog.parts.filter((part) => {
    if (category && part.category !== category.id) return false;
    if (subId === "yok" ? Boolean(part.subcategory) : subId && part.subcategory !== subId) return false;
    if (terms.length === 0) return true;
    const haystack = slugify(`${part.code} ${part.oemCodes?.join(" ") ?? ""} ${part.title} ${part.keywords.join(" ")} ${part.brands?.join(" ") ?? ""} ${part.manufacturer ?? ""}`);
    return terms.every((term) => haystack.includes(term));
  });

  return (
    <div className="grid gap-6">
      <PageTitle
        title="Ürünler"
        description={`${catalog.parts.length} ürün · listelenen ${rows.length}`}
        actions={
          <Link href="/admin/urunler/yeni" className="btn btn-primary btn-sm">
            Ürün Ekle
          </Link>
        }
      />

      {saved && <Notice tone="success">Ürün kaydedildi: {saved}</Notice>}
      {deleted && <Notice tone="success">Ürün silindi: {deleted}</Notice>}
      {message && <Notice tone="success">{message}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      <form className="grid gap-3 rounded-md border border-ink/10 bg-white p-4 md:grid-cols-[1.5fr_1fr_1fr_auto]">
        <label>
          <span className="sr-only">Ara</span>
          <input name="q" defaultValue={query} placeholder="Ürün kodu, adı, marka…" className={inputClass} />
        </label>
        <label>
          <span className="sr-only">Kategori</span>
          <select name="kategori" defaultValue={category?.id ?? ""} className={inputClass}>
            <option value="">Tüm kategoriler</option>
            {catalog.categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Alt kategori</span>
          <select name="alt" defaultValue={subId} className={inputClass}>
            <option value="">Tüm alt kategoriler</option>
            <option value="yok">Alt kategorisi olmayanlar</option>
            {(category ? [category] : catalog.categories).flatMap((item) =>
              item.subcategories.map((sub) => (
                <option key={`${item.id}/${sub.id}`} value={sub.id}>
                  {category ? sub.title : `${item.title} / ${sub.title}`}
                </option>
              )),
            )}
          </select>
        </label>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary btn-sm h-11">
            Filtrele
          </button>
          <Link href="/admin/urunler" className="btn btn-ghost btn-sm h-11">
            Temizle
          </Link>
        </div>
      </form>

      <PartsTable
        rows={rows.map((part) => ({
          slug: part.slug,
          code: part.code,
          title: part.title,
          brands: part.brands?.join(", "),
          category: findCategory(catalog, part.category)?.title ?? part.category,
          subcategory: subcategoryTitle(catalog, part),
          segments: part.segments.map((segment) => segmentLabels[segment]).join(", "),
          href: partHref(part.slug),
        }))}
        categories={catalog.categories.map(({ id, title }) => ({ id, title }))}
        back={new URLSearchParams({ q: query, kategori: categoryId, alt: subId }).toString()}
        highlight={saved}
      />
    </div>
  );
}
