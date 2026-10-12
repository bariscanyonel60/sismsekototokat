import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { Catalog } from "@/lib/catalog/types";

/**
 * Katalog deposu. Şimdilik `content/catalog.json` dosyasıdır; veritabanı bağlandığında
 * yalnızca bu arayüzün yeni bir uygulaması yazılıp `catalogStore` değiştirilir.
 */
export interface CatalogStore {
  read(): Promise<Catalog>;
  write(catalog: Catalog): Promise<void>;
}

const CATALOG_FILE = path.join(process.cwd(), "content", "catalog.json");

const fileStore: CatalogStore = {
  async read() {
    return JSON.parse(await fs.readFile(CATALOG_FILE, "utf8")) as Catalog;
  },
  async write(catalog) {
    const temp = `${CATALOG_FILE}.${process.pid}.tmp`;
    await fs.writeFile(temp, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
    await fs.rename(temp, CATALOG_FILE);
  },
};

export const catalogStore: CatalogStore = fileStore;

/** İstek başına bir kez okunur. */
export const getCatalog = cache(() => catalogStore.read());
