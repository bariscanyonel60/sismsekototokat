import type { ContactInfo } from "@/data/site";

export interface GalleryPhoto {
  id: string;
  /** `content/uploads/galeri/` altındaki WebP dosyası; `/galeri/foto/<file>` adresinden sunulur. */
  file: string;
  width: number;
  height: number;
  /** Yüklenirken üretilen küçük bulanık önizleme (data URL). */
  blurDataURL: string;
  /** Fotoğrafın altında görünür ve görselin alternatif metnidir. */
  caption: string;
  createdAt: string;
}

export interface GalleryContent {
  photos: GalleryPhoto[];
}

export interface SiteContent {
  contact: ContactInfo;
}
