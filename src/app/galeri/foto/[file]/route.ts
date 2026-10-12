import { promises as fs } from "node:fs";
import path from "node:path";

import { GALLERY_FILE_PATTERN } from "@/lib/content/gallery";
import { GALLERY_UPLOAD_DIR } from "@/lib/content/store";

/** Panelden yüklenen galeri fotoğrafları; `public/` build sonrası eklenen dosyaları sunmadığı için buradan okunur. */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!GALLERY_FILE_PATTERN.test(file)) return new Response("Bulunamadı", { status: 404 });
  try {
    const data = await fs.readFile(path.join(GALLERY_UPLOAD_DIR, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Bulunamadı", { status: 404 });
  }
}
