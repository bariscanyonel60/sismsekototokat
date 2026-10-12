import type { Metadata } from "next";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { BackLink, PageTitle } from "@/components/admin/ui";
import { services } from "@/data/services";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Kategori Ekle" };

export default async function AdminNewCategoryPage() {
  await requireAdmin();
  return (
    <div className="grid gap-6">
      <BackLink href="/admin/kategoriler">Kategorilere Dön</BackLink>
      <PageTitle
        title="Kategori Ekle"
        description="Kaydettikten sonra alt kategorileri ekleyebilirsiniz."
      />
      <CategoryForm services={services.map(({ slug, title }) => ({ slug, title }))} />
    </div>
  );
}
