import type { CSSProperties } from "react";

export function cssVars(vars: Record<`--${string}`, string | number>): CSSProperties {
  return vars as CSSProperties;
}

/** Reveal / giriş animasyonlarında sıralı gecikme için kısa yol. */
export function delay(step: number): CSSProperties {
  return cssVars({ "--d": step });
}
