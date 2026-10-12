"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type DragEvent } from "react";

import { uploadGalleryPhotoAction } from "@/app/admin/contentActions";
import { UploadIcon } from "@/components/admin/adminIcons";
import { inputClass } from "@/components/admin/ui";
import { CloseIcon } from "@/components/icons";
import { GALLERY_ACCEPT, GALLERY_MAX_UPLOAD_BYTES } from "@/lib/content/gallery";

type Status = "bekliyor" | "yükleniyor" | "hata";

interface Entry {
  key: string;
  file: File;
  preview: string;
  caption: string;
  status: Status;
  message?: string;
}

function fileError(file: File): string | undefined {
  if (!(GALLERY_ACCEPT as readonly string[]).includes(file.type)) return "Yalnızca JPG, PNG, WebP veya AVIF.";
  if (file.size > GALLERY_MAX_UPLOAD_BYTES) return "Dosya 15 MB'tan büyük.";
  return undefined;
}

/** Seçilen fotoğraflar açıklamalarıyla birlikte tek tek yüklenir; bitenler listeden düşer. */
export function GalleryUploader({ remaining }: { remaining: number }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const previews = useRef(new Set<string>());

  useEffect(() => {
    const urls = previews.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const add = (files: FileList | null) => {
    if (!files) return;
    setNotice("");
    const next = [...files].slice(0, Math.max(0, remaining - entries.length)).map((file): Entry => {
      const preview = URL.createObjectURL(file);
      previews.current.add(preview);
      const message = fileError(file);
      return { key: preview, file, preview, caption: "", status: message ? "hata" : "bekliyor", message };
    });
    if (files.length > next.length) setNotice(`Galeri sınırı nedeniyle yalnızca ${next.length} fotoğraf eklendi.`);
    setEntries((current) => [...current, ...next]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (key: string) => {
    URL.revokeObjectURL(key);
    previews.current.delete(key);
    setEntries((current) => current.filter((entry) => entry.key !== key));
  };

  const update = (key: string, patch: Partial<Entry>) =>
    setEntries((current) => current.map((entry) => (entry.key === key ? { ...entry, ...patch } : entry)));

  const upload = async () => {
    const queue = entries.filter((entry) => !fileError(entry.file));
    const missing = queue.filter((entry) => entry.caption.trim().length < 3);
    if (missing.length > 0) {
      missing.forEach((entry) => update(entry.key, { status: "hata", message: "Açıklama yazın (en az 3 karakter)." }));
      return;
    }
    setBusy(true);
    let uploaded = 0;
    for (const entry of queue) {
      update(entry.key, { status: "yükleniyor", message: undefined });
      const data = new FormData();
      data.set("photo", entry.file);
      data.set("caption", entry.caption);
      const result = await uploadGalleryPhotoAction(data).catch(() => ({
        ok: false as const,
        message: "Bağlantı hatası; tekrar deneyin.",
      }));
      if (result.ok) {
        uploaded++;
        remove(entry.key);
      } else {
        update(entry.key, { status: "hata", message: result.message });
      }
    }
    setBusy(false);
    if (uploaded > 0) {
      setNotice(`${uploaded} fotoğraf yüklendi.`);
      router.refresh();
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    add(event.dataTransfer.files);
  };

  return (
    <div className="grid gap-4">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-ink/20 bg-bone-100 hover:border-ink/40"
        } ${remaining === 0 ? "pointer-events-none opacity-50" : ""}`}
      >
        <UploadIcon size={28} className="text-steel-700" />
        <span className="font-semibold text-ink">Fotoğrafları sürükleyin veya seçmek için tıklayın</span>
        <span className="text-xs text-steel-500">
          JPG, PNG, WebP · en fazla 15 MB · otomatik küçültülür, konum (EXIF) bilgisi silinir · {remaining} yer kaldı
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={GALLERY_ACCEPT.join(",")}
          multiple
          disabled={remaining === 0}
          onChange={(event) => add(event.target.files)}
          className="sr-only"
        />
      </label>

      {notice && (
        <p role="status" className="text-sm text-steel-700">
          {notice}
        </p>
      )}

      {entries.length > 0 && (
        <>
          <ul className="grid gap-3">
            {entries.map((entry) => (
              <li key={entry.key} className="flex items-start gap-4 rounded-md border border-ink/10 bg-white p-3">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-bone-300">
                  <Image src={entry.preview} alt="" fill unoptimized sizes="80px" className="object-cover" />
                </div>
                <div className="grid min-w-0 flex-1 gap-1.5">
                  <label className="text-xs font-semibold text-steel-700" htmlFor={`caption-${entry.key}`}>
                    Açıklama · <span className="font-normal">{entry.file.name}</span>
                  </label>
                  <input
                    id={`caption-${entry.key}`}
                    value={entry.caption}
                    onChange={(event) => update(entry.key, { caption: event.target.value, ...(entry.status === "hata" && !fileError(entry.file) ? { status: "bekliyor", message: undefined } : {}) })}
                    placeholder="Örn. Otokar otobüste şanzıman bakımı"
                    maxLength={120}
                    disabled={busy}
                    aria-invalid={entry.status === "hata"}
                    className={inputClass}
                  />
                  {entry.status === "yükleniyor" && <p className="text-xs text-steel-700">Yükleniyor…</p>}
                  {entry.status === "hata" && entry.message && (
                    <p className="text-xs text-accent" role="alert">
                      {entry.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(entry.key)}
                  disabled={busy}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm text-steel-700 hover:bg-bone-100 hover:text-accent"
                >
                  <CloseIcon size={18} />
                  <span className="sr-only">Listeden çıkar</span>
                </button>
              </li>
            ))}
          </ul>
          <div>
            <button type="button" onClick={upload} disabled={busy} className="btn btn-primary btn-sm disabled:opacity-60">
              {busy ? "Yükleniyor…" : `${entries.filter((entry) => !fileError(entry.file)).length} Fotoğrafı Yükle`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
