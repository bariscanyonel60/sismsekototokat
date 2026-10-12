import type { Metadata } from "next";
import Link from "next/link";

import { Card, PageTitle } from "@/components/admin/ui";
import { ArrowRight, CheckIcon } from "@/components/icons";
import { categoryIcons } from "@/components/partCategoryIcons";
import { requireAdmin } from "@/lib/admin/auth";
import { partCountByCategory } from "@/lib/catalog/helpers";
import { getCatalog } from "@/lib/catalog/store";
import { getGallery, siteContentStore } from "@/lib/content/store";

export const metadata: Metadata = { title: "Panel" };

const dateFormat = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [catalog, { photos }, { contact }] = await Promise.all([getCatalog(), getGallery(), siteContentStore.read()]);
  const subcategoryCount = catalog.categories.reduce((sum, category) => sum + category.subcategories.length, 0);
  const uncategorized = catalog.parts.filter((part) => !part.subcategory).length;

  const stats = [
    { label: "Ürün", value: catalog.parts.length, href: "/admin/urunler" },
    { label: "Kategori", value: catalog.categories.length, href: "/admin/kategoriler" },
    { label: "Alt kategori", value: subcategoryCount, href: "/admin/kategoriler" },
    { label: "Alt kategorisiz ürün", value: uncategorized, href: "/admin/urunler?alt=yok" },
    { label: "Galeri fotoğrafı", value: photos.length, href: "/admin/galeri" },
  ];

  const checklist = [
    { done: Boolean(contact.phone), label: "Telefon numarası", href: "/admin/iletisim" },
    { done: Boolean(contact.whatsapp), label: "WhatsApp numarası", href: "/admin/iletisim" },
    { done: Boolean(contact.address), label: "Adres", href: "/admin/iletisim" },
    { done: Boolean(contact.hours?.length), label: "Çalışma saatleri", href: "/admin/iletisim" },
    { done: Boolean(contact.mapUrl), label: "Harita / yol tarifi bağlantısı", href: "/admin/iletisim" },
    { done: photos.length > 0, label: "Atölye galerisi (ana sayfada görünür)", href: "/admin/galeri" },
    { done: Boolean(process.env.NEXT_PUBLIC_SITE_URL), label: "Alan adı (NEXT_PUBLIC_SITE_URL)", href: undefined },
  ];
  const missing = checklist.filter((item) => !item.done).length;

  const recent = catalog.parts
    .filter((part) => part.updatedAt)
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
    .slice(0, 5);

  return (
    <div className="grid gap-8">
      <PageTitle
        title="Panel"
        description="Yedek parça kataloğu ve site içeriği."
        actions={
          <>
            <Link href="/admin/urunler/yeni" className="btn btn-primary btn-sm">
              Ürün Ekle
            </Link>
            <Link href="/admin/galeri" className="btn btn-ghost btn-sm">
              Fotoğraf Yükle
            </Link>
          </>
        }
      />

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Link
              href={stat.href}
              className="block h-full rounded-md border border-ink/10 bg-white p-4 transition-colors hover:border-ink/30 md:p-5"
            >
              <span className="block font-display text-3xl font-bold text-ink md:text-4xl">{stat.value}</span>
              <span className="mt-1 block text-sm text-steel-700">{stat.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Kategoriler</h2>
          <ul className="mt-4 divide-y divide-ink/10">
            {catalog.categories.map((category) => {
              const Icon = categoryIcons[category.icon];
              return (
                <li key={category.id}>
                  <Link
                    href={`/admin/urunler?kategori=${category.id}`}
                    className="group flex items-center gap-4 py-3 transition-colors hover:text-accent"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-bone-100 text-ink">
                      <Icon size={20} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold">{category.title}</span>
                      <span className="block text-xs text-steel-500">{category.subcategories.length} alt kategori</span>
                    </span>
                    <span className="text-sm text-steel-700">{partCountByCategory(catalog, category.id)} ürün</span>
                    <ArrowRight size={16} className="text-steel-500" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="grid content-start gap-6">
          <Card>
            <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Site durumu</h2>
            <p className="mt-1 text-sm text-steel-700">
              {missing === 0 ? "Tüm bilgiler tamam." : `${missing} eksik bilgi var.`}
            </p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {checklist.map((item) => {
                const content = (
                  <>
                    <span
                      className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full ${
                        item.done ? "bg-emerald-600 text-white" : "border border-ink/25"
                      }`}
                    >
                      {item.done && <CheckIcon size={12} />}
                    </span>
                    <span className={item.done ? "text-steel-700" : "font-semibold text-ink"}>{item.label}</span>
                    <span className="sr-only">{item.done ? "(tamam)" : "(eksik)"}</span>
                  </>
                );
                return (
                  <li key={item.label}>
                    {item.href && !item.done ? (
                      <Link href={item.href} className="flex items-center gap-2.5 hover:text-accent">
                        {content}
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2.5">{content}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>

          {recent.length > 0 && (
            <Card>
              <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Son güncellenen ürünler</h2>
              <ul className="mt-3 divide-y divide-ink/10 text-sm">
                {recent.map((part) => (
                  <li key={part.slug}>
                    <Link href={`/admin/urunler/${part.slug}`} className="block py-2.5 hover:text-accent">
                      <span className="block font-semibold">{part.title}</span>
                      <span className="block text-xs text-steel-500">
                        {part.code} · {dateFormat.format(new Date(part.updatedAt ?? ""))}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-steel-500">
        Değişiklikler <code>content/</code> klasöründeki dosyalara kaydedilir ve site sayfaları otomatik yenilenir.
      </p>
    </div>
  );
}
