import type { Metadata } from "next";
import Link from "next/link";

import { deleteCategoryAction, moveCategoryAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { MoveButtons, Notice, PageTitle } from "@/components/admin/ui";
import { categoryIcons } from "@/components/partCategoryIcons";
import { requireAdmin } from "@/lib/admin/auth";
import { partCountByCategory } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";

export const metadata: Metadata = { title: "Kategoriler" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminCategoriesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const message = typeof params.mesaj === "string" ? params.mesaj : "";
  const error = typeof params.hata === "string" ? params.hata : "";
  const catalog = await getCatalog();

  return (
    <div className="grid gap-6">
      <PageTitle
        title="Kategoriler"
        description="Sıra, yedek parça sayfasındaki kategori kutuları ve filtre listesiyle aynıdır."
        actions={
          <Link href="/admin/kategoriler/yeni" className="btn btn-primary btn-sm">
            Kategori Ekle
          </Link>
        }
      />
      {message && <Notice tone="success">{message}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      <ul className="grid gap-3">
        {catalog.categories.map((category, index) => {
          const Icon = categoryIcons[category.icon];
          const count = partCountByCategory(catalog, category.id);
          return (
            <li key={category.id} className="rounded-md border border-ink/10 bg-white p-4 md:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex flex-1 items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-bone-100">
                    <Icon size={22} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold uppercase tracking-[0.03em]">
                      <span className="mr-2 text-steel-500">{String(index + 1).padStart(2, "0")}</span>
                      {category.title}
                      <span className="ml-2 font-mono text-xs font-normal text-steel-500">{category.code}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-steel-700">{category.summary}</p>
                    <p className="mt-2 flex flex-wrap gap-1.5">
                      {category.subcategories.length === 0 ? (
                        <span className="text-xs text-steel-500">Alt kategori yok</span>
                      ) : (
                        category.subcategories.map((sub) => (
                          <span key={sub.id} className="rounded-full bg-bone-100 px-2.5 py-0.5 text-xs text-ink">
                            {sub.title}
                          </span>
                        ))
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/urunler?kategori=${category.id}`} className="text-sm text-steel-700 underline-offset-4 hover:underline">
                    {count} ürün
                  </Link>
                  <MoveButtons
                    action={moveCategoryAction}
                    hidden={{ id: category.id }}
                    first={index === 0}
                    last={index === catalog.categories.length - 1}
                    label={category.title}
                  />
                  <Link href={`/admin/kategoriler/${category.id}`} className="btn btn-ghost btn-sm">
                    Düzenle
                  </Link>
                  <form action={deleteCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <ConfirmButton
                      message={
                        count > 0
                          ? `Bu kategoride ${count} ürün var; silinemez. Önce ürünleri taşıyın.`
                          : `"${category.title}" kategorisi silinsin mi?`
                      }
                      className="btn btn-sm border border-accent/40 text-accent hover:bg-accent hover:text-white"
                    >
                      Sil
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
