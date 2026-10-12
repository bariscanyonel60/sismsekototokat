import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { deletePartAction } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { PartForm } from "@/components/admin/PartForm";
import { BackLink, PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { catalogManufacturers, findPart, partHref } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";

export const metadata: Metadata = { title: "Ürün Düzenle" };

export default async function AdminEditPartPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const catalog = await getCatalog();
  const part = findPart(catalog, slug);
  if (!part) notFound();

  return (
    <div className="grid gap-6">
      <BackLink href="/admin/urunler">Ürünlere Dön</BackLink>
      <PageTitle
        title="Ürün Düzenle"
        description={`${part.code} · ${part.title}`}
        actions={
          <>
            <Link href={partHref(part.slug)} target="_blank" className="btn btn-ghost btn-sm">
              Sitede Gör
            </Link>
            <Link href={`/admin/urunler/yeni?kopya=${part.slug}`} className="btn btn-ghost btn-sm">
              Kopyala
            </Link>
            <form action={deletePartAction}>
              <input type="hidden" name="slug" value={part.slug} />
              <ConfirmButton
                message={`"${part.title}" silinsin mi? Bu işlem geri alınamaz.`}
                className="btn btn-sm border border-accent/40 text-accent hover:bg-accent hover:text-white"
              >
                Ürünü Sil
              </ConfirmButton>
            </form>
          </>
        }
      />
      <PartForm
        categories={catalog.categories}
        suggestedCodes={{}}
        manufacturers={catalogManufacturers(catalog).map((item) => item.name)}
        part={part}
      />
    </div>
  );
}
