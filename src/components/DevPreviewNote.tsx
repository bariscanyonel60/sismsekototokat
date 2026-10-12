/** Yalnızca `npm run dev` sırasında boş bölümlerin iskeletini göstermek için. */
export const isDevPreview = process.env.NODE_ENV === "development";

export function DevPreviewNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="label-mono mt-8 inline-flex items-center gap-3 border border-dashed border-accent/50 bg-accent/5 px-4 py-2.5 text-[0.65rem] text-accent-600">
      <span className="size-1.5 shrink-0 bg-accent" aria-hidden />
      Geliştirme önizlemesi · {children}
    </p>
  );
}
