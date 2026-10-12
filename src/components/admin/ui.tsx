import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowRight } from "@/components/icons";

export const inputClass =
  "h-11 w-full rounded-sm border border-ink/15 bg-white px-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-steel-500 focus:border-accent aria-[invalid=true]:border-accent";

export const textareaClass =
  "min-h-28 w-full rounded-sm border border-ink/15 bg-white px-3 py-2.5 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-steel-500 focus:border-accent aria-[invalid=true]:border-accent";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-accent" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-steel-500">{hint}</p>
      )}
    </div>
  );
}

const noticeTones = {
  success: "border-emerald-600/30 bg-emerald-50 text-emerald-800",
  error: "border-accent/40 bg-accent/5 text-accent",
  info: "border-ink/15 bg-white text-steel-700",
} as const;

export function Notice({ tone, children }: { tone: keyof typeof noticeTones; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : tone === "success" ? "status" : undefined}
      className={`rounded-sm border px-4 py-3 text-sm ${noticeTones[tone]}`}
    >
      {children}
    </p>
  );
}

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-[0.04em] text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-steel-700">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/** Düzenleme / ekleme sayfalarının üstündeki liste sayfasına dönüş bağlantısı. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-steel-700 transition-colors hover:text-accent"
    >
      <ArrowRight size={16} className="rotate-180" />
      {children}
    </Link>
  );
}

const moveButtonClass =
  "inline-flex size-9 items-center justify-center rounded-sm border border-ink/15 text-ink transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-30";

/** Sıralanabilir listelerde yukarı / aşağı taşıma; `action` `direction` alanını "up" / "down" olarak alır. */
export function MoveButtons({
  action,
  hidden,
  first,
  last,
  label,
}: {
  action: (form: FormData) => Promise<void>;
  hidden: Record<string, string>;
  first: boolean;
  last: boolean;
  label: string;
}) {
  return (
    <div className="flex gap-2">
      {(["up", "down"] as const).map((direction) => (
        <form key={direction} action={action}>
          {Object.entries(hidden).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <input type="hidden" name="direction" value={direction} />
          <button
            type="submit"
            disabled={direction === "up" ? first : last}
            aria-label={`${label} ${direction === "up" ? "yukarı" : "aşağı"} taşı`}
            className={moveButtonClass}
          >
            {direction === "up" ? "↑" : "↓"}
          </button>
        </form>
      ))}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-md border border-ink/10 bg-white p-5 md:p-6 ${className}`}>{children}</div>;
}
