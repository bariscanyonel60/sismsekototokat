#!/usr/bin/env node
/**
 * SEO denetimi (geliştirme aracı): `npm run seo:audit`
 *
 * 1. Katalog verisi (content/catalog.json): tekrarlanan slug / kod / ad / açıklama / SEO başlığı,
 *    marka-kategori-ürün adres çakışması, eksik kategori, uzun başlık.
 * 2. Build çıktısı (`npm run build` sonrası .next/server/app/**.html): sayfa başına title, meta
 *    description, canonical, robots, tek h1, alt metni olmayan görsel; indekslenen sayfalar arasında
 *    tekrarlanan title / description; sitemap'te noindex veya bulunmayan adres.
 *
 * Hata varsa çıkış kodu 1, yalnızca uyarı varsa 0.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const errors = [];
const warnings = [];

const TR_FOLD = { ı: "i", ş: "s", ğ: "g", ü: "u", ö: "o", ç: "c" };
function slugify(value) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/[ışğüöç]/g, (char) => TR_FOLD[char] ?? char)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " ve ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function duplicates(items, key, label) {
  const seen = new Map();
  for (const item of items) {
    const value = key(item);
    if (!value) continue;
    const normalized = value.toLocaleLowerCase("tr-TR").trim();
    if (seen.has(normalized)) errors.push(`${label} tekrarlanıyor: "${value}" (${seen.get(normalized)} / ${item.slug ?? item.id})`);
    else seen.set(normalized, item.slug ?? item.id);
  }
}

/* --------------------------------- Katalog -------------------------------- */

const catalog = JSON.parse(readFileSync(join(root, "content/catalog.json"), "utf8"));
const brandSource = readFileSync(join(root, "src/data/brands.ts"), "utf8");
const brandSlugs = [...brandSource.matchAll(/plain: "([^"]+)"/g)].map((match) => slugify(match[1]));
const reserved = new Set(["kategori", "marka", "urun-markasi", "sitemap", ...brandSlugs]);
const categoryIds = new Set(catalog.categories.map((category) => category.id));
const SITE_SUFFIX = " | Şimşek Oto".length;

duplicates(catalog.parts, (part) => part.slug, "Ürün adresi");
duplicates(catalog.parts, (part) => part.code, "Ürün kodu");
duplicates(catalog.parts, (part) => part.title, "Ürün adı");
duplicates(catalog.parts, (part) => part.description, "Ürün açıklaması");
duplicates(catalog.parts, (part) => part.seoTitle, "SEO başlığı");
duplicates(catalog.parts, (part) => part.seoDescription, "SEO açıklaması");
duplicates(catalog.categories, (category) => category.title, "Kategori adı");

for (const category of catalog.categories) {
  if (reserved.has(category.id)) errors.push(`Kategori "${category.id}" bir marka / ayrılmış adresle çakışıyor.`);
}
for (const part of catalog.parts) {
  if (reserved.has(part.slug) || categoryIds.has(part.slug))
    errors.push(`Ürün "${part.slug}" bir marka / kategori adresiyle çakışıyor.`);
  if (!categoryIds.has(part.category)) errors.push(`Ürün "${part.slug}" bilinmeyen kategoride: ${part.category}`);
  if (!part.code) errors.push(`Ürün "${part.slug}" kodsuz.`);
  const title = part.seoTitle ?? `${part.title} ${part.code}`;
  if (title.length + SITE_SUFFIX > 70) warnings.push(`Uzun başlık (${title.length + SITE_SUFFIX}): ${part.slug}`);
  if (part.description.length < 50) warnings.push(`Kısa açıklama (${part.description.length}): ${part.slug}`);
}
const withoutDate = catalog.parts.filter((part) => !part.updatedAt).length;
if (withoutDate) warnings.push(`${withoutDate} üründe updatedAt yok; sitemap lastmod yazılmaz (panelden kaydedilince oluşur).`);

/* ------------------------------ Build çıktısı ----------------------------- */

const appDir = join(root, ".next/server/app");
let pageCount = 0;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attr(html, pattern) {
  const match = html.match(pattern);
  return match ? decode(match[1]) : undefined;
}

if (existsSync(appDir)) {
  const pages = new Map();
  for (const file of walk(appDir).filter((path) => path.endsWith(".html"))) {
    const route = `/${relative(appDir, file).replace(/\.html$/, "").replace(/(^|\/)index$/, "")}`;
    if (route.startsWith("/admin") || route === "/_not-found" || route.startsWith("/_")) continue;
    const html = readFileSync(file, "utf8");
    const head = html.slice(0, html.indexOf("</head>") + 7);
    const page = {
      route,
      title: attr(head, /<title>([^<]*)<\/title>/),
      description: attr(head, /<meta name="description" content="([^"]*)"/),
      canonical: attr(head, /<link rel="canonical" href="([^"]*)"/),
      robots: attr(head, /<meta name="robots" content="([^"]*)"/) ?? "",
      h1: (html.match(/<h1[\s>]/g) ?? []).length,
      imgNoAlt: (html.match(/<img(?![^>]*\balt=)[^>]*>/g) ?? []).length,
    };
    page.index = !page.robots.includes("noindex");
    pages.set(route, page);
    pageCount += 1;

    if (!page.title) errors.push(`${route}: title yok`);
    if (!page.description) errors.push(`${route}: meta description yok`);
    else if (page.description.length > 160) warnings.push(`${route}: açıklama ${page.description.length} karakter`);
    if (page.title && page.title.length > 70) warnings.push(`${route}: başlık ${page.title.length} karakter`);
    if (page.index && !page.canonical) errors.push(`${route}: indekslenen sayfada canonical yok`);
    if (page.index && page.canonical && new URL(page.canonical).pathname.replace(/\/$/, "") !== route.replace(/\/$/, ""))
      warnings.push(`${route}: canonical başka adrese işaret ediyor (${page.canonical})`);
    if (page.h1 !== 1) errors.push(`${route}: ${page.h1} adet h1`);
    if (page.imgNoAlt) errors.push(`${route}: ${page.imgNoAlt} görselde alt yok`);
  }

  const indexed = [...pages.values()].filter((page) => page.index);
  duplicates(indexed.map((page) => ({ slug: page.route, title: page.title })), (item) => item.title, "Sayfa başlığı");
  duplicates(
    indexed.map((page) => ({ slug: page.route, description: page.description })),
    (item) => item.description,
    "Meta açıklama",
  );

  const sitemapFiles = walk(appDir).filter((path) => /sitemap(\/\d+)?\.xml\.body$/.test(path));
  let sitemapUrls = 0;
  for (const file of sitemapFiles) {
    for (const [, loc] of readFileSync(file, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
      sitemapUrls += 1;
      const path = new URL(loc).pathname.replace(/\/$/, "") || "/";
      if (new URL(loc).search) errors.push(`Sitemap'te sorgu parametreli adres: ${loc}`);
      const page = pages.get(path);
      if (!page) warnings.push(`Sitemap adresi build çıktısında statik değil: ${path}`);
      else if (!page.index) errors.push(`Sitemap'te noindex sayfa: ${path}`);
    }
  }
  console.log(`Build: ${pageCount} HTML sayfa, ${sitemapFiles.length} sitemap, ${sitemapUrls} sitemap adresi.`);
} else {
  warnings.push("Build çıktısı yok; sayfa denetimi için önce `npm run build` çalıştırın.");
}

console.log(`Katalog: ${catalog.categories.length} kategori, ${catalog.parts.length} ürün.`);
for (const message of warnings) console.log(`UYARI  ${message}`);
for (const message of errors) console.log(`HATA   ${message}`);
console.log(errors.length ? `\n${errors.length} hata, ${warnings.length} uyarı.` : `\nHata yok (${warnings.length} uyarı).`);
process.exit(errors.length ? 1 : 0);
