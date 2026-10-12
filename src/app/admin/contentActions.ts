"use server";

import { redirect } from "next/navigation";

import type { FormState } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { validateCaption, validateContact } from "@/lib/admin/contentValidation";
import { adminHref, formField as field, moveItem, refreshSite } from "@/lib/admin/routing";
import { GALLERY_MAX_PHOTOS } from "@/lib/content/gallery";
import { removeGalleryFile, saveGalleryUpload } from "@/lib/content/galleryUpload";
import { galleryStore, mutateContent, siteContentStore } from "@/lib/content/store";

export type UploadResult = { ok: true } | { ok: false; message: string };

/** Panelden tek tek çağrılır (her istek tek fotoğraf); istemci hepsi bitince sayfayı yeniler. */
export async function uploadGalleryPhotoAction(form: FormData): Promise<UploadResult> {
  await requireAdmin();
  const upload = form.get("photo");
  const caption = field(form, "caption").replace(/\s+/g, " ");
  const captionError = validateCaption(caption);
  if (captionError) return { ok: false, message: captionError };
  if (!(upload instanceof File)) return { ok: false, message: "Fotoğraf seçin." };

  const { photos } = await galleryStore.read();
  if (photos.length >= GALLERY_MAX_PHOTOS) return { ok: false, message: `Galeride en fazla ${GALLERY_MAX_PHOTOS} fotoğraf olabilir.` };

  const processed = await saveGalleryUpload(upload);
  if (typeof processed === "string") return { ok: false, message: processed };

  await mutateContent(galleryStore, (gallery) => {
    gallery.photos.push({
      id: processed.file.replace(/\.webp$/, ""),
      ...processed,
      caption,
      createdAt: new Date().toISOString(),
    });
  });
  refreshSite();
  return { ok: true };
}

export async function updateGalleryCaptionAction(form: FormData): Promise<void> {
  await requireAdmin();
  const id = field(form, "id");
  const caption = field(form, "caption").replace(/\s+/g, " ");
  const error = validateCaption(caption);
  if (error) redirect(adminHref("/admin/galeri", { hata: error }));
  const found = await mutateContent(galleryStore, (gallery) => {
    const photo = gallery.photos.find((item) => item.id === id);
    if (photo) photo.caption = caption;
    return Boolean(photo);
  });
  if (!found) redirect(adminHref("/admin/galeri", { hata: "Fotoğraf bulunamadı." }));
  refreshSite();
  redirect(adminHref("/admin/galeri", { mesaj: "Açıklama kaydedildi." }));
}

export async function moveGalleryPhotoAction(form: FormData): Promise<void> {
  await requireAdmin();
  const id = field(form, "id");
  const moved = await mutateContent(galleryStore, (gallery) =>
    moveItem(gallery.photos, gallery.photos.findIndex((item) => item.id === id), field(form, "direction")),
  );
  if (moved) refreshSite();
  redirect("/admin/galeri");
}

export async function deleteGalleryPhotoAction(form: FormData): Promise<void> {
  await requireAdmin();
  const id = field(form, "id");
  const removed = await mutateContent(galleryStore, (gallery) => {
    const photo = gallery.photos.find((item) => item.id === id);
    gallery.photos = gallery.photos.filter((item) => item !== photo);
    return photo;
  });
  if (!removed) redirect(adminHref("/admin/galeri", { hata: "Fotoğraf bulunamadı; zaten silinmiş olabilir." }));
  await removeGalleryFile(removed.file);
  refreshSite();
  redirect(adminHref("/admin/galeri", { mesaj: "Fotoğraf silindi." }));
}

export async function saveContactAction(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const result = validateContact(form);
  if (!result.ok) return { errors: result.errors, message: "Lütfen işaretli alanları düzeltin." };
  await mutateContent(siteContentStore, (content) => {
    content.contact = result.value;
  });
  refreshSite();
  redirect(adminHref("/admin/iletisim", { mesaj: "İletişim bilgileri kaydedildi." }));
}
