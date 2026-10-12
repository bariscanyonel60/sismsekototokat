import Link from "next/link";

import { JsonLd } from "@/components/JsonLd";
import { routes } from "@/data/navigation";
import { buildBreadcrumbSchema, type BreadcrumbItem } from "@/lib/structuredData";

interface BreadcrumbProps {
  /** Ana Sayfa otomatik eklenir; son öğe geçerli sayfadır. */
  items: BreadcrumbItem[];
  className?: string;
  /** 404 gibi indekslenmeyen sayfalarda yapılandırılmış veri basılmaz. */
  withSchema?: boolean;
}

export function Breadcrumb({ items, className = "", withSchema = true }: BreadcrumbProps) {
  const trail: BreadcrumbItem[] = [{ label: "Ana Sayfa", href: routes.home }, ...items];
  const last = trail.length - 1;

  return (
    <nav aria-label="Sayfa konumu" className={className}>
      <ol className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.68rem] text-steel-400">
        {trail.map((item, index) => (
          <li key={item.label} className="flex items-center gap-3">
            {index === last || !item.href ? (
              <span aria-current={index === last ? "page" : undefined} className="text-amber">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-bone">
                {item.label}
              </Link>
            )}
            {index < last && (
              <span aria-hidden className="text-steel-500">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
      {withSchema && <JsonLd data={buildBreadcrumbSchema(trail)} />}
    </nav>
  );
}
