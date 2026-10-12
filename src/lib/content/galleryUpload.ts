import "server-only";

import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp, { type OutputInfo } from "sharp";

import { GALLERY_ACCEPT, GALLERY_FILE_PATTERN, GALLERY_MAX_UPLOAD_BYTES } from "@/lib/content/gallery";
import { GALLERY_UPLOAD_DIR } from "@/lib/content/store";

const MAX_EDGE = 2400;

export type ProcessedPhoto = { file: string; width: number; height: number; blurDataURL: string };

/**
 * Yüklenen fotoğrafı yönüne göre döndürür, en uzun kenarı 2400 px'e küçültür ve WebP olarak kaydeder.
 * sharp varsayılan olarak EXIF / GPS verisini çıktıya yazmaz.
 */
export async function saveGalleryUpload(upload: File): Promise<ProcessedPhoto | string> {
  if (!(GALLERY_ACCEPT as readonly string[]).includes(upload.type)) return "Yalnızca JPG, PNG, WebP veya AVIF yüklenebilir.";
  if (upload.size === 0) return "Dosya boş.";
  if (upload.size > GALLERY_MAX_UPLOAD_BYTES) return "Dosya en fazla 15 MB olabilir.";

  let output: { data: Buffer; info: OutputInfo };
  try {
    output = await sharp(Buffer.from(await upload.arrayBuffer()), { limitInputPixels: 80_000_000 })
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    return "Görsel okunamadı; dosya bozuk veya desteklenmeyen biçimde olabilir.";
  }

  const blur = await sharp(output.data).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  const file = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.webp`;
  await fs.mkdir(GALLERY_UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(GALLERY_UPLOAD_DIR, file), output.data);

  return {
    file,
    width: output.info.width,
    height: output.info.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

export async function removeGalleryFile(file: string): Promise<void> {
  if (!GALLERY_FILE_PATTERN.test(file)) return;
  await fs.rm(path.join(GALLERY_UPLOAD_DIR, file), { force: true });
}
