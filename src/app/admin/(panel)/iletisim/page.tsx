import type { Metadata } from "next";

import { ContactForm } from "@/components/admin/ContactForm";
import { Notice, PageTitle } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { param, type SearchParams } from "@/lib/admin/searchParams";
import { siteContentStore } from "@/lib/content/store";

export const metadata: Metadata = { title: "İletişim Bilgileri" };

export default async function AdminContactPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const { contact } = await siteContentStore.read();
  const message = param(params, "mesaj");

  return (
    <div className="grid gap-6">
      <PageTitle
        title="İletişim Bilgileri"
        description="Header, footer, iletişim bölümü, WhatsApp / Ara butonları ve Google işletme bilgisinde kullanılır. Boş bırakılan alan sitede gösterilmez."
      />
      {message && <Notice tone="success">{message}</Notice>}
      <Notice tone="info">
        İletişim bilgileri sitenin her sayfasına derlenir: yerelde (<code>npm run dev</code>) hemen, canlı sitede
        bir sonraki yayında (build) güncellenir.
      </Notice>
      <ContactForm contact={contact} />
    </div>
  );
}
