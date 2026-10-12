"use client";

import { useEffect, useState } from "react";

import { CheckIcon } from "@/components/icons";

/** Ürün / OEM kodunu panoya kopyalar. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
      aria-label={`${label} kopyala: ${value}`}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xs border border-ink/15 px-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-steel-700 transition-colors hover:border-ink hover:text-ink"
    >
      {copied ? <CheckIcon size={14} className="text-accent" /> : <CopyGlyph />}
      <span aria-live="polite">{copied ? "Kopyalandı" : "Kopyala"}</span>
    </button>
  );
}

function CopyGlyph() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="8" y="8" width="12" height="12" rx="1" />
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    </svg>
  );
}
