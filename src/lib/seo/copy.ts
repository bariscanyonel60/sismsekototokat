import { segmentLabels, type Brand, type VehicleSegment } from "@/data/brands";
import { qualityLabels } from "@/data/parts";
import type { PageSeo } from "@/data/seo";
import { services, type Service } from "@/data/services";
import { site } from "@/data/site";
import { partHref } from "@/lib/catalog/helpers";
import type { Part, PartCategory } from "@/lib/catalog/types";
import { fitDescription } from "@/lib/metadata";
import type {
  BrandCategoryLanding,
  BrandLanding,
  CategoryLanding,
  ModelCategoryLanding,
  ModelLanding,
} from "@/lib/seo/catalog";
import { autoPartSeoDescription, autoPartSeoTitle } from "@/lib/seo/partSeo";
import type { FaqEntry } from "@/lib/structuredData";

/**
 * Programatik sayfaların başlık, açıklama, giriş metni ve SSS'leri. Metinler sabit şablon değil;
 * ürün sayıları, kategoriler, ürün kodları ve araç grubu gibi gerçek verilerden kurulur. Bu yüzden
 * 13 markanın sayfaları birbirinin kopyası olmaz. Uydurma model, OEM veya stok bilgisi eklenmez.
 */

const TITLE_KEEP = /(Parçaları|Yağları|Setleri|Seti|Motor|Motoru)$/;

function lower(value: string): string {
  return value.toLocaleLowerCase("tr-TR");
}

/** "a, b ve c" */
export function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} ve ${items.at(-1)}`;
}

/** Kategori adının doğal isim hâli: "Fren Sistemi" → "Fren Sistemi Parçaları", "Motor Yağları" aynen. */
export function categoryNoun(category: PartCategory): string {
  return TITLE_KEEP.test(category.title) ? category.title : `${category.title} Parçaları`;
}

export function categoryService(category: PartCategory): Service | undefined {
  return services.find((service) => service.slug === category.serviceSlug);
}

/** Ağır vasıta ve motor markalarının arama niyeti binekten ayrılır. */
export function brandHeading(brand: Brand): string {
  if (brand.engineMaker) return `${brand.name} Motor Yedek Parça`;
  if (brand.note === "Otobüs") return `${brand.name} Otobüs Yedek Parça`;
  if (brand.segment === "agir-vasita") return `${brand.name} Ağır Vasıta Yedek Parça`;
  return `${brand.name} Yedek Parça`;
}

/** "Renault binek araçları", "Ford Transit ve Connect", "Deutz motorları" */
export function brandAudience(brand: Brand): string {
  if (brand.engineMaker) return `${brand.name} motorları`;
  if (brand.note === "Otobüs") return `${brand.name} otobüsleri`;
  if (brand.segment === "agir-vasita") return `${brand.name} ağır vasıta araçları`;
  if (brand.note) return `${brand.name} ${brand.note.split(" · ").join(" ve ")}`;
  return `${brand.name} ${lower(segmentLabels[brand.segment])} araçları`;
}

/** Siparişte hangi bilginin istendiği; motor, otobüs ve binek için farklıdır. */
function brandCheckAdvice(brand: Brand): string {
  if (brand.engineMaker)
    return "Motor parçalarında araç markası değil motorun kendisi esas alınır; motor etiketindeki model ve seri bilgisini paylaşmanız eşleştirmeyi kolaylaştırır.";
  if (brand.segment === "agir-vasita")
    return "Otobüs ve ağır vasıtalarda aynı modelin farklı motor ve şasi seçenekleri olabileceğinden şasi numarası ile kontrol edilir.";
  return "Aynı modelin farklı motor seçenekleri olabileceğinden model, motor ve yıl bilgisi ya da şasi numarası ile kontrol edilir.";
}

function segmentNames(segments: VehicleSegment[]): string {
  return listJoin([...new Set(segments)].map((segment) => lower(segmentLabels[segment])));
}

function codeExamples(parts: Part[], count = 3): string {
  return parts
    .slice(0, count)
    .map((part) => part.code)
    .join(", ");
}

function categoryCounts(entries: { category: PartCategory; parts: Part[] }[]): string {
  return listJoin(entries.map((entry) => `${lower(categoryNoun(entry.category))} (${entry.parts.length})`));
}

/* ---------------------------------- Marka --------------------------------- */

export function brandSeo(landing: BrandLanding): PageSeo {
  const { brand, exclusive, shared, categories } = landing;
  const exclusivePart = exclusive.length ? `${exclusive.length} özel ürün (${codeExamples(exclusive, 2)}) ve ` : "";
  return {
    title: brandHeading(brand),
    description: fitDescription(
      `${brandAudience(brand)} için ${exclusivePart}${shared.length} uyumlu yedek parça: ${listJoin(categories.map((entry) => lower(categoryNoun(entry.category))))}.`,
    ),
    socialTitle: `${brandHeading(brand)} | ${site.name}`,
    path: landing.href,
    index: landing.indexable,
  };
}

export function brandIntro(landing: BrandLanding): string[] {
  const { brand, parts, exclusive, shared, models } = landing;
  const segment = lower(segmentLabels[brand.segment]);
  const exclusiveTitles = listJoin(exclusive.map((part) => part.title));
  const sentences = [`${brandAudience(brand)} için katalogda ${parts.length} ürün listeleniyor.`];
  if (exclusive.length && shared.length)
    sentences.push(
      `Bunlardan ${exclusive.length} tanesi doğrudan ${brand.name} için hazırlanmış: ${exclusiveTitles}. Kalan ${shared.length} ürün ${segment} araç grubundaki markalara uygun genel parçadır.`,
    );
  else if (exclusive.length) sentences.push(`Tamamı doğrudan ${brand.name} için hazırlanmış: ${exclusiveTitles}.`);
  else sentences.push(`Ürünler ${segment} araç grubuna uygun genel parçalardır; ${brand.name} için özel set henüz eklenmedi.`);
  const first = sentences.join(" ");
  const second = models.length
    ? `Uyumluluk tablosu girilmiş modeller: ${listJoin(models.map((model) => model.name))}. ${brandCheckAdvice(brand)}`
    : brandCheckAdvice(brand);
  return [first, second];
}

export function brandFaqs(landing: BrandLanding): FaqEntry[] {
  const { brand, exclusive, categories } = landing;
  const example = exclusive[0];
  const items: FaqEntry[] = [
    {
      question: `${brand.name} için hangi yedek parça kategorileri var?`,
      answer: `Katalogda ${brandAudience(brand)} için ${categoryCounts(categories)} bulunuyor. Listede olmayan parçalar için ürün kodu veya OEM numarasıyla WhatsApp'tan sorabilirsiniz.`,
    },
  ];
  if (example)
    items.push({
      question: `${brand.name} parçasını ürün koduyla nasıl sorarım?`,
      answer: `Her ürünün bir katalog kodu vardır; örneğin ${example.title} için kod ${example.code}. Kodu veya aracınızın orijinal parça (OEM) numarasını mesajınıza yazmanız yeterlidir.`,
    });
  items.push({
    question: brand.engineMaker
      ? `${brand.name} motoruma uygun parçayı nasıl seçerim?`
      : `${brand.name} aracıma uygun parçayı nasıl seçerim?`,
    answer: `${brandCheckAdvice(brand)} Ürün sayfasındaki "WhatsApp'tan Uyumluluk Sor" butonu ürün kodunu hazır yazar; yalnızca bilgileri eklersiniz.`,
  });
  return items;
}

/* -------------------------------- Kategori -------------------------------- */

export function categorySeo(landing: CategoryLanding): PageSeo {
  const { category, parts, brands } = landing;
  const exclusiveBrands = brands.filter((entry) => entry.exclusive.length > 0).map((entry) => entry.brand.name);
  const subs = category.subcategories.filter((sub) => parts.some((part) => part.subcategory === sub.id));
  return {
    title: category.seoTitle ?? `${categoryNoun(category)} | Oto Yedek Parça`,
    description:
      category.seoDescription ??
      fitDescription(
        `${categoryNoun(category)}: ${parts.length} ürün${subs.length ? ` (${listJoin(subs.map((sub) => lower(sub.title)))})` : ""}, ${segmentNames(parts.flatMap((part) => part.segments))} için. ${exclusiveBrands.length ? `${listJoin(exclusiveBrands)} için özel ürünler.` : ""}`,
      ),
    socialTitle: `${categoryNoun(category)} | ${site.name} Yedek Parça`,
    path: landing.href,
    index: landing.indexable,
  };
}

export function categoryIntro(landing: CategoryLanding): string[] {
  const { category, parts, brands } = landing;
  const exclusiveBrands = brands.filter((entry) => entry.exclusive.length > 0);
  const segments = parts.flatMap((part) => part.segments);
  return [
    `${category.summary} Bu kategoride ${parts.length} ürün var; ${segmentNames(segments)} araç gruplarına yönelik.`,
    exclusiveBrands.length
      ? `${listJoin(exclusiveBrands.map((entry) => entry.brand.name))} için markaya özel ${lower(categoryNoun(category))} ayrı sayfalarda listelenir.`
      : `Bu kategorideki ürünler araç grubuna göre genel parçalardır; markaya özel set bulunmuyor.`,
  ];
}

export function categoryFaqs(landing: CategoryLanding): FaqEntry[] {
  const { category, parts, brands } = landing;
  const noun = lower(categoryNoun(category));
  const service = categoryService(category);
  const bySegment = (Object.keys(segmentLabels) as VehicleSegment[])
    .map((segment) => ({ segment, count: parts.filter((part) => part.segments.includes(segment)).length }))
    .filter((entry) => entry.count > 0);
  const exclusiveBrands = brands.filter((entry) => entry.exclusive.length > 0).map((entry) => entry.brand.name);
  const qualities = [...new Set(parts.flatMap((part) => part.qualities))];

  const items: FaqEntry[] = [
    {
      question: `${categoryNoun(category)} hangi araç gruplarına uygun?`,
      answer: `${listJoin(bySegment.map((entry) => `${lower(segmentLabels[entry.segment])} için ${entry.count} ürün`))} listeleniyor. Her ürün sayfasında uygun araç grubu ve markalar ayrıca yazılıdır.`,
    },
    {
      question: `Markaya özel ${noun} var mı?`,
      answer: exclusiveBrands.length
        ? `Evet; ${listJoin(exclusiveBrands)} için markaya özel ürünler var. Diğer ürünler araç grubuna göre genel parçalardır.`
        : `Bu kategorideki ürünler araç grubuna göre genel parçalardır. Aracınıza özel parça için ürün kodu veya OEM numarasıyla sorabilirsiniz.`,
    },
  ];
  if (qualities.length)
    items.push({
      question: `${categoryNoun(category)} orijinal mi, muadil mi?`,
      answer: `Bu kategoride ${listJoin(qualities.map((quality) => lower(qualityLabels[quality])))} seçenekleri bulunan ürünler var; seçenek ürün sayfasında belirtilir.`,
    });
  if (service)
    items.push({
      question: `${categoryNoun(category)} montajı yapılıyor mu?`,
      answer: `Evet; ${lower(service.title)} hizmetimiz kapsamında parçayı atölyemizde takabiliriz. ${service.summary}`,
    });
  return items;
}

/* ---------------------------- Marka + kategori ---------------------------- */

export function brandCategoryHeading(landing: BrandCategoryLanding): string {
  return `${landing.brand.name} ${categoryNoun(landing.category)}`;
}

export function brandCategorySeo(landing: BrandCategoryLanding): PageSeo {
  const { brand, category, exclusive, shared } = landing;
  const listed = [
    ...exclusive.map((part) => `${part.title} (${part.code})`),
    ...(shared.length ? [`${shared.length} uyumlu genel ürün`] : []),
  ];
  return {
    title: brandCategoryHeading(landing),
    description: fitDescription(`${brandAudience(brand)} için ${lower(categoryNoun(category))}: ${listJoin(listed)}.`),
    socialTitle: `${brandCategoryHeading(landing)} | ${site.name}`,
    path: landing.href,
    index: landing.indexable,
  };
}

export function brandCategoryIntro(landing: BrandCategoryLanding): string[] {
  const { brand, category, exclusive, shared } = landing;
  return [
    `${brandAudience(brand)} için ${lower(categoryNoun(category))}: ${exclusive.length ? `${exclusive.length} ürün doğrudan ${brand.name} için hazırlanmış` : `markaya özel ürün henüz yok`}${shared.length ? `, ${shared.length} ürün ${lower(segmentLabels[brand.segment])} araç grubuna uygun genel parça` : ""}.`,
    `${category.summary} ${brandCheckAdvice(brand)}`,
  ];
}

/* ---------------------------------- Model --------------------------------- */

export function modelHeading(model: ModelLanding): string {
  return `${model.brand.name} ${model.name} Yedek Parça`;
}

export function modelSeo(model: ModelLanding): PageSeo {
  return {
    title: modelHeading(model),
    description: fitDescription(
      `${model.brand.name} ${model.name} ile uyumluluğu doğrulanmış ${model.parts.length} yedek parça: ${model.parts
        .slice(0, 3)
        .map((part) => `${part.title} (${part.code})`)
        .join(", ")}.`,
    ),
    path: model.href,
    index: model.indexable,
  };
}

export function modelIntro(model: ModelLanding): string[] {
  const rows = model.parts.flatMap((part) =>
    (part.compatibility ?? []).filter((row) => row.brand === model.brand.plain && row.model === model.name),
  );
  const engines = [...new Set(rows.map((row) => row.engine).filter((value): value is string => Boolean(value)))];
  const years = [...new Set(rows.map((row) => row.years).filter((value): value is string => Boolean(value)))];
  return [
    `${model.brand.name} ${model.name} için uyumluluk tablosunda kayıtlı ${model.parts.length} ürün listeleniyor.${engines.length ? ` Motor: ${listJoin(engines)}.` : ""}${years.length ? ` Yıl: ${listJoin(years)}.` : ""}`,
    brandCheckAdvice(model.brand),
  ];
}

export function modelCategoryHeading(landing: ModelCategoryLanding): string {
  return `${landing.model.brand.name} ${landing.model.name} ${categoryNoun(landing.category)}`;
}

export function modelCategorySeo(landing: ModelCategoryLanding): PageSeo {
  return {
    title: modelCategoryHeading(landing),
    description: fitDescription(
      `${landing.model.brand.name} ${landing.model.name} ile uyumlu ${lower(categoryNoun(landing.category))}: ${landing.parts
        .map((part) => `${part.title} (${part.code})`)
        .join(", ")}.`,
    ),
    path: landing.href,
    index: landing.indexable,
  };
}

/* ---------------------------------- Ürün ---------------------------------- */

export function partSeo(part: Part): PageSeo {
  return {
    title: part.seoTitle ?? autoPartSeoTitle(part),
    description: part.seoDescription ?? autoPartSeoDescription(part),
    socialTitle: `${part.title} | ${site.name} Yedek Parça`,
    socialDescription: part.description,
    path: partHref(part.slug),
    index: true,
  };
}
