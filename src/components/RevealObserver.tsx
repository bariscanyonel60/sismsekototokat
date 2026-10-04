"use client";

import { useEffect } from "react";

/** `data-reveal` işaretli öğeleri görünür alana girdiklerinde açığa çıkarır. */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const viewportBottom = window.innerHeight;
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < viewportBottom) el.dataset.revealed = "true";
    });
    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    targets.filter((el) => el.dataset.revealed !== "true").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
