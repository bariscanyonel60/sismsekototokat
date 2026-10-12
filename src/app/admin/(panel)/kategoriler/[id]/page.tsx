import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteSubcategoryAction, moveSubcategoryAction, saveSubcategoryAction } from "@/app/admin/actions";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ConfirmButton, SubmitButton } from "@/components/admin/ConfirmButton";
import { BackLink, Card, inputClass, MoveButtons, Notice, PageTitle } from "@/components/admin/ui";
import { services } from "@/data/services";
import { requireAdmin } from "@/lib/admin/auth";
import { findCategory } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";

export const metadata: Metadata = { title: "Kategori Düzenle" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminEditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const catalog = await getCatalog();
  const category = findCategory(catalog, id);
  if (!category) notFound();

  const message = typeof query.mesaj === "string" ? query.mesaj : "";
  const error = typeof query.hata === "string" ? query.hata : "";
  const counts = new Map(
    category.subcategories.map((sub) => [
      sub.id,
      catalog.parts.filter((part) => part.category === category.id && part.subcategory === sub.id).length,
    ]),
  );

  return (
    <div className="grid gap-6">
      <BackLink href="/admin/kategoriler">Kategorilere Dön</BackLink>
      <PageTitle
        title={category.title}
        description="Kategori bilgileri ve filtre panelinde görünen alt kategoriler."
        actions={
          <Link href={`/admin/urunler?kategori=${category.id}`} className="btn btn-ghost btn-sm">
            Bu Kategorinin Ürünleri
          </Link>
        }
      />
      {message && <Notice tone="success">{message}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      <Card className="grid gap-4">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Alt kategoriler</h2>
          <p className="mt-1 text-sm text-steel-700">
            Yedek parça sayfasında kategori seçildiğinde filtre panelinde listelenir. Silinen alt kategorinin ürünleri
            kategoride kalır, yalnızca alt kategorisi boşalır.
          </p>
        </div>

        {category.subcategories.length > 0 && (
          <ul className="divide-y divide-ink/10 rounded-sm border border-ink/10">
            {category.subcategories.map((sub, index) => (
              <li key={sub.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
                <form action={saveSubcategoryAction} className="flex flex-1 gap-2">
                  <input type="hidden" name="categoryId" value={category.id} />
                  <input type="hidden" name="subId" value={sub.id} />
                  <label className="flex-1">
                    <span className="sr-only">{sub.title} adı</span>
                    <input name="title" defaultValue={sub.title} required maxLength={60} className={inputClass} />
                  </label>
                  <SubmitButton className="btn btn-ghost btn-sm h-11">Kaydet</SubmitButton>
                </form>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-right text-xs text-steel-500">{counts.get(sub.id) ?? 0} ürün</span>
                  <MoveButtons
                    action={moveSubcategoryAction}
                    hidden={{ categoryId: category.id, subId: sub.id }}
                    first={index === 0}
                    last={index === category.subcategories.length - 1}
                    label={sub.title}
                  />
                  <form action={deleteSubcategoryAction}>
                    <input type="hidden" name="categoryId" value={category.id} />
                    <input type="hidden" name="subId" value={sub.id} />
                    <ConfirmButton
                      message={`"${sub.title}" alt kategorisi silinsin mi? ${counts.get(sub.id) ?? 0} ürünün alt kategorisi boşalacak.`}
                      label={`${sub.title} sil`}
                      className="btn btn-sm h-9 border border-accent/40 text-accent hover:bg-accent hover:text-white"
                    >
                      Sil
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form action={saveSubcategoryAction} className="flex flex-col gap-2 sm:flex-row">
          <input type="hidden" name="categoryId" value={category.id} />
          <label className="flex-1">
            <span className="sr-only">Yeni alt kategori adı</span>
            <input name="title" required maxLength={60} placeholder="Yeni alt kategori adı" className={inputClass} />
          </label>
          <SubmitButton className="btn btn-primary btn-sm h-11">Alt Kategori Ekle</SubmitButton>
        </form>
      </Card>

      <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Kategori bilgileri</h2>
      <CategoryForm category={category} services={services.map(({ slug, title }) => ({ slug, title }))} />
    </div>
  );
}
