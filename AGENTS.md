# Şimşek Oto – Kurumsal Web Sitesi

Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind CSS v4. Tek sayfalık kurumsal site; içerik tamamen `src/data/` altındaki veri dosyalarından gelir.

## Komutlar

| Amaç | Komut |
| --- | --- |
| Geliştirme sunucusu | `npm run dev` (http://localhost:3000) |
| Tip kontrolü | `npm run typecheck` |
| Lint | `npm run lint` |
| Production build | `npm run build` |
| Production sunucu | `npm run start` |

Bir değişikliği doğrulamak için minimum döngü: `npm run typecheck && npm run lint && npm run build`.

## Ortam değişkenleri

- `NEXT_PUBLIC_SITE_URL` – canonical/OG/sitemap için gerçek alan adı (örn. `https://simsekoto.com.tr`). Tanımlı değilse sırasıyla `VERCEL_PROJECT_PRODUCTION_URL`, Netlify `URL`, en son `http://localhost:3000` kullanılır (`src/data/site.ts`).

## İçerik nerede düzenlenir

- **İletişim bilgileri** (telefon, WhatsApp, e-posta, adres, harita, çalışma saatleri): `src/data/site.ts` → `contact`. Şu an hepsi `null`; arayüz bu durumda "Bilgi yakında eklenecek" gösterir, JSON-LD'ye de eklenmez. Gerçek bilgi verilmeden uydurma değer girilmez.
- **WhatsApp mesajları**: `src/lib/contact.ts` → `buildWhatsAppMessage` (hizmet / marka / araç grubu / randevu bağlamına göre).
- **Hizmetler**: `src/data/services.ts`
- **Araç grupları**: `src/data/vehicleTypes.ts`
- **Markalar**: `src/data/brands.ts` (yalnızca tipografik isim; logo kullanılmaz)
- **Hakkımızda, avantajlar, süreç, CTA metinleri, yetkinlik göstergeleri**: `src/data/company.ts`. Gerçek istatistik geldiğinde `capabilities[].value` / `valueCaption` doldurulabilir; sahte rakam eklenmez.
- **Menü ve section id'leri**: `src/data/navigation.ts`
- **SEO başlık/anahtar kelime**: `src/data/seo.ts`

## Görseller

- Tüm fotoğraflar `src/assets/images/` altında yereldir ve `src/data/images.ts` kaydından kullanılır (kaynak URL + lisans bilgisiyle).
- Yalnızca Unsplash License (Unsplash+ değil) veya Pexels License görseller kullanılır. Yeni görsel eklerken `source` ve `license` alanlarını doldur.
- Gerçek işletme fotoğrafları geldiğinde aynı dosya adıyla değiştirmek veya `images.ts` içindeki import'u güncellemek yeterlidir.

## Kurallar

- Sahte yorum, puan, istatistik, adres, şehir veya telefon eklenmez.
- Sayfada tek `h1` vardır (Hero). Yeni bölümler `h2` ile başlar.
- Animasyonlar `prefers-reduced-motion` kurallarına uyar; reveal animasyonu `RevealObserver` + `data-reveal` ile çalışır. Gözlenen elemana doğrudan `clip-path` verme (IntersectionObserver tetiklenmez); maske için iç `data-mask` sarmalayıcısını kullan.
- Discriminated union üzerinde `switch` kullanırken `default` dalında `never` kontrolü yapılır.
- İçe aktarmalar dosyanın başında olur.

## Dokunma

- `.next/`, `node_modules/`, `next-env.d.ts` (otomatik üretilir)
- `src/assets/fonts/BarlowCondensed-Bold.ttf` – OG görseli (`src/app/opengraph-image.tsx`) için gerekli.

## Deploy

Vercel veya Netlify'da ek ayar gerekmeden çalışır (`npm run build`). Yayına almadan önce `NEXT_PUBLIC_SITE_URL` tanımlanmalı ve `src/data/site.ts` içindeki iletişim bilgileri doldurulmalı. KVKK / Gizlilik sayfaları (`/kvkk`, `/gizlilik`) şimdilik yer tutucudur ve `noindex` durumundadır.
