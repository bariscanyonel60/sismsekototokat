import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { GalleryContent, SiteContent } from "@/lib/content/types";

/**
 * Panelden düzenlenen site içeriği (galeri, iletişim). Katalog gibi `content/` altındaki JSON
 * dosyalarıdır; veritabanı bağlandığında yalnızca `ContentStore` uygulaması değiştirilir.
 */
export interface ContentStore<T> {
  read(): Promise<T>;
  write(value: T): Promise<void>;
}

export const CONTENT_DIR = path.join(process.cwd(), "content");
export const GALLERY_UPLOAD_DIR = path.join(CONTENT_DIR, "uploads", "galeri");

function jsonFileStore<T>(name: string, fallback: () => T): ContentStore<T> {
  const file = path.join(CONTENT_DIR, name);
  return {
    async read() {
      try {
        return JSON.parse(await fs.readFile(file, "utf8")) as T;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback();
        throw error;
      }
    },
    async write(value) {
      const temp = `${file}.${process.pid}.tmp`;
      await fs.writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
      await fs.rename(temp, file);
    },
  };
}

export const galleryStore = jsonFileStore<GalleryContent>("gallery.json", () => ({ photos: [] }));
/** `src/data/site.ts` bu dosyayı derlemede içe aktarır; yazma yalnızca panelden yapılır. */
export const siteContentStore = jsonFileStore<SiteContent>("site.json", () => {
  throw new Error("content/site.json bulunamadı.");
});

const queues = new Map<ContentStore<unknown>, Promise<unknown>>();

/** Aynı dosyaya yazmaları sıraya koyar; aynı anda iki kayıt birbirini ezmez. */
export function mutateContent<T, R>(store: ContentStore<T>, change: (value: T) => R | Promise<R>): Promise<R> {
  const key = store as ContentStore<unknown>;
  const run = (queues.get(key) ?? Promise.resolve()).then(async () => {
    const value = await store.read();
    const result = await change(value);
    await store.write(value);
    return result;
  });
  queues.set(
    key,
    run.catch(() => undefined),
  );
  return run;
}

/** İstek başına bir kez okunur. */
export const getGallery = cache(() => galleryStore.read());
