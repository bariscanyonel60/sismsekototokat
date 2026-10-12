"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState, useState, type FormEvent } from "react";

import { saveCategoryAction, type FormState } from "@/app/admin/actions";
import { Card, Field, inputClass, Notice } from "@/components/admin/ui";
import { categoryIconLabels, categoryIcons } from "@/components/partCategoryIcons";
import { images, imageKeys, type ImageKey } from "@/data/images";
import { slugify } from "@/lib/catalog/helpers";
import { categoryIconKeys, type CategoryIconKey, type PartCategory } from "@/lib/catalog/types";

const INITIAL: FormState = {};

export function CategoryForm({
  category,
  services,
}: {
  category?: PartCategory;
  services: { slug: string; title: string }[];
}) {
  const [state, dispatch, pending] = useActionState(saveCategoryAction, INITIAL);
  const [title, setTitle] = useState(category?.title ?? "");
  const [icon, setIcon] = useState<CategoryIconKey>(category?.icon ?? "engine");
  const [imageKey, setImageKey] = useState<ImageKey>(category?.imageKey ?? imageKeys[0]);
  const errors = state.errors ?? {};
  const preview = images[imageKey];

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      {category && <input type="hidden" name="originalId" value={category.id} />}
      {state.message && <Notice tone="error">{state.message}</Notice>}

      <Card className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-[1fr_10rem]">
          <Field
            label="Kategori adı"
            htmlFor="title"
            error={errors.title}
            hint={category ? `Kimlik: ${category.id}` : `Kimlik: ${slugify(title) || "kategori-adi"}`}
          >
            <input
              id="title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-invalid={Boolean(errors.title)}
              required
              maxLength={60}
              className={inputClass}
            />
          </Field>
          <Field label="Kod" htmlFor="code" error={errors.code} hint="Ürün kodu öneki (FRN → SO-FRN-01).">
            <input
              id="code"
              name="code"
              defaultValue={category?.code}
              aria-invalid={Boolean(errors.code)}
              required
              maxLength={5}
              onChange={(event) => {
                event.target.value = event.target.value.toUpperCase().replace(/[^A-Z]/g, "");
              }}
              className={`${inputClass} font-mono uppercase`}
            />
          </Field>
        </div>

        <Field label="Kısa açıklama" htmlFor="summary" error={errors.summary} hint="Ana sayfa özetinde ve katalogda görünür.">
          <input
            id="summary"
            name="summary"
            defaultValue={category?.summary}
            aria-invalid={Boolean(errors.summary)}
            required
            maxLength={200}
            className={inputClass}
          />
        </Field>

        <Field label="İlgili hizmet" htmlFor="serviceSlug" error={errors.serviceSlug} hint='Ürün sayfasındaki "Parça + Usta" bağlantısı.'>
          <select
            id="serviceSlug"
            name="serviceSlug"
            defaultValue={category?.serviceSlug ?? services[0]?.slug}
            className={inputClass}
          >
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
        </Field>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">İkon</legend>
          <div className="flex flex-wrap gap-2">
            {categoryIconKeys.map((key) => {
              const Icon = categoryIcons[key];
              const active = icon === key;
              return (
                <label
                  key={key}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors ${
                    active ? "border-accent bg-accent/5 text-accent" : "border-ink/15 hover:border-ink/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="icon"
                    value={key}
                    checked={active}
                    onChange={() => setIcon(key)}
                    className="sr-only"
                  />
                  <Icon size={18} />
                  {categoryIconLabels[key]}
                </label>
              );
            })}
          </div>
          {errors.icon && <p className="mt-1.5 text-sm text-accent">{errors.icon}</p>}
        </fieldset>

        <div className="grid gap-5 md:grid-cols-[1fr_14rem] md:items-start">
          <Field label="Görsel" htmlFor="imageKey" error={errors.imageKey} hint="Bu kategorideki ürün kartlarında kullanılır.">
            <select
              id="imageKey"
              name="imageKey"
              value={imageKey}
              onChange={(event) => setImageKey(event.target.value as ImageKey)}
              className={inputClass}
            >
              {imageKeys.map((key) => (
                <option key={key} value={key}>
                  {images[key].alt}
                </option>
              ))}
            </select>
          </Field>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-bone-300">
            <Image src={preview.src} alt={preview.alt} fill sizes="224px" className="object-cover" />
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Kaydediliyor…" : category ? "Değişiklikleri Kaydet" : "Kategoriyi Ekle"}
        </button>
        <Link href="/admin/kategoriler" className="btn btn-ghost">
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
