import type { ReactNode } from "react";

import { delay } from "@/lib/cssVars";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  tone?: "dark" | "light";
  id?: string;
  className?: string;
}

/** Bölüm başlığı: numara + etiket satırı, büyük başlık ve isteğe bağlı açıklama. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  tone = "dark",
  id,
  className = "",
}: SectionHeadingProps) {
  const muted = tone === "dark" ? "text-steel-300" : "text-steel-700";
  const rule = tone === "dark" ? "bg-bone/15" : "bg-ink/15";
  return (
    <div className={`grid gap-8 lg:grid-cols-12 lg:gap-10 ${className}`}>
      <div className="lg:col-span-12" data-reveal>
        <div className="flex items-center gap-5">
          <span className={`label-mono ${tone === "dark" ? "text-accent" : "text-ink"}`}>{index}</span>
          <span className={`h-px flex-1 ${rule}`} />
          <span className={`eyebrow ${tone === "dark" ? "text-bone" : "text-ink"}`}>{eyebrow}</span>
        </div>
      </div>
      <h2 id={id} className="heading-xl lg:col-span-7" data-reveal style={delay(1)}>
        {title}
      </h2>
      {description && (
        <p className={`lede self-end lg:col-span-4 lg:col-start-9 ${muted}`} data-reveal style={delay(2)}>
          {description}
        </p>
      )}
    </div>
  );
}
