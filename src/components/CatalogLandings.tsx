import { PartListing, type LinkSection, type PartGroup } from "@/components/PartListing";
import { brands, segmentLabels, type Brand } from "@/data/brands";
import { findCategory, partBrandHref, partCategoryHref, subcategoryTitle } from "@/lib/catalog/helpers";
import type { Catalog, Part } from "@/lib/catalog/types";
import {
  brandCategoryLanding,
  type BrandCategoryLanding,
  type BrandLanding,
  type CategoryLanding,
  type ModelCategoryLanding,
  type ModelLanding,
} from "@/lib/seo/catalog";
import {
  brandCategoryHeading,
  brandCategoryIntro,
  brandFaqs,
  brandHeading,
  brandIntro,
  categoryFaqs,
  categoryIntro,
  categoryNoun,
  categoryService,
  modelCategoryHeading,
  modelHeading,
  modelIntro,
} from "@/lib/seo/copy";

function productCount(count: number): string {
  return `${count} ürün`;
}

function brandEyebrow(brand: Brand): string {
  return [segmentLabels[brand.segment], brand.note].filter(Boolean).join(" · ");
}

/** Aynı araç grubundaki markalar önce; marka sayfaları arasında konu kümesi oluşturur. */
function otherBrandSections(brand: Brand): LinkSection[] {
  const others = brands.filter((item) => item.plain !== brand.plain);
  const toLink = (item: Brand) => ({ href: partBrandHref(item), label: brandHeading(item) });
  return [
    {
      id: "ayni-gruptaki-markalar",
      title: `Diğer ${segmentLabels[brand.segment]} Markaları`,
      links: others.filter((item) => item.segment === brand.segment).map(toLink),
    },
    {
      id: "diger-markalar",
      title: "Diğer Markalar",
      links: others.filter((item) => item.segment !== brand.segment).map(toLink),
    },
  ];
}

function categorySection(catalog: Catalog, excludeId?: string): LinkSection {
  return {
    id: "kategoriler",
    title: "Kategoriye Göre Yedek Parça",
    links: catalog.categories
      .filter((category) => category.id !== excludeId)
      .map((category) => ({
        href: partCategoryHref(category.id),
        label: categoryNoun(category),
        meta: productCount(catalog.parts.filter((part) => part.category === category.id).length),
      })),
  };
}

export function BrandLandingPage({ catalog, landing }: { catalog: Catalog; landing: BrandLanding }) {
  const { brand, exclusive, shared, categories, models } = landing;
  const categoryLabel = (part: Part) => findCategory(catalog, part.category)?.title;
  const groups: PartGroup[] = [
    { id: "markaya-ozel", title: `${brand.name} İçin Özel Ürünler`, parts: exclusive, label: categoryLabel },
    ...catalog.categories.map((category) => ({
      id: category.id,
      title: categoryNoun(category),
      parts: shared.filter((part) => part.category === category.id),
      label: (part: Part) => subcategoryTitle(catalog, part),
    })),
  ];

  return (
    <PartListing
      catalog={catalog}
      path={landing.href}
      heading={brandHeading(brand)}
      eyebrow={brandEyebrow(brand)}
      intro={brandIntro(landing)}
      groups={groups}
      shortcuts={[
        {
          id: "marka-kategorileri",
          title: `${brand.name} Parça Kategorileri`,
          links: categories
            .filter((entry) => entry.indexable)
            .map((entry) => ({
              href: entry.href,
              label: brandCategoryHeading(entry),
              meta: `${entry.exclusive.length} özel${entry.shared.length ? ` + ${entry.shared.length} uyumlu` : ""} ürün`,
            })),
        },
        {
          id: "modeller",
          title: `${brand.name} Modelleri`,
          links: models
            .filter((model) => model.indexable)
            .map((model) => ({ href: model.href, label: modelHeading(model), meta: productCount(model.parts.length) })),
        },
      ]}
      faqs={brandFaqs(landing)}
      related={[...otherBrandSections(brand), categorySection(catalog)]}
      contactContext={{ kind: "part", part: "yedek parça", brand: brand.plain }}
    />
  );
}

export function CategoryLandingPage({ catalog, landing }: { catalog: Catalog; landing: CategoryLanding }) {
  const { category, parts, brands: brandEntries } = landing;
  const used = category.subcategories.filter((sub) => parts.some((part) => part.subcategory === sub.id));
  const groups: PartGroup[] = [
    ...used.map((sub) => ({ id: sub.id, title: sub.title, parts: parts.filter((part) => part.subcategory === sub.id) })),
    {
      id: `${category.id}-diger`,
      title: used.length ? `Diğer ${categoryNoun(category)}` : categoryNoun(category),
      parts: parts.filter((part) => !part.subcategory || !used.some((sub) => sub.id === part.subcategory)),
    },
  ];

  return (
    <PartListing
      catalog={catalog}
      path={landing.href}
      heading={categoryNoun(category)}
      eyebrow="Oto Yedek Parça · Kategori"
      intro={categoryIntro(landing)}
      groups={groups}
      shortcuts={[
        {
          id: "markaya-gore",
          title: `Markaya Göre ${categoryNoun(category)}`,
          links: brandEntries
            .filter((entry) => entry.indexable)
            .map((entry) => ({
              href: entry.href,
              label: brandCategoryHeading(entry),
              meta: `${entry.exclusive.length} özel ürün`,
            })),
        },
      ]}
      faqs={categoryFaqs(landing)}
      service={categoryService(category)}
      related={[categorySection(catalog, category.id)]}
      contactContext={{ kind: "part", part: categoryNoun(category) }}
    />
  );
}

export function BrandCategoryLandingPage({ catalog, landing }: { catalog: Catalog; landing: BrandCategoryLanding }) {
  const { brand, category, exclusive, shared } = landing;
  const label = (part: Part) => subcategoryTitle(catalog, part);
  const brandPage = { label: brandHeading(brand), href: partBrandHref(brand) };
  const siblings = catalog.categories
    .filter((item) => item.id !== category.id)
    .map((item) => brandCategoryLanding(catalog, brand, item))
    .filter((entry): entry is BrandCategoryLanding => Boolean(entry?.indexable));
  const otherBrands = brands
    .filter((item) => item.plain !== brand.plain)
    .map((item) => brandCategoryLanding(catalog, item, category))
    .filter((entry): entry is BrandCategoryLanding => Boolean(entry?.indexable));

  return (
    <PartListing
      catalog={catalog}
      path={landing.href}
      heading={brandCategoryHeading(landing)}
      eyebrow={`${brandEyebrow(brand)} · ${category.title}`}
      intro={brandCategoryIntro(landing)}
      trail={[brandPage]}
      groups={[
        { id: "markaya-ozel", title: `${brand.name} İçin Özel`, parts: exclusive, label },
        { id: "uyumlu-genel", title: `${segmentLabels[brand.segment]} Araç Grubuna Uygun`, parts: shared, label },
      ]}
      service={categoryService(category)}
      related={[
        {
          id: "marka-diger-kategoriler",
          title: `Diğer ${brand.name} Parçaları`,
          links: [brandPage, ...siblings.map((entry) => ({ href: entry.href, label: brandCategoryHeading(entry) }))],
        },
        {
          id: "kategori-diger-markalar",
          title: `Diğer Markalar İçin ${categoryNoun(category)}`,
          links: [
            { href: partCategoryHref(category.id), label: `Tüm ${categoryNoun(category)}` },
            ...otherBrands.map((entry) => ({ href: entry.href, label: brandCategoryHeading(entry) })),
          ],
        },
      ]}
      contactContext={{ kind: "part", part: categoryNoun(category), brand: brand.plain }}
    />
  );
}

export function ModelLandingPage({
  catalog,
  model,
  categories,
}: {
  catalog: Catalog;
  model: ModelLanding;
  categories: ModelCategoryLanding[];
}) {
  const label = (part: Part) => findCategory(catalog, part.category)?.title;
  return (
    <PartListing
      catalog={catalog}
      path={model.href}
      heading={modelHeading(model)}
      eyebrow={brandEyebrow(model.brand)}
      intro={modelIntro(model)}
      trail={[{ label: brandHeading(model.brand), href: partBrandHref(model.brand) }]}
      groups={[{ id: "uyumlu-urunler", title: `${model.brand.name} ${model.name} İle Uyumlu`, parts: model.parts, label }]}
      shortcuts={[
        {
          id: "model-kategorileri",
          title: `${model.brand.name} ${model.name} Parça Kategorileri`,
          links: categories.map((entry) => ({
            href: entry.href,
            label: modelCategoryHeading(entry),
            meta: productCount(entry.parts.length),
          })),
        },
      ]}
      related={otherBrandSections(model.brand).slice(0, 1)}
      contactContext={{ kind: "part", part: `${model.name} yedek parça`, brand: model.brand.plain }}
    />
  );
}

export function ModelCategoryLandingPage({ catalog, landing }: { catalog: Catalog; landing: ModelCategoryLanding }) {
  const { model, category } = landing;
  return (
    <PartListing
      catalog={catalog}
      path={landing.href}
      heading={modelCategoryHeading(landing)}
      eyebrow={`${brandEyebrow(model.brand)} · ${category.title}`}
      intro={[`${category.summary}`, ...modelIntro(model).slice(1)]}
      trail={[
        { label: brandHeading(model.brand), href: partBrandHref(model.brand) },
        { label: modelHeading(model), href: model.href },
      ]}
      groups={[
        {
          id: "uyumlu-urunler",
          title: `${model.name} İle Uyumlu`,
          parts: landing.parts,
          label: (part) => subcategoryTitle(catalog, part),
        },
      ]}
      service={categoryService(category)}
      related={[
        {
          id: "ust-sayfalar",
          title: "İlgili Sayfalar",
          links: [
            { href: model.href, label: modelHeading(model) },
            { href: partCategoryHref(category.id), label: categoryNoun(category) },
          ],
        },
      ]}
      contactContext={{ kind: "part", part: categoryNoun(category), brand: model.brand.plain }}
    />
  );
}
