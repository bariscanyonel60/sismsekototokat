"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1400;

function format(value: number, grouped: boolean) {
  return grouped ? value.toLocaleString("tr-TR") : String(value);
}

/** Sunucuda son değeri basar; görünür olunca 0'dan sayar. Hareket azaltma tercihinde sabit kalır. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const target = Number(value.replace(/\D/g, ""));
  const grouped = /[.,]/.test(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || !Number.isFinite(target) || target === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / DURATION);
          const eased = 1 - Math.pow(1 - progress, 4);
          setDisplay(format(Math.round(target * eased), grouped));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, grouped]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      <span aria-hidden>{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
