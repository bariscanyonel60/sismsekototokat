import type { Metadata } from "next";

import { PartForm } from "@/components/admin/PartForm";
import { BackLink, Notice, PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { param, type SearchParams } from "@/lib/admin/searchParams";
import { catalogManufacturers, findPart, suggestPartCode } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";

export const metadata: Metadata = { title: "Ürün Ekle" };

export default async function AdminNewPartPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const [catalog, params] = await Promise.all([getCatalog(), searchParams]);
  const template = findPart(catalog, param(params, "kopya"));
  const suggestedCodes = Object.fromEntries(
    catalog.categories.map((category) => [category.id, suggestPartCode(catalog, category)]),
  );

  return (
    <div className="grid gap-6">
      <BackLink href="/admin/urunler">Ürünlere Dön</BackLink>
      <PageTitle
        title={template ? "Ürünü Kopyala" : "Ürün Ekle"}
        description="Ürün kaydedildiğinde yedek parça sayfasında ve kendi detay sayfasında yayınlanır."
      />
      {template && (
        <Notice tone="info">
          “{template.code} · {template.title}” ürününün bilgileriyle açıldı. Ürün adını ve kodunu yeni ürüne göre
          düzenleyin; kaydettiğinizde ayrı bir ürün olarak eklenir.
        </Notice>
      )}
      <PartForm
        categories={catalog.categories}
        suggestedCodes={suggestedCodes}
        manufacturers={catalogManufacturers(catalog).map((item) => item.name)}
        template={template}
      />
    </div>
  );
}
