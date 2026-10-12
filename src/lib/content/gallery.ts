export const GALLERY_MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const GALLERY_MAX_PHOTOS = 60;
export const GALLERY_ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const GALLERY_FILE_PATTERN = /^[a-z0-9]+-[a-f0-9]{8}\.webp$/;
/** Ana sayfada gösterilen fotoğraf sayısı; fazlası `/galeri` sayfasındadır. */
export const GALLERY_HOME_LIMIT = 6;

export function galleryPhotoSrc(file: string): string {
  return `/galeri/foto/${file}`;
}
