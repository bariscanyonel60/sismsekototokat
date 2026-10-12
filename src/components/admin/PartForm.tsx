"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState, useState, type FormEvent } from "react";

import { savePartAction, type FormState } from "@/app/admin/actions";
import { Card, Field, inputClass, Notice, textareaClass } from "@/components/admin/ui";
import { brands, segmentLabels, type VehicleSegment } from "@/data/brands";
import { images, imageKeys, type ImageKey } from "@/data/images";
import { qualityLabels } from "@/data/parts";
import { slugify } from "@/lib/catalog/helpers";
import { partQualities, type Part, type PartCategory } from "@/lib/catalog/types";

const INITIAL: FormState = {};
const segments = Object.keys(segmentLabels) as VehicleSegment[];

const checkboxClass = "size-4 accent-[var(--color-accent)]";

export function PartForm({
  categories,
  suggestedCodes,
  manufacturers,
  part,
  template,
}: {
  categories: PartCategory[];
  /** Katalogdaki ürün markaları; yazım birliği için öneri listesi. */
  manufacturers: string[];
  /** Kategori kimliği → sıradaki önerilen ürün kodu (yeni ürün için). */
  suggestedCodes: Record<string, string>;
  part?: Part;
  /** "Kopyala": yeni ürün formu bu ürünün bilgileriyle açılır. */
  template?: Part;
}) {
  const source = part ?? template;
  const [state, dispatch, pending] = useActionState(savePartAction, INITIAL);
  const [title, setTitle] = useState(part?.title ?? (template ? `${template.title} (Kopya)` : ""));
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(source?.category ?? categories[0]?.id ?? "");
  const [subcategory, setSubcategory] = useState(source?.subcategory ?? "");
  const [code, setCode] = useState(part?.code ?? suggestedCodes[categoryId] ?? "");
  const [codeEdited, setCodeEdited] = useState(Boolean(part));
  const [imageKey, setImageKey] = useState<ImageKey | "">(source?.imageKey ?? "");

  const category = categories.find((item) => item.id === categoryId);
  const errors = state.errors ?? {};
  const previewKey = imageKey || category?.imageKey;
  const preview = previewKey ? images[previewKey] : undefined;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      {part && <input type="hidden" name="originalSlug" value={part.slug} />}
      {state.message && <Notice tone="error">{state.message}</Notice>}

      <Card className="grid gap-5">
        <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Ürün bilgisi</h2>
        <Field label="Ürün adı" htmlFor="title" error={errors.title}>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-invalid={Boolean(errors.title)}
            required
            maxLength={120}
            className={inputClass}
          />
        </Field>

        {part ? (
          <p className="text-sm text-steel-700">
            Sayfa adresi: <code className="text-ink">/yedek-parca/{part.slug}</code>
            <span className="block text-xs text-steel-500">Adres, paylaşılmış bağlantılar bozulmasın diye değiştirilemez.</span>
          </p>
        ) : (
          <Field
            label="Sayfa adresi (isteğe bağlı)"
            htmlFor="slug"
            error={errors.slug}
            hint={`Boş bırakılırsa: /yedek-parca/${slugify(title) || "urun-adi"}`}
          >
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => setSlug(slugify(event.target.value))}
              aria-invalid={Boolean(errors.slug)}
              placeholder={slugify(title)}
              className={inputClass}
            />
          </Field>
        )}

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Kategori" htmlFor="category" error={errors.category}>
            <select
              id="category"
              name="category"
              value={categoryId}
              onChange={(event) => {
                const next = event.target.value;
                setCategoryId(next);
                setSubcategory("");
                if (!codeEdited) setCode(suggestedCodes[next] ?? "");
              }}
              aria-invalid={Boolean(errors.category)}
              className={inputClass}
            >
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Alt kategori"
            htmlFor="subcategory"
            error={errors.subcategory}
            hint={category?.subcategories.length ? undefined : "Bu kategoride alt kategori yok."}
          >
            <select
              id="subcategory"
              name="subcategory"
              value={subcategory}
              onChange={(event) => setSubcategory(event.target.value)}
              aria-invalid={Boolean(errors.subcategory)}
              className={inputClass}
            >
              <option value="">Seçilmedi</option>
              {category?.subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ürün kodu" htmlFor="code" error={errors.code} hint="WhatsApp siparişinde ürünü tanımlar.">
            <input
              id="code"
              name="code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.toUpperCase());
                setCodeEdited(true);
              }}
              aria-invalid={Boolean(errors.code)}
              required
              maxLength={30}
              className={`${inputClass} font-mono`}
            />
          </Field>
        </div>

        <Field
          label="Kısa açıklama"
          htmlFor="description"
          error={errors.description}
          hint="10–600 karakter. Ürün adının altında, kartlarda ve Google açıklamasında kullanılır."
        >
          <textarea
            id="description"
            name="description"
            defaultValue={source?.description}
            aria-invalid={Boolean(errors.description)}
            required
            maxLength={600}
            className={textareaClass}
          />
        </Field>

        <Field
          label="OEM / orijinal parça numaraları (isteğe bağlı)"
          htmlFor="oemCodes"
          error={errors.oemCodes}
          hint="Her satıra bir numara (örn. 7701208265). Ürün sayfasında yazılır; müşteri bu numarayla Google'da aradığında ürün bulunur. Yalnızca doğrulanmış numaraları girin."
        >
          <textarea
            id="oemCodes"
            name="oemCodes"
            defaultValue={source?.oemCodes?.join("\n")}
            aria-invalid={Boolean(errors.oemCodes)}
            className={`${textareaClass} font-mono`}
          />
        </Field>
      </Card>

      <Card className="grid gap-5">
        <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Marka, özellikler ve açıklama</h2>
        <Field
          label="Ürün markası (isteğe bağlı)"
          htmlFor="manufacturer"
          error={errors.manufacturer}
          hint="Parçanın üretici markası (örn. Bosch, Valeo). Ürün sayfasında, menüde ve marka sayfasında görünür. Araç markası değil."
        >
          <input
            id="manufacturer"
            name="manufacturer"
            defaultValue={source?.manufacturer}
            list="manufacturer-options"
            aria-invalid={Boolean(errors.manufacturer)}
            maxLength={60}
            autoComplete="off"
            className={inputClass}
          />
          <datalist id="manufacturer-options">
            {manufacturers.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </Field>

        <Field
          label="Ürün özellikleri (isteğe bağlı)"
          htmlFor="specs"
          error={errors.specs}
          hint="Her satıra bir özellik, “Özellik: Değer” biçiminde (örn. Viskozite: 15W-40). Ürün sayfasındaki özellik tablosunda görünür."
        >
          <textarea
            id="specs"
            name="specs"
            defaultValue={source?.specs?.map((spec) => `${spec.label}: ${spec.value}`).join("\n")}
            aria-invalid={Boolean(errors.specs)}
            rows={6}
            className={textareaClass}
          />
        </Field>

        <Field
          label="Detaylı ürün açıklaması (isteğe bağlı)"
          htmlFor="details"
          error={errors.details}
          hint="Ürün sayfasındaki “Ürün Açıklaması” bölümü. Paragrafları boş satırla ayırın; en fazla 4000 karakter."
        >
          <textarea
            id="details"
            name="details"
            defaultValue={source?.details}
            aria-invalid={Boolean(errors.details)}
            rows={8}
            maxLength={4000}
            className={textareaClass}
          />
        </Field>
      </Card>

      <Card className="grid gap-5">
        <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Uyumluluk</h2>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Araç grubu</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {segments.map((segment) => (
              <label key={segment} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="segments"
                  value={segment}
                  defaultChecked={source ? source.segments.includes(segment) : true}
                  className={checkboxClass}
                />
                {segmentLabels[segment]}
              </label>
            ))}
          </div>
          {errors.segments && (
            <p className="mt-1.5 text-sm text-accent" role="alert">
              {errors.segments}
            </p>
          )}
        </fieldset>

        <fieldset>
          <legend className="mb-1 text-sm font-semibold">Markaya özel ürün</legend>
          <p className="mb-2 text-xs text-steel-500">
            Hiçbiri seçilmezse ürün, seçilen araç gruplarındaki tüm markalara uygun sayılır.
          </p>
          <div className="grid gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand) => (
              <label key={brand.plain} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="brands"
                  value={brand.plain}
                  defaultChecked={source?.brands?.includes(brand.plain)}
                  className={checkboxClass}
                />
                {brand.name}
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          label="Model / motor uyumu"
          htmlFor="fitment"
          error={errors.fitment}
          hint="Her satıra bir model veya motor (örn. Ford Transit). Yalnızca kesin bilinen uyumları yazın."
        >
          <textarea
            id="fitment"
            name="fitment"
            defaultValue={source?.fitment?.join("\n")}
            aria-invalid={Boolean(errors.fitment)}
            className={textareaClass}
          />
        </Field>

        <Field
          label="Uyumluluk tablosu (isteğe bağlı)"
          htmlFor="compatibility"
          error={errors.compatibility}
          hint="Her satır: Marka | Model | Motor | Yıl (örn. Ford | Transit | 2.2 TDCi | 2014–2019). Marka zorunlu, diğerleri boş bırakılabilir. Ürün sayfasında tablo olarak, katalogdaki araç seçicide öneri olarak gösterilir. Yalnızca doğrulanmış uyumları girin."
        >
          <textarea
            id="compatibility"
            name="compatibility"
            defaultValue={source?.compatibility
              ?.map((row) => [row.brand, row.model ?? "", row.engine ?? "", row.years ?? ""].join(" | ").replace(/( \| )+$/, ""))
              .join("\n")}
            aria-invalid={Boolean(errors.compatibility)}
            rows={4}
            className={`${textareaClass} font-mono text-sm`}
          />
        </Field>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Parça türü</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {partQualities.map((quality) => (
              <label key={quality} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="qualities"
                  value={quality}
                  defaultChecked={source?.qualities.includes(quality)}
                  className={checkboxClass}
                />
                {qualityLabels[quality]}
              </label>
            ))}
          </div>
        </fieldset>
      </Card>

      <Card className="grid gap-5">
        <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em]">Arama ve görsel</h2>
        <Field label="Arama kelimeleri" htmlFor="keywords" hint="Virgülle ayırın (örn. balata, fren, disk).">
          <input id="keywords" name="keywords" defaultValue={source?.keywords.join(", ")} className={inputClass} />
        </Field>

        <div className="grid gap-5 md:grid-cols-[1fr_14rem] md:items-start">
          <Field label="Görsel" htmlFor="imageKey" error={errors.imageKey} hint="Boş bırakılırsa kategori görseli kullanılır.">
            <select
              id="imageKey"
              name="imageKey"
              value={imageKey}
              onChange={(event) => setImageKey(event.target.value as ImageKey | "")}
              className={inputClass}
            >
              <option value="">Kategori görseli</option>
              {imageKeys.map((key) => (
                <option key={key} value={key}>
                  {images[key].alt}
                </option>
              ))}
            </select>
          </Field>
          {preview && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-bone-300">
              <Image src={preview.src} alt={preview.alt} fill sizes="224px" className="object-cover" />
            </div>
          )}
        </div>

        <fieldset>
          <legend className="mb-1 text-sm font-semibold">Ek görseller (isteğe bağlı)</legend>
          <p className="mb-2 text-xs text-steel-500">
            Ürün sayfasında ana görselin yanında küçük resim olarak gösterilir; en fazla 8.
          </p>
          <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {imageKeys.map((key) => (
              <label key={key} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="gallery"
                  value={key}
                  defaultChecked={source?.gallery?.includes(key)}
                  className={checkboxClass}
                />
                {images[key].alt}
              </label>
            ))}
          </div>
          {errors.gallery && (
            <p className="mt-1.5 text-sm text-accent" role="alert">
              {errors.gallery}
            </p>
          )}
        </fieldset>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Kaydediliyor…" : part ? "Değişiklikleri Kaydet" : "Ürünü Ekle"}
        </button>
        <Link href="/admin/urunler" className="btn btn-ghost">
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
