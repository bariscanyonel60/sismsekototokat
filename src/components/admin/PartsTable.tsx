"use client";

import Link from "next/link";
import { useState } from "react";

import { bulkPartsAction, deletePartAction } from "@/app/admin/actions";
import { CopyIcon } from "@/components/admin/adminIcons";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { inputClass } from "@/components/admin/ui";

export interface PartRow {
  slug: string;
  code: string;
  title: string;
  brands?: string;
  category: string;
  subcategory?: string;
  segments: string;
  href: string;
}

const checkboxClass = "size-4 accent-[var(--color-accent)]";

export function PartsTable({
  rows,
  categories,
  back,
  highlight,
}: {
  rows: PartRow[];
  categories: { id: string; title: string }[];
  /** Toplu işlemden sonra aynı filtreye dönmek için geçerli sorgu. */
  back: string;
  highlight?: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [operation, setOperation] = useState<"move" | "delete">("move");
  const visible = rows.filter((row) => selected.has(row.slug));
  const allSelected = rows.length > 0 && visible.length === rows.length;

  const toggle = (slug: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  return (
    <div className="grid gap-3">
      {visible.length > 0 && (
        <form
          action={bulkPartsAction}
          className="sticky top-16 z-20 flex flex-wrap items-center gap-3 rounded-md border border-ink/15 bg-ink px-4 py-3 text-bone shadow-lg lg:top-4"
        >
          <input type="hidden" name="back" value={back} />
          <input type="hidden" name="op" value={operation} />
          {visible.map((row) => (
            <input key={row.slug} type="hidden" name="slugs" value={row.slug} />
          ))}
          <span className="text-sm font-semibold">{visible.length} ürün seçili</span>
          <label className="flex items-center gap-2 text-sm">
            <span className="sr-only">İşlem</span>
            <select
              value={operation}
              onChange={(event) => setOperation(event.target.value as "move" | "delete")}
              className={`${inputClass} h-10 w-auto`}
            >
              <option value="move">Kategoriye taşı</option>
              <option value="delete">Sil</option>
            </select>
          </label>
          {operation === "move" && (
            <label className="text-sm">
              <span className="sr-only">Hedef kategori</span>
              <select name="category" defaultValue="" required className={`${inputClass} h-10 w-auto`}>
                <option value="" disabled>
                  Kategori seçin
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <ConfirmButton
            message={
              operation === "delete"
                ? `${visible.length} ürün silinsin mi? Bu işlem geri alınamaz.`
                : `${visible.length} ürün seçilen kategoriye taşınsın mı? Alt kategorileri boşalır.`
            }
            className="btn btn-primary btn-sm h-10"
          >
            Uygula
          </ConfirmButton>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto text-sm font-semibold text-bone/80 underline-offset-4 hover:underline"
          >
            Seçimi temizle
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-md border border-ink/10 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-ink/10 bg-bone-100 text-xs uppercase tracking-[0.08em] text-steel-500">
            <tr>
              <th scope="col" className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((row) => row.slug)))}
                  aria-label="Listelenen tüm ürünleri seç"
                  className={checkboxClass}
                />
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">Kod</th>
              <th scope="col" className="px-4 py-3 font-semibold">Ürün</th>
              <th scope="col" className="px-4 py-3 font-semibold">Kategori</th>
              <th scope="col" className="px-4 py-3 font-semibold">Araç grubu</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {rows.map((row) => (
              <tr
                key={row.slug}
                className={selected.has(row.slug) ? "bg-accent/5" : highlight === row.slug ? "bg-emerald-50" : undefined}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(row.slug)}
                    onChange={() => toggle(row.slug)}
                    aria-label={`${row.title} seç`}
                    className={checkboxClass}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{row.code}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/urunler/${row.slug}`} className="font-semibold text-ink hover:text-accent">
                    {row.title}
                  </Link>
                  {row.brands && <span className="mt-0.5 block text-xs text-steel-500">{row.brands}</span>}
                </td>
                <td className="px-4 py-3 text-steel-700">
                  {row.category}
                  {row.subcategory && <span className="block text-xs text-steel-500">{row.subcategory}</span>}
                </td>
                <td className="px-4 py-3 text-steel-700">{row.segments}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={row.href} target="_blank" className="btn btn-ghost btn-sm h-9 px-3">
                      Gör
                    </Link>
                    <Link href={`/admin/urunler/${row.slug}`} className="btn btn-ghost btn-sm h-9 px-3">
                      Düzenle
                    </Link>
                    <Link
                      href={`/admin/urunler/yeni?kopya=${row.slug}`}
                      className="btn btn-ghost btn-sm h-9 px-2.5"
                      aria-label={`${row.title} kopyala`}
                      title="Kopyala"
                    >
                      <CopyIcon size={16} />
                    </Link>
                    <form action={deletePartAction}>
                      <input type="hidden" name="slug" value={row.slug} />
                      <ConfirmButton
                        message={`"${row.title}" silinsin mi? Bu işlem geri alınamaz.`}
                        className="btn btn-sm h-9 border border-accent/40 px-3 text-accent hover:bg-accent hover:text-white"
                      >
                        Sil
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-center text-sm text-steel-700">Filtreye uyan ürün yok.</p>}
      </div>
    </div>
  );
}
