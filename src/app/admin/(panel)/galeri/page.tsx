import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { deleteGalleryPhotoAction, moveGalleryPhotoAction, updateGalleryCaptionAction } from "@/app/admin/contentActions";
import { ConfirmButton, SubmitButton } from "@/components/admin/ConfirmButton";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { Card, inputClass, MoveButtons, Notice, PageTitle } from "@/components/admin/ui";
import { ArrowUpRight } from "@/components/icons";
import { routes } from "@/data/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { param, type SearchParams } from "@/lib/admin/searchParams";
import { GALLERY_HOME_LIMIT, GALLERY_MAX_PHOTOS, galleryPhotoSrc } from "@/lib/content/gallery";
import { getGallery } from "@/lib/content/store";

export const metadata: Metadata = { title: "Galeri" };

export default async function AdminGalleryPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const { photos } = await getGallery();
  const message = param(params, "mesaj");
  const error = param(params, "hata");

  return (
    <div className="grid gap-6">
      <PageTitle
        title="Galeri"
        description={`${photos.length} / ${GALLERY_MAX_PHOTOS} fotoğraf · ilk ${GALLERY_HOME_LIMIT} fotoğraf ana sayfada, hepsi galeri sayfasında görünür.`}
        actions={
          photos.length > 0 ? (
            <Link href={routes.gallery} target="_blank" className="btn btn-ghost btn-sm">
              Galeriyi Gör
              <ArrowUpRight size={16} />
            </Link>
          ) : undefined
        }
      />

      {message && <Notice tone="success">{message}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      <Card className="grid gap-4">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Fotoğraf yükle</h2>
          <p className="mt-1 text-sm text-steel-700">
            Yalnızca işletmenin kendi atölye fotoğraflarını yükleyin (stok / internetten görsel değil). Açıklama
            fotoğrafın altında görünür ve görme engelli ziyaretçiler ile Google için görselin metnidir.
          </p>
        </div>
        <GalleryUploader remaining={GALLERY_MAX_PHOTOS - photos.length} />
      </Card>

      {photos.length === 0 ? (
        <Card>
          <p className="text-sm text-steel-700">
            Henüz fotoğraf yok. İlk fotoğraf yüklendiğinde ana sayfadaki “Atölyeden Gerçek Kareler” bölümü ve galeri
            sayfası yayına girer.
          </p>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {photos.map((photo, index) => (
            <li key={photo.id} className="overflow-hidden rounded-md border border-ink/10 bg-white">
              <div className="relative aspect-[4/3] bg-bone-300">
                <Image
                  src={galleryPhotoSrc(photo.file)}
                  alt={photo.caption}
                  fill
                  placeholder="blur"
                  blurDataURL={photo.blurDataURL}
                  sizes="(min-width:1280px) 360px, (min-width:640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-2 top-2 rounded-xs bg-ink/80 px-2 py-0.5 text-xs font-semibold text-bone">
                  {index + 1}
                  {index < GALLERY_HOME_LIMIT ? " · Ana sayfa" : ""}
                </span>
              </div>
              <div className="grid gap-3 p-4">
                <form action={updateGalleryCaptionAction} className="flex gap-2">
                  <input type="hidden" name="id" value={photo.id} />
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">Açıklama</span>
                    <input
                      name="caption"
                      defaultValue={photo.caption}
                      required
                      minLength={3}
                      maxLength={120}
                      className={`${inputClass} h-10 text-sm`}
                    />
                  </label>
                  <SubmitButton className="btn btn-ghost btn-sm h-10 px-3">Kaydet</SubmitButton>
                </form>
                <div className="flex items-center justify-between gap-2">
                  <MoveButtons
                    action={moveGalleryPhotoAction}
                    hidden={{ id: photo.id }}
                    first={index === 0}
                    last={index === photos.length - 1}
                    label={photo.caption}
                  />
                  <form action={deleteGalleryPhotoAction}>
                    <input type="hidden" name="id" value={photo.id} />
                    <ConfirmButton
                      message="Bu fotoğraf silinsin mi? Bu işlem geri alınamaz."
                      className="btn btn-sm h-9 border border-accent/40 px-3 text-accent hover:bg-accent hover:text-white"
                    >
                      Sil
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
