import Link from "next/link";

import { ArrowUpRight } from "@/components/icons";
import { quickLinks } from "@/data/navigation";

export function QuickLinks({ title = "Size yardımcı olabilecek sayfalar" }: { title?: string }) {
  return (
    <nav aria-label={title}>
      <h2 className="label-mono text-steel-400">{title}</h2>
      <ul className="mt-6 grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((link) => (
          <li key={link.href} className="bg-ink">
            <Link
              href={link.href}
              className="group relative flex h-full flex-col justify-between gap-8 p-6 transition-colors duration-500 hover:bg-anthracite"
            >
              <span className="absolute left-0 top-0 h-0.5 w-0 bg-accent transition-[width] duration-700 ease-out-expo group-hover:w-full" />
              <span className="flex items-start justify-between gap-4">
                <span className="display text-[1.6rem] text-bone transition-colors group-hover:text-accent">
                  {link.label}
                </span>
                <ArrowUpRight size={18} className="mt-1 shrink-0 text-steel-500 transition-colors group-hover:text-accent" />
              </span>
              <span className="text-sm leading-relaxed text-steel-400">{link.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
