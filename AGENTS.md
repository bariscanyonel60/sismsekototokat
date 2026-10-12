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
- **Markalar**: `src/data/brands.ts` (yalnızca tipografik isim; logo kullanılmaz). `segment` alanı yedek parça filtresinde markayı araç grubuna bağlar.
- **Yedek parça** (`/yedek-parca` sayfası ve ana sayfa özeti): `src/data/parts.ts` → kategoriler ve parça grupları. `qualities` (orijinal / muadil) yalnızca firmanın belirttiği parçalara girilir; stok adedi veya fiyat eklenmez. Kart görseli kategoriden (`partCategories[].image`) gelir; ürüne özel görsel için `parts[].image` verilir.
- **Hakkımızda, avantajlar, süreç, CTA metinleri, yetkinlik göstergeleri**: `src/data/company.ts`. Gerçek istatistik geldiğinde `capabilities[].value` / `valueCaption` doldurulabilir; sahte rakam eklenmez.
- **Menü, section id'leri, üst duyuru şeridi (`topBar`), hızlı bağlantılar (404 / teşekkür / yasal sayfalar)**: `src/data/navigation.ts`
- **SSS** (ana sayfa + FAQPage şeması): `src/data/faq.ts`
- **Müşteri yorumları**: `src/data/reviews.ts`. Liste boşken bölüm ve AggregateRating/Review şeması hiç render edilmez; yalnızca gerçek, izinli yorumlar eklenir.
- **SEO**: `src/data/seo.ts` → `pageSeo`. Her sayfanın benzersiz başlık, meta açıklama ve sosyal medya metni buradadır; metadata `src/lib/metadata.ts` → `buildPageMetadata` ile üretilir. Kendi `opengraph-image` dosyası olan segmentlerde `{ ownOgImage: true }` verilir (aksi halde metadata görseli dosyayı ezer).
- **Gizlilik politikası**: `src/app/gizlilik/page.tsx` (indekslenir). KVKK metni `src/app/kvkk/page.tsx` hâlâ yer tutucu ve `noindex`.

## Sayfalar ve ortak bileşenler

- `/yedek-parca/[slug]`: her ürünün detay sayfası ve paylaşım görseli `src/data/parts.ts` içindeki `parts` listesinden statik üretilir (slug = `parts[].slug`). "Parça + Usta" bağlantısı kategorinin `serviceSlug` alanından gelir; yeni ürün eklemek için yalnızca listeye kayıt eklemek yeterlidir.
- `/tesekkurler`: randevu formu WhatsApp'ı açtıktan sonra yönlendirilen sayfa (`noindex`, robots.txt'de disallow).
- `not-found.tsx`: özel 404 sayfası.
- `SiteShell`: ana sayfa dışındaki sayfaların header/footer/sticky iletişim iskeleti. İletişim bölümü olmayan sayfalarda `contactAnchor={homeContactHref}` kullanılır.
- `Breadcrumb`: görsel sayfa yolu + BreadcrumbList şeması.
- `StickyContact`: masaüstünde yüzen telefon/WhatsApp, mobilde alt sabit Ara / WhatsApp / Randevu çubuğu.

## Görseller

- Logo: `src/assets/brand/simsek-oto-logo.png` (arka planı şeffaf PNG), `src/components/Logo.tsx` ile header, mobil menü ve footer'da kullanılır. Medya ajansı imzası (BCY DİJİTAL → bariscanyonel.com) `src/data/site.ts` → `mediaCredit`.
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
