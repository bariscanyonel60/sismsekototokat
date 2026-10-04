import { site } from "@/data/site";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden focusable={false}>
      <path d="M9 3h29l-7 34H2z" fill="var(--color-amber)" />
      <path d="M23.5 7.5 13 22.2h7.1l-3 10.3L28 17.3h-7.2z" fill="var(--color-ink)" />
    </svg>
  );
}

export function Logo({ className = "", compact = false }: LogoProps) {
  const [first, second] = site.wordmark.split(" ");
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.45rem] font-bold tracking-[0.06em]">{first}</span>
          <span className="font-display text-[0.68rem] font-semibold tracking-[0.62em] text-amber">
            {second}
          </span>
        </span>
      )}
    </span>
  );
}
